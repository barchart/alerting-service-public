var io = require('socket.io-client');
var uuid = require('uuid');

var assert = require('./../../common/lang/assert');
var AlertAdapterBase = require('./AlertAdapterBase');

module.exports = (() => {
	'use strict';

	class SocketAlertAdapter extends AlertAdapterBase {
		constructor(host, port, secure, onAlertMutated, onAlertDeleted) {
			super(onAlertMutated, onAlertDeleted);
			
			assert.argumentIsOptional(host, 'host', String);
			assert.argumentIsOptional(port, 'port', Number);
			assert.argumentIsOptional(secure, 'secure', Boolean);
			
			this._host = host;
			this._port = port;
			this._secure = secure;

			this._socket = null;
			this._connectionState = ConnectionState.Disconnected;

			this._requestMap = {};
		}

		connect() {
			return new Promise((resolveCallback, rejectCallback) => {
				if (this._connectionState.getCanConnect()) {
					let protocol;

					if (this._secure) {
						protocol = 'https://';
					} else {
						protocol = 'http://';
					}

					this._socket = io.connect(protocol + this._host + ':' + this._port);

					this._socket.on('connect', () => {
						this._requestMap = {};

						changeConnectionState.call(this, ConnectionState.Connected);

						resolveCallback(true);
					});

					this._socket.on('reconnecting', () => {
						changeConnectionState.call(this, ConnectionState.Connecting);
					});

					this._socket.on('reconnect', () => {
						changeConnectionState.call(this, ConnectionState.Connected);
					});

					this._socket.on('response', (data) => {
						const requestId = data.requestId;

						if (requestId) {
							const resolveCallback = this._requestMap[requestId];

							if (resolveCallback) {
								delete this._requestMap[requestId];

								resolveCallback(data.response);
							}
						}
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

		enableAlert(alert) {
			return sendRequestToServer.call(this, 'alerts/update', alert);
		}

		disableAlert(alert) {
			return sendRequestToServer.call(this, 'alerts/update', alert);
		}

		deleteAlert(alert) {
			return sendRequestToServer.call(this, 'alerts/delete', alert);
		}

		retrieveAlerts(user) {
			return sendRequestToServer.call(this, 'alerts/retrieve/user', user);
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

		getPublisherTypes() {
			return sendRequestToServer.call(this, 'alert/publishers/retrieve', {});
		}

		getPublisherTypeDefaults(query) {

		}

		assignPublisherTypeDefault(query) {

		}

		getMarketDataConfiguration(query) {

		}

		assignMarketDataConfiguration(query) {

		}

		getServerVersion() {
			return sendRequestToServer.call(this, 'server/version', {});
		}

		toString() {
			return '[SocketAlertAdapter]';
		}
	}

	function sendRequestToServer(channel, payload) {
		let requestPromise;

		if (this._connectionState.getCanTransmit()) {

			requestPromise = new Promise((resolveCallback, rejectCallback) => {
				const requestId = uuid.v4();

				this._requestMap[requestId] = resolveCallback;

				this._socket.emit('request/' + channel, {requestId: requestId, request: payload});
			});
		} else {
			requestPromise = when.reject('Unable to send request. The socket is not connected.');
		}

		return requestPromise;
	}

	function changeConnectionState(connectionState) {
		this._connectionState = connectionState;
	}

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

	return SocketAlertAdapter;
})();