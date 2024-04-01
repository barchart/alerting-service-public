const process = require('process');

const AlertManager = require('./../../lib/AlertManager');

const AdapterForHttp = require('./../../lib/adapters/AdapterForHttp'),
	AdapterForSocketIo = require('./../../lib/adapters/AdapterForSocketIo');

const JwtProvider = require('./../../lib/security/JwtProvider'),
	getJwtGenerator = require('./../../lib/security/demo/getJwtGenerator');

const LoggerFactory = require('./../../lib/logging/LoggerFactory'),
	CustomLoggingProvider = require('./logging/CustomLoggingProvider');

//LoggerFactory.configureForConsole();
//LoggerFactory.configureForSilence();

LoggerFactory.configure(new CustomLoggingProvider());

const logger = LoggerFactory.getLogger('@barchart/example9');

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

function getParameterValue(name) {
	let value = null;

	for (let i = 0; i < process.argv.length; i++) {
		const matches = process.argv[i].match(/^--(\S+)[=\s]+(\S+)$/);

		if (matches !== null && matches[1] === name) {
			value = matches[2];
		}

		if (value !== null) {
			break;
		}
	}

	return value;
}

const user_id = getParameterValue('user_id');
const alert_system = getParameterValue('alert_system') || 'barchart.com';
const symbol = getParameterValue('symbol') || 'TSLA';

if (!user_id) {
	logger.error('The user_id argument must be specified. Example: "node example9.js --user_id=me --symbol=ESZ22"');

	process.exit();
}

const mode = getParameterValue('mode') || 'socket.io';

let adapterClazz;
let adapterDescription;

if (mode === 'http') {
	adapterClazz = AdapterForHttp;
	adapterDescription = 'HTTP';
} else {
	adapterClazz = AdapterForSocketIo;
	adapterDescription = 'Socket.IO';
}

let host = getParameterValue('host') || 'alerts-management-demo.barchart.com';
let port = getParameterValue('port') || 443;

try {
	port = parseInt(port);
} catch (e) {
	logger.error('The port argument must be an integer. Example: "node example9.js --user_id=me --host=localhost --port=8888"');

	process.exit();
}

let secure = port === 443;

logger.info(`Example: Creating AlertManager for [ ${host}:${port} ] using [ ${adapterDescription} ] mode`);

alertManager = new AlertManager(host, port, secure, adapterClazz);

logger.info(`Example: Configuring JWT generator to impersonate [ ${user_id}@${alert_system} ]`);

const jwtGenerator = getJwtGenerator(user_id, alert_system);
const jwtProvider = new JwtProvider(jwtGenerator, 60000);

logger.info(`Example: Connecting to the Barchart Alerting Service`);

alertManager.connect(jwtProvider)
	.then(() => {
		logger.info(`Example: Connected to the Barchart Alerting Service`);

		return Promise.resolve({ })
			.then((context) => {
				logger.info(`Example: Downloading all properties`);

				return alertManager.getProperties()
					.then((properties) => {
						logger.info(`Example: Downloaded [ ${properties.length} ] properties`);

						context.properties = properties;

						return context;
					});
			}).then((context) => {
				logger.info(`Example: Filtering valid properties for symbol [ ${symbol} ] and target [ 1 ]`);

				return AlertManager.filterPropertiesForSymbol(context.properties, symbol, 1)
					.then((filtered) => {
						logger.info(`Example: [ ${filtered.length} ] of [ ${context.properties.length} ] properties are valid for [ ${symbol} ] and target [ 1 ]`);

						return context;
					});
			}).then((context) => {
				const payload = { };

				payload.user_id = user_id;
				payload.alert_system = alert_system;

				logger.info(`Example: Downloading all templates for user [ ${payload.user_id} ] [ ${payload.alert_system} ]`);

				return alertManager.retrieveTemplates(payload)
					.then((templates) => {
						logger.info(`Example: Downloaded [ ${templates.length} ] templates for user [ ${payload.user_id} ] [ ${payload.alert_system} ]`);

						context.templates = templates;

						return context;
					});
			}).then((context) => {
				logger.info(`Example: Filtering templates properties for symbol [ ${symbol} ]`);

				return AlertManager.filterTemplatesForSymbol(context.templates, symbol, alert_system)
					.then((filtered) => {
						logger.info(`Example: [ ${filtered.length} ] of [ ${context.templates.length} ] templates are valid for [ ${symbol} ]`);

						return context;
					});
			}).catch((e) => {
				logger.error('Example: An error occurred while running the script', e);
			});
	}).catch((e) => {
		logger.warn(`Example: Failed to connect to the Barchart Alerting Service`);
	}).then(() => {
		logger.info(`Example: Disposing AlertManager`);

		alertManager.dispose();
	});
