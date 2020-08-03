const process = require('process');

const AlertManager = require('./../../lib/AlertManager');

const AdapterForHttp = require('./../../lib/adapters/AdapterForHttp');

const JwtProvider = require('./../../lib/security/JwtProvider'),
	getJwtGenerator = require('./../../lib/security/demo/getJwtGenerator');

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
const alert_system = 'barchart.com';

if (!user_id) {
	logger.error('A user identifier must be specified. Here is a usage example: "node example2.js user-1234"');

	process.exit();
}

const host = 'alerts-management-demo.barchart.com';
const port = 443;
const secure = true;

logger.info(`Example: Created AlertManager for [ ${host}:${port} ] using [ HTTP ] mode`);

alertManager = new AlertManager(host, port, secure, AdapterForHttp);

logger.info(`Example: Configuring JWT generator to impersonate [ ${user_id}@${alert_system} ]`);

const jwtGenerator = getJwtGenerator(user_id, alert_system);
const jwtProvider = new JwtProvider(jwtGenerator, 60000, 'demo');

logger.info(`Example: Connecting to the Barchart Alerting Service`);

alertManager.connect(jwtProvider)
	.then(() => {
		logger.info(`Example: Connected to the Barchart Alerting Service`);
		logger.info(`Example: Creating new alert for [ ${user_id}@${alert_system} ]`);

		const alert = {
			name: 'Example Alert: AAPL exceeds $600',
			user_id: user_id,
			alert_system: alert_system,
			conditions: [
				{
					property: {
						property_id: 1,
						target: {
							identifier: 'AAPL'
						}
					},
					operator: {
						operator_id: 2,
						operand: "600.00"
					}
				}
			]
		};

		return alertManager.createAlert(alert)
			.then((created) => {
				logger.info(`Example: Created new alert for [ ${user_id}@${alert_system} ] with ID [ ${created.alert_id} ]`);
			}).catch((e) => {
				logger.error(`Example: Failed to create new alert for [ ${user_id}@${alert_system} ]`);
				logger.error(e);
			});
	}).catch((e) => {
		logger.warn(`Example: Failed to connect to the Barchart Alerting Service`);
	}).then(() => {
		logger.info(`Example: Disposing AlertManager`);

		alertManager.dispose();
	});
