const validator = require('./../../../lib/data/validators/alert');

describe('When validating an alert object', () => {
	'use strict';

	describe('for queries', () => {
		let alert;

		beforeEach(() => {
			alert = { };

			alert.alert_id = 'id';
		});

		it('an object having an "alert_id" property with a string value should be valid', () => {
			expect(() => validator.forQuery(alert)).not.toThrow();
		});
	});
});