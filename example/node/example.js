const process = require('process');

const AlertManager = require('./../../lib/AlertManager');

const AdapterForHttp = require('./../../lib/adapters/AdapterForHttp'),
	AdapterForSocketIo = require('./../../lib/adapters/AdapterForSocketIo');

const JwtProvider = require('./../../lib/security/JwtProvider'),
	getJwtGenerator = require('./../../lib/security/demo/getJwtGenerator');

const LoggerFactory = require('./../../lib/logging/LoggerFactory'),
	CustomLoggingProvider = require('./logging/CustomLoggingProvider');

const startup = (() => {
	'use strict';
	
	//LoggerFactory.configureForConsole();
	//LoggerFactory.configureForSilence();

	LoggerFactory.configure(new CustomLoggingProvider());

	const logger = LoggerFactory.getLogger('@barchart/example');

	logger.info(`Example: Node.js example script started, SDK version [ ${AlertManager.version} ]`);

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

	const mode = process.argv[3];

	let adapterClazz;
	let adapterDescription;

	if (mode === 'http') {
		adapterClazz = AdapterForHttp;
		adapterDescription = 'HTTP';
	} else {
		adapterClazz = AdapterForSocketIo;
		adapterDescription = 'Socket.IO';
	}

	const host = 'alerts-management-demo.barchart.com';
	const port = 443;
	const secure = true;

	logger.info(`Example: Created AlertManager for [ ${host}:${port} ] using [ ${adapterDescription} ] mode`);

	alertManager = new AlertManager(host, port, secure, adapterClazz);

	logger.info(`Example: Configuring JWT generator to impersonate [ ${user_id}@${alert_system} ]`);

	const jwtGenerator = getJwtGenerator(user_id, alert_system);
	const jwtProvider = new JwtProvider(jwtGenerator, 60000, 'demo');

	logger.info(`Example: Connecting to Barchart\'s Alert Service`);

	alertManager.connect(jwtProvider)
		.then(() => {
			logger.info(`Example: Connected to Barchart\'s Alert Service`);

			logger.info(`Example: Retrieving a list of alerts for [ ${user_id}@${alert_system} ]`);

			const payload = { };
			
			payload.user_id = user_id;
			payload.alert_system = alert_system;

			return alertManager.retrieveAlerts(payload)
				.then((alerts) => {
					logger.info(`Example: Retrieved alerts [ ${alerts.length} ] for [ ${user_id}@${alert_system} ]`);
				}).catch((e) => {
					logger.warn(`Example: Failed to retrieve alerts for [ ${user_id}@${alert_system} ]`);
				});
		}).catch((e) => {
			logger.warn(`Example: Failed to connect to Barchart\'s Alert Service`);
		}).then(() => {
			logger.info(`Example: Disposing AlertManager`);

			alertManager.dispose();
		});
})();
