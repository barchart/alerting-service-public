const assert = require('@barchart/common-js/lang/assert');

const Modifier = require('../data/Modifier');

module.exports = (() => {
	/**
	 * @public
	 * @ignore
	 */
	class ModifierBuilder {
		constructor() {
			this._modifier = new Modifier(null, null);
		}

		withModifier(modifier) {
			assert.argumentIsRequired(modifier, 'modifier', Number);

			this._modifier = new Modifier(modifier, this._modifier.value);

			return this;
		}

		withValue(value) {
			assert.argumentIsRequired(value, 'value', String);

			this._modifier = new Modifier(this._modifier.modifier_id, value);

			return this;
		}

		get modifier() {
			return this._modifier;
		}

		build() {
			return this._modifier.toJSON();
		}

		toString() {
			return '[ModifierBuilder]';
		}
	}

	return ModifierBuilder;
})();