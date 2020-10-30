/**
 * A meta namespace containing signatures of anonymous functions.
 *
 * @namespace Callbacks
 */

/**
 * The function signature for a callback which notifies the {@link AlertManager}
 * after a new alert has been created.
 *
 * @public
 * @callback AlertCreatedCallback
 * @memberOf Callbacks
 * @returns {Schema.Alert}
 */

/**
 * The function signature for a callback which notifies the {@link AlertManager}
 * after an alert mutates (e.g. the ```alert_state``` property changes).
 *
 * @public
 * @callback AlertMutatedCallback
 * @memberOf Callbacks
 * @returns {Schema.Alert}
 */

/**
 * The function signature for a callback which notifies the {@link AlertManager}
 * after an alert has been deleted.
 *
 * @public
 * @callback AlertDeletedCallback
 * @memberOf Callbacks
 * @returns {Schema.Alert}
 */

/**
 * The function signature for a callback which notifies the {@link AlertManager}
 * after an alert has been triggered.
 *
 * @public
 * @callback AlertTriggeredCallback
 * @memberOf Callbacks
 * @returns {Schema.Alert}
 */
