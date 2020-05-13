const jwt = require('jsonwebtoken');

const JwtPayload = require('./../JwtPayload');

module.exports = (() => {
	'use strict';

	// 2020/05/03, BRI. This is *not* how to implement a token generator for
	// production purposes. Including the secret in the code -- or anywhere in
	// the browser's memory -- is unsafe. An attacker could easily gain access
	// to your secret, allowing them to impersonate your users. Instead,
	// signing tokens should be done by a outside of the browser (perhaps
	// using a remote web service). More information can be found in the "Key
	// Concepts: Security" section of the documentation.

	// This "generator" grants access to Barchart's test environment where there
	// is no expectation of privacy or security. In this narrow case, making the
	// secret public knowledge, by including it here, is intentional.

	const SECRET = 'public-knowledge-1234567890';

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