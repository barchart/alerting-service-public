const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	Event = require('@barchart/common-js/messaging/Event'),
	promise = require('@barchart/common-js/lang/promise');

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

const version = require('./meta').version;

module.exports = (() => {
	'use strict';

	const regex = {};

	regex.hosts = {};
	regex.hosts.production = /(prod)/i;

	/**
	 * The **central component of the SDK**. It is responsible for connecting to Barchart's
	 * Alert Service, querying existing alerts, creating new alerts, and monitoring the status
	 * of existing alerts.
	 *
	 * @public
	 * @exported
	 * @extends {Disposable}
	 * @param {String} host - Barchart Alert Service's hostname.
	 * @param {Number} port - Barchart Alert Service's TCP port number.
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
			this._suspended = null;
			this._suspendedJwtProvider = null;

			this._alertSubscriptionMap = {};
		}

		/**
		 * Attempts to establish a connection to the backend. This function should be invoked
		 * immediately following instantiation. Once the resulting promise resolves, a
		 * connection has been established and other instance methods can be used.
		 *
		 * @public
		 * @param {JwtProvider} jwtProvider - Your implementation of {@link JwtProvider}.
		 * @param {Boolean} [lazy] - Suspend connection.
		 * @returns {Promise<AlertManager>}
		 */
		connect(jwtProvider, lazy = false) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');
					assert.argumentIsOptional(lazy, 'lazy', Boolean);

					checkDispose(this, 'connect');
				}).then(() => {
					if (this._connectPromise === null) {
						const alertAdapterPromise = Promise.resolve()
							.then(() => {
								let adapter = this._adapter;

								if (adapter === null) {
									adapter = new this._adapterClazz(this._host, this._port, this._secure, onAlertCreated.bind(this), onAlertMutated.bind(this), onAlertDeleted.bind(this), onAlertTriggered.bind(this));
								}

								if (lazy) {
									this._suspended = true;
									this._adapter = adapter;
									this._suspendedJwtProvider = jwtProvider;
									
									return Promise.resolve(adapter);
								} else {
									this._suspended = false;
								}

								return timeout(adapter.connect(jwtProvider), 10000, 'Alert service is temporarily unavailable. Please try again later.');
							});

						this._connectPromise = Promise.all([alertAdapterPromise])
							.then((results) => {
								if (this._adapter === null) {
									this._adapter = results[0];
								}

								if (lazy) {
									this._connectPromise = null;
								}

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
		 * Creates a new alert.
		 *
		 * @public
		 * @param {Schema.Alert} alert
		 * @returns {Promise<Schema.Alert>}
		 */
		createAlert(alert) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'create alert');

					return checkSuspended(this).then(() => {
						validate.alert.forCreate(alert);
					});
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
					}, {});

					const operatorMap = alert.conditions.reduce((map, c) => {
						const operator = operators.find((o) => o.operator_id === c.operator.operator_id);

						map[operator.operator_id] = operator;

						return map;
					}, {});

					const instrumentMap = alert.conditions.reduce((map, c) => {
						const property = propertyMap[c.property.property_id];

						if (property.target.type === 'symbol') {
							const symbol = c.property.target.identifier;

							if (!map.hasOwnProperty(symbol)) {
								map[symbol] = lookupInstrument(symbol);
							}
						}

						return map;
					}, {});

					return Promise.all(alert.conditions.map((c, i) => {
						let validatePromise;

						const property = propertyMap[c.property.property_id];
						const operator = operatorMap[c.operator.operator_id];

						if (property.target.type === 'symbol') {
							const symbol = c.property.target.identifier;

							validatePromise = instrumentMap[symbol]
								.then((result) => {
									const instrument = result.instrument;
									const unitcode = convertBaseCodeToUnitCode(instrument.unitcode);

									validate.instrument.forCreate(symbol, instrument);

									if (property.format === 'price' && operator.operand_type === 'number' && operator.operand_literal) {
										let operandToParse = c.operator.operand;

										if (is.string(operandToParse) && operandToParse.match(/^(-?)([0-9,]+)$/) !== null) {
											operandToParse = operandToParse + '.0';
										}

										const price = valueParser(operandToParse, unitcode, ',');

										if (!is.number(price)) {
											throw new Error('Condition ' + i + ' is invalid. The price cannot be parsed.');
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
		 * @param {Schema.Alert} alert
		 * @returns {Promise<Schema.Alert>}
		 */
		editAlert(alert) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'edit alert');

					return checkSuspended(this).then(() => {
						validate.alert.forEdit(alert);
					});
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
		 * @param {Schema.Alert} alert
		 * @returns {Promise<Schema.Alert>}
		 */
		deleteAlert(alert) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'delete alert');

					return checkSuspended(this).then(() => {
						validate.alert.forQuery(alert);
					});
				}).then(() => {
					return this._adapter.deleteAlert({alert_id: alert.alert_id});
				});
		}

		/**
		 * Gets a single alert by its identifier.
		 *
		 * @public
		 * @param {Schema.Alert|Schema.AlertIdentifier} alert
		 * @returns {Promise<Schema.Alert>}
		 */
		retrieveAlert(alert) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'retrieve alert');

					return checkSuspended(this).then(() => {
						validate.alert.forQuery(alert);
					});
				}).then(() => {
					return this._adapter.retrieveAlert(alert);
				});
		}

		/**
		 * Gets the set of alerts which match a query.
		 *
		 * @public
		 * @param {Schema.AlertQuery} query
		 * @returns {Promise<Schema.Alert[]>}
		 */
		retrieveAlerts(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'retrieve alerts');

					return checkSuspended(this).then(() => {
						validate.alert.forUser(query);
					});
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
						return results.filter((result) => result.conditions.some((c) => (c.property.target.type === 'symbol' && c.property.target.identifier === query.filter.symbol) || (c.property.type === 'symbol' && c.operator.operand === query.filter.symbol)));
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
					if (query.filter && query.filter.condition && (typeof (query.filter.condition.operand) === 'string' || typeof (query.filter.condition.operand) === 'number')) {
						return results.filter((result) => result.conditions.some((c) => c.operator.operand === query.filter.condition.operand.toString()));
					} else {
						return results;
					}
				});
		}

		/**
		 * Sends a request to transition an alert to the ```Active``` state.
		 *
		 * @public
		 * @param {Schema.Alert|Schema.AlertIdentifier} alert
		 * @returns {Promise<Schema.Alert>}
		 */
		enableAlert(alert) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'enable alert');

					return checkSuspended(this).then(() => {
						validate.alert.forQuery(alert);
					});
				}).then(() => {
					const clone = Object.assign(alert);
					clone.alert_state = 'Starting';

					onAlertMutated.call(this, clone);

					return this._adapter.updateAlert({alert_id: alert.alert_id, alert_state: 'Starting'});
				});
		}

		/**
		 * Sends a request to transition all alerts owned by a user to the ```Active``` state.
		 *
		 * @public
		 * @param {Schema.AlertQuery} query
		 * @returns {Promise<Boolean>}
		 */
		enableAlerts(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'enable alerts');

					return checkSuspended(this).then(() => {
						validate.alert.forUser(query);

						return this._adapter.updateAlertsForUser({
							user_id: query.user_id,
							alert_system: query.alert_system,
							alert_state: 'Starting'
						});
					});
				}).then(() => {
					return true;
				});
		}

		/**
		 * Sends a request to transition an alert to the ```Inactive``` state.
		 *
		 * @public
		 * @param {Schema.Alert|Schema.AlertIdentifier} alert
		 * @returns {Promise<Schema.Alert>}
		 */
		disableAlert(alert) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'disable alert');

					return checkSuspended(this).then(() => {
						validate.alert.forQuery(alert);
					});
				}).then(() => {
					const clone = Object.assign(alert);
					clone.alert_state = 'Stopping';

					onAlertMutated.call(this, clone);

					return this._adapter.updateAlert({alert_id: alert.alert_id, alert_state: 'Stopping'});
				});
		}

		/**
		 * Sends a request to transition all alerts owned by a user to the ```Inactive``` state.
		 *
		 * @public
		 * @param {Schema.AlertQuery} query
		 * @returns {Promise<Boolean>}
		 */
		disableAlerts(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'disable alerts');

					return checkSuspended(this).then(() => {
						validate.alert.forUser(query);

						return this._adapter.updateAlertsForUser({
							user_id: query.user_id,
							alert_system: query.alert_system,
							alert_state: 'Stopping'
						});
					});
				}).then(() => {
					return true;
				});
		}

		subscribeAlerts(query, changeCallback, deleteCallback, createCallback, triggerCallback) {
			checkStatus(this, 'subscribe alerts');

			return checkSuspended(this).then(() => {
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
		 * @param {String} symbol - The symbol to check
		 * @returns {Promise<String>}
		 */
		checkSymbol(symbol) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'check symbol');

					return checkSuspended(this).then(() => {
						return lookupInstrument(symbol);
					});
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
		 * @returns {Promise<Schema.Target[]>}
		 */
		getTargets() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get targets');

					return checkSuspended(this).then(() => {
						return this._adapter.getTargets();
					});
				});
		}

		/**
		 * Retrieves the entire list of properties which are available to the
		 * system.
		 *
		 * @public
		 * @returns {Promise<Schema.Property[]>}
		 */
		getProperties() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get properties');

					return checkSuspended(this).then(() => {
						return this._adapter.getProperties();
					});
				});
		}

		/**
		 * Retrieves the entire list of operators which are available to the
		 * system.
		 *
		 * @public
		 * @returns {Promise<Schema.Operator[]>}
		 */
		getOperators() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get operators');

					return checkSuspended(this).then(() => {
						return this._adapter.getOperators();
					});
				});
		}

		getModifiers() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get modifiers');

					return checkSuspended(this).then(() => {
						return this._adapter.getModifiers();
					});
				});
		}

		getPublisherTypes() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get publisher types');

					return checkSuspended(this).then(() => {
						return this._adapter.getPublisherTypes();
					});
				});
		}

		getPublisherTypeDefaults(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get publisher type defaults');

					return checkSuspended(this).then(() => {
						validate.publisherTypeDefault.forUser(query);
					});
				}).then(() => {
					return this._adapter.getPublisherTypeDefaults(query);
				});
		}

		assignPublisherTypeDefault(publisherTypeDefault) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'assign publisher type default');

					return checkSuspended(this).then(() => {
						validate.publisherTypeDefault.forCreate(publisherTypeDefault);
					});
				}).then(() => {
					return this._adapter.assignPublisherTypeDefault(publisherTypeDefault);
				});
		}

		getMarketDataConfiguration(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get market data configuration');

					return checkSuspended(this);
				}).then(() => {
					return this._adapter.getMarketDataConfiguration(query);
				});
		}

		assignMarketDataConfiguration(marketDataConfiguration) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'assign market data configuration');

					return checkSuspended(this);
				}).then(() => {
					return this._adapter.assignMarketDataConfiguration(marketDataConfiguration);
				});
		}

		/**
		 * Returns the version number of the remote service you are connected to.
		 *
		 * @public
		 * @returns {Promise<String>}
		 */
		getServerVersion() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get server version');

					return checkSuspended(this);
				}).then(() => {
					return this._adapter.getServerVersion();
				});
		}

		/**
		 * Returns the current user (according to the JWT token which is embedded
		 * in the request).
		 *
		 * @public
		 * @returns {Promise<Schema.UserIdentifier>}
		 */
		getUser() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get authenticated user');

					return checkSuspended(this);
				}).then(() => {
					return this._adapter.getUser();
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
				const descriptionPath = (property.category || []).concat(descriptionSelector(property) || []);
				const descriptionPathLast = descriptionPath.length - 1;

				let node = tree;

				descriptionPath.forEach((description, i) => {
					node.items = node.items || [];

					let child = node.items.find((candidate) => candidate.description === description);

					if (!child) {
						let sortOrder;

						if (i === descriptionPathLast && typeof (property.sortOrder) === 'number') {
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
			}, {});

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
		 * Returns the version of the SDK.
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get version() {
			return version;
		}

		_onDispose() {
			if (this._adapter) {
				this._adapter.dispose();
				this._adapter = null;
			}

			this._alertSubscriptionMap = null;
		}

		toString() {
			return '[AlertManager]';
		}
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

	function checkSuspended(manager) {
		let result = Promise.resolve();

		if (manager._suspended) {
			result = manager.connect(manager._suspendedJwtProvider, false);
		}

		return result;
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
			data.createEvent.fire(Object.assign(alert));
		}
	}

	function onAlertMutated(alert) {
		if (!alert) {
			return;
		}

		const data = getMutationEvents(this._alertSubscriptionMap, alert);

		if (data) {
			data.changeEvent.fire(Object.assign(alert));
		}
	}

	function onAlertDeleted(alert) {
		if (!alert) {
			return;
		}

		const data = getMutationEvents(this._alertSubscriptionMap, alert);

		if (data) {
			data.deleteEvent.fire(alert);
		}
	}

	function onAlertTriggered(alert) {
		if (!alert) {
			return;
		}

		const data = getMutationEvents(this._alertSubscriptionMap, alert);

		if (data) {
			data.triggerEvent.fire(alert);
		}
	}

	function timeout(p, duration, description) {
		return Promise.race([
			p, promise.build((resolveCallback, rejectCallback) => {
				setTimeout(() => {
					rejectCallback(description);
				}, duration);
			})
		]);
	}

	const instrumentLookupEndpoint = EndpointBuilder.for('lookup-instrument', 'lookup instrument')
		.withVerb(VerbType.GET)
		.withProtocol(ProtocolType.HTTPS)
		.withHost('instruments-prod.aws.barchart.com')
		.withPort(443)
		.withPathBuilder((pb) => {
			pb.withLiteralParameter('instruments', 'instruments')
				.withVariableParameter('symbol', 'symbol', 'symbol');
		})
		.withResponseInterceptor(ResponseInterceptor.DATA)
		.withErrorInterceptor(ErrorInterceptor.GENERAL)
		.endpoint;

	function lookupInstrument(symbol) {
		return Gateway.invoke(instrumentLookupEndpoint, {symbol: symbol});
	}

	return AlertManager;
})();