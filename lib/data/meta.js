/**
 * A namespace for enumerations.
 *
 * @namespace Enums
 */

/**
 * The mutually-exclusive states an {@link Schema.Alert} can inhabit.
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
 * The possible ways an {@link Schema.Alert} can react after its conditions have been met.
 *
 * @name AlertBehaviour
 * @enum {String}
 * @memberOf Enums
 * @property {String} terminate - When the alert becomes ```Active```, it begins tracking immediately. Once the alert's conditions have been met, notifications are published and tracking stops. The alert will transition to ```Triggered``` state. This is the default behavior.
 * @property {String} continue -  When the alert becomes ```Active```, it begins tracking immediately. Once the alert's conditions have been met, notifications are published and tracking continues. The alert will remain in the ```Active``` state. This is useful for news alerts.
 * @property {String} schedule - When the alert becomes ```Active```, it waits until the until a scheduled time to begin tracking. Once an alert's conditions have been met, notifications will be published and tracking stops; however, The alert will remain in the ```Active``` state waiting to begin tracking again at the next scheduled time. This behavior is rarely used.
 */

/**
 * A meta namespace containing structural contracts of anonymous objects.
 *
 * @namespace Schema
 */

/**
 * An "alert" is the system's **primary** data structure. An "alert" is essentially
 * a collection of ```conditions``` which the backend monitors.
 *
 * All required properties must be present to create a new alert. Once an alert has been
 * created, the backend will "fill in" any omitted properties. For example, if you create
 * an alert without a ```publishers``` property, the backend will add the property and
 * assign an empty array.
 *
 * @typedef Alert
 * @type Object
 * @memberOf Schema
 * @property {String=} alert_id - The alert's unique identifier (assigned by the backend).
 * @property {String=} name - The name of the alert (if not provided, the backend will attempt to generate a name).
 * @property {String} user_id - The alert owner's unique identifier.
 * @property {String} alert_system - The alert owner's domain.
 * @property {Enums.AlertState=} alert_state - The alert's current status (managed by the backend).
 * @property {Enums.AlertBehaviour=} alert_behaviour - The alert's strategy for handling state changes after its conditions are met —```terminate``` is the default value.
 * @property {String=} create_date - The time the alert was created (milliseconds since epoch).
 * @property {String=} last_start_date - The last time the alert was started (milliseconds since epoch).
 * @property {String=} last_trigger_date - The last time the alert was triggered (milliseconds since epoch).
 * @property {String=} user_notes - Ad hoc text.
 * @property {String=} alert_type - Used to classify the alert, controlling "default" publishing rules, if no publishers have been explicitly specified. This happens by matching the "active_alert_type" property of a {@link PublisherTypeDefault}.
 * @property {Condition[]} conditions - The conditions which cause an the alert to be triggered.
 * @property {Array<AlertResetSchedule>=} schedules
 * @property {Array<Publisher>=} publishers - The rules for publishing a notification. This is optional. In most cases, it's best to rely on the default rules bound to the alert's owner.
 * @property {Array<Publisher>=} effectivePublishers - A read-only property added by the backend listing the "effective" rules which will be used to publish notifications. Any rules in the "publishers" property take precedence, then the default rules for the alert's owner are applied.
 */

/**
 * A "condition" is a statement that can be evaluated as the backend processes streaming data.
 *
 * For example, "Apple stock's last price is higher than $600" forms a "condition" object.
 * Breaking down the example, the "property" object denotes "Apple stock's last price" and
 * the "operator" object denotes "higher than $600."
 *
 * Only required properties are necessary to create a new condition.
 *
 * @typedef Condition
 * @type Object
 * @memberOf Schema
 * @property {String=} condition_id - The conditions's unique identifier (assigned by the backend).
 * @property {String=} name - The name of the condition (if not provided, the backend will attempt to generate a name).
 * @property {Schema.Property} property - The "property" which is being evaluated (e.g. last price).
 * @property {Schema.Operator} operator - The "operator" to use to evaluate the ```property``` (e.g. greater than).
 */

/**
 * A subset of {@link Schema.Alert} properties. An {@link Schema.Alert} can be substituted
 * for this type.
 *
 * @typedef AlertIdentifier
 * @type Object
 * @memberOf Schema
 * @property {String=} alert_id - The alert's unique identifier (assigned by the backend).
 * @property {String} user_id - The alert owner's unique identifier.
 * @property {String} alert_system - The alert owner's domain.
 */

/**
 * Parameters used when running a query for alerts.
 *
 * @typedef AlertQuery
 * @type Object
 * @memberOf Schema
 * @property {String} user_id - A value to match against an alert's ```user_id``` property.
 * @property {String} alert_system - A value to match against an alert's ```alert_system``` property.
 * @property {String=} alert_system_key - A value to match against an alert's ```alert_system_key``` property.
 */

/**
 * The compound key for a system user.
 *
 * @typedef UserIdentifier
 * @type Object
 * @memberOf Schema
 * @property {String} user_id - The alert owner's unique identifier.
 * @property {String} alert_system - The alert owner's domain.
 */



