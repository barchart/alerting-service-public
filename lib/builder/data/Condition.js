module.exports = (() => {
	/**
	 * 	A "condition" is a statement that is evaluated by the backend (as streaming data is processed).
	 *
	 * @public
	 * @param {Object<Property>} property - A {@link Property} object.
	 * @param {Object<Operator>} operator - An {@link Operator} operator.
	 */
	class Condition {
		constructor(property, operator) {
			this._property = Object.assign({}, property);
			this._operator = Object.assign({}, operator);
		}

		get property() {
			return this._property;
		}

		get operator() {
			return this._operator;
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