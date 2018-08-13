const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	const validator = {
		forCreate: (condition, description) => {
			const d = getDescription(description);

			assert.argumentIsRequired(condition.property, `${d}.property`, Object);
			assert.argumentIsRequired(condition.property.property_id, `${d}.property.property_id`, Number);
			assert.argumentIsRequired(condition.property.target, `${d}.property.target`, Object);
			assert.argumentIsRequired(condition.property.target.identifier, `${d}.property.target.identifier`, String);
			assert.argumentIsOptional(condition.property.target.display, `${d}.property.target.display`, String);
			assert.argumentIsOptional(condition.property.target.kind, `${d}.property.target.kind`, String);
			assert.argumentIsRequired(condition.operator, `${d}.operator`, Object);
			assert.argumentIsRequired(condition.operator.operator_id, `${d}.operator.operator_id`, Number);

			if (Array.isArray(condition.operator.operand)) {
				assert.argumentIsArray(condition.operator.operand, `${d}.operator.operand`, String);
			} else {
				assert.argumentIsOptional(condition.operator.operand, `${d}.operator.operand`, String);
			}

			if (condition.operator.modifiers) {
				assert.argumentIsArray(condition.operator.modifiers, `${d}.operator.modifiers`, validateModifier);
			}
		}
	};

	function getDescription(description) {
		if (is.string(description)) {
			return description;
		} else {
			return 'condition';
		}
	}

	function validateModifier(modifier, d) {
		assert.argumentIsRequired(modifier.modifier_id, `${d}.modifier_id`, Number);
		assert.argumentIsRequired(modifier.value, `${d}.value`, String);
	}

	return validator;
})();