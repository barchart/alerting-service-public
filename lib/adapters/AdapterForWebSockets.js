const AdapterBase = require('./AdapterBase');

module.exports = (() => {
	'use strict';

	/**
	 * A backend communication adapter implemented with WebSockets. Coming soon.
	 *
	 * @public
	 * @exported
	 * @extends {AdapterBase}
	 */
	class AdapterForWebSockets extends AdapterBase {
		constructor(host, port, secure, onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered) {
			super(onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered);
		}

		_onDispose() {

		}

		toString() {
			return '[AdapterForWebSockets]';
		}
	}

	return AdapterForWebSockets;
})();