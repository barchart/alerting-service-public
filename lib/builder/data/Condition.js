module.exports = (() => {
	/**
	 * @public
	 * @ignore
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