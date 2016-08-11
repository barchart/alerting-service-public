var assert = require('common/lang/assert');
var Disposable = require('common/lang/Disposable');

module.exports = (() => {
	'use strict';

	class AlertAdapterBase extends Disposable {
		constructor(onAlertCreated, onAlertMutated, onAlertDeleted) {
			super();

			assert.argumentIsOptional(onAlertCreated, 'onAlertCreated', Function);
			assert.argumentIsOptional(onAlertMutated, 'onAlertMutated', Function);
			assert.argumentIsOptional(onAlertDeleted, 'onAlertDeleted', Function);

			this._onAlertCreated = onAlertCreated;
			this._onAlertMutated = onAlertMutated;
			this._onAlertDeleted = onAlertDeleted;
		}

		connect() {
			return Promise.reject();
		}

		createAlert(alert) {
			return  null;
		}

		retrieveAlert(alert) {
			return null;
		}

		updateAlert(alert) {
			return null;
		}

		deleteAlert(alert) {
			return null;
		}

		retrieveAlerts(query) {
			return null;
		}

		subscribeAlerts(query) {
			return null;
		}

		getTargets() {
			return null;
		}

		getProperties() {
			return null;
		}

		getOperators() {
			return null;
		}

		getModifiers() {
			return null;
		}

		getPublisherTypes() {
			return null;
		}

		getPublisherTypeDefaults(query) {
			return null;
		}

		assignPublisherTypeDefault(publisherTypeDefault) {
			return null;
		}

		getMarketDataConfiguration(query) {
			return null;
		}

		assignMarketDataConfiguration(marketDataConfiguration) {
			return null;
		}

		getServerVersion() {
			return null;
		}

		toString() {
			return '[AlertAdapterBase]';
		}
	}

	return AlertAdapterBase;
})();