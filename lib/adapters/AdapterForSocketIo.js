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

		async connect(jwtProvider) {
			return promise.build((resolveCallback, rejectCallback) => {
				assert.argumentIsOptional(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');

				if (!this._connectionState.getCanConnect()) {
					throw new Error('Unable to connect.');
				}

				this._jwtProvider = jwtProvider || null;

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

					getSubscribers(this._templateSubscriberMap).forEach((subscriber) => {
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
			});
		}

		async createAlert(alert) {
			return sendRequestToServer.call(this, 'alerts/create', alert, true);
		}

		async retrieveAlert(alert) {
			return sendRequestToServer.call(this, 'alerts/retrieve', alert, true);
		}

		async retrieveAlerts(query) {
			return sendRequestToServer.call(this, 'alerts/retrieve/user', query, true);
		}

		async updateAlert(alert) {
			return sendRequestToServer.call(this, 'alerts/update', alert, true);
		}

		async updateAlertsForUser(query) {
			return sendRequestToServer.call(this, 'alerts/update/user', query, true);
		}

		async deleteAlert(alert) {
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

		async retrieveTrigger(query) {
			return sendRequestToServer.call(this, 'alert/triggers/retrieve', query, true);
		}

		async retrieveTriggers(query) {
			return sendRequestToServer.call(this, 'alert/triggers/retrieve/user', query, true);
		}

		async updateTrigger(query) {
			return sendRequestToServer.call(this, 'alert/triggers/update', query, true);
		}

		async updateTriggers(query) {
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

		async createTemplate(template) {
			return sendRequestToServer.call(this, 'templates/create', template, true);
		}

		async retrieveTemplates(query) {
			return sendRequestToServer.call(this, 'templates/retrieve/user', query, true);
		}

		async updateTemplate(template) {
			return sendRequestToServer.call(this, 'templates/update', template, true);
		}

		async updateTemplateOrder(template) {
			return sendRequestToServer.call(this, 'templates/batch/sorting', template, true);
		}

		async deleteTemplate(template) {
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

		async getTargets() {
			return sendRequestToServer.call(this, 'alert/targets/retrieve', {});
		}

		async getProperties() {
			return sendRequestToServer.call(this, 'alert/targets/properties/retrieve', {});
		}

		async getOperators() {
			return sendRequestToServer.call(this, 'alert/operators/retrieve', {});
		}

		async getModifiers() {
			return sendRequestToServer.call(this, 'alert/modifiers/retrieve', {});
		}

		async getPublisherTypes() {
			return sendRequestToServer.call(this, 'alert/publishers/retrieve', {});
		}

		async getPublisherTypeDefaults(query) {
			return sendRequestToServer.call(this, 'alert/publishers/default/retrieve', query, true);
		}

		async assignPublisherTypeDefault(publisherTypeDefault) {
			return sendRequestToServer.call(this, 'alert/publishers/default/update', publisherTypeDefault, true);
		}

		async deletePublisherTypeDefault(publisherTypeDefault) {
			return sendRequestToServer.call(this, 'alert/publishers/default/delete', publisherTypeDefault, true);
		}

		async getMarketDataConfiguration(query) {
			return sendRequestToServer.call(this, 'alert/market/configuration/retrieve', query, true);
		}

		async assignMarketDataConfiguration(marketDataConfiguration) {
			return sendRequestToServer.call(this, 'alert/market/configuration/update', marketDataConfiguration, true);
		}

		async getUser() {
			return sendRequestToServer.call(this, 'user/retrieve', {}, true);
		}

		async getServerVersion() {
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

	async function sendToServer(channel, payload, secure) {
		if (!this._connectionState.getCanTransmit()) {
			throw new Error('Unable to send data. The socket is not connected.');
		}

		let jwtData = null;

		if (!(this._jwtProvider === null || !secure)) {
			const token = await this._jwtProvider.getToken();

			jwtData = { };

			jwtData.token = token;
			jwtData.source = this._jwtProvider.source;
		}

		if (jwtData !== null) {
			payload.context = jwtData;
		}

		return this._socket.emit(channel, payload);
	}

	async function sendRequestToServer(channel, payload, secure) {
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

	async function sendSubscriptionToServer(channel, payload, secure) {
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


		async subscribe() {
			if (this.disposed) {
				throw new Error('The alert subscriber has been disposed.');
			}

			await sendSubscriptionToServer.call(this._parent, 'alerts/events', this._query, true);

			if (this.disposed) {
				return;
			}

			const alerts = await this._parent.retrieveAlerts(this._query);

			if (this.disposed) {
				return;
			}

			alerts.forEach((alert) => {
				this._parent._onAlertMutated(alert);
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

		async subscribe() {
			if (this.disposed) {
				throw new Error('The trigger subscriber has been disposed.');
			}

			await sendSubscriptionToServer.call(this._parent, 'triggers/events', this._query, true);

			if (this.disposed) {
				return;
			}

			const triggers = await this._parent.retrieveTriggers(this._query);

			if (this.disposed) {
				return;
			}

			this._parent._onTriggersMutated(triggers);
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

		async subscribe() {
			if (this.disposed) {
				throw new Error('The template subscriber has been disposed.');
			}

			await sendSubscriptionToServer.call(this._parent, 'templates/events', this._query, true);

			if (this.disposed) {
				return;
			}

			const templates = await this._parent.retrieveTemplates(this._query);

			if (this.disposed) {
				return;
			}

			templates.forEach((alert) => {
				this._parent._onTemplateMutated(alert);
			});
		}

		toString() {
			return '[AdapterForSocketIo.TemplateSubscriber]';
		}
	}

	return AdapterForSocketIo;
})();
