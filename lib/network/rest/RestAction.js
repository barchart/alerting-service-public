var Class = require('class.extend');

var assert = require('./../../common/lang/assert');

module.exports = function() {
    'use strict';

    var RestAction = Class.extend({
        init: function(action, httpVerb, requiresQuery, requiresPayload) {
            assert.argumentIsRequired(action, 'action', String);
            assert.argumentIsRequired(httpVerb, 'httpVerb', String);
            assert.argumentIsRequired(requiresQuery, 'requiresQuery', Boolean);
            assert.argumentIsRequired(requiresPayload, 'requiresPayload', Boolean);

            this._action = action;
            
            this._httpVerb = httpVerb;
            this._requiresQuery = requiresQuery;
            this._requiresPayload = requiresPayload;
        },

        getAction: function() {
            return this._action;
        },
        
        getHttpVerb: function() {
            return this._httpVerb;
        },

        getQueryIsRequired: function() {
            return this._requiresQuery;
        },

        getPayloadIsRequired: function() {
            return this._requiresPayload;
        },

        toString: function() {
            return '[RestAction (action=' + this._action + ')]';
        }
    });

    function addAction(restAction) {
        var action = restAction.getAction();

        RestAction[action] = restAction;
    }

    addAction(new RestAction('Create', 'POST', false, true));
    addAction(new RestAction('Update', 'PUT', true, true));
    addAction(new RestAction('Retrieve', 'GET', true, false));
    addAction(new RestAction('Delete', 'DELETE', true, false));
    addAction(new RestAction('Query', 'GET', false, true));

    return RestAction;
}();