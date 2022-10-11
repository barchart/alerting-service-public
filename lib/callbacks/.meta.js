/**
 * A meta namespace containing signatures of anonymous functions.
 *
 * @namespace Callbacks
 */

/**
 * The function signature for a callback which is invoked after
 * a new alert has been created.
 *
 * @public
 * @callback AlertCreatedCallback
 * @memberOf Callbacks
 * @param {Schema.Alert} alert
 */

/**
 * The function signature for a callback which is invoked after
 * an alert mutates (e.g. the ```alert_state``` property changes).
 *
 * @public
 * @callback AlertMutatedCallback
 * @memberOf Callbacks
 * @param {Schema.Alert} alert
 */

/**
 * The function signature for a callback which is invoked after
 * an alert has been deleted.
 *
 * @public
 * @callback AlertDeletedCallback
 * @memberOf Callbacks
 * @param {Schema.Alert} alert
 */

/**
 * The function signature for a callback which is invoked after
 * an alert has been triggered.
 *
 * @public
 * @callback AlertTriggeredCallback
 * @memberOf Callbacks
 * @param {Schema.Alert} alert
 */

/**
 * The function signature for a callback which is invoked after
 * after new trigger(s) have been created.
 *
 * @public
 * @callback TriggersCreatedCallback
 * @memberOf Callbacks
 * @param {Array<Schema.Trigger>} triggers
 */

/**
 * The function signature for a callback which is invoked after
 * trigger(s) mutate (e.g. the ```trigger_status``` property changes).
 *
 * @public
 * @callback TriggersMutatedCallback
 * @memberOf Callbacks
 * @param {Array<Schema.Trigger>} triggers
 */

/**
 * The function signature for a callback which is invoked after
 * trigger(s) have been deleted (because the associated alert
 * was deleted).
 *
 * @public
 * @callback TriggersDeletedCallback
 * @memberOf Callbacks
 * @param {Array<Schema.Trigger>} triggers
 */

/**
 * The function signature for a callback which is invoked after
 * a new template has been created.
 *
 * @public
 * @callback TemplateCreatedCallback
 * @memberOf Callbacks
 * @param {Schema.Template} template
 */

/**
 * The function signature for a callback which is invoked after
 * a template mutates.
 *
 * @public
 * @callback TemplateMutatedCallback
 * @memberOf Callbacks
 * @param {Schema.Template} template
 */

/**
 * The function signature for a callback which is invoked after
 * a template has been deleted.
 *
 * @public
 * @callback TemplateDeletedCallback
 * @memberOf Callbacks
 * @param {Schema.Template} template
 */

/**
 * The function signature for a callback which is invoked the status
 * of the connection to the remote service changes.
 *
 * @public
 * @callback ConnectionStatusChangedCallback
 * @memberOf Callbacks
 * @param {String} status
 */