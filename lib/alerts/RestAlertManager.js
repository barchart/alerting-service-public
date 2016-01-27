var _ = require('lodash');
var when = require('when');

var assert = require('./../common/lang/assert');
var AlertManager = require('./AlertManager');
var RestAction = require('./../network/rest/RestAction');
var RestEndpoint = require('./../network/rest/RestEndpoint');
var RestProvider = require('./../network/rest/RestProvider');

module.exports = function() {
	'use strict';

	var RestAlertManager = AlertManager.extend({
		init: function(baseUrl, port, secure) {
			assert.argumentIsOptional(baseUrl, 'baseUrl', String);
			assert.argumentIsOptional(port, 'port', Number);
			assert.argumentIsOptional(secure, 'secure', Boolean);

			this._super();

			this._restProvider = new RestProvider(baseUrl || 'alerts-management-prod.barchart.com', port || 80, getIsSecure(secure));

			this._createEndpoint = new RestEndpoint(RestAction.Create, [ 'alerts' ]);
			this._retireveEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alerts', 'alert_id' ]);
			this._queryEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alerts', 'users', 'alert_system', 'user_id' ]);
			this._updateEndpoint = new RestEndpoint(RestAction.Update, [ 'alerts', 'alert_id' ]);
			this._deleteEndpoint = new RestEndpoint(RestAction.Delete, [ 'alerts', 'alert_id' ]);
			this._retrieveTargets = new RestEndpoint(RestAction.Retrieve, [ 'alert', 'targets' ]);
			this._retrieveProperties = new RestEndpoint(RestAction.Retrieve, [ 'alert', 'targets', 'properties' ]);
			this._retrieveOperators = new RestEndpoint(RestAction.Retrieve, [ 'alert', 'operators' ]);
			this._retrievePublisherTypes = new RestEndpoint(RestAction.Retrieve, [ 'alert', 'publishers' ]);

			this._versionEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'server', 'version' ]);
		},

		_connect: function() {
			return when(true);
		},

		_createAlert: function(alert) {
			return this._restProvider.call(this._createEndpoint, alert);
		},

		_retrieveAlert: function(alert) {
			return this._restProvider.call(this._retireveEndpoint, alert);
		},

		_retrieveAlerts: function(user) {
			return this._restProvider.call(this._queryEndpoint, user);
		},

		_subscribeAlerts: function(user, callback) {

		},

		_disableAlert: function(alert) {
			return this._restProvider.call(this._updateEndpoint, alert);
		},

		_enableAlert: function(alert) {
			return this._restProvider.call(this._updateEndpoint, alert);
		},

		_deleteAlert: function(alert) {
			return this._restProvider.call(this._deleteEndpoint, alert);
		},

		_getTargets: function() {
			return this._restProvider.call(this._retrieveTargets, { });
		},

		_getProperties: function() {
			return this._restProvider.call(this._retrieveProperties, { });
		},

		_getOperators: function() {
			return this._restProvider.call(this._retrieveOperators, { });
		},

		_getPublisherTypes: function() {
			return this._restProvider.call(this._retrievePublisherTypes, { });
		},

		_getServerVersion: function() {
			return this._restProvider.call(this._versionEndpoint, { });
		},

		toString: function() {
			return '[REST Alert Manager]';
		}
	});

	function getIsSecure(secure) {
		var returnVal;

		if (_.isBoolean(secure)) {
			returnVal = secure;
		} else {
			var protocol;

			if (_.isObject(window) && _.isObject(window.location) && _.isString(window.location.protocol)) {
				protocol = window.location.protocol;
			} else if (_.isObject(document) && _.isObject(document.location) && _.isString(document.location.protocol)) {
				protocol = document.location.protocol
			} else {
				protocol = '';
			}

			returnVal = _.startsWith(protocol, 'https');
		}

		return returnVal;
	}

	return RestAlertManager;
}();