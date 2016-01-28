var _ = require('lodash');
var when = require('when');

var assert = require('./../common/lang/assert');
var connection = require('./../common/lang/connection');
var Disposable = require('./../common/lang/Disposable');
var AlertManager = require('./AlertManager');
var RestAction = require('./../network/rest/RestAction');
var RestEndpoint = require('./../network/rest/RestEndpoint');
var RestProvider = require('./../network/rest/RestProvider');
var Scheduler = require('./../common/timing/Scheduler');

module.exports = function() {
	'use strict';

	var RestAlertManager = AlertManager.extend({
		init: function(baseUrl, port, secure) {
			assert.argumentIsOptional(baseUrl, 'baseUrl', String);
			assert.argumentIsOptional(port, 'port', Number);
			assert.argumentIsOptional(secure, 'secure', Boolean);

			this._super();

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

			this._restProvider = new RestProvider(baseUrl || 'alerts-management-prod.barchart.com', portToUse, secureToUse);

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

			this._scheduler = new Scheduler();

			this._subscribers = [ ];
		},

		_connect: function() {
			return true;
		},

		_createAlert: function(alert) {
			return this._restProvider.call(this._createEndpoint, alert);
		},

		_retrieveAlert: function(alert) {
			return this._restProvider.call(this._retireveEndpoint, alert);
		},

		_enableAlert: function(alert) {
			return this._restProvider.call(this._updateEndpoint, alert);
		},

		_disableAlert: function(alert) {
			return this._restProvider.call(this._updateEndpoint, alert);
		},

		_deleteAlert: function(alert) {
			return this._restProvider.call(this._deleteEndpoint, alert);
		},

		_retrieveAlerts: function(query) {
			return this._restProvider.call(this._queryEndpoint, query);
		},

		_onSubscribeAlerts: function(query) {
			var that = this;

			var userId = query.user_id;
			var systemId = query.alert_system;

			var exists = _.some(that._subscribers, function(candidate) {
				var candidateQuery = candidate.getQuery();

				return candidateQuery.user_id === query.user_id && candidateQuery.alert_system === query.alert_system;
			});

			if (!exists) {
				var subscriber = new AlertSubscriber(that, query);

				subscriber.start();

				that._subscribers.push(subscriber);
			}
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

		_onDispose: function() {
			this._scheduler.dispose();
		},

		toString: function() {
			return '[REST Alert Manager]';
		}
	});

	var AlertSubscriber = Disposable.extend({
		init: function(parent, query) {
			this._super();

			this._parent = parent;

			this._query = query;
			this._alerts = { };

			this._started = false;
		},

		getQuery: function() {
			return this._query;
		},

		start: function() {
			if (this._started) {
				throw new Error('The alert subscriber has already been started.');
			}

			var that = this;

			that._started = true;

			var poll = function() {
				return that._parent._retrieveAlerts(that._query)
					.then(function(alerts) {
						var currentAlerts = _.indexBy(alerts, function(alert) {
							return alert.alert_id;
						});

						var mutatedAlerts = _.filter(alerts, function(alert) {
							var alertId = alert.alert_id;

							return !_.has(that._alerts, alertId) || !_.isEqual(alert, that._alerts[alertId]);
						});

						var deletedAlerts = _.filter(_.values(that._alerts), function(existing) {
							return !_.has(currentAlerts, existing.alert_id);
						});

						_.forEach(mutatedAlerts, function(alert) {
							that._alerts[alert.alert_id] = alert;
						});

						_.forEach(deletedAlerts, function(alert) {
							delete that._alerts[alert.alert_id];
						});

						_.forEach(mutatedAlerts, function(alert) {
							console.log('mutated');

							that._parent._onAlertMutated(alert);
						});

						_.forEach(deletedAlerts, function(alert) {
							console.log('deleted');

							that._parent._onAlertDeleted(alert);
						});

						return true;
					});
			};

			var repeat = function() {
				that._parent._scheduler.backoff(poll, 5000, 'alert poll', 7)
					.then(function() {
						repeat();
					});
			};

			repeat();
		}
	});

	return RestAlertManager;
}();