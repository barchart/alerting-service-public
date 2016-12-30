var alert = require('./../../../../lib/alerts/validators/alert');

describe('When validating an alert object', () => {
	'use strict';

	describe('for the purpose of a user query', () => {
		it('will throw an exception if the user "user_id" property is missing', function() {
			expect(() => alert.forUser({ alert_system: 'barchart.com'})).toThrow(new Error('The argument [alert.user_id] must be a string'));
		});

		it('will throw an exception if the user "alert_system" property is missing', function() {
			expect(() => alert.forUser({ user_id: '123456'})).toThrow(new Error('The argument [alert.alert_system] must be a string'));
		});
	});
});