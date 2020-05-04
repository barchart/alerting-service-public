const jwt = require('jsonwebtoken');

const JwtPayload = require('./../JwtPayload');

module.exports = (() => {
	'use strict';

	// 2020/05/03, BRI. This is *not* how to implement a token generator for
	// production purposes. Including the secret in the code -- or anywhere in
	// the browser's memory -- is unsafe. An attacker could easily gain access
	// to your secret, allowing them to impersonate your users. Instead,
	// signing of a JWT token should be done by a controlled, private service.
	// More information can be found in the "Key Concepts: Security" section of
	// the documentation.

	// This "generator" grants access to Barchart's test environment where there
	// is no expectation of privacy or security. In this narrow case, making the
	// secret public knowledge, by including it here, is intentional.

	const SECRET = 'not_a_secret::everyone_has_it';

	/**
	 * Returns a {@link Callbacks.JwtTokenGenerator} function. The resulting function will
	 * generate a token allowing you to impersonate any user in the test environment. It will
	 * not work in the production environment. Instead, connection to the production environment
	 * requires you to sign your tokens with a private certificate (and provide Barchart the
	 * matching public certificate).
	 *
	 * @exported
	 * @function
	 * @public
	 * @memberOf Functions
	 * @param {String} userId - The identifier of the user to impersonate.
	 * @param {String} alertSystem - The domain of the user who will be impersonated.
	 * @returns {Callbacks.JwtTokenGenerator}
	 */
	function getJwtGenerator(userId, alertSystem) {
		const payload = new JwtPayload(userId, alertSystem);

		return () => jwt.sign(payload.forSigning(), SECRET, { algorithm: 'HS256' });
	}

	return getJwtGenerator;
})();