const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	Scheduler = require('@barchart/common-js/timing/Scheduler');

module.exports = (() => {
	'use strict';

	/**
	 * Provides JWT tokens to the adapters (i.e. {@link AdapterBase} implementations).
	 *
	 * @public
	 * @param {JwtProvider~tokenGenerator} callback
	 * @param {Number} interval
	 * @param {String} source
	 */
	class JwtProvider extends Disposable {
		constructor(generator, interval, source) {
			super();

			assert.argumentIsRequired(generator, 'generator', Function);
			assert.argumentIsRequired(interval, 'interval', Number);
			assert.argumentIsRequired(source, 'source', String);

			this._generator = generator;
			this._interval = interval;
			this._source = source;

			this._tokenPromise = null;
			this._tokenTimestamp = null;

			this._scheduler = new Scheduler();
		}

		get source() {
			return this._source;
		}

		/**
		 * Reads the current JWT token, refreshing if necessary.
		 *
		 * @public
		 * @return {Promise.<String>}
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

	/**
	 * A function returns a JWT token (or a promise for a JWT token).
	 *
	 * @callback JwtProvider~tokenGenerator
	 * @returns {String|Promise.<String>}
	 */

	return JwtProvider;
})();