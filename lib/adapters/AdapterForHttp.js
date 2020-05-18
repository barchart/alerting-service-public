const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable');

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
		constructor(host, port, secure, onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered) {
			super(host, port, secure, onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered);

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

			this._createEndpoint = EndpointBuilder.for('create-alert', 'Create alert')
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

			this._retrieveEndpoint = EndpointBuilder.for('query', 'Query')
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

			this._queryEndpoint = EndpointBuilder.for('query', 'Query')
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

			this._updateEndpoint = EndpointBuilder.for('update-alert', 'Update alert')
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

			this._deleteEndpoint = EndpointBuilder.for('delete-alert', 'Delete alert')
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

			this._userEndpoint = EndpointBuilder.for('get-user', 'Get user')
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

			this._versionEndpoint = EndpointBuilder.for('get-version', 'Get version')
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

			this._subscribers = { };
		}

		connect(jwtProvider) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsOptional(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');

					this._jwtProvider = jwtProvider;

					return this.getServerVersion()
						.then(() => {
							return Promise.resolve(this);
						}).catch((e) => {
							return Promise.reject(`Unable to connect to server using HTTP adapter [ ${this.host} ] [ ${this.port} ] [ ${this.secure} ]`);
						});
				});


		}

		createAlert(alert) {
			return Gateway.invoke(this._createEndpoint, alert);
		}

		retrieveAlert(alert) {
			return Gateway.invoke(this._retrieveEndpoint, alert);
		}

		updateAlert(alert) {
			return Gateway.invoke(this._updateEndpoint, alert);
		}

		updateAlertsForUser(query) {
			return Gateway.invoke(this._updateAlertsForUserEndpoint, query);
		}

		deleteAlert(alert) {
			return Gateway.invoke(this._deleteEndpoint, alert);
		}

		retrieveAlerts(query) {
			return Gateway.invoke(this._queryEndpoint, query)
				.then((alerts) => {
					const subscriber = getSubscriber(this._subscribers, query);

					if (subscriber) {
						const clones = alerts.map((alert) => {
							return Object.assign(alert);
						});

						subscriber.processAlerts(clones);
					}

					return alerts;
				}).catch((e) => {
					console.log(e);
				});
		}

		subscribeAlerts(query) {
			if (getSubscriber(this._subscribers, query) !== null) {
				throw new Error('A subscriber already exists');
			}

			const subscriber = new AlertSubscriber(this, query);
			subscriber.start();

			putSubscriber(this._subscribers, subscriber);

			return Disposable.fromAction(() => {
				deleteSubscriber(this._subscribers, subscriber);

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

		getMarketDataConfiguration(query) {
			return Gateway.invoke(this._retrieveMarketDataConfigurationEndpoint, query);
		}

		assignMarketDataConfiguration(marketDataConfiguration) {
			return Gateway.invoke(this._assignMarketDataConfigurationEndpoint, marketDataConfiguration);
		}

		getUser() {
			return Gateway.invoke(this._userEndpoint);
		}

		getServerVersion() {
			return Gateway.invoke(this._versionEndpoint);
		}

		_onDispose() {
			getSubscribers(this._subscribers).forEach((subscriber) => {
				subscriber.dispose();
			});

			this._subscribers = null;

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

			this._started = true;

			const poll = (delay) => {
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