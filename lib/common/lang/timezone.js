var _ = require('lodash');
var moment = require('moment-timezone');

module.exports = function() {
	'use strict';

	var timezone = {
		getTimezones: function() {
			return moment.tz.names();
		},

		hasTimezone: function(timezone) {
			assert.argumentIsRequired(timezone, 'timezone', String);

			return _.some(timezone.getTimezones(), function(candidate) {
				return candidate === timezone;
			});
		},

		guessTimezone: function() {
			return moment.tz.guess() || null;
		}
	};

	return timezone;
}();