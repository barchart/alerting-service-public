/**
 * A namespace for enumerations.
 *
 * @namespace Enums
 */

/**
 * The possible ways an {@link Schema.Alert} can react after it has been published.
 *
 * @name AlertBehaviour
 * @enum {String}
 * @memberOf Enums
 * @property {String} terminate - When the alert becomes ```Active```, it begins tracking immediately. Once the alert's conditions have been met, notifications are published and tracking stops. The alert will transition to ```Triggered``` state. This is the default behavior.
 * @property {String} continue -  When the alert becomes ```Active```, it begins tracking immediately. Once the alert's conditions have been met, notifications are published and tracking continues. The alert will remain in the ```Active``` state. This is useful for news alerts.
 * @property {String} schedule - When the alert becomes ```Active```, it waits until the until a scheduled time to begin tracking. Once an alert's conditions have been met, notifications will be published and tracking stops; however, The alert will remain in the ```Active``` state waiting to begin tracking again at the next scheduled time. This behavior is rarely used.
 */

/**
 * The possible states an {@link Schema.Alert} can inhabit.
 *
 * @name AlertState
 * @enum {String}
 * @memberOf Enums
 * @property Inactive - The alert is not processing. No notifications will be generated.
 * @property Starting - The alert is attempting to transition to the ```Active``` state.
 * @property Active - The alert is tracking; however, its conditions have not yet been met.
 * @property Scheduled - The alert is not currently tracking; however, it is scheduled to become ```Active``` in the future.
 * @property Stopping - The alert is attempting to transition to the ```Inactive``` state.
 * @property Triggered - The alert's conditions have been met. Functionally speaking, this is equivalent to the ```Inactive``` state.
 */

/**
 * A meta namespace containing structural contracts of anonymous objects.
 *
 * @namespace Schema
 */

/**
 * The arguments which can be used with {@link AlertManager}.
 *
 * @typedef AlertFilter
 * @type Object
 * @memberOf Schema
 *
 * @property {String=} user_id - The identifier of the authenticated user.
 * @property {String=} alert_system - The domain of the authenticated user.
 */

/**
 * A user-defined set of conditions which is tracked by the remote service.
 * Once the conditions are met, a notification will be generated.
 *
 * @typedef Alert
 * @type Object
 * @memberOf Schema
 *
 * @property {String=} alert_id - The alert's unique identifier. This property will be assigned by the backend (when the alert is created).
 * @property {String} user_id - The unique identifier of the alert's owner.
 * @property {String} alert_system - The domain of the alert's owner.
 * @property {Enums.AlertBehaviour=} alert_behaviour - Defines the alerts behavior after its conditions have been met. The ```terminate``` behavior is default.
 *
 * @property {String=} user_notes
 * @property {Enums.AlertState=} alert_state - The alert's current status. This property is managed by the backend.

 * @property {String=} alert_type - Used to classify the alert, controlling "default" publishing rules, if no publishers have been explicitly specified. This happens by matching the "active_alert_type" property of a {@link PublisherTypeDefault}.
 * @property {Boolean=} automatic_reset
 * @property {String=} create_date
 * @property {Publisher[]} effectivePublishers
 * @property {String} last_start_date
 * @property {String} last_trigger_date
 * @property {String} name
 * @property {Condition[]} conditions
 * @property {Publisher[]} publishers
 * @property {AlertResetSchedule[]} schedules
 * @property {String} tracking_server_id
 */

/**
 * The arguments which can be used with {@link AlertManager}.
 *
 * @typedef AlertFilter
 * @type Object
 * @memberOf Schema
 * @property {String} alert_system_key -
 */



