module.exports = (() => {
	'use strict';

	/**
	 * Static configuration data.
	 *
	 * @public
	 * @ignore
	 */
	class Configuration {
		constructor() {

		}

		/**
		 * The hostname of the REST API for the development environment (intended for Barchart use only).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get demoHost() {
			return 'alerts-management-demo.barchart.com';
		}

		/**
		 * The hostname of the REST API for the staging environment (public use allowed).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get stagingHost() {
			return 'alerts-management-stage.barchart.com';
		}

		/**
		 * The hostname of the REST API for the production environment (public use allowed).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get productionHost() {
			return 'alerts-management-prod.barchart.com';
		}

		/**
		 * The hostname of the REST API for the admin environment.
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get adminHost() {
			return 'alerts-management-admin.barchart.com';
		}
		
		/**
		 * The hostname of REST API which generates impersonation tokens for non-secure
		 * test and demo environments.
		 *
		 * @public
		 * @static
		 * @returns {string}
		 */
		static get getJwtImpersonationHost() {
			return 'jwt-public-prod.aws.barchart.com';
		}

		toString() {
			return '[Configuration]';
		}
	}

	return Configuration;
})();
