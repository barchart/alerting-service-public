const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	Scheduler = require('@barchart/common-js/timing/Scheduler');

module.exports = (() => {
	'use strict';

	/**
	 * Generates and caches a signed token (using a delegate). The cached token
	 * is refreshed periodically. An instance of this class is required by
	 * the {@link AdapterBase} implementations.
	 *
	 * @public
	 * @exported
	 * @param {Callbacks.JwtTokenGenerator} generator - An anonymous function which returns a signed JWT token.
	 * @param {Number} interval - The number of milliseconds which must pass before a new JWT token is generated.
	 */
	class JwtProvider extends Disposable {
		constructor(generator, interval) {
			super();

			assert.argumentIsRequired(generator, 'generator', Function);
			assert.argumentIsRequired(interval, 'interval', Number);

			this._generator = generator;
			this._interval = interval;

			this._tokenPromise = null;
			this._tokenTimestamp = null;

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
					const time = (new Date().getTime());

					if (this._tokenPromise === null || this._timestamp === null || (this._tokenTimestamp + this._interval) < time) {
						this._tokenTimestamp = time;

						this._tokenPromise  = this._scheduler.backoff(() => this._generator(), 100, 'Read JWT token', 3);
					}

					return this._tokenPromise;
				});
		}

		_onDispose() {
			this._scheduler.dispose();
			this._scheduler = null;
		}

		toString() {
			return '[JwtProvider]';
		}
	}

	return JwtProvider;
})();