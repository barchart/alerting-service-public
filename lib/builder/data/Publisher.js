module.exports = (() => {
	/**
	 * A "publisher" describes the rules for sending a specific type of notification when an alert triggers.
	 *
	 * @public
	 * @ignore
	 * @param {String} recipient -  The addressing data required to deliver a notification. For email notifications, an email address. For SMS notifications, a phone number.
	 * @param {Number} publisher_type_id - The identifier of the {@link Schema.PublisherType} this rule applies to.
	 * @param {String} format - A message format.
	 * @param {Boolean} use_default_recipient - If present (and true), the recipient property is ignored; in favor the of default_recipient from the user's corresponding {@link Schema.PublisherTypeDefault}.
	 */
	class Publisher {
		constructor(recipient, publisher_type_id, format, use_default_recipient) {
			this._recipient = recipient;
			this._format = format;
			this._type = {};
			this._type.publisher_type_id = publisher_type_id;
			this._use_default_recipient = use_default_recipient || false;
		}

		get recipient() {
			return this._recipient;
		}

		get format() {
			return this._format;
		}

		get use_default_recipient() {
			return this._use_default_recipient;
		}

		get type() {
			return this._type;
		}

		get publisher_type_id() {
			return this._type.publisher_type_id;
		}

		/**
		 * Returns a JSON object representing {@link Publisher}
		 *
		 * @returns {Object<Publisher>}
		 */
		toJSON() {
			return {
				format: this._format,
				recipient: this._recipient,
				use_default_recipient: this._use_default_recipient,
				type: Object.assign({}, this._type)
			};
		}

		toString() {
			return '[Publisher]';
		}
	}

	return Publisher;
})();