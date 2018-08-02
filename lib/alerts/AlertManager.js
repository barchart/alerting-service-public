const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is'),
	connection = require('@barchart/common-js/lang/connection'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	Event = require('@barchart/common-js/messaging/Event'),
	promise = require('@barchart/common-js/lang/promise');

const converter = require('@barchart/marketdata-utilities-js/lib/convert'),
	SearchManager = require('@barchart/instruments-client-js/lib/search/SearchManager'),
	priceFormatter = require('@barchart/marketdata-utilities-js/lib/priceFormatter'),
	priceParser = require('@barchart/marketdata-utilities-js/lib/priceParser');

const validate = require('./validators/validate');

const JwtProvider = require('./JwtProvider'),
	RestAdapter = require('./adapters/RestAdapter'),
	SocketAdapter = require('./adapters/SocketAdapter');

module.exports = (() => {
	'use strict';

	const productionHostExpression = /(prod)/i;

	/**
	 * The entry point for interacting with the alerts system.
	 *
	 * @public
	 * @param {String=} host - Optional. The name of the remote server.
	 * @param {Number=} port - Optional. The TCP port used to connect to the remote server.
	 * @param {String=} mode - Optional. The transport abstraction used to exchange data with the remote server. Valid options are "socket.io" or "rest" where the first maintains a websocket connection and the second uses XHR requests and short polling.
	 * @param {Boolean=} secure - Optional. If true, the transport layer will use encryption (e.g. HTTPS or WSS).
	 */
	class AlertManager extends Disposable {
		constructor(host, port, mode, secure) {
			super();

			assert.argumentIsOptional(host, 'host', String);
			assert.argumentIsOptional(port, 'port', Number);
			assert.argumentIsOptional(mode, 'mode', String);
			assert.argumentIsOptional(secure, 'secure', Boolean);

			this._host = host || 'alerts-management-prod.barchart.com';
			this._mode = mode || 'socket.io';

			this._secure = connection.getIsSecure(secure);
			this._port = getPort(this._secure, port);

			this._connectPromise = null;

			this._adapter = null;
			this._searchManager = null;

			this._alertSubscriptionMap = { };
		}

		/**
		 * Conntects to the remove server, using the transport mode specified in the constructor.
		 *
		 * @public
		 * @param {JwtProvider=} jwtProvider
		 * @returns {Promise}
		 */
		connect(jwtProvider) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsOptional(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');

					checkDispose(this, 'connect');
				}).then(() => {
					if (this._connectPromise === null) {
						const alertAdapterPromise = Promise.resolve()
							.then(() => {
								const mode = this._mode.toLowerCase();

								let adapter;

								if (mode === 'rest') {
									adapter = new RestAdapter(this._host, this._port, this._secure, onAlertCreated.bind(this), onAlertMutated.bind(this), onAlertDeleted.bind(this), onAlertTriggered.bind(this));
								} else if (mode === 'socket.io') {
									adapter = new SocketAdapter(this._host, this._port, this._secure, onAlertCreated.bind(this), onAlertMutated.bind(this), onAlertDeleted.bind(this), onAlertTriggered.bind(this));
								} else {
									throw new Error(`Unable to connect, using unsupported mode (${mode})`);
								}

								return timeout(adapter.connect(jwtProvider), 10000, 'Alert service is temporarily unavailable. Please try again later.');
							});

						const searchManagerPromise = Promise.resolve()
							.then(() => {
								let host;

								if (productionHostExpression.test(this._host)) {
									host = 'instruments-prod.aws.barchart.com';
								} else {
									host = 'instruments-stage.aws.barchart.com';
								}

								const secure = this._secure;
								const port = getPort(this._secure);

								const manager = new SearchManager(host, port, 'rest', secure);

								return timeout(manager.connect(), 10000, 'Search service is temporarily unavailable. Please try again later.');
							});

						this._connectPromise = Promise.all([alertAdapterPromise, searchManagerPromise])
							.then((results) => {
								this._adapter = results[0];
								this._searchManager = results[1];

								return this;
							}).catch((e) => {
								this.dispose();

								throw e;
							});
					}

					return this._connectPromise;
				});
		}

		checkSymbol(symbol) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'check symbol');
				}).then(() => {
					return this._searchManager.lookupInstrument(symbol);
				}).then((result) => {
					validate.instrument.forCreate(symbol, result.instrument);

					return result.instrument.symbol;
				});
		}

		createAlert(alert) {
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
								map[symbol] = this._searchManager.lookupInstrument(symbol);
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
									const unitcode = converter.baseCodeToUnitCode(instrument.unitcode);

									validate.instrument.forCreate(symbol, instrument);

									if (property.format === 'price' && operator.operand_type === 'number' && operator.operand_literal) {
										let operandToParse = c.operator.operand;

										if (is.string(operandToParse) && operandToParse.match(/^(-?)([0-9,]+)$/) !== null) {
											operandToParse = operandToParse + '.0';
										}

										const price = priceParser(operandToParse, unitcode, ',');

										if (!is.number(price)) {
											throw new Error('Condition ' + i + ' is invalid. The price cannot be parsed.');
										}

										c.operator.operand_display = c.operator.operand;
										c.operator.operand_format = priceFormatter('-', false, ',').format(price, unitcode);
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

		retrieveAlert(alert) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'retrieve alert');

					validate.alert.forQuery(alert);
				}).then(() => {
					return this._adapter.retrieveAlert(alert);
				});
		}

		editAlert(alert) {
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

		enableAlert(alert) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'enable alert');

					validate.alert.forQuery(alert);
				}).then(() => {
					const clone = Object.assign(alert);
					clone.alert_state = 'Starting';

					onAlertMutated.call(this, clone);

					return this._adapter.updateAlert({alert_id: alert.alert_id, alert_state: 'Starting'});
				});
		}

		enableAlerts(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'enable alerts');

					validate.alert.forUser(query);

					return this._adapter.updateAlertsForUser({user_id: query.user_id, alert_system: query.alert_system, alert_state: 'Starting'});
				}).then(() => {
					return true;
				});
		}

		disableAlert(alert) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'disable alert');

					validate.alert.forQuery(alert);
				}).then(() => {
					const clone = Object.assign(alert);
					clone.alert_state = 'Stopping';

					onAlertMutated.call(this, clone);

					return this._adapter.updateAlert({alert_id: alert.alert_id, alert_state: 'Stopping'});
				});
		}

		disableAlerts(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'disable alerts');

					validate.alert.forUser(query);

					return this._adapter.updateAlertsForUser({user_id: query.user_id, alert_system: query.alert_system, alert_state: 'Stopping'});
				}).then(() => {
					return true;
				});
		}

		deleteAlert(alert) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'delete alert');

					validate.alert.forQuery(alert);
				}).then(() => {

				}).then(() => {
					return this._adapter.deleteAlert({alert_id: alert.alert_id});
				});
		}

		retrieveAlerts(query) {
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

		getTargets() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get targets');
				}).then(() => {
					return this._adapter.getTargets();
				});
		}

		getProperties() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get properties');
				}).then(() => {
					return this._adapter.getProperties();
				});
		}

		getOperators() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get operators');
				}).then(() => {
					return this._adapter.getOperators();
				});
		}

		getModifiers() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get modifiers');
				}).then(() => {
					return this._adapter.getModifiers();
				});
		}

		getPublisherTypes() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get publisher types');
				}).then(() => {
					return this._adapter.getPublisherTypes();
				});
		}

		getPublisherTypeDefaults(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get publisher type defaults');

					validate.publisherTypeDefault.forUser(query);
				}).then(() => {
					return this._adapter.getPublisherTypeDefaults(query);
				});
		}

		assignPublisherTypeDefault(publisherTypeDefault) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'assign publisher type default');

					validate.publisherTypeDefault.forCreate(publisherTypeDefault);
				}).then(() => {
					return this._adapter.assignPublisherTypeDefault(publisherTypeDefault);
				});
		}

		getMarketDataConfiguration(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get market data configuration');
				}).then(() => {
					return this._adapter.getMarketDataConfiguration(query);
				});
		}

		assignMarketDataConfiguration(marketDataConfiguration) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'assign market data configuration');
				}).then(() => {
					return this._adapter.assignMarketDataConfiguration(marketDataConfiguration);
				});
		}

		getServerVersion() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get server version');
				}).then(() => {
					return this._adapter.getServerVersion();
				});
		}

		getUser() {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'get authenticated user');
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

		static getPropertyTree(properties) {
			const root = properties.reduce((tree, property) => {
				const descriptionPath = [ property.group ].concat(property.category || [ ]).concat(property.description || [ ]);
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
							sortOrder = 0;
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

		_onDispose() {
			if (this._adapter) {
				this._adapter.dispose();
				this._adapter = null;
			}

			if (this._searchManager) {
				this._searchManager.dispose();
				this._searchManager = null;
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

	function getPort(secure, port) {
		let portToUse;

		if (typeof(port) === 'number') {
			portToUse = port;
		} else {
			if (secure) {
				portToUse = 443;
			} else {
				portToUse = 80;
			}
		}

		return portToUse;
	}

	return AlertManager;
})();