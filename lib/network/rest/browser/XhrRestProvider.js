var xhr = require('xhr');
var when = require('when');

var RestProviderBase = require('./../RestProviderBase');

module.exports = function() {
	'use strict';

	var XhrRestProvider = RestProviderBase.extend({
		init: function(baseUrl, port, secure) {
			this._super(baseUrl, port, secure);
		},

		_call: function(action, url, port, payload) {
			var that = this;

			return when.promise(function(resolveCallback, rejectCallback) {
				var options = {
					url: url,
					method: action.getHttpVerb(),
					json: payload
				};

				xhr(options, function(error, response, body) {
					if (error) {
						rejectCallback(error);
					} else if (response.statusCode !== 200) {
						var message;

						if (_.isObject(body) && _.isString(body.message)) {
							message = body.message;
						} else {
							message = 'The server returned an HTTP ' + response.statusCode + ' error.';
						}

						rejectCallback(new Error(message));
					} else {
						resolveCallback(body);
					}
				});
			});
		}
	});

	return XhrRestProvider;
}();