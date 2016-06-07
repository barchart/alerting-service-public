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
			this._retrieveEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alerts', 'alert_id' ]);
			this._queryEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alerts', 'users', 'alert_system', 'user_id' ]);
			this._updateEndpoint = new RestEndpoint(RestAction.Update, [ 'alerts', 'alert_id' ]);
			this._deleteEndpoint = new RestEndpoint(RestAction.Delete, [ 'alerts', 'alert_id' ]);
			this._retrieveTargetsEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alert', 'targets' ]);
			this._retrievePropertiesEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alert', 'targets', 'properties' ]);
			this._retrieveOperatorsEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alert', 'operators' ]);
			this._retrievePublisherTypesEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alert', 'publishers' ]);
			this._retrievePublisherTypeDefaultsEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alert', 'publishers', 'default', 'alert_system', 'user_id' ]);
			this._assignPublisherTypeDefaultEndpoint = new RestEndpoint(RestAction.Update, [ 'alert', 'publishers', 'default', 'alert_system', 'user_id', 'publisher_type_id' ]);
			this._retrieveMarketDataConfigurationEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alert', 'market', 'configuration', 'alert_system', 'user_id' ]);
			this._assignMarketDataConfigurationEndpoint = new RestEndpoint(RestAction.Update, [ 'alert', 'market', 'configuration', 'alert_system', 'user_id' ]);

			this._versionEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'server', 'version' ]);

			this._scheduler = new Scheduler();

			this._subscribers = { };
		},

		_connect: function() {
			return true;
		},

		_createAlert: function(alert) {
			return this._restProvider.call(this._createEndpoint, alert);
		},

		_retrieveAlert: function(alert) {
			return this._restProvider.call(this._retrieveEndpoint, alert);
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
			var that = this;

			return that._restProvider.call(that._queryEndpoint, query)
				.then(function(alerts) {
					var subscriber = getSubscriber(that._subscribers, query);

					if (subscriber) {
						var clones = _.map(alerts, function(alert) {
							return _.clone(alert, true);
						});

						subscriber.processAlerts(clones);
					}

					return alerts;
				});
		},

		_onSubscribeAlerts: function(query) {
			var that = this;

			var userId = query.user_id;
			var systemId = query.alert_system;

			var subscriber = getSubscriber(that._subscribers, query);

			if (subscriber !== null) {
				throw new Error('A subscriber already exists');
			}

			subscriber = new AlertSubscriber(that, query);
			subscriber.start();

			putSubscriber(that._subscribers, subscriber);

			return new Disposable.fromAction(function() {
				delete that._subscribers[userId][systemId];

				subscriber.dispose();
			});
		},

		_getTargets: function() {
			return this._restProvider.call(this._retrieveTargetsEndpoint, { });
		},

		_getProperties: function() {
			return this._restProvider.call(this._retrievePropertiesEndpoint, { });
		},

		_getOperators: function() {
			return this._restProvider.call(this._retrieveOperatorsEndpoint, { });
		},

		_getPublisherTypes: function() {
			return this._restProvider.call(this._retrievePublisherTypesEndpoint, { });
		},

		_getPublisherTypeDefaults: function(query) {
			return this._restProvider.call(this._retrievePublisherTypeDefaultsEndpoint, query);
		},

		_assignPublisherTypeDefault: function(query) {
			return this._restProvider.call(this._assignPublisherTypeDefaultEndpoint, query);
		},

		_getMarketDataConfiguration: function(query) {
			return this._restProvider.call(this._retrieveMarketDataConfigurationEndpoint, query);
		},

		_assignMarketDataConfiguration: function(query) {
			return this._restProvider.call(this._assignMarketDataConfigurationEndpoint, query);
		},

		_getServerVersion: function() {
			return this._restProvider.call(this._versionEndpoint, { });
		},

		_onDispose: function() {
			_.forEach(this._subscribers, function(subscriber) {
				subscriber.dispose();
			});

			this._scheduler.dispose();
		},

		toString: function() {
			return '[REST Alert Manager]';
		}
	});

	function getSubscriber(subscribers, query) {
		var userId = query.user_id;
		var systemId = query.alert_system;

		var returnRef;

		if (_.has(subscribers, userId) && _.has(subscribers[userId], systemId)) {
			returnRef = subscribers[userId][systemId];
		} else {
			returnRef = null;
		}

		return returnRef;
	}

	function putSubscriber(subscribers, subscriber) {
		var query = subscriber.getQuery();

		var userId = query.user_id;
		var systemId = query.alert_system;

		var returnRef;

		if (!_.has(subscribers, userId)) {
			subscribers[userId] = { };
		}

		subscribers[userId][systemId] = subscriber;
	}

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

		processAlerts: function(alerts) {
			var that = this;

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
				that._parent._onAlertMutated(alert);
			});

			_.forEach(deletedAlerts, function(alert) {
				that._parent._onAlertDeleted(alert);
			});
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
						return true;
					});
			};

			var repeat = function(delay) {
				that._parent._scheduler.backoff(poll, delay, 'alert poll', 7)
					.then(function() {
						if (that.getIsDisposed()) {
							return;
						}

						repeat(5000);
					});
			};

			repeat(0);
		}
	});

	return RestAlertManager;
}();