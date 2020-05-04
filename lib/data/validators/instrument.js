const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	const validator = {
		forCreate: (symbol, instrument) => {
			assert.argumentIsRequired(symbol, symbol, String);

			if (is.null(instrument) || is.undefined(instrument)) {
				throw new Error(`${symbol} does not appear to be a valid symbol.`);
			}

			if (is.boolean(instrument.expired) && instrument.expired) {
				throw new Error(`${symbol} appears to be expired.`);
			}
		}
	};

	return validator;
})();