const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	object = require('@barchart/common-js/lang/object');

const EndpointBuilder = require('@barchart/common-js/api/http/builders/EndpointBuilder'),
	ErrorInterceptor = require('@barchart/common-js/api/http/interceptors/ErrorInterceptor'),
	FailureReason = require('@barchart/common-js/api/failures/FailureReason'),
	FailureType = require('@barchart/common-js/api/failures/FailureType'),
	Gateway = require('@barchart/common-js/api/http/Gateway'),
	ProtocolType = require('@barchart/common-js/api/http/definitions/ProtocolType'),
	RequestInterceptor = require('@barchart/common-js/api/http/interceptors/RequestInterceptor'),
	ResponseInterceptor = require('@barchart/common-js/api/http/interceptors/ResponseInterceptor'),
	Scheduler = require('@barchart/common-js/timing/Scheduler'),
	VerbType = require('@barchart/common-js/api/http/definitions/VerbType');

const AdapterBase = require('./AdapterBase'),
	JwtProvider = require('../security/JwtProvider');

module.exports = (() => {
	'use strict';

	/**
	 * A backend communication strategy implemented with purely with HTTP requests
	 * (using the [Axios](https://github.com/axios/axios) library). Short polling
	 * is used for data feeds.
	 *
	 * @public
	 * @exported
	 * @extends {AdapterBase}
	 */
	class AdapterForHttp extends AdapterBase {
		constructor(host, port, secure, onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered, onTriggersCreated, onTriggersMutated, onTriggersDeleted, onTemplateCreated, onTemplateMutated, onTemplateDeleted, onConnectionStatusChanged) {
			super(host, port, secure, onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered, onTriggersCreated, onTriggersMutated, onTriggersDeleted, onTemplateCreated, onTemplateMutated, onTemplateDeleted, onConnectionStatusChanged);

			assert.argumentIsOptional(host, 'host', String);
			assert.argumentIsOptional(port, 'port', Number);
			assert.argumentIsOptional(secure, 'secure', Boolean);

			this._jwtProvider = null;

			const requestInterceptor = getRequestInterceptorForJwt.call(this);

			let protocolType;

			if (secure) {
				protocolType = ProtocolType.HTTPS;
			} else {
				protocolType = ProtocolType.HTTP;
			}

			this._createAlertEndpoint = EndpointBuilder.for('create-alert', 'Create alert')
				.withVerb(VerbType.POST)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alerts', 'alerts');
				})
				.withBody()
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._retrieveAlertEndpoint = EndpointBuilder.for('query', 'Query')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alerts', 'alerts')
						.withVariableParameter('alert_id', 'alert_id', 'alert_id');
				})
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._retrieveAlertsEndpoint = EndpointBuilder.for('query', 'Query')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alerts', 'alerts')
						.withLiteralParameter('users', 'users')
						.withVariableParameter('alert_system', 'alert_system', 'alert_system')
						.withVariableParameter('user_id', 'user_id', 'user_id');
				})
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._updateAlertEndpoint = EndpointBuilder.for('update-alert', 'Update alert')
				.withVerb(VerbType.PUT)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alerts', 'alerts')
						.withVariableParameter('alert_id', 'alert_id', 'alert_id');
				})
				.withBody()
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._updateAlertsForUserEndpoint = EndpointBuilder.for('update-alert', 'Update alert')
				.withVerb(VerbType.PUT)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alerts', 'alerts')
						.withLiteralParameter('users', 'users')
						.withVariableParameter('alert_system', 'alert_system', 'alert_system')
						.withVariableParameter('user_id', 'user_id', 'user_id');
				})
				.withBody()
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._deleteAlertEndpoint = EndpointBuilder.for('delete-alert', 'Delete alert')
				.withVerb(VerbType.DELETE)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alerts', 'alerts')
						.withVariableParameter('alert_id', 'alert_id', 'alert_id');
				})
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._retrieveTriggersEndpoint = EndpointBuilder.for('retrieve-alert-triggers', 'Retrieve alert triggers')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alert', 'alert')
						.withLiteralParameter('triggers', 'triggers')
						.withLiteralParameter('users', 'users')
						.withVariableParameter('alert_system', 'alert_system', 'alert_system')
						.withVariableParameter('user_id', 'user_id', 'user_id');
				})
				.withQueryBuilder((pb) => {
					pb.withVariableParameter('trigger_date', 'trigger_date', 'trigger_date', true)
						.withVariableParameter('trigger_status', 'trigger_status', 'trigger_status', true);
				})
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._updateTriggerEndpoint = EndpointBuilder.for('update-trigger', 'Update trigger')
				.withVerb(VerbType.PUT)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alert', 'alert')
						.withLiteralParameter('triggers', 'triggers')
						.withVariableParameter('alert_id', 'alert_id', 'alert_id')
						.withVariableParameter('trigger_date', 'trigger_date', 'trigger_date');
				})
				.withBody()
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._updateTriggersEndpoint = EndpointBuilder.for('update-triggers', 'Update triggers')
				.withVerb(VerbType.PUT)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alert', 'alert')
						.withLiteralParameter('triggers', 'triggers')
						.withLiteralParameter('users', 'users')
						.withVariableParameter('alert_system', 'alert_system', 'alert_system')
						.withVariableParameter('user_id', 'user_id', 'user_id');
				})
				.withBody()
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._createTemplateEndpoint = EndpointBuilder.for('create-template', 'Create template')
				.withVerb(VerbType.POST)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('templates', 'templates');
				})
				.withBody()
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._retrieveTemplatesEndpoint = EndpointBuilder.for('retrieve-templates', 'Retrieve templates')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('templates', 'templates')
						.withLiteralParameter('users', 'users')
						.withVariableParameter('alert_system', 'alert_system', 'alert_system')
						.withVariableParameter('user_id', 'user_id', 'user_id');
				})
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._updateTemplateEndpoint = EndpointBuilder.for('update-template', 'Update template')
				.withVerb(VerbType.PUT)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('templates', 'templates')
						.withVariableParameter('template_id', 'template_id', 'template_id');
				})
				.withBody()
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._updateTemplateOrderEndpoint = EndpointBuilder.for('update-template-order', 'Update template ordering')
				.withVerb(VerbType.PUT)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('templates', 'templates')
						.withLiteralParameter('batch', 'batch')
						.withLiteralParameter('sorting', 'sorting');
				})
				.withBody()
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._deleteTemplateEndpoint = EndpointBuilder.for('delete-template', 'Delete template')
				.withVerb(VerbType.DELETE)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('templates', 'templates')
						.withVariableParameter('template_id', 'template_id', 'template_id');
				})
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._retrieveTargetsEndpoint = EndpointBuilder.for('retrieve-targets', 'Retrieve targets')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alert', 'alert')
						.withLiteralParameter('targets', 'targets');
				})
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._retrievePropertiesEndpoint = EndpointBuilder.for('retrieve-properties', 'Retrieve properties')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alert', 'alert')
						.withLiteralParameter('targets', 'targets')
						.withLiteralParameter('properties', 'properties');
				})
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._retrieveOperatorsEndpoint = EndpointBuilder.for('retrieve-operators', 'Retrieve operators')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alert', 'alert')
						.withLiteralParameter('operators', 'operators');
				})
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._retrieveModifiersEndpoint = EndpointBuilder.for('retrieve-modifiers', 'Retrieve modifiers')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alert', 'alert')
						.withLiteralParameter('modifiers', 'modifiers');
				})
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._retrievePublisherTypesEndpoint = EndpointBuilder.for('retrieve-publisher-types', 'Retrieve publisher types')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alert', 'alert')
						.withLiteralParameter('publishers', 'publishers');
				})
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._retrievePublisherTypeDefaultsEndpoint = EndpointBuilder.for('retrieve-publisher-type-defaults', 'Retrieve publisher type defaults')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alert', 'alert')
						.withLiteralParameter('publishers', 'publishers')
						.withLiteralParameter('default', 'default')
						.withVariableParameter('alert_system', 'alert_system', 'alert_system')
						.withVariableParameter('user_id', 'user_id', 'user_id');
				})
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._assignPublisherTypeDefaultEndpoint = EndpointBuilder.for('assign-publisher-type-default', 'Assign default publisher type')
				.withVerb(VerbType.PUT)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alert', 'alert')
						.withLiteralParameter('publishers', 'publishers')
						.withLiteralParameter('default', 'default')
						.withVariableParameter('alert_system', 'alert_system', 'alert_system')
						.withVariableParameter('user_id', 'user_id', 'user_id')
						.withVariableParameter('publisher_type_id', 'publisher_type_id', 'publisher_type_id');
				})
				.withBody()
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._deletePublisherTypeDefaultEndpoint = EndpointBuilder.for('delete-publisher-type-default', 'Clear default publisher type')
				.withVerb(VerbType.DELETE)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alert', 'alert')
						.withLiteralParameter('publishers', 'publishers')
						.withLiteralParameter('default', 'default')
						.withVariableParameter('alert_system', 'alert_system', 'alert_system')
						.withVariableParameter('user_id', 'user_id', 'user_id')
						.withVariableParameter('publisher_type_id', 'publisher_type_id', 'publisher_type_id');
				})
				.withBody()
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._retrieveMarketDataConfigurationEndpoint = EndpointBuilder.for('get-market-data-configuration', 'Get market data configuration')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alert', 'alert')
						.withLiteralParameter('market', 'market')
						.withLiteralParameter('configuration', 'configuration')
						.withVariableParameter('alert_system', 'alert_system', 'alert_system')
						.withVariableParameter('user_id', 'user_id', 'user_id');
				})
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._assignMarketDataConfigurationEndpoint = EndpointBuilder.for('assign-market-data-configuration', 'Assign market data configuration')
				.withVerb(VerbType.PUT)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('alert', 'alert')
						.withLiteralParameter('market', 'market')
						.withLiteralParameter('configuration', 'configuration')
						.withVariableParameter('alert_system', 'alert_system', 'alert_system')
						.withVariableParameter('user_id', 'user_id', 'user_id');
				})
				.withBody()
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._retrieveUserEndpoint = EndpointBuilder.for('get-user', 'Get user')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('user', 'user');
				})
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._retrieveVersionEndpoint = EndpointBuilder.for('get-version', 'Get version')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('server', 'server')
						.withLiteralParameter('version', 'version');
				})
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._scheduler = new Scheduler();

			this._alertSubscriberMap = {};
			this._triggerSubscriberMap = {};
			this._templateSubscriberMap = {};
		}

		connect(jwtProvider) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsOptional(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');

					this._jwtProvider = jwtProvider;

					return this.getServerVersion()
						.then(() => {
							this._onConnectionStatusChanged('connected');

							return Promise.resolve(this);
						}).catch((e) => {
							return Promise.reject(`Unable to connect to server using HTTP adapter [ ${this.host} ] [ ${this.port} ] [ ${this.secure} ]`);
						});
				});
		}

		createAlert(alert) {
			return Gateway.invoke(this._createAlertEndpoint, alert);
		}

		retrieveAlert(alert) {
			return Gateway.invoke(this._retrieveAlertEndpoint, alert);
		}

		retrieveAlerts(query) {
			return Gateway.invoke(this._retrieveAlertsEndpoint, query)
				.then((alerts) => {
					const subscriber = getSubscriber(this._alertSubscriberMap, query);

					if (subscriber) {
						const clones = alerts.map((alert) => {
							return object.clone(alert);
						});

						subscriber.processAlerts(clones);
					}

					return alerts;
				}).catch((e) => {
					console.log(e);
				});
		}
		
		updateAlert(alert) {
			return Gateway.invoke(this._updateAlertEndpoint, alert);
		}

		updateAlertsForUser(query) {
			return Gateway.invoke(this._updateAlertsForUserEndpoint, query);
		}

		deleteAlert(alert) {
			return Gateway.invoke(this._deleteAlertEndpoint, alert);
		}

		subscribeAlerts(query) {
			if (getSubscriber(this._alertSubscriberMap, query) !== null) {
				throw new Error('An alert subscriber already exists');
			}

			const subscriber = new AlertSubscriber(this, query);
			subscriber.start();

			putSubscriber(this._alertSubscriberMap, subscriber);

			return Disposable.fromAction(() => {
				deleteSubscriber(this._alertSubscriberMap, subscriber);

				subscriber.dispose();
			});
		}

		retrieveTriggers(query) {
			return Gateway.invoke(this._retrieveTriggersEndpoint, query)
				.then((triggers) => {
					const subscriber = getSubscriber(this._triggerSubscriberMap, query);

					if (subscriber) {
						const clones = triggers.map((trigger) => {
							return object.clone(trigger);
						});

						subscriber.processTriggers(clones);
					}

					return triggers;
				}).catch((e) => {
					console.log(e);
				});
		}

		updateTrigger(query) {
			return Gateway.invoke(this._updateTriggerEndpoint, query);
		}

		updateTriggers(query) {
			return Gateway.invoke(this._updateTriggersEndpoint, query);
		}

		subscribeTriggers(query) {
			if (getSubscriber(this._triggerSubscriberMap, query) !== null) {
				throw new Error('A trigger subscriber already exists');
			}

			const subscriber = new TriggerSubscriber(this, query);
			subscriber.start();

			putSubscriber(this._triggerSubscriberMap, subscriber);

			return Disposable.fromAction(() => {
				deleteSubscriber(this._triggerSubscriberMap, subscriber);

				subscriber.dispose();
			});
		}

		createTemplate(template) {
			return Gateway.invoke(this._createTemplateEndpoint, template);
		}

		retrieveTemplates(query) {
			return Gateway.invoke(this._retrieveTemplatesEndpoint, query)
				.then((templates) => {
					const subscriber = getSubscriber(this._templateSubscriberMap, query);

					if (subscriber) {
						const clones = templates.map((template) => {
							return object.clone(template);
						});

						subscriber.processTemplates(clones);
					}

					return templates;
				}).catch((e) => {
					console.log(e);
				});
		}

		updateTemplate(template) {
			return Gateway.invoke(this._updateTemplateEndpoint, template);
		}

		updateTemplateOrder(templates) {
			return Gateway.invoke(this._updateTemplateOrderEndpoint, templates);
		}

		deleteTemplate(template) {
			return Gateway.invoke(this._deleteTemplateEndpoint, template);
		}

		subscribeTemplates(query) {
			if (getSubscriber(this._templateSubscriberMap, query) !== null) {
				throw new Error('A template subscriber already exists');
			}

			const subscriber = new TemplateSubscriber(this, query);
			subscriber.start();

			putSubscriber(this._templateSubscriberMap, subscriber);

			return Disposable.fromAction(() => {
				deleteSubscriber(this._templateSubscriberMap, subscriber);

				subscriber.dispose();
			});
		}

		getTargets() {
			return Gateway.invoke(this._retrieveTargetsEndpoint);
		}

		getProperties() {
			return Gateway.invoke(this._retrievePropertiesEndpoint);
		}

		getOperators() {
			return Gateway.invoke(this._retrieveOperatorsEndpoint);
		}

		getModifiers() {
			return Gateway.invoke(this._retrieveModifiersEndpoint);
		}

		getPublisherTypes() {
			return Gateway.invoke(this._retrievePublisherTypesEndpoint);
		}

		getPublisherTypeDefaults(query) {
			return Gateway.invoke(this._retrievePublisherTypeDefaultsEndpoint, query);
		}

		assignPublisherTypeDefault(publisherTypeDefault) {
			return Gateway.invoke(this._assignPublisherTypeDefaultEndpoint, publisherTypeDefault);
		}

		deletePublisherTypeDefault(publisherTypeDefault) {
			return Gateway.invoke(this._deletePublisherTypeDefaultEndpoint, publisherTypeDefault);
		}

		getMarketDataConfiguration(query) {
			return Gateway.invoke(this._retrieveMarketDataConfigurationEndpoint, query);
		}

		assignMarketDataConfiguration(marketDataConfiguration) {
			return Gateway.invoke(this._assignMarketDataConfigurationEndpoint, marketDataConfiguration);
		}

		getUser() {
			return Gateway.invoke(this._retrieveUserEndpoint);
		}

		getServerVersion() {
			return Gateway.invoke(this._retrieveVersionEndpoint);
		}

		_onDispose() {
			getSubscribers(this._alertSubscriberMap).forEach((subscriber) => {
				subscriber.dispose();
			});

			getSubscribers(this._triggerSubscriberMap).forEach((subscriber) => {
				subscriber.dispose();
			});

			getSubscribers(this._templateSubscriberMap).forEach((subscriber) => {
				subscriber.dispose();
			});

			this._alertSubscriberMap = null;
			this._triggerSubscriberMap = null;
			this._templateSubscriberMap = null;

			this._scheduler.dispose();
			this._scheduler = null;
		}

		toString() {
			return '[AdapterForHttp]';
		}
	}

	function getSubscriber(subscribers, query) {
		const userId = query.user_id;
		const systemId = query.alert_system;

		let returnRef;

		if (subscribers.hasOwnProperty(userId) && subscribers[userId].hasOwnProperty(systemId)) {
			returnRef = subscribers[userId][systemId];
		} else {
			returnRef = null;
		}

		return returnRef;
	}

	function putSubscriber(subscribers, subscriber) {
		const query = subscriber.getQuery();

		const userId = query.user_id;
		const systemId = query.alert_system;

		if (!subscribers.hasOwnProperty(userId)) {
			subscribers[userId] = { };
		}

		subscribers[userId][systemId] = subscriber;
	}

	function deleteSubscriber(subscribers, subscriber) {
		const query = subscriber.getQuery();

		const userId = query.user_id;
		const systemId = query.alert_system;

		delete subscribers[userId][systemId];
	}

	function getSubscribers(subscribers) {
		return Object.keys(subscribers).reduce((array, userId) => {
			const systems = subscribers[userId];

			return array.concat(Object.keys(systems).map((systemId) => {
				return systems[systemId];
			}));
		}, [ ]);
	}

	class AlertSubscriber extends Disposable {
		constructor(parent, query) {
			super();

			this._parent = parent;

			this._query = query;
			this._alerts = { };

			this._started = false;
		}

		getQuery() {
			return this._query;
		}

		processAlerts(alerts) {
			const currentAlerts = array.indexBy(alerts, (alert) => alert.alert_id);

			const createdAlerts = Object.keys(currentAlerts)
				.filter((alertId) => !this._alerts.hasOwnProperty(alertId))
				.map((alertId) => currentAlerts[alertId]);

			const deletedAlerts = Object.keys(this._alerts)
				.filter((alertId) => !currentAlerts.hasOwnProperty(alertId))
				.map((alertId) => this._alerts[alertId]);

			const mutatedAlerts = alerts.filter((alert) => {
				let returnVal = true;

				const alertId = alert.alert_id;

				if (this._alerts.hasOwnProperty(alertId)) {
					const existing = this._alerts[alertId];

					returnVal = existing.alert_state !== alert.alert_state || existing.last_trigger_date !== alert.last_trigger_date;
				}

				return returnVal;
			});

			const triggeredAlerts = mutatedAlerts.filter((alert) => {
				let returnVal = false;

				const alertId = alert.alert_id;

				if (this._alerts.hasOwnProperty(alertId)) {
					const existing = this._alerts[alertId];

					returnVal = existing.last_trigger_date !== alert.last_trigger_date;
				}

				return returnVal;
			});

			createdAlerts.forEach((alert) => {
				this._alerts[alert.alert_id] = alert;
			});

			mutatedAlerts.forEach((alert) => {
				this._alerts[alert.alert_id] = alert;
			});

			deletedAlerts.forEach((alert) => {
				delete this._alerts[alert.alert_id];
			});

			createdAlerts.forEach((alert) => {
				this._parent._onAlertCreated(alert);
			});

			mutatedAlerts.forEach((alert) => {
				this._parent._onAlertMutated(alert);
			});

			deletedAlerts.forEach((alert) => {
				this._parent._onAlertDeleted(alert);
			});

			triggeredAlerts.forEach((alert) => {
				this._parent._onAlertTriggered(alert);
			});
		}

		start() {
			if (this._started) {
				throw new Error('The alert subscriber has already been started.');
			}

			if (this.getIsDisposed()) {
				throw new Error('The alert subscriber has been disposed.');
			}

			this._started = true;

			const poll = (delay) => {
				if (!this._started) {
					return;
				}

				this._parent._scheduler.schedule(() => {
					return this._parent.retrieveAlerts(this._query)
						.catch((e) => {

						}).then(() => {
							poll(delay || 5000);
						});
				}, delay);
			};

			poll(0);
		}

		_onDispose() {
			this._started = false;
		}

		toString() {
			return '[AdapterForHttp.AlertSubscriber]';
		}
	}

	class TriggerSubscriber extends Disposable {
		constructor(parent, query) {
			super();

			this._parent = parent;

			this._query = query;
			this._triggers = { };

			this._started = false;
		}

		getQuery() {
			return this._query;
		}

		processTriggers(triggers) {
			const extractKey = (trigger) => `${trigger.alert_id}-${trigger.trigger_date}`;

			const currentTriggers = array.indexBy(triggers, (trigger) => extractKey(trigger));

			const createdTriggers = Object.keys(currentTriggers)
				.filter((key) => !this._triggers.hasOwnProperty(key))
				.map((key) => currentTriggers[key]);

			const deletedTriggers = Object.keys(this._triggers)
				.filter((key) => !currentTriggers.hasOwnProperty(key))
				.map((key) => this._triggers[key]);

			const mutatedTriggers = triggers.filter((trigger) => {
				let returnVal = true;

				const key = extractKey(trigger);

				if (this._triggers.hasOwnProperty(key)) {
					const existing = this._triggers[key];

					returnVal = existing.trigger_status !== trigger.trigger_status || existing.trigger_status_date !== trigger.trigger_status_date;
				}

				return returnVal;
			});

			createdTriggers.forEach((trigger) => {
				this._triggers[extractKey(trigger)] = trigger;
			});

			mutatedTriggers.forEach((trigger) => {
				this._triggers[extractKey(trigger)] = trigger;
			});

			deletedTriggers.forEach((trigger) => {
				delete this._triggers[extractKey(trigger)];
			});

			if (createdTriggers.length > 0) {
				this._parent._onTriggersCreated(createdTriggers);
			}

			if (mutatedTriggers.length > 0) {
				this._parent._onTriggersMutated(mutatedTriggers);
			}

			if (deletedTriggers.length > 0) {
				this._parent._onTriggersDeleted(deletedTriggers);
			}
		}

		start() {
			if (this._started) {
				throw new Error('The trigger subscriber has already been started.');
			}

			if (this.getIsDisposed()) {
				throw new Error('The trigger subscriber has been disposed.');
			}

			this._started = true;

			const poll = (delay) => {
				if (!this._started) {
					return;
				}

				this._parent._scheduler.schedule(() => {
					return this._parent.retrieveTriggers(this._query)
						.catch((e) => {

						}).then(() => {
							poll(delay || 5000);
						});
				}, delay);
			};

			poll(0);
		}

		_onDispose() {
			this._started = false;
		}

		toString() {
			return '[AdapterForHttp.TriggerSubscriber]';
		}
	}

	class TemplateSubscriber extends Disposable {
		constructor(parent, query) {
			super();

			this._parent = parent;

			this._query = query;
			this._templates = { };

			this._started = false;
		}

		getQuery() {
			return this._query;
		}

		processTemplates(templates) {
			const currentTemplates = array.indexBy(templates, (template) => template.template_id);

			const createdTemplates = Object.keys(currentTemplates)
				.filter((templateId) => !this._templates.hasOwnProperty(templateId))
				.map((templateId) => currentTemplates[templateId]);

			const deletedTemplates = Object.keys(this._templates)
				.filter((templateId) => !currentTemplates.hasOwnProperty(templateId))
				.map((templateId) => this._templates[templateId]);

			const mutatedTemplates = templates.filter((template) => {
				let returnVal = true;

				const templateId = template.template_id;

				if (this._templates.hasOwnProperty(templateId)) {
					const existing = this._templates[templateId];

					returnVal = existing.version !== template.version;
				}

				return returnVal;
			});

			createdTemplates.forEach((template) => {
				this._templates[template.template_id] = template;
			});

			mutatedTemplates.forEach((template) => {
				this._templates[template.template_id] = template;
			});

			deletedTemplates.forEach((template) => {
				delete this._templates[template.template_id];
			});

			createdTemplates.forEach((template) => {
				this._parent._onTemplateCreated(template);
			});

			mutatedTemplates.forEach((template) => {
				this._parent._onTemplateMutated(template);
			});

			deletedTemplates.forEach((template) => {
				this._parent._onTemplateDeleted(template);
			});
		}

		start() {
			if (this._started) {
				throw new Error('The template subscriber has already been started.');
			}

			if (this.getIsDisposed()) {
				throw new Error('The template subscriber has been disposed.');
			}

			this._started = true;

			const poll = (delay) => {
				if (!this._started) {
					return;
				}

				this._parent._scheduler.schedule(() => {
					return this._parent.retrieveTemplates(this._query)
						.catch((e) => {

						}).then(() => {
							poll(delay || 5000);
						});
				}, delay);
			};

			poll(0);
		}

		_onDispose() {
			this._started = false;
		}

		toString() {
			return '[AdapterForHttp.TemplateSubscriber]';
		}
	}

	function getRequestInterceptorForJwt() {
		return RequestInterceptor.fromDelegate((options, endpoint) => {
			const getFailure = (e) => {
				const failure = FailureReason.forRequest({ endpoint: endpoint })
					.addItem(FailureType.REQUEST_IDENTITY_FAILURE)
					.format();

				return Promise.reject(failure);
			};

			if (this._jwtProvider === null) {
				return Promise.reject(getFailure());
			}

			return this._jwtProvider.getToken()
				.then((token) => {
					options.headers = options.headers || { };
					options.headers.Authorization = `Bearer ${token}`;

					return options;
				}).catch((e) => {
					return Promise.reject(getFailure(e));
				});
		});
	}

	return AdapterForHttp;
})();
