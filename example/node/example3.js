const process = require('process');

const promise = require('@barchart/common-js/lang/promise');

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
    logger.error('The user_id argument must be specified. Example: "node example3.js --user_id=me"');

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

const THRESHOLD = 7000;

try {
    port = parseInt(port);
} catch (e) {
    logger.error('The port argument must be an integer. Example: "node example3.js --user_id=me --host=localhost --port=8888"');

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

        return Promise.resolve({ })
            .then((context) => {
                logger.info(`Example: Retrieving a list of templates for [ ${user_id}@${alert_system} ]`);

                const payload = { };

                payload.user_id = user_id;
                payload.alert_system = alert_system;

                return alertManager.retrieveTemplates(payload)
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
                return wait(THRESHOLD).then(() => {
                    return context;
                });
            }).then((context) => {
                logger.info(`Example: Updating an existing template for [ ${user_id}@${alert_system} ]`);

                const update = { };

                update.template_id = context.template.template_id;
                update.name = 'New Name';
                update.description = 'New Description';
                update.use_as_default = true;
                update.sort_order = 999;

                return alertManager.updateTemplate(update)
                    .then((template) => {
                        logger.info(`Example: Updated template for [ ${user_id}@${alert_system} ]`);
                        logger.info(JSON.stringify(template, null, 2));

                        context.template = template;

                        return context;
                    }).catch((e) => {
                        logger.warn(`Example: Failed to update template for [ ${user_id}@${alert_system} ]`);
                        logger.error(e);

                        throw e;
                    });
            }).then((context) => {
                return wait(THRESHOLD).then(() => {
                    return context;
                });
            }).then((context) => {
                logger.info(`Example: Creating new alert from template for [ ${user_id}@${alert_system} ]`);

                const alert = AlertManager.createAlertFromTemplate(context.template, 'AAPL');

                return alertManager.createAlert(alert)
                    .then((createdAlert) => {
                        logger.info(`Example: Created alert from template for [ ${user_id}@${alert_system} ]`);
                        logger.info(JSON.stringify(createdAlert, null, 2));

                        context.alert = createdAlert;

                        return context;
                    }).catch((e) => {
                        logger.warn(`Example: Failed to create an alert from template for [ ${user_id}@${alert_system} ]`);
                        logger.error(e);

                        throw e;
                    });
            }).then((context) => {
                return wait(THRESHOLD).then(() => {
                    return context;
                });
            }).then((context) => {
                logger.info(`Example: Deleting an alert for [ ${user_id}@${alert_system} ]`);

                return alertManager.deleteAlert(context.alert)
                    .then((deletedAlert) => {
                        logger.info(`Example: Deleted alert [ ${deletedAlert.alert_id} ] for [ ${user_id}@${alert_system} ]`);

                        context.alert = null;

                        return context;
                    }).catch((e) => {
                        logger.warn(`Example: Failed to delete alert for [ ${user_id}@${alert_system} ]`);
                        logger.error(e);

                        throw e;
                    });
            }).then((context) => {
                return wait(THRESHOLD).then(() => {
                    return context;
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

function wait(delay) {
    return promise.build((resolve) => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
}
