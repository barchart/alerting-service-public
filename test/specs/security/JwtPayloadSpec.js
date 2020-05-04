const JwtPayload = require('./../../../lib/security/JwtPayload');

describe('When constructing a JwtPayload', () => {
	'use strict';

	const userId = 'me';
	const alertSystem = 'mystery';

	let payload;

	beforeEach(() => {
		payload = new JwtPayload(userId, alertSystem);
	});

	it('the "userId" property should equal the value passed to the constructor', () => {
		expect(payload.userId).toEqual(userId);
	});

	it('the "alertSystem" property should equal the value passed to the constructor', () => {
		expect(payload.alertSystem).toEqual(alertSystem);
	});

	describe('and serialized the instance for signing purposes', () => {
		let serialized;

		beforeEach(() => {
			serialized = payload.forSigning();
		});

		it('the result should be an object', () => {
			expect(typeof serialized).toEqual('object');
		});

		it('the result should have a "user_id" property', () => {
			expect(serialized.hasOwnProperty('user_id')).toEqual(true);
		});

		it('the result should have a "alert_system" property', () => {
			expect(serialized.hasOwnProperty('alert_system')).toEqual(true);
		});

		it('the result\'s "user_id" property should have the same value as the "userId" property', () => {
			expect(serialized.user_id).toEqual(payload.userId);
		});

		it('the result\'s "alert_system" property should have the same value as the "alertSystem" property', () => {
			expect(serialized.alert_system).toEqual(payload.alertSystem);
		});
	});
});