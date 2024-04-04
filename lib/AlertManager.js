const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	Event = require('@barchart/common-js/messaging/Event'),
	object = require('@barchart/common-js/lang/object'),
	promise = require('@barchart/common-js/lang/promise'),
	TimeMap = require('@barchart/common-js/collections/specialized/TimeMap');

const EndpointBuilder = require('@barchart/common-js/api/http/builders/EndpointBuilder'),
	ErrorInterceptor = require('@barchart/common-js/api/http/interceptors/ErrorInterceptor'),
	Gateway = require('@barchart/common-js/api/http/Gateway'),
	ProtocolType = require('@barchart/common-js/api/http/definitions/ProtocolType'),
	ResponseInterceptor = require('@barchart/common-js/api/http/interceptors/ResponseInterceptor'),
	VerbType = require('@barchart/common-js/api/http/definitions/VerbType');

const convertBaseCodeToUnitCode = require('@barchart/marketdata-api-js/lib/utilities/convert/baseCodeToUnitCode'),
	formatPrice = require('@barchart/marketdata-api-js/lib/utilities/format/price'),
	valueParser = require('@barchart/marketdata-api-js/lib/utilities/parse/ddf/value');

const validate = require('./data/validators/validate');

const AdapterBase = require('./adapters/AdapterBase'),
	JwtProvider = require('./security/JwtProvider');

const Configuration = require('./common/Configuration');

const version = require('./meta').version;

