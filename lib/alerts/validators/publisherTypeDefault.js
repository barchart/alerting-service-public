var assert = require('common/lang/assert');
var is = require('common/lang/is');

module.exports = (() => {
	'use strict';

	const validator = {
		forCreate: (publisherTypeDefault, description) => {
			const ptd = publisherTypeDefault;
			const d = getDescription(description);

			assert.argumentIsRequired(ptd, d, Object);
			assert.argumentIsOptional(ptd.allow_window_timezone, `${d}.allow_window_timezone`, String);
			assert.argumentIsOptional(ptd.allow_window_start, `${d}.allow_window_start`, String);
			assert.argumentIsOptional(ptd.allow_window_end, `${d}.allow_window_end`, String);

			if (ptd.allow_window_start === '') {
				ptd.allow_window_start = null;
			}

			if (ptd.allow_window_end === '') {
				ptd.allow_window_end = null;
			}

			if (ptd.active_alert_types === undefined || ptd.active_alert_types === null) {
				delete ptd.active_alert_types;
			}

			if (ptd.active_alert_types) {
				assert.argumentIsArray(ptd.active_alert_types, `${d}.active_alert_types`, String);
			}
		},

		forUser: (publisherTypeDefault, description) => {
			const ptd = publisherTypeDefault;
			const d = getDescription(description);

			assert.argumentIsRequired(ptd, d, Object);
			assert.argumentIsRequired(ptd.user_id, `${d}.user_id`, String);
			assert.argumentIsRequired(ptd.alert_system, `${d}.alert_system`, String);
		}
	};

	function getDescription(description) {
		if (is.string(description)) {
			return description;
		} else {
			return 'publisherTypeDefault';
		}
	}

	return validator;
})();