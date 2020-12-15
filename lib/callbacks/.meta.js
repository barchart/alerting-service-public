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

/**
 * The function signature for a callback which notifies the {@link AlertManager}
 * after new triggers have been created.
 *
 * @public
 * @callback TriggersCreatedCallback
 * @memberOf Callbacks
 * @returns {Array<Schema.Trigger>}
 */

/**
 * The function signature for a callback which notifies the {@link AlertManager}
 * after triggers mutate (e.g. the ```trigger_status``` property changes).
 *
 * @public
 * @callback TriggersMutatedCallback
 * @memberOf Callbacks
 * @returns {Array<Schema.Trigger>}
 */

/**
 * The function signature for a callback which notifies the {@link AlertManager}
 * after triggers have been deleted (because the associated alert was deleted).
 *
 * @public
 * @callback TriggersDeletedCallback
 * @memberOf Callbacks
 * @returns {Array<Schema.Trigger>}
 */


