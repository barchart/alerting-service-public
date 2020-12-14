const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	is = require('@barchart/common-js/lang/is'),
	random = require('@barchart/common-js/lang/random'),
	Scheduler = require('@barchart/common-js/timing/Scheduler');

const getJwtGeneratorForDemo = require('./demo/getJwtGenerator');

module.exports = (() => {
	'use strict';

	/**
	 * Generates and caches a signed token (using a delegate). The cached token
	 * is refreshed periodically. An instance of this class is required by
	 * the {@link AdapterBase} implementations.
	 *
	 * @public
	 * @exported
	 * @param {Callbacks.JwtTokenGenerator} tokenGenerator - An anonymous function which returns a signed JWT token.
	 * @param {Number=} refreshInterval - The number of milliseconds which must pass before a new JWT token is generated. A null or undefined value means the token is not cached.
	 */
	class JwtProvider extends Disposable {
		constructor(tokenGenerator, refreshInterval) {
			super();

			assert.argumentIsRequired(tokenGenerator, 'tokenGenerator', Function);
			assert.argumentIsOptional(refreshInterval, 'refreshInterval', Number);

			this._tokenGenerator = tokenGenerator;

			this._tokenPromise = null;

			this._refreshTimestamp = null;
			this._refreshPending = false;

			if (is.number(refreshInterval)) {
				this._refreshInterval = Math.max(refreshInterval || 0, 0);
				this._refreshJitter = random.range(0, Math.floor(this._refreshInterval / 10));
			} else {
				this._refreshInterval = null;
				this._refreshJitter = null;
			}

			this._scheduler = new Scheduler();
		}

		/**
		 * Reads the current token, refreshing if necessary.
		 *
		 * @public
		 * @returns {Promise<String>}
		 */
		getToken() {
			return Promise.resolve()
				.then(() => {
					if (this._refreshPending) {
						return this._tokenPromise;
					}

					if (this._tokenPromise === null || this._refreshInterval === null || (this._refreshInterval > 0 && getTime() > (this._refreshTimestamp + this._refreshInterval + this._refreshJitter))) {
						this._refreshPending = true;

						this._tokenPromise = this._scheduler.backoff(() => this._tokenGenerator(), 100, 'Read JWT token', 3)
							.then((token) => {
								this._refreshTimestamp = getTime();
								this._refreshPending = false;

								return token;
							}).catch((e) => {
								this._tokenPromise = null;

								this._refreshTimestamp = null;
								this._refreshPending = false;

								return Promise.reject(e);
							});
					}

					return this._tokenPromise;
				});
		}

		/**
		 * A factory for {@link JwtProvider} which is an alternative to the constructor.
		 *
		 * @public
		 * @static
		 * @param {Callbacks.JwtTokenGenerator} tokenGenerator - An anonymous function which returns a signed JWT token.
		 * @param {Number=} refreshInterval - The number of milliseconds which must pass before a new JWT token is generated. A zero value means the token should never be refreshed. A null or undefined value means the token is not cached.
		 * @returns {JwtProvider}
		 */
		static fromTokenGenerator(tokenGenerator, refreshInterval) {
			return new JwtProvider(tokenGenerator, refreshInterval);
		}

		/**
		 * Builds a {@link JwtProvider} which will generate tokens impersonating the specified
		 * user. These tokens will only work in the "test" environment.
		 *
		 * Recall, the "test" environment is not "secure" -- any data saved here can be accessed
		 * by anyone (using this feature). Furthermore, data is periodically purged from the
		 * test environment.
		 *
		 * @public
		 * @static
		 * @param {String} userId - The identifier of the user to impersonate.
		 * @param {String} alertSystem - The domain of the user who will be impersonated.
		 * @param {Number=} refreshInterval - The number of milliseconds which must pass before a new JWT token is generated. A null or undefined value means the token is not cached.
		 * @returns {JwtProvider}
		 */
		static forDemo(userId, alertSystem, refreshInterval) {
			return JwtProvider.fromTokenGenerator(getJwtGeneratorForDemo(userId, alertSystem), refreshInterval);
		}

		_onDispose() {
			this._scheduler.dispose();
			this._scheduler = null;
		}

		toString() {
			return '[JwtProvider]';
		}
	}

	function getTime() {
		return (new Date()).getTime();
	}

	return JwtProvider;
})();