const process = require('process');

const AlertManager = require('./../../lib/AlertManager');

const AdapterForHttp = require('./../../lib/adapters/AdapterForHttp'),
    AdapterForSocketIo = require('./../../lib/adapters/AdapterForSocketIo');

const JwtProvider = require('./../../lib/security/JwtProvider'),
    getJwtGenerator = require('./../../lib/security/demo/getJwtGenerator');

const LoggerFactory = require('./../../lib/logging/LoggerFactory'),
    CustomLoggingProvider = require('./logging/CustomLoggingProvider');

LoggerFactory.configure(new CustomLoggingProvider());

const logger = LoggerFactory.getLogger('@barchart/example5');

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
    logger.error('The user_id argument must be specified. Example: "node example5.js --user_id=me"');

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
    logger.error('The port argument must be an integer. Example: "node example5.js --user_id=me --host=localhost --port=8888"');

    process.exit();
}

let secure = port === 443;

logger.info(`Example: Creating AlertManager for [ ${host}:${port} ] using [ ${adapterDescription} ] mode`);

alertManager = new AlertManager(host, port, secure, adapterClazz);

logger.info(`Example: Configuring JWT generator to impersonate [ ${user_id}@${alert_system} ]`);

const jwtGenerator = getJwtGenerator(user_id, alert_system);
const jwtProvider = new JwtProvider(jwtGenerator, 60000, 'dev');

logger.info(`Example: Connecting to the Barchart Alerting Service`);

alertManager.connect(jwtProvider)
    .then(() => {
        logger.info(`Example: Connected to the Barchart Alerting Service`);

        return Promise.resolve({})
            .then((context) => {
                logger.info(`Example: Deleting existing template`);

                const payload = { template_id: "0a7170a3-18b8-41dd-a386-887dd0ea8c95" };

                return alertManager.deleteTemplate(payload)
                    .then((response) => {
                        logger.info(`Example: Deleted existing template`);
                        logger.info(JSON.stringify(response, null, 2));

                        return context;
                    }).catch((e) => {
                        logger.warn(`Example: Failed to delete template`);
                        logger.error(e);

                        throw e;
                    });
            });
    }).catch((e) => {
        logger.warn(`Example: Failed to connect to the Barchart Alerting Service`);
    }).then(() => {
        logger.info(`Example: Disposing AlertManager`);

        alertManager.dispose();
    });