module.exports = (() => {
	/**
	 * @public
	 * @ignore
	 * @param {Number} operator_id - An operation id.
	 * @param {String|Array<String>} operand - An operand.
	 */
	class Operator {
		constructor(operator_id, operand, modifiers) {
			this._operator_id = operator_id || null;
			this._operand = operand || null;
			this._modifiers = modifiers || [];
		}

		get operator_id() {
			return this._operator_id;
		}

		get operand() {
			return this._operand;
		}

		get modifiers() {
			return this._modifiers;
		}

		/**
		 * Returns a JSON object representing {@link Operator}
		 *
		 * @returns {Object<Operator>}
		 */
		toJSON() {
			const operator = {
				operator_id: this._operator_id,
				operand: this._operand,
			};
			
			if (this._modifiers && this._modifiers.length > 0) {
				operator.modifiers = this._modifiers;
			}
			
			return operator;
		}

		toString() {
			return '[Operator]';
		}
	}

	return Operator;
})();