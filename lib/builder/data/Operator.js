module.exports = (() => {
	/**
	 * @public
	 * @ignore
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