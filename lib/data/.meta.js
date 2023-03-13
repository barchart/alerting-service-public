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
 *
 * @property {String=} alert_id - The alert's unique identifier (assigned by the backend, omit when creating a new alert).
 * @property {String=} template_id - The template identifier, if this alert was created from a template (otherwise null).
 * @property {String=} name - The name of the alert (if not provided, the backend will attempt to generate a name).
 * @property {String} user_id - The alert owner's unique identifier.
 * @property {String} alert_system - The alert owner's domain.
 * @property {Enums.AlertState=} alert_state - The alert's current status. Managed by the backend.
 * @property {Enums.AlertBehaviour=} alert_behaviour - The alert's strategy for handling state changes after its conditions are met —```terminate``` is the default value.
 * @property {String=} create_date - The time the alert was created (milliseconds since epoch). Managed by the backend.
 * @property {String=} last_start_date - The last time the alert was started (milliseconds since epoch). Managed by the backend.
 * @property {String=} last_trigger_date - The last time the alert was triggered (milliseconds since epoch). Managed by the backend.
 * @property {String=} user_notes - Ad hoc text.
 * @property {String=} alert_type - Used to classify the alert, controlling "default" publishing rules, if no publishers have been explicitly specified. This happens by matching the "active_alert_type" property of a {@link PublisherTypeDefault}.
 * @property {Array<Schema.Condition>} conditions - The conditions which cause an the alert to be triggered. If multiple conditions are present, they must all be satisfied before the alert will be triggered.
 * @property {Array<Schema.Publisher>=} publishers - The rules for sending notifications when the alert is triggered. This is optional. In most cases, it's best to rely on the default rules bound to the alert's owner.
 * @property {Array<Schema.Publisher>=} effectivePublishers - A read-only property added by the backend listing the "effective" rules which will be used to publish notifications. Any rules in the "publishers" property take precedence, then the default rules for the alert's owner are applied.
 * @property {Array<AlertResetSchedule>=} schedules
 */

/**
 * A "condition" is a statement that is evaluated by the backend (as streaming data is processed).
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
 *
 * @property {String} condition_id - The condition's unique identifier (assigned by the backend).
 * @property {String=} name - The name of the condition (if not provided, the backend will attempt to generate a name). Managed by the backend.
 * @property {Schema.Property} property - The "property" which is being evaluated (e.g. last price).
 * @property {Schema.Operator} operator - The "operator" to use to evaluate the ```property``` (e.g. greater than).
 */

/**
 * A "property" is an attribute of a "condition" referring to a streaming data source. A property includes
 * a {@link Target}. For example, the **last price** of the stock quote is a property. Specifying "Apple" stock,
 * as opposed to some other company, is the target.
 *
 * A property is a key component of a {@link Schema.Condition}.
 *
 * @typedef Property
 * @type Object
 * @memberOf Schema
 *
 * @property {Number} property_id - The property's unique identifier (assigned by the backend).
 * @property {Schema.Target=} target - Points to a concrete object (e.g. Apple common stock versus Microsoft common stock). Managed by the backend.
 * @property {Enums.PropertyType=} type - The attribute's value type (e.g. a number or a string). Managed by the backend.
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
 *
 * @property {Number} target_id - The target's unique identifier (assigned by the backend). In other words, the identifier for the entire group.
 * @property {String=} description - The description of the target. In other words, the description of the entire group. Managed by the backend.
 * @property {String=} identifier - The identifier for the specific item within the group. For example, within the group of stock quotes, the symbol "AAPL" is the identifier for Apple. **This is required when a new alert.**
 * @property {String} identifier_description - The description of the a target's ```identifier```. Managed by the backend.
 * @property {Enums.TargetType} type - Indicates if the target's identifier is an instrument symbol (e.g. AAPL). Managed by the backend.
 */

