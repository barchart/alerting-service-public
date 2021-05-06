const assert = require('@barchart/common-js/lang/assert');

const Modifier = require('../data/Modifier');

module.exports = (() => {
	/**
	 * Alert builder responsible for building an {@link Modifier} object by using provided API functions.
	 *
	 * @public
	 * @exported
	 * @ignore
	 */
	class ModifierBuilder {
		constructor() {
			this._modifier = new Modifier(null, null);
		}

		/**
		 * Adds an modifier ID then returns the current instance.
		 *
		 * @param {Number} modifier - A modifier Id.
		 * @returns {ModifierBuilder}
		 */
		withModifier(modifier) {
			assert.argumentIsRequired(modifier, 'modifier', Number);

			this._modifier = new Modifier(modifier, this._modifier.value);

			return this;
		}

		/**
		 * Adds a value then returns the current instance.
		 *
		 * @param {String} value - a modifier value.
		 * @returns {ModifierBuilder}
		 */
		withValue(value) {
			assert.argumentIsRequired(value, 'value', String);

			this._modifier = new Modifier(this._modifier.modifier_id, value);

			return this;
		}

		get modifier() {
			return this._modifier;
		}

		/**
		 * Returns a JSON object representing {@link Modifier}.
		 *
		 * @returns {Object<Modifier>}
		 */
		build() {
			return this._modifier.toJSON();
		}

		toString() {
			return '[ModifierBuilder]';
		}
	}

	return ModifierBuilder;
})();