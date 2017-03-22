const assert = require('common/lang/assert'),
	is = require('common/lang/is');

module.exports = (() => {
	'use strict';

	const validator = {
		forCreate: (symbol, instrument) => {
			assert.argumentIsRequired(symbol, symbol, String);

			if (is.null(instrument) || is.undefined(instrument)) {
				throw new Error(`${symbol} does not appear to be a valid symbol.`);
			}
		}
	};

	return validator;
})();