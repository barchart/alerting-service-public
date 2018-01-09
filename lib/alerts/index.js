const AlertManager = require('./AlertManager');

const timezone = require('@barchart/common-js/lang/timezone');

module.exports = (() => {
	'use strict';

	return {
		AlertManager: AlertManager,
		timezone: timezone,
		version: '1.6.5'
	};
})();