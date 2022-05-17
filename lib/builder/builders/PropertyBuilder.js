const assert = require('@barchart/common-js/lang/assert');

const Property = require('../data/Property');

module.exports = (() => {
	/**
	 * @public
	 * @ignore
	 */
	class PropertyBuilder {
		constructor(properties) {
			this._properties = properties;
			this._property = new Property(null, null, null);
		}

		withProperty(property) {
			assert.argumentIsRequired(property, 'property', String);

			const selectedProperty = this._properties.find((item) => property.toLowerCase() === item.accessor.join('').toLowerCase());

			if (!selectedProperty) {
				throw new Error(`Property [ ${property} ] not found.`);
			}

			this._property = new Property(selectedProperty.property_id, this._property.identifier, this._property.display);

			return this;
		}

		withIdentifier(identifier) {
			assert.argumentIsRequired(identifier, 'identifier', String);

			this._property = new Property(this._property.property_id, identifier, this._property.display);

			return this;
		}

		withDisplay(display) {
			assert.argumentIsRequired(display, 'display', String);

			this._property = new Property(this._property.property_id, this._property.identifier, display);

			return this;
		}

		get property() {
			return this._property;
		}

		build() {
			return this._property.toJSON();
		}

		toString() {
			return '[PropertyBuilder]';
		}
	}

	return PropertyBuilder;
})();