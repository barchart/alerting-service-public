var assert = require('./../../common/lang/assert');

module.exports = (() => {
	'use strict';

	const validator = {
		forCreate: (condition, description) => {
			const d = getDescription(description);

			assert.argumentIsRequired(condition.property, `${d}.property`, Object);
			assert.argumentIsRequired(condition.property.property_id, `${d}.property.property_id`, Number);
			assert.argumentIsRequired(condition.property.target, `${d}.property.target`, Object);
			assert.argumentIsRequired(condition.property.target.identifier, `${d}.property.target.identifier`, String);
			assert.argumentIsRequired(condition.operator, `${d}.operator`, Object);
			assert.argumentIsRequired(condition.operator.operator_id, `${d}.operator.operator_id`, Number);

			if (Array.isArray(condition.operator.operand)) {
				assert.argumentIsArray(condition.operator.operand, `${d}.operand`, String);
			} else {
				assert.argumentIsOptional(condition.operator.operand, `${d}.operand`, String);
			}
		}
	};

	const getDescription = (description) => {
		if (typeof(description) === 'string') {
			return description;
		} else {
			return 'condition';
		}
	};

	return validator;
})();