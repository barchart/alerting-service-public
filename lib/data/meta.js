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
 * assign an empty array. This applies to all component types.
 *
 * @typedef Alert
 * @type Object
 * @memberOf Schema
 * @property {String=} alert_id - The alert's unique identifier (assigned by the backend, omit when creating a new alert).
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
 * @property {Array<Schema.Condition>} conditions - The conditions which cause an the alert to be triggered. If multiple conditions are present, they must all be satisfied before the alert will be triggered.
 * @property {Array<AlertResetSchedule>=} schedules
 * @property {Array<Publisher>=} publishers - The rules for publishing a notification. This is optional. In most cases, it's best to rely on the default rules bound to the alert's owner.
 * @property {Array<Publisher>=} effectivePublishers - A read-only property added by the backend listing the "effective" rules which will be used to publish notifications. Any rules in the "publishers" property take precedence, then the default rules for the alert's owner are applied.
 */

/**
 * A "condition" is a statement that can be evaluated (as the backend processes streaming data).
 *
 * For example, "Apple stock's last price is higher than $600" is a condition. Using this example,
 * the "property" object denotes "Apple stock's last price" and the "operator" object denotes "higher
 * than $600."
 *
 * Only required fields are necessary to create a condition (for use with a new alert object).
 *
 * @typedef Condition
 * @type Object
 * @memberOf Schema
 * @property {String} condition_id - The condition's unique identifier (assigned by the backend).
 * @property {String=} name - The name of the condition (if not provided, the backend will attempt to generate a name).
 * @property {Schema.Property} property - The "property" which is being evaluated (e.g. last price).
 * @property {Schema.Operator} operator - The "operator" to use to evaluate the ```property``` (e.g. greater than).
 */

/**
 * A "property" is an attribute of an observable object. A property refers to a {@link Target}.
 * For example, a **stock quote** is a target. The **last price** of the stock quote is the attribute.
 *
 * A property is a key component of a {@link Schema.Condition}.
 *
 * @typedef Property
 * @type Object
 * @memberOf Schema
 * @property {Number} property_id - The property's unique identifier (assigned by the backend).
 * @property {Schema.Target=} target - Points to a concrete object (e.g. Apple common stock versus Microsoft common stock). **This is required when a new alert.**
 * @property {Enums.PropertyType=} type - The attribute's value type (e.g. a number or a string).
 * @property {Array<Schema.Operator>=} valid_operators - A list of operators which can be used with this {@link Schema.Property} to create a {@link Schema.Condition}. Managed by the backend.
 * @property {Array<String>=} category - A grouping container for the property. Useful when displaying a list of properties. Managed by the backend.
 * @property {Array<String>=} description - A description of the property (broken into one or more components). Managed by the backend.
 * @property {Array<String>=} descriptionShort - Similar to ```description``` but with condensed or abbreviated wording. Managed by the backend.
 * @property {Number=} sortOrder - A suggested ranking for use when displaying a list of properties. Managed by the backend.
 */

/**
 * A "target" refers to an entire group of objects (e.g. stock quotes). When used to
 * build an alert, a target has an ```identifier``` which points to the specific object
 * (within the group).
 *
 * To use an example, a stock quote is a group of objects. The stock quote for Apple
 * refers to a specific item within the group (by using an ```identifier```).
 *
 * @typedef Target
 * @type Object
 * @memberOf Schema
 * @property {Number} target_id - The target's unique identifier (assigned by the backend). In other words, the identifier for the entire group.
 * @property {String=} description - The description of the target. In other words, the description of the entire group.
 * @property {String=} identifier - The identifier for the specific item within the group. For example, within the group of stock quotes, the symbol "AAPL" is the identifier for Apple. **This is required when a new alert.**
 * @property {String} identifier_description - The description of the a target's ```identifier```.
 * @property {String} type
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
 * The possible value types for a {@link Schema.Property}.
 *
 * @name PropertyType
 * @enum {String}
 * @memberOf Enums
 *
 * @property {String} number - A simple number.
 * @property {String} object - A complex object (with one or more of its own properties).
 * @property {String} percent - A number which represents a percentage where 1.0 represents 100% and 0.5 represents 50%.
 * @property {String} string - A simple string.
 */



