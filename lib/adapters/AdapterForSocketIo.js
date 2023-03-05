const io = require('socket.io-client'),
	uuid = require('uuid');

const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	promise = require('@barchart/common-js/lang/promise');

const AdapterBase = require('./AdapterBase'),
	JwtProvider = require('../security/JwtProvider');

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

	/**
	 * A backend communication strategy implemented with the [Socket.IO](https://socket.io/docs/) library.
	 * The Socket.IO will use a WebSocket in modern browsers.
	 *
	 * @public
	 * @exported
	 * @extends {AdapterBase}
	 */
	class AdapterForSocketIo extends AdapterBase {
		constructor(host, port, secure, onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered, onTriggersCreated, onTriggersMutated, onTriggersDeleted, onTemplateCreated, onTemplateMutated, onTemplateDeleted, onConnectionStatusChanged) {
			super(host, port, secure, onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered, onTriggersCreated, onTriggersMutated, onTriggersDeleted, onTemplateCreated, onTemplateMutated, onTemplateDeleted, onConnectionStatusChanged);

			this._socket = null;
			this._connectionState = ConnectionState.Disconnected;

			this._requestMap = {};

			this._alertSubscriberMap = {};
			this._triggerSubscriberMap = {};
			this._templateSubscriberMap = {};

			this._jwtProvider = null;
		}

		connect(jwtProvider) {
			return promise.build((resolveCallback, rejectCallback) => {
				assert.argumentIsOptional(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');

				this._jwtProvider = jwtProvider || null;

				if (this._connectionState.getCanConnect()) {
					changeConnectionState.call(this, ConnectionState.Connecting);

					let protocol;

					if (this.secure) {
						protocol = 'https';
					} else {
						protocol = 'http';
					}

					this._socket = io.connect(`${protocol}://${this.host}:${this.port}`, {transports: ['websocket'], secure: this.secure, forceNew: true});

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

						getSubscribers(this._alertSubscriberMap).forEach((subscriber) => {
							subscriber.subscribe();
						});

						getSubscribers(this._triggerSubscriberMap).forEach((subscriber) => {
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

					this._socket.on('template/created', (template) => {
						this._onTemplateCreated(template);
					});

					this._socket.on('template/mutated', (template) => {
						this._onTemplateMutated(template);
					});

					this._socket.on('template/deleted', (template) => {
						this._onTemplateDeleted(template);
					});

					this._socket.on('triggers/created', (triggers) => {
						this._onTriggersCreated(triggers);
					});

					this._socket.on('triggers/mutated', (triggers) => {
						this._onTriggersMutated(triggers);
					});

					this._socket.on('triggers/deleted', (triggers) => {
						this._onTriggersDeleted(triggers);
					});
				} else {
					rejectCallback('Unable to connect.');
				}
			});
		}

		createAlert(alert) {
			return sendRequestToServer.call(this, 'alerts/create', alert, true);
		}

		retrieveAlert(alert) {
			return sendRequestToServer.call(this, 'alerts/retrieve', alert, true);
		}

		retrieveAlerts(query) {
			return sendRequestToServer.call(this, 'alerts/retrieve/user', query, true);
		}

		updateAlert(alert) {
			return sendRequestToServer.call(this, 'alerts/update', alert, true);
		}

		updateAlertsForUser(query) {
			return sendRequestToServer.call(this, 'alerts/update/user', query, true);
		}

		deleteAlert(alert) {
			return sendRequestToServer.call(this, 'alerts/delete', alert, true);
		}

		subscribeAlerts(query) {
			if (getSubscriber(this._alertSubscriberMap, query) !== null) {
				throw new Error('An alert subscriber already exists');
			}

			const subscriber = new AlertSubscriber(this, query);
			subscriber.subscribe();

			putSubscriber(this._alertSubscriberMap, subscriber);

			return Disposable.fromAction(() => {
				deleteSubscriber(this._alertSubscriberMap, subscriber);

				subscriber.dispose();
			});
		}

		retrieveTriggers(query) {
			return sendRequestToServer.call(this, 'alert/triggers/retrieve/user', query, true);
		}

		updateTrigger(query) {
			return sendRequestToServer.call(this, 'alert/triggers/update', query, true);
		}

		updateTriggers(query) {
			return sendRequestToServer.call(this, 'alert/triggers/update/user', query, true);
		}

		subscribeTriggers(query) {
			if (getSubscriber(this._triggerSubscriberMap, query) !== null) {
				throw new Error('A trigger subscriber already exists');
			}

			const subscriber = new TriggerSubscriber(this, query);
			subscriber.subscribe();

			putSubscriber(this._triggerSubscriberMap, subscriber);

			return Disposable.fromAction(() => {
				deleteSubscriber(this._triggerSubscriberMap, subscriber);

				subscriber.dispose();
			});
		}

		createTemplate(template) {
			return sendRequestToServer.call(this, 'templates/create', template, true);
		}

		retrieveTemplates(query) {
			return sendRequestToServer.call(this, 'templates/retrieve/user', query, true);
		}

		updateTemplate(template) {
			return sendRequestToServer.call(this, 'templates/update', template, true);
		}

		updateTemplateOrder(template) {
			return sendRequestToServer.call(this, 'templates/batch/sorting', template, true);
		}

		deleteTemplate(template) {
			return sendRequestToServer.call(this, 'templates/delete', template, true);
		}

		subscribeTemplates(query) {
			if (getSubscriber(this._templateSubscriberMap, query) !== null) {
				throw new Error('A template subscriber already exists');
			}

			const subscriber = new TemplateSubscriber(this, query);
			subscriber.subscribe();

			putSubscriber(this._templateSubscriberMap, subscriber);

			return Disposable.fromAction(() => {
				deleteSubscriber(this._templateSubscriberMap, subscriber);

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
			return sendRequestToServer.call(this, 'alert/publishers/default/retrieve', query, true);
		}

		assignPublisherTypeDefault(publisherTypeDefault) {
			return sendRequestToServer.call(this, 'alert/publishers/default/update', publisherTypeDefault, true);
		}

		deletePublisherTypeDefault(publisherTypeDefault) {
			return sendRequestToServer.call(this, 'alert/publishers/default/delete', publisherTypeDefault, true);
		}

		getMarketDataConfiguration(query) {
			return sendRequestToServer.call(this, 'alert/market/configuration/retrieve', query, true);
		}

		assignMarketDataConfiguration(marketDataConfiguration) {
			return sendRequestToServer.call(this, 'alert/market/configuration/update', marketDataConfiguration, true);
		}

		getUser() {
			return sendRequestToServer.call(this, 'user/retrieve', {}, true);
		}

		getServerVersion() {
			return sendRequestToServer.call(this, 'server/version', {});
		}

		_onDispose() {
			if (this._socket) {
				this._socket.disconnect();
				this._socket = null;
			}

			this._alertSubscriberMap = { };
			this._triggerSubscriberMap = { };
		}

		toString() {
			return '[AdapterForSocketIo]';
		}
	}

	function sendToServer(channel, payload, secure) {
		if (this._connectionState.getCanTransmit()) {
			return Promise.resolve()
				.then(() => {
					let jwtPromise;

					if (this._jwtProvider === null || !secure) {
						jwtPromise = Promise.resolve(null);
					} else {
						jwtPromise = this._jwtProvider.getToken()
							.then((token) => {
								const data = { };

								data.token = token;
								data.source = this._jwtProvider.source;

								return data;
							});
					}

					return jwtPromise;
				}).then((jwtData) => {
					if (jwtData !== null) {
						payload.context = jwtData;
					}

					return this._socket.emit(channel, payload);
				});
		} else {
			return Promise.reject('Unable to send data. The socket is not connected.');
		}
	}

	function sendRequestToServer(channel, payload, secure) {
		return promise.build((resolveCallback, rejectCallback) => {
			const requestId = uuid.v4();

			this._requestMap[requestId] = resolveCallback;

			return sendToServer.call(this, 'request/' + channel, {requestId: requestId, request: payload}, secure)
				.catch((e) => {
					delete this._requestMap[requestId];

					throw e;
				});
		});
	}

	function sendSubscriptionToServer(channel, payload, secure) {
		return sendToServer.call(this, 'subscribe/' + channel, payload, secure);
	}

	function changeConnectionState(connectionState) {
		if (this._connectionState !== connectionState) {
			this._connectionState = connectionState;

			this._onConnectionStatusChanged(this._connectionState.getDescription());
		}
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
				throw new Error('The alert subscriber has been disposed.');
			}

			sendSubscriptionToServer.call(this._parent, 'alerts/events', this._query, true)
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

		toString() {
			return '[AdapterForSocketIo.AlertSubscriber]';
		}
	}

	class TriggerSubscriber extends Disposable {
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
				throw new Error('The trigger subscriber has been disposed.');
			}

			sendSubscriptionToServer.call(this._parent, 'triggers/events', this._query, true)
				.then(() => {
					if (this.getIsDisposed()) {
						return;
					}

					this._parent.retrieveTriggers(this._query)
						.then((triggers) => {
							if (this.getIsDisposed()) {
								return;
							}

							this._parent._onTriggersMutated(triggers);
						});
				});
		}

		toString() {
			return '[AdapterForSocketIo.TriggerSubscriber]';
		}
	}

	class TemplateSubscriber extends Disposable {
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
				throw new Error('The template subscriber has been disposed.');
			}

			sendSubscriptionToServer.call(this._parent, 'templates/events', this._query, true)
				.then(() => {
					if (this.getIsDisposed()) {
						return;
					}

					this._parent.retrieveTemplates(this._query)
						.then((templates) => {
							if (this.getIsDisposed()) {
								return;
							}

							templates.forEach((alert) => {
								this._parent._onTemplateMutated(alert);
							});
						});
				});
		}

		toString() {
			return '[AdapterForSocketIo.TemplateSubscriber]';
		}
	}

	return AdapterForSocketIo;
})();
