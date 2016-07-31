var assert = require('common/lang/assert');
var is = require('common/lang/is');

module.exports = (() => {
	'use strict';

	const exclude = [
		'INDEX',
		'INDEX-CBOE',
		'INDEX-DOW',
		'INDEX-RL',
		'INDEX-NY',
		'INDEX-NQ',
		'INDEX-SP'
	];

	const validator = {
		forCreate: (symbol, instrument) => {
			assert.argumentIsRequired(symbol, symbol, String);

			if (is.null(instrument) || is.undefined(instrument)) {
				throw new Error(`${symbol} does not appear to be a valid symbol.`);
			}

			if (exclude.some((e) => e === instrument.exchange)) {
				throw new Error(`${symbol} is listed on ${instrument.exchange}. We cannot create alerts for this exchange.`);
			}
		}
	};

	return validator;
})();