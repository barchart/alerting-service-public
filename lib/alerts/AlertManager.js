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
			assert.argumentIsRequired(alert.automatic_reset, 'alert.automatic_reset', Boolean);

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

		retrieveAlerts: function(user) {
			assert.argumentIsRequired(user, user, Object);
			assert.argumentIsRequired(user.user_id, 'user.user_id', String);

			return this._retrieveAlerts(user);
		},

		_retrieveAlerts: function(user) {
			return null;
		},

        disableAlert: function(alert) {
			var clone = _.clone(alert);

			clone.alert_state = 'Stopping';

			this._onAlertMutated(clone);

			return this._disableAlert(clone);
        },

		_disableAlert: function(alert) {
			return;
		},

        resetAlert: function(alert) {
			var clone = _.clone(alert);

			clone.alert_state = 'Starting';

			this._onAlertMutated(clone);

			return this._resetAlert(clone);
        },

		_resetAlert: function(alert) {
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

		subscribeAlerts: function(user, changeCallback, deleteCallback) {
			assert.argumentIsRequired(user, user, Object);
			assert.argumentIsRequired(user.user_id, 'user.user_id', String);
			assert.argumentIsRequired(changeCallback, 'changeCallback', Function);
			assert.argumentIsRequired(deleteCallback, 'deleteCallback', Function);

			var userId = user.user_id;

			if (!_.has(this._alertChangeMap, user.user_id)) {
				this._alertChangeMap[userId] = new Event(this);
			}

			if (!_.has(this._alertDeleteMap, user.user_id)) {
				this._alertDeleteMap[userId] = new Event(this);
			}

			var implementationBinding = this._onSubscribeAlerts(user);

			var changeRegistration = this._alertChangeMap[userId].register(changeCallback);
			var deleteRegistration = this._alertDeleteMap[userId].register(deleteCallback);

			return Disposable.fromAction(function() {
				implementationBinding.dispose();

				changeRegistration.dispose();
				deleteRegistration.dispose();
			});
		},

		_onSubscribeAlerts: function(user) {
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

		getConditionOperators: function() {
			return this._getConditionOperators();
		},

		_getConditionOperators: function() {
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
		}
    });

    return AlertManager;
}();