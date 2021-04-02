const assert = require('@barchart/common-js/lang/assert');

const Publisher = require('../data/Publisher');

module.exports = (() => {
	/**
	 * Publisher builder responsible for building a {@link Publisher} object by using provided API functions.
	 *
	 * @public
	 * @exported
	 * @param {Array} publishersType - An array of possible publishers types.
	 */
	class PublisherBuilder {
		constructor(publisherTypes) {
			assert.argumentIsRequired(publisherTypes, 'publisherTypes', Array);

			this._publisherTypes = publisherTypes;
			this._publisher = new Publisher(null, null, null, null);
		}

		/**
		 * Sets a publisher type then return current instance.
		 *
		 * @param {String} type - Publisher type
		 * @returns {PublisherBuilder}
		 */
		withType(type) {
			assert.argumentIsRequired(type, 'type', String);

			const selectedType = this._publisherTypes.find((defaultType) => type.toLowerCase() === defaultType.transport.toLowerCase());

			if (!selectedType) {
				throw new Error(`Publisher type [ ${type} ] not found.`);
			}

			this._publisher = new Publisher(this._publisher._recipient, selectedType.publisher_type_id, this._publisher._format, this._publisher._use_default_recipient);

			return this;
		}

		/**
		 * Adds a recipient then returns the current instance.
		 *
		 * @param {String} recipient - A recipient.
		 * @returns {PublisherBuilder}
		 */
		withRecipient(recipient) {
			assert.argumentIsRequired(recipient, 'recipient', String);

			this._publisher = new Publisher(recipient, this._publisher._type.publisher_type_id, this._publisher._format, this._publisher._use_default_recipient);

			return this;
		}

		/**
		 * Adds a format then returns the current instance.
		 *
		 * @param {String} format - A message format.
		 * @returns {PublisherBuilder}
		 */
		withFormat(format) {
			assert.argumentIsRequired(format, 'format', String);

			this._publisher = new Publisher(this._publisher._recipient, this._publisher._type.publisher_type_id, format, this._publisher._use_default_recipient);

			return this;
		}

		/**
		 * Sets use_default_recipient property to true then returns the current instance.
		 *
		 * @returns {PublisherBuilder}
		 */
		withUseDefaultRecipient() {
			this._publisher = new Publisher(this._publisher._recipient, this._publisher._type.publisher_type_id, this._publisher._format, true);

			return this;
		}

		get publisher() {
			return this._publisher;
		}

		/**
		 * Returns a JSON object representing {@link Publisher}.
		 *
		 * @returns {Object<Publisher>}
		 */
		build() {
			return this._publisher.toJSON();
		}

		toString() {
			return '[PublisherBuilder]';
		}
	}

	return PublisherBuilder;
})();