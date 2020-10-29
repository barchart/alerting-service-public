const process = require('process');

const AlertManager = require('./../../lib/AlertManager');
const AdapterForSocketIo = require('../../lib/adapters/AdapterForSocketIo');
const JwtProvider = require('../../lib/security/JwtProvider'),
	getJwtGenerator = require('../../lib/security/demo/getJwtGenerator');

const LoggerFactory = require('./../../lib/logging/LoggerFactory'),
	CustomLoggingProvider = require('./logging/CustomLoggingProvider');

LoggerFactory.configure(new CustomLoggingProvider());

const logger = LoggerFactory.getLogger('@barchart/example');

logger.info(`Example: Node.js example script started, using SDK version [ ${AlertManager.version} ]`);

let alertManager = null;

process.on('SIGINT', () => {
	logger.info('Example: Processing SIGINT');

	if (alertManager !== null) {
		alertManager.dispose();
	}

	logger.info('Example: Node.js example script ending');

	process.exit();
});

process.on('unhandledRejection', (error) => {
	logger.error('Unhandled Promise Rejection', error);
});

process.on('uncaughtException', (error) => {
	logger.error('Unhandled Error', error);
});

const user_id = process.argv[2];
let lazy = process.argv[3];
const alert_system = 'barchart.com';

if (!user_id) {
	logger.error('A user identifier must be specified. Here is a usage example: "node example2.js user-1234 true"');

	process.exit();
}

if (!lazy) {
	logger.error('A lazy mode must be specified. Here is a usage example: "node example2.js user-1234 true"');

	process.exit();
}

lazy = lazy === 'true';

const host = 'alerts-management-demo.barchart.com';
const port = 443;
const secure = true;

logger.info(`Example: Created AlertManager for [ ${host}:${port} ] using [ SocketIO ] adapter and lazy [ ${lazy} ] mode`);

logger.info(`Example: Connecting to the Barchart Alerting Service`);

alertManager = new AlertManager(host, port, secure, AdapterForSocketIo);
const jwtGenerator = getJwtGenerator(user_id, alert_system);
const jwtProvider = new JwtProvider(jwtGenerator, 60000, 'demo');

(async function () {
	logger.info('Example: BEFORE CONNECT FUNCTION');
	const manager = await alertManager.connect(jwtProvider, lazy);
	logger.info('Example: AFTER CONNECT FUNCTION');
	logger.info('Example: CONNECTION STATUS:', manager._adapter._connectionState.getDescription());

	function getUser() {
		logger.info('Example: BEFORE GET USER FUNCTION');
		return alertManager.getUser().then((res) => {
			logger.info('Example: AFTER GET USER FUNCTION');
			logger.info('Example: USERS:', res.user_id);

			return res;
		});
	}

	function getOperators() {
		logger.info('Example: BEFORE GET OPERATORS FUNCTION');
		return alertManager.getOperators().then((res) => {
			logger.info('Example: AFTER GET OPERATORS FUNCTION');
			logger.info('Example: OPERATOR:', res[0].operator_name);

			return res;
		});
	}

	await getOperators();
	logger.info('Example: CONNECTION STATUS:', manager._adapter._connectionState.getDescription());
	await getUser();

	alertManager.dispose();
})();