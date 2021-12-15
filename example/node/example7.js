const process = require('process');

const AlertManager = require('./../../lib/AlertManager');

const AdapterForHttp = require('./../../lib/adapters/AdapterForHttp'),
	AdapterForSocketIo = require('./../../lib/adapters/AdapterForSocketIo');

const JwtProvider = require('./../../lib/security/JwtProvider'),
	getJwtGenerator = require('./../../lib/security/demo/getJwtGenerator');

const LoggerFactory = require('./../../lib/logging/LoggerFactory'),
	CustomLoggingProvider = require('./logging/CustomLoggingProvider');

LoggerFactory.configure(new CustomLoggingProvider());

const logger = LoggerFactory.getLogger('@barchart/example7');

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

if (!user_id) {
	logger.error('The user_id argument must be specified. Example: "node example7.js --user_id=me"');

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

let host = getParameterValue('host') || 'alerts-management-stage.barchart.com';
let port = getParameterValue('port') || 443;

try {
	port = parseInt(port);
} catch (e) {
	logger.error('The port argument must be an integer. Example: "node example7.js --user_id=me"');

	process.exit();
}

let secure = port === 443;

logger.info(`Example: Creating AlertManager for [ ${host}:${port} ] using [ ${adapterDescription} ] mode`);

alertManager = new AlertManager(host, port, secure, adapterClazz);

logger.info(`Example: Configuring JWT generator to impersonate [ ${user_id}@${alert_system} ]`);

const jwtGenerator = getJwtGenerator(user_id, alert_system);
const jwtProvider = new JwtProvider(jwtGenerator, 60000, 'dev');

logger.info(`Example: Connecting to the Barchart Alerting Service`);

const timing = { };

timing.connect = { };
timing.connect.start = 0;
timing.connect.finish = 0;

timing.properties = { };
timing.properties.start = 0;
timing.properties.finish = 0;

timing.grouping = { };
timing.grouping.start = 0;
timing.grouping.finish = 0;

function getTime() {
	const date = new Date();

	return date.getTime();
}

function getElapsedTime(finish, start) {
	return `${finish - start} ms`;
}

timing.connect.start = getTime();

alertManager.connect(jwtProvider)
	.then(() => {
		timing.connect.finish = getTime();

		logger.info(`Example: Connected to the Barchart Alerting Service`);

		timing.properties.start = getTime();

		return Promise.resolve({})
			.then((context) => {
				logger.info(`Example: Retrieving properties`);

				return alertManager.getProperties()
					.then((response) => {
						timing.properties.finish = getTime();

						logger.info(`Example: Retrieved ${response.length} properties`);

						context.properties = response;

						return context;
					}).catch((e) => {
						logger.warn(`Example: Failed retrieve properties`);
						logger.error(e);

						throw e;
					});
			}).then((context) => {
				timing.grouping.start = getTime();

				logger.info(`Example: Grouping properties into tree`);

				const groups = AlertManager.getPropertyTree(context.properties);

				timing.grouping.finish = getTime();

				return context;
			}).then((context) => {
				logger.info(`Example: Backend connect time was ${getElapsedTime(timing.connect.finish, timing.connect.start)}`);
				logger.info(`Example: Property download time was ${getElapsedTime(timing.properties.finish, timing.properties.start)}`);
				logger.info(`Example: Property grouping time was ${getElapsedTime(timing.grouping.finish, timing.grouping.start)}`);

				logger.info(`Example: Total elapsed time was ${getElapsedTime(timing.grouping.finish, timing.connect.start)}`);
			});
	}).catch((e) => {
	logger.warn(`Example: Failed to connect to the Barchart Alerting Service`);
}).then(() => {
	logger.info(`Example: Disposing AlertManager`);

	alertManager.dispose();
});