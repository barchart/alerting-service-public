module.exports = (() => {
	/**
	 *
	 * @public
	 * @param {Number} modifier_id - An modifier id.
	 * @param {String} value - A value.
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

		/**
		 * Returns a JSON object representing {@link Modifier}
		 *
		 * @returns {Object<Modifier>}
		 */
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