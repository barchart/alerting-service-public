const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is');

const condition = require('./condition'),
	publisher = require('./publisher');

module.exports = (() => {
	'use strict';

	const validator = {
		forCreate: (alert, description) => {
			const d = getDescription(description);

			validator.forUser(alert, description);

			assert.argumentIsOptional(alert.template_id, `${d}.template_id`, String);
			assert.argumentIsOptional(alert.alert_type, `${d}.alert_type`, String);
			assert.argumentIsOptional(alert.name, `${d}.name`, String);
			assert.argumentIsOptional(alert.notes, `${d}.notes`, Object);
			assert.argumentIsOptional(alert.user_notes, `${d}.user_notes`, String);
			assert.argumentIsOptional(alert.alert_system_key, `${d}.alert_system_key`, String);
			assert.argumentIsOptional(alert.alert_behavior, `${d}.alert_behavior`, String);

			assert.argumentIsArray(alert.conditions, `${d}.conditions`, condition.forCreate);

			if (alert.hasOwnProperty('publishers')) {
				assert.argumentIsArray(alert.publishers, `${d}.publishers`, publisher.forCreate);
			}
		},

		forEdit: (alert, description) => {
			const d = getDescription(description);

			assert.argumentIsRequired(alert.alert_id, `${d}.alert_id`, String);

			validator.forCreate(alert, description);
		},

		forQuery: (alert, description) => {
			const d = getDescription(description);

			assert.argumentIsRequired(alert, d, Object);
			assert.argumentIsRequired(alert.alert_id, `${d}.alert_id`, String);
		},

		forUser: (alert, description) => {
			const d = getDescription(description);

			assert.argumentIsRequired(alert, d, Object);
			assert.argumentIsRequired(alert.user_id, `${d}.user_id`, String);
			assert.argumentIsRequired(alert.alert_system, `${d}.alert_system`, String);
		}
	};

	function getDescription(description) {
		if (is.string(description)) {
			return description;
		} else {
			return 'alert';
		}
	}

	return validator;
})();
