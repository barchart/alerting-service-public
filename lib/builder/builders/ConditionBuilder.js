const assert = require('@barchart/common-js/lang/assert');

const Condition = require('../data/Condition');

const PropertyBuilder = require('./PropertyBuilder'),
	OperatorBuilder = require('./OperatorBuilder');

module.exports = (() => {
	/**
	 * @public
	 * @ignore
	 */
	class ConditionBuilder {
		constructor(operators, properties) {
			this._operators = operators;
			this._properties = properties;
			this._condition = new Condition(null, null);
		}

		get condition() {
			return this._condition;
		}

		withPropertyBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const pb = new PropertyBuilder(this._properties);
			callback(pb);
			const property = pb.build();

			this._condition = new Condition(property, this._condition.operator);

			return this;
		}

		withOperatorBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const ob = new OperatorBuilder(this._operators);
			callback(ob);
			const operator = ob.build();

			this._condition = new Condition(this._condition.property, operator);

			return this;
		}

		build() {
			const selectedProperty = this._properties.find((item) => item.property_id === this._condition.property.property_id);

			if (!selectedProperty) {
				throw new Error(`Property has not been set.`);
			}

			if (this.condition.operator && !selectedProperty.valid_operators.includes(this.condition.operator.operator_id)) {
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