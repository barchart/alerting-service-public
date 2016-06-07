var _ = require('lodash');
var io = require('socket.io-client');
var uuid = require('uuid');
var when = require('when');

var assert = require('./../common/lang/assert');
var connection = require('./../common/lang/connection');
var AlertManager = require('./AlertManager');

module.exports = function() {
	'use strict';

	var SocketIOAlertManager = AlertManager.extend({
		init: function(host, port, secure) {
			assert.argumentIsOptional(host, 'host', String);
			assert.argumentIsOptional(port, 'port', Number);
			assert.argumentIsOptional(secure, 'secure', Boolean);

			this._super();

			this._host = host || 'alerts-management-prod.barchart.com';

			var secureToUse = connection.getIsSecure(secure);

			var portToUse;

			if (_.isNumber(port)) {
				portToUse = port;
			} else {
				if (secureToUse) {
					portToUse = 443;
				} else {
					portToUse = 80;
				}
			}

			this._port = portToUse;
			this._secure = secureToUse;

			this._socket = null;
			this._connectionState = ConnectionState.Disconnected;

			this._requestMap = {};
		},

		_connect: function() {
			var that = this;

			var connectPromise;

			return when.promise(function(resolveCallback, rejectCallback) {
				if (that._connectionState.getCanConnect()) {
					var protocol;

					if (that._secure) {
						protocol = 'https://';
					} else {
						protocol = 'http://';
					}

					that._socket = io.connect(protocol + that._host + ':' + that._port);

					that._socket.on('connect', function() {
						that._requestMap = {};

						changeConnectionState.call(that, ConnectionState.Connected);

						resolveCallback(true);
					});

					that._socket.on('reconnecting', function() {
						changeConnectionState.call(that, ConnectionState.Connecting);
					});

					that._socket.on('reconnect', function() {
						changeConnectionState.call(that, ConnectionState.Connected);
					});

					that._socket.on('response', function(data) {
						var requestId = data.requestId;

						if (requestId) {
							var requestPromise = that._requestMap[requestId];

							if (requestPromise) {
								delete that._requestMap[requestId];

								requestPromise.resolve(data.response);
							}
						}
					});
				} else {
					rejectCallback('Unable to connect.');
				}
			});
		},

		_createAlert: function(alert) {
			return sendRequestToServer.call(this, 'alerts/create', alert);
		},

		_retrieveAlert: function(alert) {
			return sendRequestToServer.call(this, 'alerts/retrieve', alert);
		},

		_enableAlert: function(alert) {
			return sendRequestToServer.call(this, 'alerts/update', alert);
		},

		_disableAlert: function(alert) {
			return sendRequestToServer.call(this, 'alerts/update', alert);
		},

		_deleteAlert: function(alert) {
			return sendRequestToServer.call(this, 'alerts/delete', alert);
		},

		_retrieveAlerts: function(user) {
			return sendRequestToServer.call(this, 'alerts/retrieve/user', user);
		},

		_getTargets: function() {
			return sendRequestToServer.call(this, 'alert/targets/retrieve', {});
		},

		_getProperties: function() {
			return sendRequestToServer.call(this, 'alert/targets/properties/retrieve', {});
		},

		_getOperators: function() {
			return sendRequestToServer.call(this, 'alert/operators/retrieve', {});
		},

		_getPublisherTypes: function() {
			return sendRequestToServer.call(this, 'alert/publishers/retrieve', {});
		},

		_getPublisherTypeDefaults: function(query) {

		},

		_assignPublisherTypeDefault: function(query) {

		},

		_getMarketDataConfiguration: function(query) {

		},

		_assignMarketDataConfiguration: function(query) {

		},

		_getServerVersion: function() {
			return sendRequestToServer.call(this, 'server/version', {});
		},

		toString: function() {
			return '[Socket.IO Alert Manager]';
		}
	});

	function sendRequestToServer(channel, payload) {
		var that = this;

		var requestPromise;

		if (that._connectionState.getCanTransmit()) {
			var requestId = uuid.v4();
			var deferred = when.defer();

			that._requestMap[requestId] = deferred;

			that._socket.emit('request/' + channel, {requestId: requestId, request: payload});

			requestPromise = deferred.promise;
		} else {
			requestPromise = when.reject('Unable to send request. The socket is not connected.');
		}

		return requestPromise;
	}

	function changeConnectionState(connectionState) {
		var that = this;

		that._connectionState = connectionState;
	}

	var ConnectionState = Class.extend({
		init: function(description, canTransmit, canReceive, canConnect, canDisconnect) {
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
		},

		getDescription: function() {
			return this._description;
		},

		getCanTransmit: function() {
			return this._canTransmit;
		},

		getCanReceive: function() {
			return this._canReceive;
		},

		getCanConnect: function() {
			return this._canConnect;
		},

		getCanDisconnect: function() {
			return this._canDisconnect;
		},

		toString: function() {
			return '[ConnectionState (description: ' + this._description + ')]';
		}
	});

	ConnectionState.Connecting = new ConnectionState('connecting', false, false, false, true);
	ConnectionState.Connected = new ConnectionState('connected', true, true, false, true);
	ConnectionState.Disconnecting = new ConnectionState('disconnecting', false, false, false, false);
	ConnectionState.Disconnected = new ConnectionState('disconnected', false, false, true, false);

	return SocketIOAlertManager;
}();