const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable');

module.exports = (() => {
	'use strict';

	class AdapterBase extends Disposable {
		constructor(onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered) {
			super();

			assert.argumentIsOptional(onAlertCreated, 'onAlertCreated', Function);
			assert.argumentIsOptional(onAlertMutated, 'onAlertMutated', Function);
			assert.argumentIsOptional(onAlertDeleted, 'onAlertDeleted', Function);
			assert.argumentIsOptional(onAlertTriggered, 'onAlertTriggered', Function);

			this._onAlertCreated = onAlertCreated;
			this._onAlertMutated = onAlertMutated;
			this._onAlertDeleted = onAlertDeleted;
			this._onAlertTriggered = onAlertTriggered;
		}

		connect(jwtProvider) {
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

		updateAlertsForUser(query) {
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

		getUser() {
			return null;
		}

		getServerVersion() {
			return null;
		}

		toString() {
			return '[AdapterBase]';
		}
	}

	return AdapterBase;
})();