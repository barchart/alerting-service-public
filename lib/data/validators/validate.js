const alert = require('./alert'),
	condition = require('./condition'),
	instrument = require('./instrument'),
	publisher = require('./publisher'),
	publisherTypeDefault = require('./publisherTypeDefault'),
	template = require('./template'),
	templateCondition = require('./templateCondition'),
	trigger = require('./trigger');

module.exports = (() => {
	'use strict';

	return {
		alert: alert,
		condition: condition,
		instrument: instrument,
		publisher: publisher,
		publisherTypeDefault: publisherTypeDefault,
		template: template,
		templateCondition: templateCondition,
		trigger: trigger
	};
})();
