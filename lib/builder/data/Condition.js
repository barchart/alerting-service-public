module.exports = (() => {
	/**
	 * 	A "condition" is a statement that is evaluated by the backend (as streaming data is processed).
	 *
	 * @public
	 * @param {Object<Property>} property - A {@link Property} object.
	 * @param {Number} operator_id - An operation id.
	 * @param {String|Number} operand - An operand.
	 */
	class Condition {
		constructor(property, operator_id, operand) {
			this._property = Object.assign({}, property);
			this._operator = {};
			this._operator.operator_id = operator_id || null;
			this._operator.operand = operand || null;
		}

		get property() {
			return this._property;
		}

		get operator() {
			return this._operator;
		}

		get operator_id() {
			return this._operator.operator_id;
		}

		get operand() {
			return this._operator.operator_id;
		}

		/**
		 * Returns a JSON object representing {@link Condition}
		 *
		 * @returns {Object<Condition>}
		 */
		toJSON() {
			return {
				property: Object.assign({}, this._property),
				operator: Object.assign({}, this._operator)
			};
		}

		toString() {
			return '[Condition]';
		}
	}

	return Condition;
})();