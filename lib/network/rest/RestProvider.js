var _ = require('lodash');
var Class = require('class.extend');
var http = require('http');
var https = require('https');
var when = require('when');

var RestProviderBase = require('./RestProviderBase');

module.exports = function() {
    'use strict';

    var RestProvider = RestProviderBase.extend({
        init: function(baseUrl, port, secure)  {
            this._super(baseUrl, port, secure);
        },

        _call: function(action, url, port, payload) {

        }
    });

    return RestProvider;
}();