var io = require('socket.io-client');
var uuid = require('uuid');

var assert = require('common/lang/assert');
var Disposable = require('common/lang/Disposable');

var AlertAdapterBase = require('./AlertAdapterBase');

module.exports = (() => {
	'use strict';

	class ConnectionState {
		constructor(description, canTransmit, canReceive, canConnect, canDisconnect) {
			assert.argumentIsRequired(description, 'description', String);
			assert.argumentIsRequired(canTransmit, 'canTransmit', Boolean);
			assert.argumentIsRequired(canReceive, 'canReceive', Boolean);
			assert.argumentIsRequired(canConnect, 'canConnect', Boolean);
			assert.argumentIsRequired(canDisconnect, 'canDisconnect', Boolean);

			this._description = description;

			this._canTransmit = canTransmit;
			this._canReceive = canReceive;

			this._canConnect = canConnect;
			this._canDisconnect = canDisconnect;
		}

		getDescription() {
			return this._description;
		}

		getCanTransmit() {
			return this._canTransmit;
		}

		getCanReceive() {
			return this._canReceive;
		}

		getCanConnect() {
			return this._canConnect;
		}

		getCanDisconnect() {
			return this._canDisconnect;
		}

		toString() {
			return `[ConnectionState (description: ${this._description})]`;
		}
	}

	ConnectionState.Connecting = new ConnectionState('connecting', false, false, false, true);
	ConnectionState.Connected = new ConnectionState('connected', true, true, false, true);
	ConnectionState.Disconnecting = new ConnectionState('disconnecting', false, false, false, false);
	ConnectionState.Disconnected = new ConnectionState('disconnected', false, false, true, false);

	class SocketAlertAdapter extends AlertAdapterBase {
		constructor(host, port, secure, onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered) {
			super(onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered);

			assert.argumentIsOptional(host, 'host', String);
			assert.argumentIsOptional(port, 'port', Number);
			assert.argumentIsOptional(secure, 'secure', Boolean);

			this._host = host;
			this._port = port;
			this._secure = secure;

			this._socket = null;
			this._connectionState = ConnectionState.Disconnected;

			this._requestMap = {};
			this._subscriberMap = {};
		}

		connect() {
			return new Promise((resolveCallback, rejectCallback) => {
				if (this._connectionState.getCanConnect()) {
					let protocol;

					if (this._secure) {
						protocol = 'https';
					} else {
						protocol = 'http';
					}

					this._socket = io.connect(`${protocol}://${this._host}:${this._port}`, {transports: ['websocket'], secure: this._secure, forceNew: true});

					this._socket.on('connect', () => {
						this._requestMap = {};

						changeConnectionState.call(this, ConnectionState.Connected);

						resolveCallback(this);
					});

					this._socket.on('reconnecting', () => {
						changeConnectionState.call(this, ConnectionState.Connecting);
					});

					this._socket.on('reconnect', () => {
						changeConnectionState.call(this, ConnectionState.Connected);

						getSubscribers(this._subscriberMap).forEach((subscriber) => {
							subscriber.subscribe();
						});
					});

					this._socket.on('response', (data) => {
						const requestId = data.requestId;

						if (requestId) {
							const requestCallback = this._requestMap[requestId];

							if (requestCallback) {
								delete this._requestMap[requestId];

								requestCallback(data.response);
							}
						}
					});

					this._socket.on('alert/created', (alert) => {
						this._onAlertCreated(alert);
					});

					this._socket.on('alert/mutated', (alert) => {
						this._onAlertMutated(alert);
					});

					this._socket.on('alert/deleted', (alert) => {
						this._onAlertDeleted(alert);
					});

					this._socket.on('alert/triggered', (alert) => {
						this._onAlertTriggered(alert);
					});
				} else {
					rejectCallback('Unable to connect.');
				}
			});
		}

		createAlert(alert) {
			return sendRequestToServer.call(this, 'alerts/create', alert);
		}

		retrieveAlert(alert) {
			return sendRequestToServer.call(this, 'alerts/retrieve', alert);
		}

		updateAlert(alert) {
			return sendRequestToServer.call(this, 'alerts/update', alert);
		}

		updateAlertsForUser(query) {
			return sendRequestToServer.call(this, 'alerts/update/user', query);
		}

		deleteAlert(alert) {
			return sendRequestToServer.call(this, 'alerts/delete', alert);
		}

		retrieveAlerts(user) {
			return sendRequestToServer.call(this, 'alerts/retrieve/user', user);
		}

		subscribeAlerts(query) {
			if (getSubscriber(this._subscriberMap, query) !== null) {
				throw new Error('A subscriber already exists');
			}

			const subscriber = new AlertSubscriber(this, query);
			subscriber.subscribe();

			putSubscriber(this._subscriberMap, subscriber);

			return new Disposable.fromAction(() => {
				deleteSubscriber(this._subscriberMap, subscriber);

				subscriber.dispose();
			});
		}

		getTargets() {
			return sendRequestToServer.call(this, 'alert/targets/retrieve', {});
		}

		getProperties() {
			return sendRequestToServer.call(this, 'alert/targets/properties/retrieve', {});
		}

		getOperators() {
			return sendRequestToServer.call(this, 'alert/operators/retrieve', {});
		}

		getModifiers() {
			return sendRequestToServer.call(this, 'alert/modifiers/retrieve', {});
		}

		getPublisherTypes() {
			return sendRequestToServer.call(this, 'alert/publishers/retrieve', {});
		}

		getPublisherTypeDefaults(query) {
			return sendRequestToServer.call(this, 'alert/publishers/default/retrieve', query);
		}

		assignPublisherTypeDefault(publisherTypeDefault) {
			return sendRequestToServer.call(this, 'alert/publishers/default/update', publisherTypeDefault);
		}

		getMarketDataConfiguration(query) {
			return sendRequestToServer.call(this, 'alert/market/configuration/retrieve', query);
		}

		assignMarketDataConfiguration(marketDataConfiguration) {
			return sendRequestToServer.call(this, 'alert/market/configuration/update', marketDataConfiguration);
		}

		getServerVersion() {
			return sendRequestToServer.call(this, 'server/version', {});
		}

		_onDispose() {
			if (this._socket) {
				this._socket.disconnect();
				this._socket = null;
			}
		}

		toString() {
			return '[SocketAlertAdapter]';
		}
	}

	function sendToServer(channel, payload) {
		if (this._connectionState.getCanTransmit()) {
			return Promise.resolve(this._socket.emit(channel, payload));
		} else {
			return Promise.reject('Unable to send data. The socket is not connected.');
		}
	}

	function sendRequestToServer(channel, payload) {
		return new Promise((resolveCallback, rejectCallback) => {
			const requestId = uuid.v4();

			this._requestMap[requestId] = resolveCallback;

			return sendToServer.call(this, 'request/' + channel, {requestId: requestId, request: payload})
				.catch((e) => {
					delete this._requestMap[requestId];

					throw e;
				});
		});
	}

	function sendSubscriptionToServer(channel, payload) {
		return sendToServer.call(this, 'subscribe/' + channel, payload);
	}

	function changeConnectionState(connectionState) {
		this._connectionState = connectionState;
	}

	function getSubscriber(subscribers, query) {
		const userId = query.user_id;
		const systemId = query.alert_system;

		let returnRef;

		if (subscribers.hasOwnProperty(userId) && subscribers[userId].hasOwnProperty(systemId)) {
			returnRef = subscribers[userId][systemId];
		} else {
			returnRef = null;
		}

		return returnRef;
	}

	function putSubscriber(subscribers, subscriber) {
		const query = subscriber.getQuery();

		const userId = query.user_id;
		const systemId = query.alert_system;

		if (!subscribers.hasOwnProperty(userId)) {
			subscribers[userId] = { };
		}

		subscribers[userId][systemId] = subscriber;
	}

	function deleteSubscriber(subscribers, subscriber) {
		const query = subscriber.getQuery();

		const userId = query.user_id;
		const systemId = query.alert_system;

		delete subscribers[userId][systemId];
	}

	function getSubscribers(subscribers) {
		return Object.keys(subscribers).reduce((array, userId) => {
			const systems = subscribers[userId];

			return array.concat(Object.keys(systems).map((systemId) => {
				return systems[systemId];
			}));
		}, [ ]);
	}

	class AlertSubscriber extends Disposable {
		constructor(parent, query) {
			super();

			this._parent = parent;
			this._query = query;
		}

		getQuery() {
			return this._query;
		}

		subscribe() {
			if (this.getIsDisposed()) {
				throw new Error('The subscriber has been disposed.');
			}

			sendSubscriptionToServer.call(this._parent, 'alerts/events', this._query)
				.then(() => {
					if (this.getIsDisposed()) {
						return;
					}

					this._parent.retrieveAlerts(this._query)
						.then((alerts) => {
							if (this.getIsDisposed()) {
								return;
							}

							alerts.forEach((alert) => {
								this._parent._onAlertMutated(alert);
							});
						});
				});
		}
	}

	return SocketAlertAdapter;
})();