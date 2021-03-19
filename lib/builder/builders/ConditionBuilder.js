const assert = require('@barchart/common-js/lang/assert');

const Condition = require('../data/Condition');
const PropertyBuilder = require('./PropertyBuilder');

module.exports = (() => {
	/**
	 * Alert builder responsible for building an {@link Condition} object by using provided API functions.
	 *
	 * @public
	 * @exported
	 * @param {Array} operators - An array of possible operators.
	 * @param {Array} properties - An array of possible properties.
	 */
	class ConditionBuilder {
		constructor(operators, properties) {
			this._operators = operators;
			this._properties = properties;
			this._condition = new Condition(null, null, null);
		}

		get condition() {
			return this._condition;
		}

		/**
		 * Adds {@link Property} by PropertyBuilder. Uses a callback to provides the consumer with a {@link PropertyBuilder}.
		 *
		 * @param {Function} callback - A callback function.
		 * @returns {ConditionBuilder}
		 */
		withPropertyBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const pb = new PropertyBuilder(this._properties);
			callback(pb);
			const property = pb.build();

			this._condition = new Condition(property, this._condition.operator_id, this._condition.operand);

			return this;
		}

		/**
		 * Adds an operator then returns the current instance.
		 *
		 * @param {String} operator - An operator name.
		 * @returns {ConditionBuilder}
		 */
		withOperator(operator) {
			assert.argumentIsRequired(operator, 'operator', String);

			const selectedOperator = this._operators.find((item) => operator.toLowerCase() === item.operator_name.toLowerCase());

			if (!selectedOperator) {
				throw new Error(`Operator [ ${operator} ] not found.`);
			}

			this._condition = new Condition(this._condition.property, selectedOperator.operator_id, this._condition.operand);

			return this;
		}

		/**
		 * Adds an operand then returns the current instance.
		 *
		 * @param {String|Number} operand - An operand.
		 * @returns {ConditionBuilder}
		 */
		withOperand(operand) {
			this._condition = new Condition(this._condition.property, this._condition.operator_id, operand);

			return this;
		}

		/**
		 * Returns a JSON object representing {@link Condition}.
		 *
		 * @returns {Object<Condition>}
		 */
		build() {
			const selectedProperty = this._properties.find((item) => item.property_id === this._condition.property.property_id);

			if (!selectedProperty) {
				throw new Error(`Property has not been set.`);
			}

			if (!selectedProperty.valid_operators.includes(this.condition.operator_id)) {
				throw new Error(`The operator is not valid for the selected property.`);
			}

			return this._condition.toJSON();
		}

		toString() {
			return '[ConditionBuilder]';
		}
	}

	return ConditionBuilder;
})();