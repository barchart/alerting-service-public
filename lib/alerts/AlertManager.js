var _ = require('lodash');
var Class = require('class.extend');

var assert = require('./../common/lang/assert');
var Disposable = require('./../common/lang/Disposable');
var Event = require('./../common/messaging/Event');

module.exports = function() {
    'use strict';

    var AlertManager = Class.extend({
        init: function() {
			this._alertChangeMap = { };
			this._alertDeleteMap = { };
        },

		connect: function() {
			return this._connect();
		},

		_connect: function() {
			return null;
		},

        createAlert: function(alert) {
			assert.argumentIsRequired(alert, 'alert', Object);
			assert.argumentIsOptional(alert.alert_id, 'alert.alert_id', String);
            assert.argumentIsRequired(alert.name, 'alert.name', String);
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
				assert.argumentIsRequired(publisher.recipient, 'alert.publishers[' + i + '].recipient', String);
				assert.argumentIsRequired(publisher.format, 'alert.publishers[' + i + '].format', String);
			}

            return this._createAlert(alert);
        },

		_createAlert: function(alert) {
			return null;
		},

        retrieveAlert: function(alert) {
			assert.argumentIsRequired(alert, 'alert', Object);
			assert.argumentIsRequired(alert.alert_id, 'alert.alert_id', String);

			return this._retrieveAlert(alert);
        },

		_retrieveAlert: function(alert) {
			return null;
		},

		retrieveAlerts: function(query) {
			assert.argumentIsRequired(query, query, Object);
			assert.argumentIsRequired(query.user_id, 'query.user_id', String);
			assert.argumentIsRequired(query.alert_system, 'query.alert_system', String);

			return this._retrieveAlerts(query);
		},

		_retrieveAlerts: function(user) {
			return null;
		},

        disableAlert: function(alert) {
			assert.argumentIsRequired(alert, 'alert', Object);
			assert.argumentIsRequired(alert.alert_id, 'alert.alert_id', String);

			var clone = _.clone(alert);

			clone.alert_state = 'Stopping';

			this._onAlertMutated(clone);

			return this._disableAlert(clone);
        },

		_disableAlert: function(alert) {
			return;
		},

        enableAlert: function(alert) {
			assert.argumentIsRequired(alert, 'alert', Object);
			assert.argumentIsRequired(alert.alert_id, 'alert.alert_id', String);

			var clone = _.clone(alert);

			clone.alert_state = 'Starting';

			this._onAlertMutated(clone);

			return this._enableAlert(clone);
        },

		_enableAlert: function(alert) {
			return;
		},

        deleteAlert: function(alert) {
			assert.argumentIsRequired(alert, 'alert', Object);
			assert.argumentIsOptional(alert.alert_id, 'alert.alert_id', String);

            return this._deleteAlert(alert);
        },

		_deleteAlert: function(alert) {
			return null;
		},

		subscribeAlerts: function(query, changeCallback, deleteCallback) {
			assert.argumentIsRequired(query, query, Object);
			assert.argumentIsRequired(query.user_id, 'query.user_id', String);
			assert.argumentIsRequired(query.alert_system, 'query.alert_system', String);
			assert.argumentIsRequired(changeCallback, 'changeCallback', Function);
			assert.argumentIsRequired(deleteCallback, 'deleteCallback', Function);

			var userId = query.user_id;

			if (!_.has(this._alertChangeMap, query.user_id)) {
				this._alertChangeMap[userId] = new Event(this);
			}

			if (!_.has(this._alertDeleteMap, query.user_id)) {
				this._alertDeleteMap[userId] = new Event(this);
			}

			var implementationBinding = this._onSubscribeAlerts(query);

			var changeRegistration = this._alertChangeMap[userId].register(changeCallback);
			var deleteRegistration = this._alertDeleteMap[userId].register(deleteCallback);

			return Disposable.fromAction(function() {
				implementationBinding.dispose();

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

			var event = this._alertChangeMap[alert.user_id];

			if (event) {
				event.fire(alert);
			}
		},

		_onAlertDeleted: function(alert) {
			if (!_.isObject(alert)) {
				return;
			}

			var event = this._alertDeleteMap[alert.user_id];

			if (event) {
				event.fire(alert);
			}
		},

		getTargets: function() {
			return this._getTargets();
		},

		_getTargets: function() {
			return null;
		},

		getProperties: function() {
			return this._getProperties();
		},

		_getProperties: function() {
			return null;
		},

		getOperators: function() {
			return this._getOperators();
		},

		_getOperators: function() {
			return null;
		},

		getPublisherTypes: function() {
			return this._getPublisherTypes();
		},

		_getPublisherTypes: function() {
			return null;
		},

		getServerVersion: function() {
			return this._getServerVersion();
		},

		_getServerVersion: function() {
			return null;
		},

		toString: function() {
			return '[AlertManager]';
		}
    });

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

					transform(children, descriptionIndex + 1)

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