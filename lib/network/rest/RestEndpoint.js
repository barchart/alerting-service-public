var _ = require('lodash');
var Class = require('class.extend');

var assert = require('./../../common/lang/assert');
var attributes = require('./../../common/lang/attributes');
var RestAction = require('./RestAction');

module.exports = function() {
    'use strict';

    var RestEndpoint = Class.extend({
        init: function(action, pathProperties, payloadProperty) {
            assert.argumentIsRequired(action, 'action', RestAction, 'RestAction');
            assert.argumentIsArray(pathProperties, 'pathProperties', String);
            assert.argumentIsOptional(payloadProperty, 'payloadProperty', String);

            this._name = name;
            this._action = action;

            this._pathProperties = pathProperties;
            this._payloadProperty = payloadProperty || null;
        },

        getAction: function() {
            return this._action;
        },

        getUrl: function(data, baseUrl) {
            assert.argumentIsOptional(baseUrl, 'baseUrl', String);

            var path = _.map(this._pathProperties, function(pathProperty) {
                var pathItem;

                if (attributes.has(data, pathProperty)) {
                    pathItem = attributes.read(data, pathProperty);
                } else {
                    pathItem = pathProperty;
                }

                return pathItem;
            });

            if (this.getAction().getQueryIsRequired() && path.length === 0) {
                throw new Error('Unable to generate REST query path.');
            }

            if (baseUrl.length !== 0) {
                path.unshift('http://' + baseUrl + ':3000');
            }

            return path.join('/');
        },

        getPayload: function(data) {
            var returnRef;

            if (this._payloadProperty !== null) {
                returnRef = attributes.read(data, this._payloadProperty);
            } else {
                returnRef = data;
            }

            if (this.getAction().getPayloadIsRequired() && !_.isObject(returnRef)) {
                throw new Error('Unable to generate REST payload.');
            }

            return returnRef;
        }
    });

    return RestEndpoint;
}();