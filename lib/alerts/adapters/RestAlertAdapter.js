var assert = require('./../../common/lang/assert');
var Disposable = require('./../../common/lang/Disposable');

var AlertAdapterBase = require('./AlertAdapterBase');
var RestAction = require('./../../network/rest/RestAction');
var RestEndpoint = require('./../../network/rest/RestEndpoint');
var RestProvider = require('./../../network/rest/RestProvider');
var Scheduler = require('./../../common/timing/Scheduler');

module.exports = (() => {
	'use strict';

	class RestAlertAdapter extends AlertAdapterBase {
		constructor(host, port, secure, onAlertMutated, onAlertDeleted) {
			super(onAlertMutated, onAlertDeleted);
			
			assert.argumentIsOptional(host, 'host', String);
			assert.argumentIsOptional(port, 'port', Number);
			assert.argumentIsOptional(secure, 'secure', Boolean);

			this._restProvider = new RestProvider(host, port, secure);

			this._createEndpoint = new RestEndpoint(RestAction.Create, [ 'alerts' ]);
			this._retrieveEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alerts', 'alert_id' ]);
			this._queryEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alerts', 'users', 'alert_system', 'user_id' ]);
			this._updateEndpoint = new RestEndpoint(RestAction.Update, [ 'alerts', 'alert_id' ]);
			this._deleteEndpoint = new RestEndpoint(RestAction.Delete, [ 'alerts', 'alert_id' ]);
			this._retrieveTargetsEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alert', 'targets' ]);
			this._retrievePropertiesEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alert', 'targets', 'properties' ]);
			this._retrieveOperatorsEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alert', 'operators' ]);
			this._retrievePublisherTypesEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alert', 'publishers' ]);
			this._retrievePublisherTypeDefaultsEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alert', 'publishers', 'default', 'alert_system', 'user_id' ]);
			this._assignPublisherTypeDefaultEndpoint = new RestEndpoint(RestAction.Update, [ 'alert', 'publishers', 'default', 'alert_system', 'user_id', 'publisher_type_id' ]);
			this._retrieveMarketDataConfigurationEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'alert', 'market', 'configuration', 'alert_system', 'user_id' ]);
			this._assignMarketDataConfigurationEndpoint = new RestEndpoint(RestAction.Update, [ 'alert', 'market', 'configuration', 'alert_system', 'user_id' ]);
			this._versionEndpoint = new RestEndpoint(RestAction.Retrieve, [ 'server', 'version' ]);

			this._scheduler = new Scheduler();

			this._subscribers = { };
		}

		connect() {
			return true;
		}

		createAlert(alert) {
			return this._restProvider.call(this._createEndpoint, alert);
		}

		retrieveAlert(alert) {
			return this._restProvider.call(this._retrieveEndpoint, alert);
		}

		updateAlert(alert) {
			return this._restProvider.call(this._updateEndpoint, alert);
		}

		deleteAlert(alert) {
			return this._restProvider.call(this._deleteEndpoint, alert);
		}

		retrieveAlerts(query) {
			return this._restProvider.call(this._queryEndpoint, query)
				.then((alerts) => {
					const subscriber = getSubscriber(this._subscribers, query);

					if (subscriber) {
						const clones = alerts.map((alert) => {
							return Object.assign(alert);
						});

						subscriber.processAlerts(clones);
					}

					return alerts;
				});
		}

		subscribeAlerts(query) {
			const userId = query.user_id;
			const systemId = query.alert_system;

			let subscriber = getSubscriber(this._subscribers, query);

			if (subscriber !== null) {
				throw new Error('A subscriber already exists');
			}

			subscriber = new AlertSubscriber(this, query);
			subscriber.start();

			putSubscriber(this._subscribers, subscriber);

			return new Disposable.fromAction(() => {
				delete this._subscribers[userId][systemId];

				subscriber.dispose();
			});
		}

		getTargets() {
			return this._restProvider.call(this._retrieveTargetsEndpoint, { });
		}

		getProperties() {
			return this._restProvider.call(this._retrievePropertiesEndpoint, { });
		}

		getOperators() {
			return this._restProvider.call(this._retrieveOperatorsEndpoint, { });
		}

		getPublisherTypes() {
			return this._restProvider.call(this._retrievePublisherTypesEndpoint, { });
		}

		getPublisherTypeDefaults(query) {
			return this._restProvider.call(this._retrievePublisherTypeDefaultsEndpoint, query);
		}

		assignPublisherTypeDefault(publisherTypeDefault) {
			return this._restProvider.call(this._assignPublisherTypeDefaultEndpoint, publisherTypeDefault);
		}

		getMarketDataConfiguration(query) {
			return this._restProvider.call(this._retrieveMarketDataConfigurationEndpoint, query);
		}

		assignMarketDataConfiguration(marketDataConfiguration) {
			return this._restProvider.call(this._assignMarketDataConfigurationEndpoint, marketDataConfiguration);
		}

		getServerVersion() {
			return this._restProvider.call(this._versionEndpoint, { });
		}

		_onDispose() {
			Object.keys(this._subscribers).forEach((key) => {
				this._subscribers[key].dispose();
			});

			this._subscribers = null;

			this._scheduler.dispose();
			this._scheduler = null;

			this._restProvider = null;
		}

		toString() {
			return '[RestAlertAdapter]';
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
			const currentAlerts = indexBy(alerts, (alert) => alert.alert_id);

			const mutatedAlerts = alerts.filter((alert) => {
				let returnVal = true;

				const alertId = alert.alert_id;

				if (this._alerts.hasOwnProperty(alertId)) {
					const existing = this._alerts[alertId];

					returnVal = existing.alert_state !== alert.alert_state || existing.last_trigger_date !== alert.last_trigger_date;
				}

				return returnVal;
			});

			const deletedAlerts = Object.keys(this._alerts)
				.filter((alertId) => !currentAlerts.hasOwnProperty(alertId))
				.map((alertId) => this._alerts[alertId]);

			mutatedAlerts.forEach((alert) => {
				this._alerts[alert.alert_id] = alert;
			});

			deletedAlerts.forEach((alert) => {
				delete this._alerts[alert.alert_id];
			});

			mutatedAlerts.forEach((alert) => {
				this._parent._onAlertMutated(alert);
			});

			deletedAlerts.forEach((alert) => {
				this._parent._onAlertDeleted(alert);
			});
		}

		start() {
			if (this._started) {
				throw new Error('The alert subscriber has already been started.');
			}

			this._started = true;

			const poll = () => {
				return this._parent.retrieveAlerts(this._query)
					.then((alerts) => {
						return true;
					});
			};

			const repeat = (delay) => {
				this._parent._scheduler.backoff(poll, delay, 'alert poll', 7)
					.then(() => {
						if (this.getIsDisposed()) {
							return;
						}

						repeat(5000);
					});
			};

			repeat(0);
		}
	}

	const indexBy = (array, keyFunction) => {
		return array.reduce((map, item) => {
			const key = keyFunction(item);

			map[key] = item;

			return map;
		}, { });
	};

	return RestAlertAdapter;
})();