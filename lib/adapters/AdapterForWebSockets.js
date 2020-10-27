const AdapterBase = require('./AdapterBase');

module.exports = (() => {
	'use strict';

	/**
	 * A backend communication adapter implemented with WebSockets. Coming in version 4.1.0.
	 *
	 * @public
	 * @exported
	 * @extends {AdapterBase}
	 */
	class AdapterForWebSockets extends AdapterBase {
		constructor(host, port, secure, onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered) {
			super(onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered);
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


		_onDispose() {

		}

		toString() {
			return '[AdapterForWebSockets]';
		}
	}

	return AdapterForWebSockets;
})();