module.exports = (() => {
	/**
	 * @public
	 * @ignore
	 */
	class Modifier {
		constructor(modifier_id, value) {
			this._modifier_id = modifier_id || null;
			this._value = value || null;
		}

		get modifier_id() {
			return this._modifier_id;
		}

		get value() {
			return this._value;
		}

		toJSON() {
			return {
				modifier_id: this._modifier_id,
				value: this._value
			};
		}

		toString() {
			return '[Modifier]';
		}
	}

	return Modifier;
})();