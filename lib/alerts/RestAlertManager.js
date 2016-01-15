var _ = require('lodash');

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

			this._restProvider = new RestProvider(baseUrl || 'alerts-management-dev.elasticbeanstalk.com', port || 80, secure || false);

			this._createEndpoint = new RestEndpoint(RestAction.Create, [ 'alerts' ]);
			this._retireveEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alerts', 'alert_id' ]);
			this._queryEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alerts', 'users', 'user_id' ]);
			this._updateEndpoint = new RestEndpoint(RestAction.Update, [ 'alerts', 'alert_id' ]);
			this._deleteEndpoint = new RestEndpoint(RestAction.Delete, [ 'alerts', 'alert_id' ]);

			this._retrieveConditionOperators = new RestEndpoint(RestAction.Retrieve, [ 'alert', 'operators' ]);
			this._retrievePublisherTypes = new RestEndpoint(RestAction.Retrieve, [ 'alert', 'publishers' ]);

			this._versionEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'server', 'version' ]);
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

		_disableAlert: function(alert) {
			return this._restProvider.call(this._updateEndpoint, alert);
		},

		_resetAlert: function(alert) {
			return this._restProvider.call(this._updateEndpoint, alert);
		},

		_deleteAlert: function(alert) {
			return this._restProvider.call(this._deleteEndpoint, alert);
		},

		_getConditionOperators: function() {
			return this._restProvider.call(this._retrieveConditionOperators, { });
		},

		_getPublisherTypes: function() {
			return this._restProvider.call(this._retrievePublisherTypes, { });
		},

		_getServerVersion: function() {
			return this._restProvider.call(this._versionEndpoint, { });
		}
	});

	return RestAlertManager;
}();