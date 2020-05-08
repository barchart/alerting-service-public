const process = require('process');

const AlertManager = require('./../../lib/AlertManager');

const AdapterForHttp = require('./../../lib/adapters/AdapterForHttp');
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

	const __logger = LoggerFactory.getLogger('@barchart/example');

	__logger.info(`Example: Node.js example script started, SDK version [ ${AlertManager.version} ]`);

	let alertManager = null;

	process.on('SIGINT', () => {
		__logger.info('Example: Processing SIGINT');

		if (alertManager !== null) {
			alertManager.dispose();
		}

		__logger.info('Example: Node.js example script ending');

		process.exit();
	});

	process.on('unhandledRejection', (error) => {
		__logger.error('Unhandled Promise Rejection', error);
	});

	process.on('uncaughtException', (error) => {
		__logger.error('Unhandled Error', error);
	});

	const userId = process.argv[2];
	const alertSystem = 'barchart.com';

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

	/*
	const host = 'alerts-management-stage.barchart.com';
	const port = 443;
	const secure = true;
	*/

	const host = 'localhost';
	const port = 3000;
	const secure = false;

	__logger.info(`Example: Created AlertManager for [ ${host}:${port} ] using [ ${adapterDescription} ] mode`);

	alertManager = new AlertManager(host, port, secure, adapterClazz);

	__logger.info(`Example: Configuring JWT generator to impersonate [ ${userId}@${alertSystem} ]`);

	const jwtGenerator = getJwtGenerator(userId, alertSystem);
	const jwtProvider = new JwtProvider(jwtGenerator, 60000, 'demo');

	__logger.info(`Example: Connecting to Barchart\'s Alert Service`);

	alertManager.connect(jwtProvider)
		.then(() => {
			__logger.info(`Example: Connected to Barchart\'s Alert Service`);

			__logger.info(`Example: Retrieving a list of alerts for [ ${userId}@${alertSystem} ]`);

			return alertManager.retrieveAlerts({ })
				.then((alerts) => {
					__logger.info(`Example: Retrieved alerts [ ${alerts.length} ] for [ ${userId}@${alertSystem} ]`);
				}).catch((e) => {
					__logger.warn(`Example: Failed to retrieve alerts for [ ${userId}@${alertSystem} ]`);
				})
		}).catch((e) => {
			__logger.warn(`Example: Failed to connect to Barchart\'s Alert Service`);
		}).then(() => {
			__logger.info(`Example: Disposing AlertManager`);

			alertManager.dispose();
		});
})();
