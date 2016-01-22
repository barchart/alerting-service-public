var axios = require('axios');
var when = require('when');

var RestProviderBase = require('./../RestProviderBase');

module.exports = function() {
	'use strict';

	var AxiosRestProvider = RestProviderBase.extend({
		init: function(baseUrl, port, secure) {
			this._super(baseUrl, port, secure);

			this._axios = axios.create();
		},

		_call: function(action, url, port, payload) {
			var that = this;

			return when.promise(function(resolvePromise, rejectPromise) {
				var options = {
					url: url,
					method: action.getHttpVerb(),
					data: payload,
					responseType: 'json'
				};

				that._axios.request(options)
					.then(function(response) {
						resolvePromise(response.data);
					})
					.catch(function(response) {
						var error;

						if (response instanceof Error) {
							error = new Error(response.message);
						} else {
							error = new Error(response.data.message || 'Unknown error');
						}

						if (response.status) {
							error.status = response.status;
						}

						rejectPromise(error);
					});
			});
		}
	});

	return AxiosRestProvider;
}();