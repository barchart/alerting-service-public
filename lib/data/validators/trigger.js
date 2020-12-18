const assert = require('@barchart/common-js/lang/assert'),
    is = require('@barchart/common-js/lang/is');

module.exports = (() => {
    'use strict';

    const validator = {
        forQuery: (query, description) => {
            const d = getDescription(description);

            validator.forUser(query, description);

            assert.argumentIsOptional(query.trigger_date, `${d}.trigger_date`, Number);
            assert.argumentIsOptional(query.trigger_status, `${d}.trigger_status`, String);
        },

        forUpdate: (query, description) => {
            const d = getDescription(description);

            assert.argumentIsRequired(query.alert_id, `${d}.alert_id`, String);
            assert.argumentIsRequired(query.trigger_date, `${d}.trigger_date`, String);
            assert.argumentIsOptional(query.trigger_status, `${d}.trigger_status`, String);
        },

        forBatch: (query, description) => {
            const d = getDescription(description);

            validator.forUser(query, description);

            assert.argumentIsOptional(query.trigger_status, `${d}.trigger_status`, String);
        },

        forUser: (query, description) => {
            const d = getDescription(description);

            assert.argumentIsRequired(query, d, Object);
            assert.argumentIsRequired(query.user_id, `${d}.user_id`, String);
            assert.argumentIsRequired(query.alert_system, `${d}.alert_system`, String);
        },
    };

    function getDescription(description) {
        if (is.string(description)) {
            return description;
        } else {
            return 'trigger';
        }
    }

    return validator;
})();
