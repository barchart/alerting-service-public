module.exports = (() => {
	/**
	 * @public
	 * @ignore
	 */
	class Publisher {
		constructor(publisher_type_id, use_default_recipient, recipient, format, title) {
			this._type = {};
			this._type.publisher_type_id = publisher_type_id || null;

			this._use_default_recipient = use_default_recipient || false;
			this._recipient = recipient || null;

			this._format = format || null;
			this._title = title || null;
		}

		get type() {
			return this._type;
		}

		get publisher_type_id() {
			return this._type.publisher_type_id;
		}

		get use_default_recipient() {
			return this._use_default_recipient;
		}

		get recipient() {
			return this._recipient;
		}

		get format() {
			return this._format;
		}

		get title() {
			return this._title;
		}


		toJSON() {
			return {
				type: Object.assign({}, this._type),
				recipient: this._recipient,
				use_default_recipient: this._use_default_recipient,
				format: this._format,
				title: this._title
			};
		}

		toString() {
			return '[Publisher]';
		}
	}

	return Publisher;
})();