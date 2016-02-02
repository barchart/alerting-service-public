var _ = require('lodash');

var assert = require('./assert');

module.exports = function() {
	'use strict';

	var conection = {
		getIsSecure: function(secure) {
			var returnVal;

			if (_.isBoolean(secure)) {
				returnVal = secure;
			} else {
				var protocol;

				if (_.isObject(window) && _.isObject(window.location) && _.isString(window.location.protocol)) {
					protocol = window.location.protocol;
				} else if (_.isObject(document) && _.isObject(document.location) && _.isString(document.location.protocol)) {
					protocol = document.location.protocol;
				} else {
					protocol = '';
				}

				returnVal = _.startsWith(protocol, 'https');
			}

			return returnVal;
		}
	};

	return conection;
}();