module.exports = (() => {
	'use strict';

	const DEFAULT_SECURE_PORT = 443;

	/**
	 * The **central component of the SDK**, responsible for connecting to Barchart's Alerting
	 * Service, creating new alerts, querying existing alerts, and monitoring the status of
	 * existing alerts.
	 *
	 * @public
	 * @exported
	 * @extends {Disposable}
	 * @param {String} host - Barchart Alerting Service's hostname.
	 * @param {Number} port - Barchart Alerting Service's TCP port number.
	 * @param {Boolean} secure - If true, the transport layer will use encryption (e.g. HTTPS, WSS, etc).
	 * @param {Function} adapterClazz - The transport strategy. Specifically, the constructor function for a class extending {@link AdapterBase}.
	 */
	class AlertManager extends Disposable {
		constructor(host, port, secure, adapterClazz) {
			super();

			assert.argumentIsRequired(host, 'host', String);
			assert.argumentIsRequired(port, 'port', Number);
			assert.argumentIsRequired(secure, 'secure', Boolean);
			assert.argumentIsRequired(adapterClazz, 'adapterClazz', Function);

			if (!is.extension(AdapterBase, adapterClazz)) {
				throw new Error('The "adapterClazz" argument must be the constructor for a class which extends AdapterBase.');
			}

			this._host = host;
			this._port = port;
			this._secure = secure;

			this._adapter = null;
			this._adapterClazz = adapterClazz;

			this._connectPromise = null;

			this._alertSubscriptionMap = { };
			this._triggerSubscriptionMap = { };
			this._templateSubscriptionMap = { };

			this._connectionChangedEvent = new Event(this);
		}

		/**
		 * Attempts to establish a connection to the backend. This function should be invoked
		 * immediately following instantiation. Once the resulting promise resolves, a
		 * connection has been established and other instance methods can be used.
		 *
		 * @public
		 * @async
		 * @param {JwtProvider} jwtProvider - Your implementation of {@link JwtProvider}.
		 * @returns {Promise<AlertManager>}
		 */
		async connect(jwtProvider) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');

					checkDispose(this, 'connect');
				}).then(() => {
					if (this._connectPromise === null) {
						const alertAdapterPromise = Promise.resolve()
							.then(() => {
								const AdapterClazz = this._adapterClazz;
								const adapter = new AdapterClazz(this._host, this._port, this._secure, onAlertCreated.bind(this), onAlertMutated.bind(this), onAlertDeleted.bind(this), onAlertTriggered.bind(this), onTriggersCreated.bind(this), onTriggersMutated.bind(this), onTriggersDeleted.bind(this), onTemplateCreated.bind(this), onTemplateMutated.bind(this), onTemplateDeleted.bind(this), onConnectionStatusChanged.bind(this));

								return promise.timeout(adapter.connect(jwtProvider), 10000, 'Alert service is temporarily unavailable. Please try again later.');
							});

						this._connectPromise = Promise.all([alertAdapterPromise])
							.then((results) => {
								this._adapter = results[0];

								return this;
							}).catch((e) => {
								this._connectPromise = null;

								throw e;
							});
					}

					return this._connectPromise;
				});
		}

		/**
		 * Registers a callback which will be invoked when the status of the
		 * connection to the remote service changes. The callback will be invoked
		 * with one of four possible values: connecting, connected, disconnecting,
		 * disconnected.
		 *
		 * @public
		 * @param {Callbacks.ConnectionStatusChangedCallback} connectionStatusChangedCallback
		 * @returns {Disposable}
		 */
		subscribeConnectionStatus(connectionStatusChangedCallback) {
			return this._connectionChangedEvent.register(connectionStatusChangedCallback);
		}

		/**
		 * Gets a single alert by its identifier.
		 *
		 * @public
		 * @async
		 * @param {Schema.Alert|Schema.AlertIdentifier} alert
		 * @returns {Promise<Schema.Alert>}
		 */
		async retrieveAlert(alert) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'retrieve alert');

					validate.alert.forQuery(alert);
				}).then(() => {
					return this._adapter.retrieveAlert(alert);
				});
		}

		/**
		 * Gets a set of alerts, matching query criteria.
		 *
		 * @public
		 * @async
		 * @param {Schema.AlertQuery} query
		 * @returns {Promise<Schema.Alert[]>}
		 */
		async retrieveAlerts(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'retrieve alerts');

					validate.alert.forUser(query);
				}).then(() => {
					return this._adapter.retrieveAlerts(query);
				}).then((results) => {
					if (query.filter && query.filter.alert_type) {
						return results.filter((result) => result.alert_type === query.filter.alert_type);
					} else {
						return results;
					}
				}).then((results) => {
					if (query.filter && query.filter.symbol) {
						return results.filter((result) => result.conditions.some((c) => (c.property.target.type === 'symbol' && c.property.target.identifier ===  query.filter.symbol) || (c.property.type === 'symbol' && c.operator.operand === query.filter.symbol)));
					} else {
						return results;
					}
				}).then((results) => {
					if (query.filter && query.filter.target && query.filter.target.identifier) {
						return results.filter((result) => result.conditions.some((c) => c.property.target.identifier === query.filter.target.identifier));
					} else {
						return results;
					}
				}).then((results) => {
					if (query.filter && query.filter.condition && (typeof(query.filter.condition.operand) === 'string' || typeof(query.filter.condition.operand) === 'number')) {
						return results.filter((result) => result.conditions.some((c) => c.operator.operand === query.filter.condition.operand.toString()));
					} else {
						return results;
					}
				});
		}

		/**
		 * Registers four separate callbacks which will be invoked when alerts are created,
		 * deleted, changed, or triggered. Soon after a subscription is first established, all
		 * existing alerts will be sent to the "change" callback.
		 *
		 * @public
		 * @param {Object} query
		 * @param {String} query.user_id
		 * @param {String} query.alert_system
		 * @param {Callbacks.AlertMutatedCallback} changeCallback
		 * @param {Callbacks.AlertDeletedCallback} deleteCallback
		 * @param {Callbacks.AlertCreatedCallback} createCallback
		 * @param {Callbacks.AlertTriggeredCallback} triggerCallback
		 * @returns {Disposable}
		 */
		subscribeAlerts(query, changeCallback, deleteCallback, createCallback, triggerCallback) {
			checkStatus(this, 'subscribe alerts');

			validate.alert.forUser(query);

			assert.argumentIsRequired(changeCallback, 'changeCallback', Function);
			assert.argumentIsRequired(deleteCallback, 'deleteCallback', Function);
			assert.argumentIsRequired(createCallback, 'createCallback', Function);
			assert.argumentIsRequired(triggerCallback, 'triggerCallback', Function);

			const userId = query.user_id;
			const alertSystem = query.alert_system;

			if (!this._alertSubscriptionMap.hasOwnProperty(userId)) {
				this._alertSubscriptionMap[userId] = {};
			}

			if (!this._alertSubscriptionMap[userId].hasOwnProperty(alertSystem)) {
				this._alertSubscriptionMap[userId][alertSystem] = {
					createEvent: new Event(this),
					changeEvent: new Event(this),
					deleteEvent: new Event(this),
					triggerEvent: new Event(this),
					subscribers: 0
				};
			}

			const subscriptionData = this._alertSubscriptionMap[userId][alertSystem];

			if (subscriptionData.subscribers === 0) {
				subscriptionData.implementationBinding = this._adapter.subscribeAlerts(query);
			}

			subscriptionData.subscribers = subscriptionData.subscribers + 1;

			const createRegistration = subscriptionData.createEvent.register(createCallback);
			const changeRegistration = subscriptionData.changeEvent.register(changeCallback);
			const deleteRegistration = subscriptionData.deleteEvent.register(deleteCallback);
			const triggerRegistration = subscriptionData.triggerEvent.register(triggerCallback);

			return Disposable.fromAction(() => {
				subscriptionData.subscribers = subscriptionData.subscribers - 1;

				if (subscriptionData.subscribers === 0) {
					subscriptionData.implementationBinding.dispose();
				}

				createRegistration.dispose();
				changeRegistration.dispose();
				deleteRegistration.dispose();
				triggerRegistration.dispose();
			});
		}

		/**
		 * Creates a new alert.
		 *
		 * @public
		 * @async
		 * @param {Schema.Alert} alert
		 * @returns {Promise<Schema.Alert>}
		 */
		async createAlert(alert) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'create alert');

					validate.alert.forCreate(alert);
				}).then(() => {
					return Promise.all([
						this.getProperties(),
						this.getOperators()
					]);
				}).then((results) => {
					const properties = results[0];
					const operators = results[1];

					const propertyMap = alert.conditions.reduce((map, c) => {
						const property = properties.find((p) => p.property_id === c.property.property_id);

						map[property.property_id] = property;

						return map;
					}, { });

					const operatorMap = alert.conditions.reduce((map, c) => {
						const operator = operators.find((o) => o.operator_id === c.operator.operator_id);

						map[operator.operator_id] = operator;

						return map;
					}, { });

					const instrumentMap = alert.conditions.reduce((map, c) => {
						const property = propertyMap[c.property.property_id];

						if (property.target.type === 'symbol') {
							const symbol = c.property.target.identifier;

							if (!map.hasOwnProperty(symbol)) {
								map[symbol] = lookupInstrument(symbol, alert.alert_system);
							}
						}

						return map;
					}, { });

					return Promise.all(alert.conditions.map((c, i) => {
						let validatePromise;

						const property = propertyMap[c.property.property_id];
						const operator = operatorMap[c.operator.operator_id];

						if (property.target.type === 'symbol') {
							const symbol = c.property.target.identifier;

							validatePromise = instrumentMap[symbol]
								.then((result) => {
									const instrument = result.instrument;

									validate.instrument.forCreate(symbol, instrument, property);

									if (property.format === 'price' && operator.operand_type === 'number' && operator.operand_literal) {
										let operandToParse = c.operator.operand;

										if (is.string(operandToParse) && operandToParse.match(/^(-?)([0-9,]+)$/) !== null) {
											operandToParse = operandToParse + '.0';
										}

										const unitcode = convertBaseCodeToUnitCode(instrument.unitcode);
										const price = valueParser(operandToParse, unitcode, ',');

										if (!is.number(price)) {
											throw new Error('Condition [' + i + '] is invalid. The price cannot be parsed.');
										}

										c.operator.operand_display = c.operator.operand;
										c.operator.operand_format = formatPrice(price, unitcode, '-', false, ',');
										c.operator.operand = price;
									}
								});
						} else {
							validatePromise = Promise.resolve();
						}

						return validatePromise;
					}));
				}).then(() => {
					return this._adapter.createAlert(alert);
				});
		}

		/**
		 * Performs a synthetic update operation on an existing alert. The
		 * existing alert is deleted. Then, a new alert is created in its
		 * place. The new alert will have the same identifier.
		 *
		 * @public
		 * @async
		 * @param {Schema.Alert} alert
		 * @returns {Promise<Schema.Alert>}
		 */
		async editAlert(alert) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'edit alert');

					validate.alert.forEdit(alert);
				}).then(() => {
					return this.deleteAlert(alert);
				}).then(() => {
					return this.createAlert(alert);
				});
		}

		/**
		 * Deletes an existing alert.
		 *
		 * @public
		 * @async
		 * @param {Schema.Alert} alert
		 * @returns {Promise<Schema.Alert>}
		 */
		async deleteAlert(alert) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'delete alert');

					validate.alert.forQuery(alert);
				}).then(() => {
					return this._adapter.deleteAlert({alert_id: alert.alert_id});
				});
		}

		/**
		 * Sends a request to transition an alert to the ```Active``` state.
		 *
		 * @public
		 * @async
		 * @param {Schema.Alert|Schema.AlertIdentifier} alert
		 * @returns {Promise<Schema.Alert>}
		 */
		async enableAlert(alert) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'enable alert');

					validate.alert.forQuery(alert);
				}).then(() => {
					const clone = Object.assign({ }, alert);
					clone.alert_state = 'Starting';

					onAlertMutated.call(this, clone);

					return this._adapter.updateAlert({alert_id: alert.alert_id, alert_state: 'Starting'});
				});
		}

		/**
		 * Sends a request to transition all alerts owned by a user to the ```Active``` state.
		 *
		 * @public
		 * @async
		 * @param {Schema.AlertQuery} query
		 * @returns {Promise<Boolean>}
		 */
		async enableAlerts(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'enable alerts');

					validate.alert.forUser(query);

					return this._adapter.updateAlertsForUser({user_id: query.user_id, alert_system: query.alert_system, alert_state: 'Starting'});
				}).then(() => {
					return true;
				});
		}

		/**
		 * Sends a request to transition an alert to the ```Inactive``` state.
		 *
		 * @public
		 * @async
		 * @param {Schema.Alert|Schema.AlertIdentifier} alert
		 * @returns {Promise<Schema.Alert>}
		 */
		async disableAlert(alert) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'disable alert');

					validate.alert.forQuery(alert);
				}).then(() => {
					const clone = Object.assign({ }, alert);
					clone.alert_state = 'Stopping';

					onAlertMutated.call(this, clone);

					return this._adapter.updateAlert({alert_id: alert.alert_id, alert_state: 'Stopping'});
				});
		}

		/**
		 * Sends a request to transition all alerts owned by a user to the ```Inactive``` state.
		 *
		 * @public
		 * @async
		 * @param {Schema.AlertQuery} query
		 * @returns {Promise<Boolean>}
		 */
		async disableAlerts(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'disable alerts');

					validate.alert.forUser(query);

					return this._adapter.updateAlertsForUser({user_id: query.user_id, alert_system: query.alert_system, alert_state: 'Stopping'});
				}).then(() => {
					return true;
				});
		}

		/**
		 * Gets a set of alert triggers, matching query criteria.
		 *
		 * @public
		 * @async
		 * @param {Object} query
		 * @param {String} query.user_id
		 * @param {String} query.alert_system
		 * @param {String=} query.trigger_date
		 * @param {String=} query.trigger_status
		 * @returns {Promise<Schema.Trigger[]>}
		 */
		async retrieveTriggers(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'retrieve alert triggers');

					validate.trigger.forQuery(query);
				}).then(() => {
					return this._adapter.retrieveTriggers(query);
				});
		}

		/**
		 * Registers three separate callbacks which will be invoked when triggers are created,
		 * deleted, changed. Soon after a subscription is first established, all existing
		 * triggers will be sent to the "change" callback.
		 *
		 * @public
		 * @param {Object} query
		 * @param {String} query.user_id
		 * @param {String} query.alert_system
		 * @param {Callbacks.TriggersMutatedCallback} changeCallback
		 * @param {Callbacks.TriggersDeletedCallback} deleteCallback
		 * @param {Callbacks.TriggersCreatedCallback} createCallback
		 * @returns {Disposable}
		 */
		subscribeTriggers(query, changeCallback, deleteCallback, createCallback) {
			checkStatus(this, 'subscribe triggers');

			validate.trigger.forUser(query);

			assert.argumentIsRequired(changeCallback, 'changeCallback', Function);
			assert.argumentIsRequired(deleteCallback, 'deleteCallback', Function);
			assert.argumentIsRequired(createCallback, 'createCallback', Function);

			const userId = query.user_id;
			const alertSystem = query.alert_system;

			if (!this._triggerSubscriptionMap.hasOwnProperty(userId)) {
				this._triggerSubscriptionMap[userId] = {};
			}

			if (!this._triggerSubscriptionMap[userId].hasOwnProperty(alertSystem)) {
				this._triggerSubscriptionMap[userId][alertSystem] = {
					createEvent: new Event(this),
					changeEvent: new Event(this),
					deleteEvent: new Event(this),
					subscribers: 0
				};
			}

			const subscriptionData = this._triggerSubscriptionMap[userId][alertSystem];

			if (subscriptionData.subscribers === 0) {
				subscriptionData.implementationBinding = this._adapter.subscribeTriggers(query);
			}

			subscriptionData.subscribers = subscriptionData.subscribers + 1;

			const createRegistration = subscriptionData.createEvent.register(createCallback);
			const changeRegistration = subscriptionData.changeEvent.register(changeCallback);
			const deleteRegistration = subscriptionData.deleteEvent.register(deleteCallback);

			return Disposable.fromAction(() => {
				subscriptionData.subscribers = subscriptionData.subscribers - 1;

				if (subscriptionData.subscribers === 0) {
					subscriptionData.implementationBinding.dispose();
				}

				createRegistration.dispose();
				changeRegistration.dispose();
				deleteRegistration.dispose();
			});
		}

		/**
		 * Updates the status (i.e. read/unread) for a single alert trigger.
		 *
		 * @public
		 * @async
		 * @param {Object} query
		 * @param {String} query.alert_id
		 * @param {String} query.trigger_date
		 * @param {String=} query.trigger_status
		 * @returns {Promise<Schema.Trigger>}
		 */
		async updateTrigger(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'updates alert trigger');

					validate.trigger.forUpdate(query);
				}).then(() => {
					return this._adapter.updateTrigger(query);
				});
		}

		/**
		 * Updates the status (i.e. read/unread) for all alert triggers which match
		 * the query criteria.
		 *
		 * @public
		 * @async
		 * @param {Object} query
		 * @param {String} query.user_id
		 * @param {String} query.alert_system
		 * @param {String=} query.trigger_status
		 * @returns {Promise<Schema.Trigger[]>}
		 */
		async updateTriggers(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'updates alert triggers');

					validate.trigger.forBatch(query);
				}).then(() => {
					return this._adapter.updateTriggers(query);
				});
		}

		/**
		 * Gets all templates owned by the current user.
		 *
		 * @public
		 * @async
		 * @param {Schema.TemplateQuery} query
		 * @returns {Promise<Schema.Template[]>}
		 */
		async retrieveTemplates(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get templates');

					validate.template.forUser(query);
				}).then(() => {
					return this._adapter.retrieveTemplates(query);
				});
		}

		/**
		 * Registers three separate callbacks which will be invoked when templates are created,
		 * deleted, or changed. Soon after a subscription is first established, all existing
		 * templates will be sent to the "change" callback.
		 *
		 * @public
		 * @param {Object} query
		 * @param {String} query.user_id
		 * @param {String} query.alert_system
		 * @param {Callbacks.TemplateMutatedCallback} changeCallback
		 * @param {Callbacks.TemplateDeletedCallback} deleteCallback
		 * @param {Callbacks.TemplateCreatedCallback} createCallback
		 * @returns {Disposable}
		 */
		subscribeTemplates(query, changeCallback, deleteCallback, createCallback) {
			checkStatus(this, 'subscribe templates');

			validate.template.forUser(query);

			assert.argumentIsRequired(changeCallback, 'changeCallback', Function);
			assert.argumentIsRequired(deleteCallback, 'deleteCallback', Function);
			assert.argumentIsRequired(createCallback, 'createCallback', Function);

			const userId = query.user_id;
			const alertSystem = query.alert_system;

			if (!this._templateSubscriptionMap.hasOwnProperty(userId)) {
				this._templateSubscriptionMap[userId] = {};
			}

			if (!this._templateSubscriptionMap[userId].hasOwnProperty(alertSystem)) {
				this._templateSubscriptionMap[userId][alertSystem] = {
					createEvent: new Event(this),
					changeEvent: new Event(this),
					deleteEvent: new Event(this),
					subscribers: 0
				};
			}

			const subscriptionData = this._templateSubscriptionMap[userId][alertSystem];

			if (subscriptionData.subscribers === 0) {
				subscriptionData.implementationBinding = this._adapter.subscribeTemplates(query);
			}

			subscriptionData.subscribers = subscriptionData.subscribers + 1;

			const createRegistration = subscriptionData.createEvent.register(createCallback);
			const changeRegistration = subscriptionData.changeEvent.register(changeCallback);
			const deleteRegistration = subscriptionData.deleteEvent.register(deleteCallback);

			return Disposable.fromAction(() => {
				subscriptionData.subscribers = subscriptionData.subscribers - 1;

				if (subscriptionData.subscribers === 0) {
					subscriptionData.implementationBinding.dispose();
				}

				createRegistration.dispose();
				changeRegistration.dispose();
				deleteRegistration.dispose();
			});
		}

		/**
		 * Creates a new template.
		 *
		 * @public
		 * @async
		 * @param {Schema.Template} template
		 * @returns {Promise<Schema.Template>}
		 */
		async createTemplate(template) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'create template');

					validate.template.forCreate(template);
				}).then(() => {
					return this._adapter.createTemplate(template);
				});
		}

		/**
		 * Update an existing template.
		 *
		 * @public
		 * @async
		 * @param {Schema.Template} template
		 * @returns {Promise<Schema.Template>}
		 */
		async updateTemplate(template) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'update template');

					validate.template.forUpdate(template);
				}).then(() => {
					return this._adapter.updateTemplate(template);
				});
		}

		/**
		 * Updates the sort_order property for one (or more) templates.
		 *
		 * @public
		 * @async
		 * @param {TemplateSortOrderDefinition[]} templates
		 * @returns {Promise<Schema.Template[]>}
		 */
		async updateTemplateOrder(templates) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'update template order');
				}).then(() => {
					return this._adapter.updateTemplateOrder({ templates });
				});
		}

		/**
		 * Deletes an existing template.
		 *
		 * @public
		 * @async
		 * @param {Schema.Template} template
		 * @returns {Promise<Schema.Template>}
		 */
		async deleteTemplate(template) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'delete template');

					validate.template.forQuery(template);
				}).then(() => {
					return this._adapter.deleteTemplate({ template_id: template.template_id });
				});
		}

		/**
		 * When constructing alert conditions, we often refer to a stock by
		 * its symbol. This function will validate the symbol before you
		 * attempt to assign it to the ```identifier``` property of a
		 * ```Target``` object. In some cases, an alternate (alias) symbol
		 * will be returned. If the symbol returned is different, you must
		 * use the alternate symbol.
		 *
		 * @public
		 * @async
		 * @param {String} symbol - The value intended to be assigned to the `property.target.identifier` attribute of a condition.
		 * @param {String=} alertSystem - The value intended to be assigned to the `alert.alert_system` attribute of an alert (some symbols are considered invalid given the user's domain).
		 * @returns {Promise<String>}
		 */
		async checkSymbol(symbol, alertSystem) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'check symbol');

					assert.argumentIsRequired(symbol, 'symbol', String);
					assert.argumentIsOptional(alertSystem, 'alertSystem', String);

					return lookupInstrument(symbol, alertSystem || null);
				}).then((result) => {
					validate.instrument.forCreate(symbol, result.instrument);

					return result.instrument.symbol;
				});
		}

		/**
		 * Retrieves the entire list of targets which are available to the
		 * system.
		 *
		 * @public
		 * @async
		 * @returns {Promise<Schema.Target[]>}
		 */
		async getTargets() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get targets');

					return this._adapter.getTargets();
				});
		}

		/**
		 * Retrieves the entire list of properties which are available to the
		 * system.
		 *
		 * @public
		 * @async
		 * @returns {Promise<Schema.Property[]>}
		 */
		async getProperties() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get properties');

					return this._adapter.getProperties();
				});
		}

		/**
		 * Retrieves the entire list of operators which are available to the
		 * system.
		 *
		 * @public
		 * @async
		 * @returns {Promise<Schema.Operator[]>}
		 */
		async getOperators() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get operators');

					return this._adapter.getOperators();
				});
		}

		async getModifiers() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get modifiers');

					return this._adapter.getModifiers();
				});
		}

		/**
		 * Retrieves the entire list of strategies that can be used to notify
		 * users when an alert is triggered.
		 *
		 * @public
		 * @async
		 * @returns {Promise<Schema.PublisherType[]>}
		 */
		async getPublisherTypes() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get publisher types');

					return this._adapter.getPublisherTypes();
				});
		}

		/**
		 * Retrieves the notification preferences for a user.
		 *
		 * @public
		 * @async
		 * @param {Object} query
		 * @param {String} query.user_id
		 * @param {String} query.alert_system
		 * @returns {Promise<Schema.PublisherTypeDefault[]>}
		 */
		async getPublisherTypeDefaults(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get publisher type defaults');

					validate.publisherTypeDefault.forUser(query);
				}).then(() => {
					return this._adapter.getPublisherTypeDefaults(query);
				});
		}

		/**
		 * Saves a user's notification preferences for a single notification strategy (e.g. email
		 * or text message).
		 *
		 * @public
		 * @async
		 * @param {Schema.PublisherTypeDefault} publisherTypeDefault
		 * @returns {Promise<Schema.PublisherTypeDefault>}
		 */
		async assignPublisherTypeDefault(publisherTypeDefault) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'assign publisher type default');

					validate.publisherTypeDefault.forCreate(publisherTypeDefault);
				}).then(() => {
					return this._adapter.assignPublisherTypeDefault(publisherTypeDefault);
				});
		}

		/**
		 * Removes a user's notification preferences for a single notification strategy (e.g. email
		 * or text message).
		 *
		 * @public
		 * @async
		 * @param {Schema.PublisherTypeDefault} publisherTypeDefault
		 * @returns {Promise<Schema.PublisherTypeDefault>}
		 */
		async deletePublisherTypeDefault(publisherTypeDefault) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'clear publisher type default');

					validate.publisherTypeDefault.forClear(publisherTypeDefault);
				}).then(() => {
					const payload = { };

					payload.user_id = publisherTypeDefault.user_id;
					payload.alert_system = publisherTypeDefault.alert_system;
					payload.publisher_type_id = publisherTypeDefault.publisher_type_id;

					return this._adapter.deletePublisherTypeDefault(payload);
				});
		}

		async getMarketDataConfiguration(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get market data configuration');
				}).then(() => {
					return this._adapter.getMarketDataConfiguration(query);
				});
		}

		async assignMarketDataConfiguration(marketDataConfiguration) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'assign market data configuration');
				}).then(() => {
					return this._adapter.assignMarketDataConfiguration(marketDataConfiguration);
				});
		}

		/**
		 * Returns the version number of the remote service you are connected to.
		 *
		 * @public
		 * @async
		 * @returns {Promise<String>}
		 */
		async getServerVersion() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get server version');
				}).then(() => {
					return this._adapter.getServerVersion();
				});
		}

		/**
		 * Returns the current user (according to the JWT which is embedded
		 * in the request).
		 *
		 * @public
		 * @async
		 * @returns {Promise<Schema.UserIdentifier>}
		 */
		async getUser() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get authenticated user');
				}).then(() => {
					return this._adapter.getUser();
				});
		}

		/**
		 * Creates an alert object from template and symbol identifier.
		 *
		 * @public
		 * @static
		 * @param {Schema.Template} template
		 * @param {String} symbol
		 * @param {Schema.Alert=} alert
		 * @returns {Promise<Schema.Alert>}
		 */
		static createAlertFromTemplate(template, symbol, alert) {
			const newAlert = { };

			if (is.object(alert)) {
				const properties = [ 'alert_type', 'alert_behavior', 'user_notes' ];

				properties.forEach((property) => {
					if (alert.hasOwnProperty(property)) {
						newAlert[property] = object.clone(alert[property]);
					}
				});
			}

			if (template.user_id) {
				newAlert.user_id = template.user_id;
			}

			if (template.alert_system) {
				newAlert.alert_system = template.alert_system;
			}

			if (template.template_id) {
				newAlert.template_id = template.template_id;
			}

			newAlert.conditions = template.conditions.map((c) => {
				const condition = object.clone(c);

				const property = condition.property;

				property.target = { };
				property.target.identifier = symbol;

				return condition;
			});

			return newAlert;
		}

		/**
		 * Given an array of property objects, returns the properties which are valid for
		 * use with a given symbol.
		 *
		 * @public
		 * @static
		 * @async
		 * @ignore
		 * @param {Array<Object>} properties
		 * @param {String} symbol
		 * @param {Number=} target
		 * @param {String=} alertSystem
		 * @returns {Promise<Array<Object>>}
		 */
		static async filterPropertiesForSymbol(properties, symbol, target, alertSystem) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsArray(properties, properties);
					assert.argumentIsRequired(symbol, 'symbol', String);
					assert.argumentIsOptional(target, 'target', Number);
					assert.argumentIsOptional(alertSystem, 'alertSystem', String);

					return lookupInstrument(symbol, alertSystem || null)
						.then((result) => {
							return result.instrument;
						});
				}).then((instrument) => {
					return properties.filter((property) => {
						let valid = instrument !== null;

						if (valid && instrument.symbolType === 12) {
							valid = property.property_id > 0 && property.property_id < 9;
						}

						if (valid && instrument.symbolType === 34) {
							valid = false;
						}

						if (valid && (property.property_id === 238 || property.property_id === 239)) {
							valid = instrument.hasOptions && (instrument.symbolType === 1 || instrument.symbolType === 7 || instrument.symbolType === 9);
						}

						if (valid && is.number(target)) {
							valid = property.target.target_id === target;
						}

						return valid;
					});
				});
		}

		static getPropertiesForTarget(properties, target) {
			return properties.filter((property) => property.target.target_id === target.target_id);
		}

		static getOperatorsForProperty(operators, property) {
			const operatorMap = AlertManager.getOperatorMap(operators);

			return property.valid_operators.map((operatorId) => operatorMap[operatorId]);
		}

		static getPropertyTree(properties, short) {
			let descriptionSelector;

			if (is.boolean(short) && short) {
				descriptionSelector = p => p.descriptionShort;
			} else {
				descriptionSelector = p => p.description;
			}

			const root = properties.reduce((tree, property) => {
				const descriptionPath = (property.category || [ ]).concat(descriptionSelector(property) || [ ]);
				const descriptionPathLast = descriptionPath.length - 1;

				let node = tree;

				descriptionPath.forEach((description, i) => {
					node.items = node.items || [ ];

					let child = node.items.find((candidate) => candidate.description === description);

					if (!child) {
						let sortOrder;

						if (i === descriptionPathLast && typeof(property.sortOrder) === 'number') {
							sortOrder = property.sortOrder;
						} else {
							sortOrder = property.sortOrder;
						}

						child = {
							description: description,
							sortOrder: sortOrder
						};

						node.items.push(child);
					}

					node = child;
				});

				node.item = property;

				return tree;
			}, { });

			const sortTree = (node) => {
				if (!Array.isArray(node.items)) {
					return;
				}

				node.items.sort((a, b) => {
					let returnVal = a.sortOrder - b.sortOrder;

					if (returnVal === 0) {
						returnVal = a.description.localeCompare(b.description);
					}

					return returnVal;
				});

				node.items.forEach((child) => {
					sortTree(child);
				});
			};

			sortTree(root);

			return root.items;
		}

		static getPropertyMap(properties) {
			return array.indexBy(properties, (property) => property.property_id);
		}

		static getOperatorMap(operators) {
			return array.indexBy(operators, (operator) => operator.operator_id);
		}

		/**
		 * Given an array of template objects, returns the templates which are valid for
		 * use with a given symbol.
		 *
		 * @public
		 * @static
		 * @async
		 * @ignore
		 * @param {Array<Object>} templates
		 * @param {String} symbol
		 * @param {String=} alertSystem
		 * @returns {Promise<Array<Object>>}
		 */
		static async filterTemplatesForSymbol(templates, symbol, alertSystem) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsArray(templates, templates);
					assert.argumentIsRequired(symbol, 'symbol', String);
					assert.argumentIsOptional(alertSystem, 'alertSystem', String);

					return lookupInstrument(symbol, alertSystem || null)
						.then((result) => {
							return result.instrument;
						});
				}).then((instrument) => {
					return templates.filter((template) => {
						let valid = instrument !== null;

						const properties = template.conditions.map((condition) => {
							return condition.property.property_id;
						});

						if (valid && instrument.symbolType === 12) {
							valid = properties.every((p) => p > 0 && p < 9);
						}

						if (valid && instrument.symbolType === 34) {
							valid = false;
						}

						if (valid && properties.some(p => p === 238 || p === 239)) {
							valid = instrument.hasOptions && (instrument.symbolType === 1 || instrument.symbolType === 7 || instrument.symbolType === 9);
						}

						return valid;
					});
				});
		}

		/**
		 * Returns the version of the SDK.
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get version() {
			return version;
		}

		/**
		 * Creates and starts a new {@link AlertManager} for use in the private staging environment.
		 *
		 * @public
		 * @static
		 * @async
		 * @param {JwtProvider} jwtProvider
		 * @param {AdapterBase} adapterClazz
		 * @returns {Promise<AlertManager>}
		 */
		static async forStaging(jwtProvider, adapterClazz) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');
					assert.argumentIsRequired(adapterClazz, 'adapter', Function);

					return start(new AlertManager(Configuration.stagingHost, DEFAULT_SECURE_PORT, true, adapterClazz), jwtProvider);
				});
		}

		/**
		 * Creates and starts a new {@link AlertManager} for use in the private production environment.
		 *
		 * @public
		 * @static
		 * @async
		 * @param {JwtProvider} jwtProvider
		 * @param {AdapterBase} adapterClazz
		 * @returns {Promise<AlertManager>}
		 */
		static async forProduction(jwtProvider, adapterClazz) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');
					assert.argumentIsRequired(adapterClazz, 'adapter', Function);

					return start(new AlertManager(Configuration.productionHost, DEFAULT_SECURE_PORT, true, adapterClazz), jwtProvider);
				});
		}

		/**
		 * Creates and starts a new {@link AlertManager} for use in the private admin environment.
		 *
		 * @public
		 * @static
		 * @async
		 * @param {JwtProvider} jwtProvider
		 * @param {AdapterBase} adapterClazz
		 * @returns {Promise<AlertManager>}
		 */
		static async forAdmin(jwtProvider, adapterClazz) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');
					assert.argumentIsRequired(adapterClazz, 'adapter', Function);

					return start(new AlertManager(Configuration.adminHost, DEFAULT_SECURE_PORT, true, adapterClazz), jwtProvider);
				});
		}

		/**
		 * Creates and starts a new {@link AlertManager} for use in the private demo environment.
		 *
		 * @public
		 * @static
		 * @async
		 * @param {JwtProvider} jwtProvider
		 * @param {AdapterBase} adapterClazz
		 * @returns {Promise<AlertManager>}
		 */
		static async forDemo(jwtProvider, adapterClazz) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');
					assert.argumentIsRequired(adapterClazz, 'adapter', Function);

					return start(new AlertManager(Configuration.demoHost, DEFAULT_SECURE_PORT, true, adapterClazz), jwtProvider);
				});
		}

		_onDispose() {
			if (this._adapter) {
				this._adapter.dispose();
				this._adapter = null;
			}

			this._alertSubscriptionMap = null;
			this._triggerSubscriptionMap = null;
			this._templateSubscriptionMap = null;

			this._connectionChangedEvent = null;
		}

		toString() {
			return '[AlertManager]';
		}
	}

	function start(gateway, jwtProvider) {
		return gateway.connect(jwtProvider)
			.then(() => {
				return gateway;
			});
	}

	function getMutationEvents(map, alert) {
		let returnRef = null;

		const userId = alert.user_id;
		const alertSystem = alert.alert_system;

		if (map.hasOwnProperty(userId)) {
			const systemMap = map[userId];

			if (systemMap.hasOwnProperty(alertSystem)) {
				returnRef = systemMap[alertSystem];
			}
		}

		return returnRef;
	}

	function checkDispose(manager, operation) {
		if (manager.getIsDisposed()) {
			throw new Error(`Unable to perform ${operation}, the alert manager has been disposed`);
		}
	}

	function checkStatus(manager, operation) {
		checkDispose(manager, operation);

		if (manager._adapter === null) {
			throw new Error(`Unable to perform ${operation}, the alert manager has not connected to the server`);
		}
	}

	function onAlertCreated(alert) {
		if (!alert) {
			return;
		}

		const data = getMutationEvents(this._alertSubscriptionMap, alert);

		if (data) {
			try {
				data.createEvent.fire(cloneAlert(alert));
			} catch (e) {
				console.error('An error was thrown by a subscriber of the alert creation event.', e);
			}
		}
	}

	function onAlertMutated(alert) {
		if (!alert) {
			return;
		}

		const data = getMutationEvents(this._alertSubscriptionMap, cloneAlert(alert));

		if (data) {
			try {
				data.changeEvent.fire(alert);
			} catch (e) {
				console.error('An error was thrown by a subscriber of the alert mutation event.', e);
			} 
		}
	}

	function onAlertDeleted(alert) {
		if (!alert) {
			return;
		}

		const data = getMutationEvents(this._alertSubscriptionMap, cloneAlert(alert));

		if (data) {
			try {
				data.deleteEvent.fire(alert);
			} catch (e) {
				console.error('An error was thrown by a subscriber of the alert deletion event.', e);
			}
		}
	}

	function onAlertTriggered(alert) {
		if (!alert) {
			return;
		}

		const data = getMutationEvents(this._alertSubscriptionMap, cloneAlert(alert));

		if (data) {
			try {
				data.triggerEvent.fire(alert);
			} catch (e) {
				console.error('An error was thrown by a subscriber of the alert trigger event.', e);
			}
		}
	}

	function onTemplateCreated(template) {
		if (!template) {
			return;
		}

		const data = getMutationEvents(this._templateSubscriptionMap, template);

		if (data) {
			try {
				data.createEvent.fire(template);
			} catch (e) {
				console.error('An error was thrown by a subscriber of the template creation event.', e);
			}
		}
	}

	function onTemplateMutated(template) {
		if (!template) {
			return;
		}

		const data = getMutationEvents(this._templateSubscriptionMap, template);

		if (data) {
			try {
				data.changeEvent.fire(template);
			} catch (e) {
				console.error('An error was thrown by a subscriber of the template mutation event.', e);
			}
		}
	}

	function onTemplateDeleted(template) {
		if (!template) {
			return;
		}

		const data = getMutationEvents(this._templateSubscriptionMap, template);

		if (data) {
			try {
				data.deleteEvent.fire(template);
			} catch (e) {
				console.error('An error was thrown by a subscriber of the template deletion event.', e);
			}
		}
	}

	function onTriggersCreated(triggers) {
		if (!triggers || triggers.length === 0) {
			return;
		}

		const data = getMutationEvents(this._triggerSubscriptionMap, triggers[0]);

		if (data) {
			try {
				data.createEvent.fire(triggers);
			} catch (e) {
				console.error('An error was thrown by a subscriber of the triggers creation event.', e);
			}
		}
	}

	function onTriggersMutated(triggers) {
		if (!triggers || triggers.length === 0) {
			return;
		}

		const data = getMutationEvents(this._triggerSubscriptionMap, triggers[0]);

		if (data) {
			try {
				data.changeEvent.fire(triggers);
			} catch (e) {
				console.error('An error was thrown by a subscriber of the triggers mutation event.', e);
			}
		}
	}

	function onTriggersDeleted(triggers) {
		if (!triggers || triggers.length === 0) {
			return;
		}

		const data = getMutationEvents(this._triggerSubscriptionMap, triggers[0]);

		if (data) {
			try {
				data.deleteEvent.fire(triggers);
			} catch (e) {
				console.error('An error was thrown by a subscriber of the triggers deletion event.', e);
			}
		}
	}

	function onConnectionStatusChanged(status) {
		try {
			this._connectionChangedEvent.fire(status);
		} catch (e) {
			console.error('An error was thrown by a subscriber of the connection status changed event.', e);
		}
	}
	
	function cloneAlert(alert) {
		return alert;
	}

	const instrumentLookupEndpoints = new Map();

	function buildInstrumentLookupEndpoint(host) {
		return EndpointBuilder.for('lookup-instrument', 'lookup instrument')
			.withVerb(VerbType.GET)
			.withProtocol(ProtocolType.HTTPS)
			.withHost(host)
			.withPort(DEFAULT_SECURE_PORT)
			.withPathBuilder((pb) => {
				pb.withLiteralParameter('instruments', 'instruments')
					.withVariableParameter('symbol', 'symbol', 'symbol');
			})
			.withResponseInterceptor(ResponseInterceptor.DATA)
			.withErrorInterceptor(ErrorInterceptor.GENERAL)
			.endpoint;
	}

	const instrumentLookupCache = new TimeMap(60 * 60 * 1000);

	function lookupInstrument(symbol, alertSystem) {
		let host;

		if (is.string(alertSystem) && (alertSystem === 'webstation.barchart.com' || alertSystem === 'webstation')) {
			host = 'instruments-cmdtyview.aws.barchart.com';
		} else {
			host = 'instruments-prod.aws.barchart.com';
		}

		if (!instrumentLookupEndpoints.has(host)) {
			instrumentLookupEndpoints.set(host, buildInstrumentLookupEndpoint(host));
		}

		const endpoint = instrumentLookupEndpoints.get(host);

		if (!instrumentLookupCache.has(symbol)) {
			instrumentLookupCache.set(symbol, Gateway.invoke(endpoint, { symbol }));
		}

		return instrumentLookupCache.get(symbol);
	}

	return AlertManager;
})();
