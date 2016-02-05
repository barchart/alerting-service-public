var _ = require('lodash');
var when = require('when');

var assert = require('./../common/lang/assert');
var Disposable = require('./../common/lang/Disposable');
var Event = require('./../common/messaging/Event');

module.exports = function() {
	'use strict';

	var AlertManager = Disposable.extend({
		init: function() {
			this._super();

			this._alertSubscriptionMap = {};
		},

		connect: function() {
			var that = this;

			return when.try(function() {
				return that._connect();
			});
		},

		_connect: function() {
			return null;
		},

		createAlert: function(alert) {
			assert.argumentIsRequired(alert, 'alert', Object);
			assert.argumentIsOptional(alert.alert_id, 'alert.alert_id', String);
			assert.argumentIsRequired(alert.name, 'alert.name', String);
			assert.argumentIsOptional(alert.notes, 'alert.notes', Object);
			assert.argumentIsRequired(alert.user_id, 'alert.user_id', String);
			assert.argumentIsRequired(alert.alert_system, 'alert.alert_system', String);
			assert.argumentIsRequired(alert.automatic_reset, 'alert.automatic_reset', Boolean);
			assert.argumentIsArray(alert.conditions, 'alert.conditions', Object, 'Object');
			assert.argumentIsArray(alert.publishers, 'alert.publishers', Object, 'Object');

			for (var i = 0; i < alert.conditions.length; i++) {
				var condition = alert.conditions[i];

				assert.argumentIsRequired(condition.property, 'alert.conditions[' + i + '].property', Object);
				assert.argumentIsRequired(condition.property.property_id, 'alert.conditions[' + i + '].property.property_id', Number);
				assert.argumentIsRequired(condition.property.target, 'alert.conditions[' + i + '].property.target', Object);
				assert.argumentIsRequired(condition.property.target.identifier, 'alert.conditions[' + i + '].property.target.identifier', String);
				assert.argumentIsRequired(condition.operator, 'alert.conditions[' + i + '].operator', Object);
				assert.argumentIsRequired(condition.operator.operator_id, 'alert.conditions[' + i + '].operator_id', Number);
				assert.argumentIsRequired(condition.operator.operand, 'alert.conditions[' + i + '].operand', String);
			}

			for (var j = 0; j < alert.publishers.length; j++) {
				var publisher = alert.publishers[j];

				assert.argumentIsRequired(publisher.type, 'alert.publishers[' + i + '].type', Object);
				assert.argumentIsRequired(publisher.type.publisher_type_id, 'alert.publishers[' + i + '].type.publisher_type_id', Number);
				assert.argumentIsRequired(publisher.use_default_recipient, 'alert.publishers[' + i + '].use_default_recipient', Boolean);

				if (!publisher.use_default_recipient) {
					assert.argumentIsRequired(publisher.recipient, 'alert.publishers[' + i + '].recipient', String);
				}

				assert.argumentIsRequired(publisher.format, 'alert.publishers[' + i + '].format', String);

				if (publisher.use_default_recipient) {
					publisher.recipient = null;
				}
			}

			var that = this;

			return when.try(function() {
				return that._createAlert(alert);
			});
		},

		_createAlert: function(alert) {
			return null;
		},

		retrieveAlert: function(alert) {
			assert.argumentIsRequired(alert, 'alert', Object);
			assert.argumentIsRequired(alert.alert_id, 'alert.alert_id', String);

			var that = this;

			return when.try(function() {
				return that._retrieveAlert(alert);
			});
		},

		_retrieveAlert: function(alert) {
			return null;
		},

		editAlert: function(alert) {
			assert.argumentIsRequired(alert, 'alert', Object);
			assert.argumentIsRequired(alert.alert_id, 'alert.alert_id', String);

			var that = this;

			return when.try(function() {
				return that.deleteAlert(alert)
					.then(function(deleted) {
						return that.createAlert(alert);
					});
			});
		},

		enableAlert: function(alert) {
			assert.argumentIsRequired(alert, 'alert', Object);
			assert.argumentIsRequired(alert.alert_id, 'alert.alert_id', String);

			var that = this;

			var clone = _.clone(alert);

			clone.alert_state = 'Starting';

			that._onAlertMutated(clone);

			return when.try(function() {
				return that._enableAlert(clone);
			});
		},

		_enableAlert: function(alert) {
			return;
		},

		disableAlert: function(alert) {
			assert.argumentIsRequired(alert, 'alert', Object);
			assert.argumentIsRequired(alert.alert_id, 'alert.alert_id', String);

			var that = this;

			var clone = _.clone(alert);

			clone.alert_state = 'Stopping';

			this._onAlertMutated(clone);

			return when.try(function() {
				return that._disableAlert(clone);
			});
		},

		_disableAlert: function(alert) {
			return;
		},

		deleteAlert: function(alert) {
			assert.argumentIsRequired(alert, 'alert', Object);
			assert.argumentIsOptional(alert.alert_id, 'alert.alert_id', String);

			var that = this;

			return when.try(function() {
				return that._deleteAlert({alert_id: alert.alert_id});
			});
		},

		_deleteAlert: function(alert) {
			return null;
		},

		retrieveAlerts: function(query) {
			assert.argumentIsRequired(query, query, Object);
			assert.argumentIsRequired(query.user_id, 'query.user_id', String);

			var that = this;

			return when.try(function() {
				var returnRef = that._retrieveAlerts(query);

				if (_.isObject(query.filter) && _.isObject(query.filter.target) && _.isString(query.filter.target.identifier)) {
					var identifier = query.filter.target.identifier;

					returnRef = returnRef.then(function(alerts) {
						return _.filter(alerts, function(alert) {
							return _.some(alert.conditions, function(condition) {
								return condition.property.target.identifier === identifier;
							});
						});
					});
				}

				return returnRef;
			});
		},

		_retrieveAlerts: function(query) {
			return null;
		},

		subscribeAlerts: function(query, changeCallback, deleteCallback) {
			assert.argumentIsRequired(query, query, Object);
			assert.argumentIsRequired(query.user_id, 'query.user_id', String);
			assert.argumentIsRequired(query.alert_system, 'query.alert_system', String);
			assert.argumentIsRequired(changeCallback, 'changeCallback', Function);
			assert.argumentIsRequired(deleteCallback, 'deleteCallback', Function);

			var userId = query.user_id;
			var alertSystem = query.alert_system;

			if (!_.has(this._alertSubscriptionMap, userId)) {
				this._alertSubscriptionMap[userId] = {};
			}

			if (!_.has(this._alertSubscriptionMap[userId], alertSystem)) {
				this._alertSubscriptionMap[userId][alertSystem] = {
					changeEvent: new Event(this),
					deleteEvent: new Event(this),
					subscribers: 0
				};
			}

			var subscriptionData = this._alertSubscriptionMap[userId][alertSystem];

			if (subscriptionData.subscribers === 0) {
				subscriptionData.implementationBinding = this._onSubscribeAlerts(query);
			}

			subscriptionData.subscribers = subscriptionData.subscribers + 1;

			var changeRegistration = subscriptionData.changeEvent.register(changeCallback);
			var deleteRegistration = subscriptionData.deleteEvent.register(deleteCallback);

			return Disposable.fromAction(function() {
				subscriptionData.subscribers = subscriptionData.subscribers - 1;

				if (subscriptionData.subscribers === 0) {
					subscriptionData.implementationBinding.dispose();
				}

				changeRegistration.dispose();
				deleteRegistration.dispose();
			});
		},

		_onSubscribeAlerts: function(query) {
			return;
		},

		_onAlertMutated: function(alert) {
			if (!_.isObject(alert)) {
				return;
			}

			var data = getMutationEvent(this._alertSubscriptionMap, alert);

			if (data) {
				data.changeEvent.fire(_.clone(alert, true));
			}
		},

		_onAlertDeleted: function(alert) {
			if (!_.isObject(alert)) {
				return;
			}

			var data = getMutationEvent(this._alertSubscriptionMap, alert);

			if (data) {
				data.deleteEvent.fire(alert);
			}
		},

		getTargets: function() {
			var that = this;

			return when.try(function() {
				return that._getTargets();
			});
		},

		_getTargets: function() {
			return null;
		},

		getProperties: function() {
			var that = this;

			return when.try(function() {
				return that._getProperties();
			});
		},

		_getProperties: function() {
			return null;
		},

		getOperators: function() {
			var that = this;

			return when.try(function() {
				return that._getOperators();
			});
		},

		_getOperators: function() {
			return null;
		},

		getPublisherTypes: function() {
			var that = this;

			return when.try(function() {
				return that._getPublisherTypes();
			});
		},

		_getPublisherTypes: function() {
			return null;
		},

		getPublisherTypeDefaults: function(query) {
			var that = this;

			return when.try(function() {
				return that._getPublisherTypeDefaults(query);
			});
		},

		_getPublisherTypeDefaults: function(query) {
			return null;
		},

		assignPublisherTypeDefault: function(query) {
			var that = this;

			return when.try(function() {
				return that._assignPublisherTypeDefault(query);
			});
		},

		_assignPublisherTypeDefault: function(query) {
			return null;
		},

		getServerVersion: function() {
			var that = this;

			return when.try(function() {
				return that._getServerVersion();
			});
		},

		_getServerVersion: function() {
			return null;
		},

		toString: function() {
			return '[AlertManager]';
		}
	});

	function getMutationEvent(map, alert) {
		var returnRef = null;

		var userId = alert.user_id;
		var alertSystem = alert.alert_system;

		if (_.has(map, userId)) {
			var systemMap = map[userId];

			if (_.has(systemMap, alertSystem)) {
				returnRef = systemMap[alertSystem];
			}
		}

		return returnRef;
	}

	AlertManager.getPropertiesForTarget = function(properties, target) {
		return _.filter(properties, function(property) {
			return property.target.target_id === target.target_id;
		});
	};

	AlertManager.getOperatorsForProperty = function(operators, property) {
		var operatorMap = AlertManager.getOperatorMap(operators);

		return _.map(property.valid_operators, function(operatorId) {
			return operatorMap[operatorId];
		});
	};

	AlertManager.getPropertyTree = function(properties) {
		var targetGroups = _.groupBy(properties, function(property) {
			return property.group;
		});

		var transform = function(map, descriptionIndex) {
			_.forEach(map, function(items, key) {
				var replacement = {
					description: key
				};

				var first = items[0];

				if (items.length === 1 && first.description.length === descriptionIndex) {
					replacement.item = first;
				} else {
					var children = _.groupBy(items, function(item) {
						return item.description[descriptionIndex];
					});

					transform(children, descriptionIndex + 1);

					replacement.items = _.values(children);
				}

				map[key] = replacement;
			});
		};

		transform(targetGroups, 0);

		return _.values(targetGroups);
	};

	AlertManager.getPropertyMap = function(properties) {
		return _.indexBy(properties, function(property) {
			return property.property_id;
		});
	};

	AlertManager.getOperatorMap = function(operators) {
		return _.indexBy(operators, function(operator) {
			return operator.operator_id;
		});
	};

	return AlertManager;
}();