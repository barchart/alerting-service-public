const assert = require('@barchart/common-js/lang/assert');

module.exports = (() => {
	'use strict';

	/**
	 * An object which contains the required assertions for a token.
	 *
	 * @public
	 * @exported
	 * @param {String} userId - The unique identifier of the authenticated user.
	 * @param {String} alertSystem - The authenticated user's domain. In the demo environment, use your company name. In the production environment, Barchart will assign a value to use.
	 */
	class JwtPayload {
		constructor(userId, alertSystem) {
			assert.argumentIsRequired(userId, 'userId', String);
			assert.argumentIsRequired(alertSystem, 'alertSystem', String);

			this._userId = userId;
			this._alertSystem = alertSystem;
		}

		/**
		 * The unique identifier of the authenticated user. This value must match
		 * the {@link Schema.Alert#user_id} of any alert you attempt to create, edit, or delete.
		 *
		 * @public
		 * @returns {String}
		 */
		get userId() {
			return this._userId;
		}

		/**
		 * The authenticated user's domain. In the demo environment, use your company name. This value must
		 * match the {@link Schema.Alert#alert_system} of any alert you attempt to create, edit, or delete.
		 *
		 * @public
		 * @returns {String}
		 */
		get alertSystem() {
			return this._alertSystem;
		}

		/**
		 * Returns the simple object representation, used for signing a token.
		 *
		 * @public
		 * @returns {String}
		 */
		forSigning() {
			const serialized = { };

			serialized.user_id = this.userId;
			serialized.userId = this.userId;

			serialized.alert_system = this.alertSystem;
			serialized.contextId = this.alertSystem;

			return serialized;
		}

		toString() {
			return '[JwtPayload]';
		}
	}

	return JwtPayload;
})();