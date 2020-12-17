import AdapterForHttp from '@barchart/alerts-client-js/lib/adapters/AdapterForHttp';
import AlertManager from '@barchart/alerts-client-js/lib/AlertManager';
import getJwtGenerator from '@barchart/alerts-client-js/lib/security/demo/getJwtGenerator';
import JwtProvider from '@barchart/alerts-client-js/lib/security/JwtProvider';

let alertManager = null;

export const createManager = async (host, userId, system) => {
	const jwtGenerator = getJwtGenerator(userId, system);
	const jwtProvider = new JwtProvider(jwtGenerator, 60000, 'demo');

	alertManager = new AlertManager(host, 443, true, AdapterForHttp);

	await alertManager.connect(jwtProvider);

	return alertManager;
};

export const getManager = () => {
	return alertManager;
};