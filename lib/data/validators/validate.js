const alert = require('./alert'),
	condition = require('./condition'),
	instrument = require('./instrument'),
	publisher = require('./publisher'),
	publisherTypeDefault = require('./publisherTypeDefault');

module.exports = (() => {
	'use strict';

	return {
		alert: alert,
		condition: condition,
		instrument: instrument,
		publisher: publisher,
		publisherTypeDefault: publisherTypeDefault
	};
})();