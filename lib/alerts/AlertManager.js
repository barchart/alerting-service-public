var _ = require('lodash');
var Class = require('class.extend');

var assert = require('./../common/lang/assert');

module.exports = function() {
    'use strict';

    var AlertManager = Class.extend({
        init: function() {
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

			return this._disableAlert(clone);
        },

		_disableAlert: function(alert) {
			return;
		},

        resetAlert: function(alert) {
			var clone = _.clone(alert);

			clone.alert_state = 'Starting';

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