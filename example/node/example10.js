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

let alert_id = getParameterValue('alert_id');
let trigger_date = getParameterValue('trigger_date');

try {
	trigger_date = parseInt(trigger_date);
} catch (e) {
	trigger_date = null;
}

if (!user_id) {
	logger.error('The user_id argument must be specified. Example: "node example10.js --alert_id=10afba84-5373-4df9-9af8-2baf64b6dd87 --trigger_date=1722202540306"');

	process.exit();
}

if (!alert_id) {
	logger.error('The alert_id argument must be specified. Example: "node example10.js --alert_id=10afba84-5373-4df9-9af8-2baf64b6dd87 --trigger_date=1722202540306"');

	process.exit();
}

if (!trigger_date) {
	logger.error('The trigger_date argument must be specified. Example: "node example10.js --alert_id=10afba84-5373-4df9-9af8-2baf64b6dd87 --trigger_date=1722202540306"');

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
	logger.error('The port argument must be an integer. Example: "node example10.js --host=localhost --port=8888 --alert_id=10afba84-5373-4df9-9af8-2baf64b6dd87 --trigger_date=1722202540306"');

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
		logger.info(`Example: Retrieving alert trigger for [ ${user_id}@${alert_system} ] [ ${alert_id}@${trigger_date} ]`);

		const payload = { };

		payload.user_id = user_id;
		payload.alert_system = alert_system;

		payload.alert_id = alert_id;
		payload.trigger_date = trigger_date;

		return alertManager.retrieveTrigger(payload)
			.then((trigger) => {
				logger.info(`Example: Retrieved alert trigger`);
				logger.info(JSON.stringify(trigger, null, 2));
			}).catch((e) => {
				console.log(e);

				logger.warn(`Example: Failed to retrieve trigger for [ ${user_id}@${alert_system} ] [ ${alert_id}@${trigger_date} ]`);
			});
	}).catch((e) => {
		logger.warn(`Example: Failed to connect to the Barchart Alerting Service`);
	}).then(() => {
		logger.info(`Example: Disposing AlertManager`);

		alertManager.dispose();
	});
