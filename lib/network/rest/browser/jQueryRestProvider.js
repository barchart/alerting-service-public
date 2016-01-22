var _ = require('lodash');
var when = require('when');

var jQueryProvider = require('./../../../common/jQuery/jQueryProvider');
var RestProviderBase = require('./../RestProviderBase');

module.exports = function() {
    'use strict';

    var RestProvider = RestProviderBase.extend({
        init: function(baseUrl, port, secure) {
            this._super(baseUrl, port, secure);
        },

        _call: function(action, url, port, payload) {
            return when.promise(function(resolveCallback, rejectCallback) {
                var options = {
                    dataType: 'json',
                    method: action.getHttpVerb(),
                    url: url,
                    error: function (xhr, status, error) {
						var data = {
							error: error
						};

						if (_.isObject(xhr) && _.isObject(xhr.responseJSON) && _.isString(xhr.responseJSON.message)) {
							data.message = xhr.responseJSON.message;
						}

                        rejectCallback(data);
                    },
                    success: function (data, status, xhr) {
                        resolveCallback(data);
                    }
                };

                if (_.isObject(payload)) {
                    options.data = payload;
                }

                jQueryProvider.getInstance().ajax(options);
            });
        }
    });

    return RestProvider;
}();