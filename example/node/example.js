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

	__logger.log(`Example: Node.js example script started, SDK version [ ${AlertManager.version} ]`);

	let alertManager = null;

	process.on('SIGINT', () => {
		__logger.log('Example: Processing SIGINT');

		if (alertManager !== null) {
			alertManager.dispose();
		}

		__logger.log('Example: Node.js example script ending');

		process.exit();
	});

	process.on('unhandledRejection', (error) => {
		__logger.error('Unhandled Promise Rejection');
		__logger.trace();
	});

	process.on('uncaughtException', (error) => {
		__logger.error('Unhandled Error', error);
		__logger.trace();
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

	const host = 'alerts-management-stage.barchart.com';
	const port = 443;
	const secure = true;

	__logger.log(`Example: Instantiating AlertManager for [ ${host}:${port} ] using [ ${adapterDescription} ] mode`);

	alertManager = new AlertManager(host, port, secure, adapterClazz);

	__logger.log(`Example: Configuring JWT generator to impersonate [ ${userId}@${alertSystem} ]`);

	const jwtGenerator = getJwtGenerator(userId, alertSystem);
	const jwtProvider = new JwtProvider(jwtGenerator, 60000, 'demo');

	__logger.log(`Example: Connecting to Barchart\'s Alert Service`);

	alertManager.connect(jwtProvider)
		.then(() => {
			__logger.log(`Example: Connected to Barchart\'s Alert Service`);
		});
})();
