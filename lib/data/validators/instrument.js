const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	const validator = {
		forCreate: (symbol, instrument, property) => {
			assert.argumentIsRequired(symbol, symbol, String);

			if (is.null(instrument) || is.undefined(instrument)) {
				throw new Error(`${symbol} does not appear to be a valid symbol.`);
			}

			if (is.boolean(instrument.expired) && instrument.expired) {
				throw new Error(`${symbol} appears to be expired.`);
			}

			if (is.number(instrument.symbolType) && instrument.symbolType === 34) {
				throw new Error(`${symbol} appears to be an equity option. Equity options are unsupported.`);
			}

			if (property) {
				if (is.number(instrument.symbolType) && instrument.symbolType === 12 && (property.property_id < 1 || property.property_id > 8)) {
					throw new Error(`${symbol} appears to be a futures option. Alerts for futures options can only target price and volume attributes.`);
				}

				if ((property.property_id === 238 || property.property_id === 239) && !instrument.hasOptions) {
					throw new Error(`${symbol} does not have options and cannot be used for option flow alerts`);
				}

				if ((property.property_id === 238 || property.property_id === 239) && !(instrument.symbolType === 1 || instrument.symbolType === 7 || instrument.symbolType === 9)) {
					throw new Error(`${symbol} does not support option flow alerts`);
				}
			}
		}
	};

	return validator;
})();