const process = require('process');

const AlertManager = require('./../../lib/AlertManager');

const AdapterForHttp = require('./../../lib/adapters/AdapterForHttp'),
    AdapterForSocketIo = require('./../../lib/adapters/AdapterForSocketIo');

const JwtProvider = require('./../../lib/security/JwtProvider'),
    getJwtGenerator = require('./../../lib/security/demo/getJwtGenerator');

const LoggerFactory = require('./../../lib/logging/LoggerFactory'),
    CustomLoggingProvider = require('./logging/CustomLoggingProvider');

LoggerFactory.configure(new CustomLoggingProvider());

const logger = LoggerFactory.getLogger('@barchart/example3');

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
    logger.error('A user identifier must be specified. Here is a usage example: "node example.js user-1234"');

    process.exit();
}

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

const host = 'localhost';
const port = 3000;
const secure = false;

logger.info(`Example: Created AlertManager for [ ${host}:${port} ] using [ ${adapterDescription} ] mode`);

alertManager = new AlertManager(host, port, secure, adapterClazz);

logger.info(`Example: Configuring JWT generator to impersonate [ ${user_id}@${alert_system} ]`);

const jwtGenerator = getJwtGenerator(user_id, alert_system);
const jwtProvider = new JwtProvider(jwtGenerator, 60000, 'dev');

logger.info(`Example: Connecting to the Barchart Alerting Service`);

alertManager.connect(jwtProvider)
    .then(() => {
        logger.info(`Example: Connected to the Barchart Alerting Service`);

        return Promise.resolve({ })
            .then((context) => {
                logger.info(`Example: Retrieving a list of templates for [ ${user_id}@${alert_system} ]`);

                const payload = { };

                payload.user_id = user_id;
                payload.alert_system = alert_system;

                return alertManager.getTemplates(payload)
                    .then((templates) => {
                        logger.info(`Example: Retrieved templates [ ${templates.length} ] for [ ${user_id}@${alert_system} ]`);

                        context.templates = templates;

                        return context;
                    }).catch((e) => {
                        logger.warn(`Example: Failed to retrieve templates for [ ${user_id}@${alert_system} ]`);
                        logger.error(e);

                        throw e;
                    });
            }).then((context) => {
                logger.info(`Example: Creating new template for [ ${user_id}@${alert_system} ]`);

                const template = { };

                template.user_id = user_id;
                template.alert_system = alert_system;
                template.name = 'Temporary template';

                template.conditions = [
                    {
                        property: {
                            property_id: 1
                        },
                        operator: {
                            operand: '100',
                            operand_display: '100',
                            operand_format: '100.00',
                            operator_id: 2
                        }
                    }
                ];

                return alertManager.createTemplate(template)
                    .then((template) => {
                        logger.info(`Example: Created template for [ ${user_id}@${alert_system} ]`);
                        logger.info(JSON.stringify(template, null, 2));

                        context.template = template;

                        return context;
                    }).catch((e) => {
                        logger.warn(`Example: Failed to create template for [ ${user_id}@${alert_system} ]`);
                        logger.error(e);

                        throw e;
                    });
            }).then((context) => {
                logger.info(`Example: Deleting template for [ ${user_id}@${alert_system} ]`);

                return alertManager.deleteTemplate(context.template)
                    .then((deletedTemplate) => {
                        logger.info(`Example: Deleted template [ ${deletedTemplate.template_id} ] for [ ${user_id}@${alert_system} ]`);

                        context.template = null;

                        return context;
                    }).catch((e) => {
                        logger.warn(`Example: Failed to delete template for [ ${user_id}@${alert_system} ]`);
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
