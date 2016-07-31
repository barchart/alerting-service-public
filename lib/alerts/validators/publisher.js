var assert = require('common/lang/assert');
var is = require('common/lang/is');

module.exports = (() => {
	'use strict';

	const validator = {
		forCreate: (publisher, description) => {
			const d = getDescription(description);

			assert.argumentIsRequired(publisher.type, `${d}.type`, Object);
			assert.argumentIsRequired(publisher.type.publisher_type_id, `${d}.type.publisher_type_id`, Number);
			assert.argumentIsRequired(publisher.use_default_recipient, `${d}.use_default_recipient`, Boolean);

			if (publisher.use_default_recipient === undefined || publisher.use_default_recipient === null) {
				publisher.use_default_recipient = false;
			}

			assert.argumentIsRequired(publisher.use_default_recipient, `${d}.use_default_recipient`, Boolean);

			if (publisher.use_default_recipient) {
				publisher.recipient = null;
			} else {
				assert.argumentIsRequired(publisher.recipient, `${d}.recipient`, String);
			}

			assert.argumentIsOptional(publisher.format, `${d}.format`, String);
		}
	};

	function getDescription(description) {
		if (is.string(description)) {
			return description;
		} else {
			return 'publisher';
		}
	}

	return validator;
})();