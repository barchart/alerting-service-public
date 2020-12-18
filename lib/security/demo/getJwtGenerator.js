const JwtPayload = require('./../JwtPayload');

const EndpointBuilder = require('@barchart/common-js/api/http/builders/EndpointBuilder'),
	Gateway = require('@barchart/common-js/api/http/Gateway'),
	ProtocolType = require('@barchart/common-js/api/http/definitions/ProtocolType'),
	ResponseInterceptor = require('@barchart/common-js/api/http/interceptors/ResponseInterceptor'),
	VerbType = require('@barchart/common-js/api/http/definitions/VerbType');

module.exports = (() => {
	'use strict';

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

		return () => {
			return Gateway.invoke(tokenEndpoint, payload.forSigning())
				.then((response) => {
					return response.toString();
				});
		};
	}

	const tokenEndpoint = EndpointBuilder.for('generate-impersonation-jwt-for-demo-environment', 'generate impersonation JWT for demo environment')
		.withVerb(VerbType.POST)
		.withProtocol(ProtocolType.HTTPS)
		.withHost('jwt-public-prod.aws.barchart.com')
		.withPathBuilder((pb) =>
			pb.withLiteralParameter('version', 'v1')
				.withLiteralParameter('tokens', 'tokens')
				.withLiteralParameter('impersonate', 'impersonate')
				.withLiteralParameter('service', 'alerts')
				.withLiteralParameter('environment', 'demo')
		)
		.withBody()
		.withResponseInterceptor(ResponseInterceptor.DATA)
		.endpoint;

	return getJwtGenerator;
})();