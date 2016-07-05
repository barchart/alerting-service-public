var assert = require('./../../common/lang/assert');

var condition = require('./condition');
var publisher = require('./condition');

module.exports = (() => {
	'use strict';

	const validator = {
		forCreate: (alert, description) => {
			const d = getDescription(description);

			validator.forUser(alert, description);

			assert.argumentIsOptional(alert.alert_id, `${d}.alert_id`, String);
			assert.argumentIsOptional(alert.alert_type, `${d}.alert_type`, String);
			assert.argumentIsRequired(alert.name, `${d}.name`, String);
			assert.argumentIsOptional(alert.notes, `${d}.notes`, Object);
			assert.argumentIsOptional(alert.user_notes, `${d}.user_notes`, String);
			assert.argumentIsRequired(alert.automatic_reset, `${d}.automatic_reset`, Boolean);

			assert.argumentIsArray(alert.conditions, `${d}.conditions`, condition.forCreate);
			assert.argumentIsArray(alert.publishers, `${d}.publishers`, publisher.forCreate);
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

	const getDescription = (description) => {
		if (typeof(description) === 'string') {
			return description;
		} else {
			return 'alert';
		}
	};

	return validator;
})();