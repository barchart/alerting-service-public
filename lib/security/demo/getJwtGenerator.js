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
	 * @param {String=} environment - The environment the token will be used in (e.g. dev, stage, demo, etc).
	 * @returns {Callbacks.JwtTokenGenerator}
	 */
	function getJwtGenerator(userId, alertSystem, environment) {
		const endpoint = getTokenEndpoint(environment);

		const payload = new JwtPayload(userId, alertSystem);

		return () => {
			return Gateway.invoke(endpoint, payload.forSigning())
				.then((response) => {
					return response.toString();
				});
		};
	}

	function getTokenEndpoint(e) {
		let environment = e || 'demo';

		return EndpointBuilder.for(`generate-impersonation-jwt-for-${environment}-environment`, `generate impersonation JWT for ${environment} environment`)
			.withVerb(VerbType.POST)
			.withProtocol(ProtocolType.HTTPS)
			.withHost('jwt-public-prod.aws.barchart.com')
			.withPathBuilder((pb) => {
				pb.withLiteralParameter('version', 'v1')
					.withLiteralParameter('tokens', 'tokens')
					.withLiteralParameter('impersonate', 'impersonate')
					.withLiteralParameter('service', 'alerts')
					.withLiteralParameter('environment', environment);
			}).withQueryBuilder((qb) => {
				qb.withLiteralParameter('expirationInMinutes', 'expirationInMinutes', '60');
			})
			.withBody()
			.withResponseInterceptor(ResponseInterceptor.DATA)
			.endpoint;
	}

	return getJwtGenerator;
})();