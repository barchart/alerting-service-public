const validator = require('./../../../lib/data/validators/alert');

describe('When validating an alert object', () => {
	'use strict';

	describe('for queries', () => {
		let alert;

		beforeEach(() => {
			alert = { };

			alert.alert_id = 'id';
		});

		it('an object with only a string "alert_id" property should be valid', () => {
			expect(() => validator.forQuery(alert)).not.toThrow();
		});
	});
});