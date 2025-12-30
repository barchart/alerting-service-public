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
	 * @param {Callbacks.TriggersCreatedCallback=} onTriggersCreated
	 * @param {Callbacks.TriggersMutatedCallback=} onTriggersMutated
	 * @param {Callbacks.TriggersDeletedCallback=} onTriggersDeleted
	 * @param {Callbacks.TemplateCreatedCallback=} onTemplateCreated
	 * @param {Callbacks.TemplateMutatedCallback=} onTemplateMutated
	 * @param {Callbacks.TemplateDeletedCallback=} onTemplateDeleted
	 * @param {Callbacks.ConnectionStatusChangedCallback=} onConnectionStatusChanged
	 */
	class AdapterBase extends Disposable {
		constructor(host, port, secure, onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered, onTriggersCreated, onTriggersMutated, onTriggersDeleted, onTemplateCreated, onTemplateMutated, onTemplateDeleted, onConnectionStatusChanged) {
			super();

			assert.argumentIsRequired(host, 'host', String);
			assert.argumentIsRequired(port, 'port', Number);
			assert.argumentIsRequired(secure, 'secure', Boolean);

			assert.argumentIsRequired(onAlertCreated, 'onAlertCreated', Function);
			assert.argumentIsRequired(onAlertMutated, 'onAlertMutated', Function);
			assert.argumentIsRequired(onAlertDeleted, 'onAlertDeleted', Function);
			assert.argumentIsRequired(onAlertTriggered, 'onAlertTriggered', Function);

			assert.argumentIsOptional(onTriggersCreated, 'onTriggersCreated', Function);
			assert.argumentIsOptional(onTriggersMutated, 'onTriggersMutated', Function);
			assert.argumentIsOptional(onTriggersDeleted, 'onTriggersDeleted', Function);

			assert.argumentIsOptional(onTemplateCreated, 'onTemplateCreated', Function);
			assert.argumentIsOptional(onTemplateMutated, 'onTemplateMutated', Function);
			assert.argumentIsOptional(onTemplateDeleted, 'onTemplateDeleted', Function);

			assert.argumentIsOptional(onTemplateDeleted, 'onConnectionStatusChanged', Function);
			
			this._host = host;
			this._port = port;
			this._secure = secure;

			this._onAlertCreated = onAlertCreated;
			this._onAlertMutated = onAlertMutated;
			this._onAlertDeleted = onAlertDeleted;
			this._onAlertTriggered = onAlertTriggered;

			this._onTriggersCreated = onTriggersCreated || emptyCallback;
			this._onTriggersMutated = onTriggersMutated || emptyCallback;
			this._onTriggersDeleted = onTriggersDeleted || emptyCallback;

			this._onTemplateCreated = onTemplateCreated || emptyCallback;
			this._onTemplateMutated = onTemplateMutated || emptyCallback;
			this._onTemplateDeleted = onTemplateDeleted || emptyCallback;
			
			this._onConnectionStatusChanged = onConnectionStatusChanged || emptyCallback;
		}

		/**
		 * The hostname of the Barchart Alerting Service.
		 *
		 * @public
		 * @returns {String}
		 */
		get host() {
			return this._host;
		}

		/**
		 * The TCP port number of the Barchart Alerting Service.
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
		 * @async
		 * @param {JwtProvider} jwtProvider
		 * @returns {Promise<AdapterBase>}
		 */
		async connect(jwtProvider) {
			return Promise.reject();
		}

		async createAlert(alert) {
			return null;
		}

		async retrieveAlert(alert) {
			return null;
		}

		async retrieveAlerts(query) {
			return null;
		}

		async updateAlert(alert) {
			return null;
		}

		async updateAlertsForUser(query) {
			return null;
		}

		async deleteAlert(alert) {
			return null;
		}

		subscribeAlerts(query) {
			return null;
		}

		async retrieveTrigger(query) {
			return null;
		}

		async retrieveTriggers(query) {
			return null;
		}

		async updateTrigger(query) {
			return null;
		}

		async updateTriggers(query) {
			return null;
		}

		subscribeTriggers(query) {
			return null;
		}

		async createTemplate(template) {
			return null;
		}

		async retrieveTemplates(query) {
			return null;
		}

		async updateTemplate(template) {
			return null;
		}

		async updateTemplateOrder(templates) {
			return null;
		}

		async deleteTemplate(template) {
			return null;
		}

		subscribeTemplates(query) {
			return null;
		}

		async getTargets() {
			return null;
		}

		async getProperties() {
			return null;
		}

		async getOperators() {
			return null;
		}

		async getModifiers() {
			return null;
		}

		async getPublisherTypes() {
			return null;
		}

		async getPublisherTypeDefaults(query) {
			return null;
		}

		async assignPublisherTypeDefault(publisherTypeDefault) {
			return null;
		}

		async deletePublisherTypeDefault(publisherTypeDefault) {
			return null;
		}

		async getMarketDataConfiguration(query) {
			return null;
		}

		async assignMarketDataConfiguration(marketDataConfiguration) {
			return null;
		}

		async getUser() {
			return null;
		}

		async getServerVersion() {
			return null;
		}

		toString() {
			return '[AdapterBase]';
		}
	}

	function emptyCallback(data) {

	}

	return AdapterBase;
})();
