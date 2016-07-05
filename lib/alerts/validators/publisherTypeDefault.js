var assert = require('./../../common/lang/assert');

module.exports = (() => {
	'use strict';

	const validator = {
		forCreate: (publisherTypeDefault, description) => {
			const ptd = publisherTypeDefault;
			const d = getDescription(description);

			assert.argumentIsOptional(ptd.allow_window_timezone, `${d}.allow_window_timezone`, Boolean);
			assert.argumentIsOptional(ptd.allow_window_start, `${d}.allow_window_start`, String);
			assert.argumentIsOptional(ptd.allow_window_end, `${d}.allow_window_end`, String);

			if (ptd.allow_window_start === '') {
				ptd.allow_window_start = null;
			}

			if (ptd.allow_window_end === '') {
				ptd.allow_window_end = null;
			}

			if (ptd.active_alert_types === undefined || ptd.active_alert_types === null) {
				ptd.active_alert_types = [ ];
			}

			assert.argumentIsArray(ptd.active_alert_types, `${d}.active_alert_types`, String);
		}
	};

	const getDescription = (description) => {
		if (typeof(description) === 'string') {
			return description;
		} else {
			return 'publisherTypeDefault';
		}
	};

	return validator;
})();