/**
 * A logical "operator" which can be used in a conditional expression. When
 * when as part of a {@link Condition}, the operator also includes an
 * ```operand``` value.
 *
 * For example, take the phrase  "greater than $600." The "operator"
 * refers to "greater than" and the "operand" refers to "$600."
 *
 * @typedef Operator
 * @type Object
 * @memberOf Schema
 *
 * @property {Number} operator_id - The operator's unique identifier (assigned by the backend).
 * @property {String=} operator_name - A description of the operator. Managed by the backend.
 * @property {Enums.OperatorType=} operator_type - Managed by the backend.
 * @property {Enums.OperandType=} operand_type - Describes the data type for an operand (e.g. for $600, the type is "number"). Managed by the backend.
 * @property {Boolean=} operand_literal - Indicates if the operand is a concrete value (e.g. $600). If not, the operand is a reference to a variable. Managed by the backend.
 * @property {Array<String>=} operand_options - Lists the possible values which can be used as an ```operand```; if the array has no items, then there is no restriction on possible values. Managed by the backend.
 * @property {String=} display.short - A short description of the operator (usually one character). Managed by the backend.
 * @property {String=} display.medium - A medium-length description of the operator. Managed by the backend.
 * @property {String=} display.long - A full-length description of the operator. Managed by the backend.
 * @property {Array=} modifiers
 */

/**
 * A "publisher" describes the rules for sending a specific type of notification when an alert triggers.
 *
 * Only required fields are necessary to create a publisher (for use with a new alert object).
 *
 * @typedef Publisher
 * @type Object
 * @memberOf Schema
 *
 * @property {Object} type
 * @property {Number} type.publisher_type_id - The identifier of the {@link Schema.PublisherType} this rule applies to.
 * @property {String=} recipient - The addressing data required to deliver a notification. For email notifications, an email address. For SMS notifications, a phone number.
 * @property {Boolean=} use_default_recipient - If present (and true), the recipient property is ignored; in favor the of default_recipient from the user's corresponding {@link Schema.PublisherTypeDefault}.
 */

/**
 * A subset of {@link Schema.Alert} properties. An {@link Schema.Alert} can be substituted
 * for this type.
 *
 * @typedef AlertIdentifier
 * @type Object
 * @memberOf Schema
 *
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
 *
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
 *
 * @property {String} user_id - The alert owner's unique identifier.
 * @property {String} alert_system - The alert owner's domain.
 */

/**
 * An object which describes a notification strategy.
 *
 * @typedef PublisherType
 * @type Object
 * @memberOf Schema
 *
 * @property {Number} publisher_type_id - The identifier of the notification strategy.
 * @property {String} transport - A description of the notification strategy.
 * @property {String} provider - A description of the mechanism used to deliver the notification.
 */

/**
 * An object which describes a user's preferences for one type of
 * notification strategy (e.g. email or text messages).
 *
 * @typedef PublisherTypeDefault
 * @type Object
 * @memberOf Schema
 *
 * @property {Number} publisher_type_id - The identifier of the referenced {@link Schema.PublisherType}.
 * @property {String} user_id - The owner of the preference.
 * @property {String} alert_system - The domain of the user who owns the preference.
 * @property {String} default_recipient - Strategy-dependent routing instructions (e.g. a phone number or an email address).
 * @property {String=} allow_window_start - The time of day, formatted as HH:MM, to begin allowing notifications to be sent.
 * @property {String=} allow_window_end - The time of day, formatted as HH:MM, to stop allowing notifications to be sent.
 * @property {String=} allow_window_timezone - The timezone which applies to allow_window_start and allow_window_end.
 * @property {String[]} active_alert_types - Applies this rule to any alert any alert with a matching "alert_type" property value.
 */

/**
 * A template.
 *
 * @typedef Template
 * @type Object
 * @memberOf Schema
 *
 * @property {String=} template_id - The template's unique identifier (assigned by the backend, omit when creating a new template).
 * @property {String=} name - The name of the template (if not provided, the backend will attempt to generate a name).
 * @property {String=} description - The description of the template.
 * @property {String=} frequency - A text description that indicates how (or if) schedules should be added when creating new alerts from this template.
 * @property {String=} alert_type - Same as the "alert_type" property of an Alert object.
 * @property {Boolean=} use_as_default - Indicates if this is the default template for a given "alert_type" property value.
 * @property {String} user_id - The template owner's unique identifier.
 * @property {String} alert_system - The template owner's domain.
 * @property {Number} sort_order - The order, relative to other templates, this template should be displayed in.
 * @property {String=} create_date - The time the alert was created (milliseconds since epoch). Managed by the backend.
 * @property {Array<Schema.TemplateCondition>} conditions - An array of conditions without target.
 */

