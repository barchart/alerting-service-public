module.exports = (() => {
	/**
	 * A "property" is an attribute of a "condition" referring to a streaming data source.
	 *
	 * @public
	 * @param {Number} propertyId - The property's unique identifier.
	 * @param {String} identifier - An identifier.
	 */
	class Property {
		constructor(propertyId, identifier, display) {
			this._property_id = propertyId || null;
			this._target = {};
			this._target.identifier = identifier || null;
			this._target.display = display || null;
		}

		get property_id() {
			return this._property_id;
		}

		get identifier() {
			return this._target.identifier;
		}

		get display() {
			return this._target.display;
		}

		get target() {
			return this._target;
		}

		/**
		 * Returns a JSON object representing property class
		 *
		 * @returns {Object<Property>}
		 */
		toJSON() {
			return {
				property_id: this._property_id,
				target: Object.assign({}, this._target)
			};
		}

		toString() {
			return '[Property]';
		}
	}

	return Property;
})();