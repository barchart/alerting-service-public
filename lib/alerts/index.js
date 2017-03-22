const AlertManager = require('./AlertManager');

const timezone = require('common/lang/timezone');

module.exports = (() => {
	'use strict';

	return {
		AlertManager: AlertManager,
		timezone: timezone,
		version: '1.5.14'
	};
})();