/**
 * A template condition.
 *
 * @typedef TemplateCondition
 * @type Object
 * @memberOf Schema
 *
 * @property {String} template_condition_id - The template's condition unique identifier (assigned by the backend).
 * @property {String=} name - The name of the template condition (if not provided, the backend will attempt to generate a name). Managed by the backend.
 * @property {Schema.Property} property - The "property" which is being evaluated (e.g. last price).
 * @property {Schema.Operator} operator - The "operator" to use to evaluate the ```property``` (e.g. greater than).
 */

/**
 * Parameters used when running a query for templates.
 *
 * @typedef TemplateSortOrderDefinition
 * @type Object
 * @memberOf Schema
 *
 * @property {String} template_id - The template's unique identifier.
 * @property {Number} sort_order - The order, relative to other templates, this template should be displayed in.
 */

/**
 * Parameters used when running a query for templates.
 *
 * @typedef TemplateQuery
 * @type Object
 * @memberOf Schema
 *
 * @property {String} user_id - A value to match against an alert's ```user_id``` property.
 * @property {String} alert_system - A value to match against an alert's ```alert_system``` property.
 */

/**
 * When all of an alert's conditions are met, the alert triggers. An alert
 * may be triggered multiple times. This object contains information
 * regarding an alert trigger and can be marked as read (or unread).
 *
 * @typedef Trigger
 * @type Object
 * @memberOf Schema
 *
 * @property {String} alert_id - The alert's unique identifier.
 * @property {String} alert_name - The name of the alert (at the time the trigger was created).
 * @property {String} user_id - The alert owner's unique identifier.
 * @property {String} alert_system - The alert owner's domain.
 * @property {String} trigger_date - The time the alert was triggered (milliseconds since epoch).
 * @property {Enums.TriggerStatus} trigger_status - The status of the trigger.
 * @property {String} trigger_status_date - The last time the alert trigger status was updated (milliseconds since epoch).
 * @property {String} trigger_title - A human-readable title.
 * @property {String} trigger_description - A human-readable description.
 * @property {Object} trigger_additional_data - An additional data.
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
 *
 * @property Inactive - The alert is not processing. No notifications will be generated.
 * @property Starting - The alert is attempting to transition to the ```Active``` state.
 * @property Active - The alert is tracking; however, its conditions have not yet been met.
 * @property Stopping - The alert is attempting to transition to the ```Inactive``` state.
 * @property Triggered - The alert's conditions have been met. Functionally speaking, this is equivalent to the ```Inactive``` state.
 * @property Expired - Tracking was stopped because the alert condition can never be met (e.g. a futures contract has expired, no further updates to the feed are possible).
 * @property Suspended - The tracking was suspended for system maintenance.
 * @property Orphaned - Either tracking was suspended for system maintenance or an error occurred which forced tracking to stop.
 */

/**
 * The possible ways an {@link Schema.Alert} can react after its conditions have been met.
 *
 * @name AlertBehaviour
 * @enum {String}
 * @memberOf Enums
 *
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
 * @property {String} string - A simple string.
 * @property {String} percent - A number which represents a percentage where 1.0 represents 100% and 0.5 represents 50%.
 * @property {String} object - A complex object (with one or more of its own properties).
 */

/**
 * Describes the type of an operator's operand. For example, in the phrase "greater
 * than $600," where the operand is "$600," the type is a number.
 *
 * @name OperandType
 * @enum {String}
 * @memberOf Enums
 *
 * @property {String} number - A simple number.
 * @property {String} string - A simple string.
 */

/**
 * @name OperatorType
 * @enum {String}
 * @memberOf Enums
 *
 * @property {String} unary - The operator does not require an operand.
 * @property {String} binary - The operator requires one operand.
 */

/**
 * Categories a target's identifier.
 *
 * @name TargetType
 * @enum {String}
 * @memberOf Enums
 *
 * @property {String} string - The target's identifier is a simple string.
 * @property {String} symbol - The target's identifier is an instrument symbol (e.g. "AAPL" for Apple stock).
 */

/**
 * Describes whether an alert has been acknowledged (in the same way an email
 * can be marked as "read" or "unread").
 *
 * @name TriggerStatus
 * @enum {String}
 * @memberOf Enums
 *
 * @property {String} Read - The alert trigger has been acknowledged.
 * @property {String} Unread - The alert trigger has not been acknowledged.
 */
