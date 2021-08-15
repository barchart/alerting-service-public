const assert = require('@barchart/common-js/lang/assert'),
    is = require('@barchart/common-js/lang/is');

const templateCondition = require('./templateCondition');

module.exports = (() => {
    'use strict';

    const validator = {
        forCreate: (template, description) => {
            const d = getDescription(description);

            validator.forUser(template, description);

            assert.argumentIsOptional(template.name, `${d}.name`, String);
            assert.argumentIsOptional(template.description, `${d}.description`, String);
            assert.argumentIsOptional(template.frequency, `${d}.frequency`, String);

            assert.argumentIsOptional(template.alert_type, `${d}.alert_type`, String);
            assert.argumentIsOptional(template.use_as_default, `${d}.use_as_default`, Boolean);

            assert.argumentIsArray(template.conditions, `${d}.conditions`, templateCondition.forCreate);
        },

        forQuery: (template, description) => {
            const d = getDescription(description);

            assert.argumentIsRequired(template, d, Object);
            assert.argumentIsRequired(template.template_id, `${d}.template_id`, String);
        },

        forUpdate: (template, description) => {
            const d = getDescription(description);

            assert.argumentIsRequired(template, d, Object);
            assert.argumentIsRequired(template.template_id, `${d}.template_id`, String);

            assert.argumentIsOptional(template.name, `${d}.name`, String);
            assert.argumentIsOptional(template.description, `${d}.description`, String);
            assert.argumentIsOptional(template.frequency, `${d}.frequency`, String);

            assert.argumentIsOptional(template.use_as_default, `${d}.use_as_default`, Boolean);
            assert.argumentIsOptional(template.sort_order, `${d}.sort_order`, Number);
        },

        forUser: (template, description) => {
            const d = getDescription(description);

            assert.argumentIsRequired(template, d, Object);
            assert.argumentIsRequired(template.user_id, `${d}.user_id`, String);
            assert.argumentIsRequired(template.alert_system, `${d}.alert_system`, String);
        }
    };

    function getDescription(description) {
        if (is.string(description)) {
            return description;
        } else {
            return 'template';
        }
    }

    return validator;
})();
