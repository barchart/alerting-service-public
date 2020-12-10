const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable');

module.exports = (() => {
	'use strict';

	/**
	 * The abstract definition for a transport strategy between the {@link AlertManager} and
	 * the backend. As a consumer of the SDK, it is unlikely you will need to implement this
	 * class. However, you will need to select an existing implementation and pass it to your
	 * {@link AlertManager} instance. Two existing implementations are included in the SDK.
	 * One uses pure HTTP requests. The other uses the [Socket.IO](https://socket.io/docs/)
	 * library.
	 *
	 * @public
	 * @exported
	 * @abstract
	 * @extends {Disposable}
	 * @see {@link AdapterForHttp}
	 * @see {@link AdapterForSocketIo}
	 * @param {String} host
	 * @param {Number} port
	 * @param {Boolean} secure
	 * @param {Callbacks.AlertCreatedCallback} onAlertCreated
	 * @param {Callbacks.AlertMutatedCallback} onAlertMutated
	 * @param {Callbacks.AlertDeletedCallback} onAlertDeleted
	 * @param {Callbacks.AlertTriggeredCallback} onAlertTriggered
	 */
	class AdapterBase extends Disposable {
		constructor(host, port, secure, onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered) {
			super();

			assert.argumentIsRequired(host, 'host', String);
			assert.argumentIsRequired(port, 'port', Number);
			assert.argumentIsRequired(secure, 'secure', Boolean);

			assert.argumentIsRequired(onAlertCreated, 'onAlertCreated', Function);
			assert.argumentIsRequired(onAlertMutated, 'onAlertMutated', Function);
			assert.argumentIsRequired(onAlertDeleted, 'onAlertDeleted', Function);
			assert.argumentIsRequired(onAlertTriggered, 'onAlertTriggered', Function);

			this._host = host;
			this._port = port;
			this._secure = secure;

			this._onAlertCreated = onAlertCreated;
			this._onAlertMutated = onAlertMutated;
			this._onAlertDeleted = onAlertDeleted;
			this._onAlertTriggered = onAlertTriggered;
		}

		/**
		 * The hostname of the Barchart Alert Service.
		 *
		 * @public
		 * @returns {String}
		 */
		get host() {
			return this._host;
		}

		/**
		 * The TCP port number of the Barchart Alert Service.
		 *
		 * @public
		 * @returns {String}
		 */
		get port() {
			return this._port;
		}

		/**
		 * Indicates if encryption will be used (e.g. WSS, HTTPS).
		 *
		 * @public
		 * @returns {String}
		 */
		get secure() {
			return this._secure;
		}

		/**
		 * Connects to the backend.
		 *
		 * @public
		 * @param {JwtProvider} jwtProvider
		 * @returns {Promise<AdapterBase>}
		 */
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

		retrieveTriggers(query) {
			return  null;
		}

		updateTrigger(query) {
			return  null;
		}

		updateTriggers(query) {
			return  null;
		}

		toString() {
			return '[AdapterBase]';
		}
	}

	return AdapterBase;
})();