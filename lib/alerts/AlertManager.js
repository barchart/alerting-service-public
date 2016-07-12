var assert = require('./../common/lang/assert');
var connection = require('./../common/lang/connection');
var Disposable = require('./../common/lang/Disposable');
var Event = require('./../common/messaging/Event');

var validate = require('./validators/validate');

var RestAlertAdapter = require('./adapters/RestAlertAdapter');
var SocketAlertAdapter = require('./adapters/SocketAlertAdapter');

module.exports = (() => {
	'use strict';

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

			let portToUse;

			if (typeof(port) === 'number') {
				portToUse = port;
			} else {
				if (this._secure) {
					portToUse = 443;
				} else {
					portToUse = 80;
				}
			}

			this._port = portToUse;

			this._adapter = null;
			this._adapterConnectPromise = null;

			this._alertSubscriptionMap = {};
		}

		connect() {
			return Promise.resolve()
				.then(() => {
					checkDispose(this, 'connect');
				}).then(() => {
					if (this._adapterConnectPromise === null) {
						this._adapterConnectPromise = Promise.resolve()
							.then(() => {
								const mode = this._mode.toLowerCase();

								let adapter;

								if (mode === 'rest') {
									adapter = new RestAlertAdapter(this._host, this._port, this._secure, onAlertMutated.bind(this), onAlertDeleted.bind(this));
								} else if (mode === 'socket.io') {
									adapter = new SocketAlertAdapter(this._host, this._port, this._secure, onAlertMutated.bind(this), onAlertDeleted.bind(this));
								} else {
									throw new Error(`Unable to connect, using unsupported mode (${mode})`);
								}

								return adapter.connect();
							}).then((adapter) => {
								this._adapter = adapter;
								this._adapterConnectPromise = Promise.resolve(this._adapter);

								return this._adapter;
							}).catch((e) => {
								this.dispose();

								throw e;
							});
					}

					return this._adapterConnectPromise;
				});
		}

		createAlert(alert) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'create alert');

					validate.alert.forCreate(alert);
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
					return this._adapter.deleteAlert(alert);
				}).then(() => {
					return this._adapter.createAlert(alert);
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

		deleteAlert(alert) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'delete alert');

					validate.alert.forQuery(alert);
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

		subscribeAlerts(query, changeCallback, deleteCallback) {
			checkStatus(this, 'subscribe alerts');
			
			validate.alert.forUser(query);

			assert.argumentIsRequired(changeCallback, 'changeCallback', Function);
			assert.argumentIsRequired(deleteCallback, 'deleteCallback', Function);

			const userId = query.user_id;
			const alertSystem = query.alert_system;

			if (!this._alertSubscriptionMap.hasOwnProperty(userId)) {
				this._alertSubscriptionMap[userId] = {};
			}

			if (!this._alertSubscriptionMap[userId].hasOwnProperty(alertSystem)) {
				this._alertSubscriptionMap[userId][alertSystem] = {
					changeEvent: new Event(this),
					deleteEvent: new Event(this),
					subscribers: 0
				};
			}

			const subscriptionData = this._alertSubscriptionMap[userId][alertSystem];

			if (subscriptionData.subscribers === 0) {
				subscriptionData.implementationBinding = this._adapter.subscribeAlerts(query);
			}

			subscriptionData.subscribers = subscriptionData.subscribers + 1;

			const changeRegistration = subscriptionData.changeEvent.register(changeCallback);
			const deleteRegistration = subscriptionData.deleteEvent.register(deleteCallback);

			return Disposable.fromAction(() => {
				subscriptionData.subscribers = subscriptionData.subscribers - 1;

				if (subscriptionData.subscribers === 0) {
					subscriptionData.implementationBinding.dispose();
				}

				changeRegistration.dispose();
				deleteRegistration.dispose();
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
			return indexBy(properties, (property) => property.property_id);
		}

		static getOperatorMap(operators) {
			return indexBy(operators, (operator) => operator.operator_id);
		}

		_onDispose() {
			this._adapter.dispose();
		}

		toString() {
			return '[AlertManager]';
		}
	}

	function getMutationEvent(map, alert) {
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

	function onAlertMutated(alert) {
		if (!alert) {
			return;
		}

		const data = getMutationEvent(this._alertSubscriptionMap, alert);

		if (data) {
			data.changeEvent.fire(Object.assign(alert));
		}
	}

	function onAlertDeleted(alert) {
		if (!alert) {
			return;
		}

		const data = getMutationEvent(this._alertSubscriptionMap, alert);

		if (data) {
			data.deleteEvent.fire(alert);
		}
	}

	const indexBy = (array, keyFunction) => {
		return array.reduce((map, item) => {
			const key = keyFunction(item);

			map[key] = item;

			return map;
		}, { });
	};

	return AlertManager;
})();