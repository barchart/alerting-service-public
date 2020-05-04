const jwt = require('jsonwebtoken');

const getJwtGenerator = require('./../../../../lib/security/demo/getJwtGenerator');

describe('When building a jwtGenerator function for the demo environment', () => {
	'use strict';

	const userId = 'John';
	const alertSystem = 'Deere';

	let jwtGenerator;

	beforeEach(() => {
		jwtGenerator = getJwtGenerator(userId, alertSystem);
	});

	it('the result should be a function', () => {
		expect(typeof jwtGenerator).toEqual('function');
	});

	describe('and the jwtGenerator function is used to create a token', () => {
		let signed;

		beforeEach(() => {
			signed = jwtGenerator();
		});

		it('the result should be a string', () => {
			expect(typeof signed).toEqual('string');
		});

		it('the result should contain more than one character', () => {
			expect(signed.length > 0).toEqual(true);
		});

		describe('When decoding the JWT token for the demo environment', () => {
			let decoded;

			beforeEach(() => {
				decoded	= jwt.decode(signed);
			});

			it('the result should be on object', () => {
				expect(typeof decoded).toEqual('object');
			});

			it('the result should a "user_id" property', () => {
				expect(decoded.hasOwnProperty('user_id')).toEqual(true);
			});

			it('the result should an "alert_system" property', () => {
				expect(decoded.hasOwnProperty('alert_system')).toEqual(true);
			});

			it('the result\'s "user_id" property value should match original value', () => {
				expect(decoded.user_id).toEqual(userId);
			});

			it('the result\'s "alert_system" property value should match original value', () => {
				expect(decoded.alert_system).toEqual(alertSystem);
			});
		});
	});
});