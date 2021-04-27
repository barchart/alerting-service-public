const assert = require('@barchart/common-js/lang/assert');

const Operator = require('../data/Operator');

const ModifierBuilder = require('./ModifierBuilder');

module.exports = (() => {
	/**
	 * Alert builder responsible for building an {@link Operator} object by using provided API functions.
	 *
	 * @public
	 * @exported
	 * @param {Array} operators - An array of possible properties.
	 */
	class OperatorBuilder {
		constructor(operators) {
			this._operators = operators; 
			this._operator = new Operator(null, null, null);
		}

		/**
		 * Adds an operator then returns the current instance.
		 *
		 * @param {String} operator - An operator name.
		 * @returns {OperatorBuilder}
		 */
		withOperator(operator) {
			assert.argumentIsRequired(operator, 'operator', String);

			const selectedOperator = this._operators.find((item) => operator.toLowerCase() === item.operator_name.toLowerCase());

			if (!selectedOperator) {
				throw new Error(`Operator [ ${operator} ] not found.`);
			}

			this._operator = new Operator(selectedOperator.operator_id, this._operator.operand, this._operator.modifiers);

			return this;
		}

		/**
		 * Adds an operand then returns the current instance.
		 *
		 * @param {String|Array<String>} operand - An operand.
		 * @returns {OperatorBuilder}
		 */
		withOperand(operand) {
			this._operator = new Operator(this._operator.operator_id, operand, this._operator.modifiers);

			return this;
		}

		/**
		 * Adds {@link Modifier} by ModifierBuilder. Uses a callback to provides the consumer with a {@link ModifierBuilder}.
		 *
		 * @param {Function} callback - A callback function.
		 * @returns {OperatorBuilder}
		 */
		withModifierBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const mb = new ModifierBuilder();
			callback(mb);
			const modifier = mb.build();

			this._operator = new Operator(this._operator.operator_id, this._operator.operand, [...this._operator.modifiers, modifier]);

			return this;
		}
		

		get operator() {
			return this._operator;
		}

		/**
		 * Returns a JSON object representing {@link Operator}.
		 *
		 * @returns {Object<Operator>}
		 */
		build() {
			return this._operator.toJSON();
		}

		toString() {
			return '[OperatorBuilder]';
		}
	}

	return OperatorBuilder;
})();