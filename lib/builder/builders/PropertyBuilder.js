const assert = require('@barchart/common-js/lang/assert');

const Property = require('../data/Property');

module.exports = (() => {
	/**
	 * Alert builder responsible for building an {@link Property} object by using provided API functions.
	 *
	 * @public
	 * @exported
	 * @param {Array} properties - An array of possible properties.
	 */
	class PropertyBuilder {
		constructor(properties) {
			this._properties = properties;
			this._property = new Property(null, null);
		}

		/**
		 * Adds a property then returns the current instance.
		 *
		 * @param {String} property - A property name.
		 * @returns {PropertyBuilder}
		 */
		withProperty(property) {
			assert.argumentIsRequired(property, 'property', String);

			const selectedProperty = this._properties.find((item) => property.toLowerCase() === item.accessor.join('').toLowerCase());

			if (!selectedProperty) {
				throw new Error(`Property [ ${property} ] not found.`);
			}

			this._property = new Property(selectedProperty.property_id, this._property.identifier);

			return this;
		}

		/**
		 * Adds an identifier then returns the current instance.
		 *
		 * @param {String} identifier - An identifier.
		 * @returns {PropertyBuilder}
		 */
		withIdentifier(identifier) {
			assert.argumentIsRequired(identifier, 'identifier', String);

			this._property = new Property(this._property.property_id, identifier);

			return this;
		}

		get property() {
			return this._property;
		}

		/**
		 * Returns a JSON object representing {@link Property}.
		 *
		 * @returns {Object<Property>}
		 */
		build() {
			return this._property.toJSON();
		}

		toString() {
			return '[PropertyBuilder]';
		}
	}

	return PropertyBuilder;
})();