const assert = require('@barchart/common-js/lang/assert');

const Operator = require('../data/Operator');

const ModifierBuilder = require('./ModifierBuilder');

module.exports = (() => {
	/**
	 * @public
	 * @ignore
	 */
	class OperatorBuilder {
		constructor(operators) {
			this._operators = operators; 
			this._operator = new Operator(null, null, null);
		}

		withOperator(operator) {
			assert.argumentIsRequired(operator, 'operator', String);

			const selectedOperator = this._operators.find((item) => operator.toLowerCase() === item.operator_name.toLowerCase());

			if (!selectedOperator) {
				throw new Error(`Operator [ ${operator} ] not found.`);
			}

			this._operator = new Operator(selectedOperator.operator_id, this._operator.operand, this._operator.modifiers);

			return this;
		}

		withOperand(operand) {
			this._operator = new Operator(this._operator.operator_id, operand, this._operator.modifiers);

			return this;
		}

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

		build() {
			return this._operator.toJSON();
		}

		toString() {
			return '[OperatorBuilder]';
		}
	}

	return OperatorBuilder;
})();