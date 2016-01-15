var Class = require('class.extend');
var when = require('when');

var assert = require('./../../common/lang/assert');
var RestEndpoint = require('./RestEndpoint');

module.exports = function() {
    'use strict';

    var RestProviderBase = Class.extend({
        init: function(baseUrl, port, secure) {
            assert.argumentIsRequired(baseUrl, 'baseUrl', String);
            assert.argumentIsRequired(port, 'port', Number);

            this._baseUrl = baseUrl;
            this._port = port;
        },

        call: function(endpoint, data) {
            assert.argumentIsRequired(endpoint, endpoint, RestEndpoint, 'RestEndpoint');

            return when(this._call(endpoint.getAction(), endpoint.getUrl(data, this._baseUrl, this._port), this._port, endpoint.getPayload(data)));
        },

        _call: function(action, url, port, payload) {
            return true;
        }
    });

    return RestProviderBase;
}();