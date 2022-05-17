const assert = require('@barchart/common-js/lang/assert');

const Publisher = require('../data/Publisher');

module.exports = (() => {
	/**
	 * @public
	 * @ignore
	 */
	class PublisherBuilder {
		constructor(publisherTypes) {
			assert.argumentIsRequired(publisherTypes, 'publisherTypes', Array);

			this._publisherTypes = publisherTypes;
			this._publisher = new Publisher(null, null, null, null);
		}

		withType(type) {
			assert.argumentIsRequired(type, 'type', String);

			const selectedType = this._publisherTypes.find((defaultType) => type.toLowerCase() === defaultType.transport.toLowerCase());

			if (!selectedType) {
				throw new Error(`Publisher type [ ${type} ] not found.`);
			}

			this._publisher = new Publisher(selectedType.publisher_type_id, this._publisher._use_default_recipient, this._publisher._recipient, this._publisher._format, this._publisher._title);

			return this;
		}

		withUseDefaultRecipient() {
			this._publisher = new Publisher(this._publisher._type.publisher_type_id, true, null, this._publisher._format, this._publisher._title);

			return this;
		}

		withRecipient(recipient) {
			assert.argumentIsRequired(recipient, 'recipient', String);

			this._publisher = new Publisher(this._publisher._type.publisher_type_id, false, recipient, this._publisher._format, this._publisher._title);

			return this;
		}

		withFormat(format) {
			assert.argumentIsRequired(format, 'format', String);

			this._publisher = new Publisher(this._publisher._type.publisher_type_id, this._publisher._use_default_recipient, this._publisher._recipient, format, this._publisher._title);

			return this;
		}

		withTitle(title) {
			assert.argumentIsRequired(title, 'title', String);

			this._publisher = new Publisher(this._publisher._type.publisher_type_id, this._publisher._use_default_recipient, this._publisher._recipient, this._publisher._format, title);

			return this;
		}

		get publisher() {
			return this._publisher;
		}

		build() {
			return this._publisher.toJSON();
		}

		toString() {
			return '[PublisherBuilder]';
		}
	}

	return PublisherBuilder;
})();