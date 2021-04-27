const assert = require('@barchart/common-js/lang/assert');

const Condition = require('../data/Condition');

const PropertyBuilder = require('./PropertyBuilder');
const OperatorBuilder = require('./OperatorBuilder');

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
			this._condition = new Condition(null, null);
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

			this._condition = new Condition(property, this._condition.operator);

			return this;
		}

		/**
		 * Adds {@link Operator} by OperatorBuilder. Uses a callback to provides the consumer with a {@link OperatorBuilder}.
		 *
		 * @param {Function} callback - A callback function.
		 * @returns {ConditionBuilder}
		 */
		withOperatorBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const ob = new OperatorBuilder(this._operators);
			callback(ob);
			const operator = ob.build();

			this._condition = new Condition(this._condition.property, operator);

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