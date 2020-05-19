## Contents {docsify-ignore}

* [Schema](#Schema) 

* [Enums](#Enums) 


* * *

## Schema :id=schema
>A meta namespace containing structural contracts of anonymous objects.

**Kind**: global namespace  

* [Schema](#Schema) : <code>object</code>
    * _static_
        * [.Alert](#SchemaAlert) : <code>Object</code>
        * [.Condition](#SchemaCondition) : <code>Object</code>
        * [.Property](#SchemaProperty) : <code>Object</code>
        * [.Target](#SchemaTarget) : <code>Object</code>
        * [.AlertIdentifier](#SchemaAlertIdentifier) : <code>Object</code>
        * [.AlertQuery](#SchemaAlertQuery) : <code>Object</code>
        * [.UserIdentifier](#SchemaUserIdentifier) : <code>Object</code>


* * *

### Schema.Alert :id=schemaalert
>An "alert" is the system's **primary** data structure. An "alert" is essentially
a collection of ```conditions``` which the backend monitors.

All required properties must be present to create a new alert. Once an alert has been
created, the backend will "fill in" any omitted properties. For example, if you create
an alert without a ```publishers``` property, the backend will add the property and
assign an empty array. This applies to all component types.

**Kind**: static typedef of <code>Schema</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [alert_id] | <code>String</code> | The alert's unique identifier (assigned by the backend, omit when creating a new alert). |
| [name] | <code>String</code> | The name of the alert (if not provided, the backend will attempt to generate a name). |
| user_id | <code>String</code> | The alert owner's unique identifier. |
| alert_system | <code>String</code> | The alert owner's domain. |
| [alert_state] | [<code>AlertState</code>](#EnumsAlertState) | The alert's current status (managed by the backend). |
| [alert_behaviour] | [<code>AlertBehaviour</code>](#EnumsAlertBehaviour) | The alert's strategy for handling state changes after its conditions are met —```terminate``` is the default value. |
| [create_date] | <code>String</code> | The time the alert was created (milliseconds since epoch). |
| [last_start_date] | <code>String</code> | The last time the alert was started (milliseconds since epoch). |
| [last_trigger_date] | <code>String</code> | The last time the alert was triggered (milliseconds since epoch). |
| [user_notes] | <code>String</code> | Ad hoc text. |
| [alert_type] | <code>String</code> | Used to classify the alert, controlling "default" publishing rules, if no publishers have been explicitly specified. This happens by matching the "active_alert_type" property of a [PublisherTypeDefault](PublisherTypeDefault). |
| conditions | [<code>Array.&lt;Condition&gt;</code>](#SchemaCondition) | The conditions which cause an the alert to be triggered. If multiple conditions are present, they must all be satisfied before the alert will be triggered. |
| [schedules] | <code>Array.&lt;AlertResetSchedule&gt;</code> |  |
| [publishers] | <code>Array.&lt;Publisher&gt;</code> | The rules for publishing a notification. This is optional. In most cases, it's best to rely on the default rules bound to the alert's owner. |
| [effectivePublishers] | <code>Array.&lt;Publisher&gt;</code> | A read-only property added by the backend listing the "effective" rules which will be used to publish notifications. Any rules in the "publishers" property take precedence, then the default rules for the alert's owner are applied. |


* * *

### Schema.Condition :id=schemacondition
>A "condition" is a statement that can be evaluated (as the backend processes streaming data).

For example, "Apple stock's last price is higher than $600" is a condition. Using this example,
the "property" object denotes "Apple stock's last price" and the "operator" object denotes "higher
than $600."

Only required fields are necessary to create a condition (for use with a new alert object).

**Kind**: static typedef of <code>Schema</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| condition_id | <code>String</code> | The condition's unique identifier (assigned by the backend). |
| [name] | <code>String</code> | The name of the condition (if not provided, the backend will attempt to generate a name). |
| property | [<code>Property</code>](#SchemaProperty) | The "property" which is being evaluated (e.g. last price). |
| operator | <code>Schema.Operator</code> | The "operator" to use to evaluate the ```property``` (e.g. greater than). |


* * *

### Schema.Property :id=schemaproperty
>A "property" is an attribute of an observable object. A property refers to a [Target](Target).
For example, a **stock quote** is a target. The **last price** of the stock quote is the attribute.

A property is a key component of a [Condition](#SchemaCondition).

**Kind**: static typedef of <code>Schema</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| property_id | <code>Number</code> | The property's unique identifier (assigned by the backend). |
| [target] | [<code>Target</code>](#SchemaTarget) | Points to a concrete object (e.g. Apple common stock versus Microsoft common stock). **This is required when a new alert.** |
| [type] | [<code>PropertyType</code>](#EnumsPropertyType) | The attribute's value type (e.g. a number or a string). |
| [valid_operators] | <code>Array.&lt;Schema.Operator&gt;</code> | A list of operators which can be used with this [Property](#SchemaProperty) to create a [Condition](#SchemaCondition). Managed by the backend. |
| [category] | <code>Array.&lt;String&gt;</code> | A grouping container for the property. Useful when displaying a list of properties. Managed by the backend. |
| [description] | <code>Array.&lt;String&gt;</code> | A description of the property (broken into one or more components). Managed by the backend. |
| [descriptionShort] | <code>Array.&lt;String&gt;</code> | Similar to ```description``` but with condensed or abbreviated wording. Managed by the backend. |
| [sortOrder] | <code>Number</code> | A suggested ranking for use when displaying a list of properties. Managed by the backend. |


* * *

### Schema.Target :id=schematarget
>A "target" refers to an entire group of objects (e.g. stock quotes). When used to
build an alert, a target has an ```identifier``` which points to the specific object
(within the group).

To use an example, a stock quote is a group of objects. The stock quote for Apple
refers to a specific item within the group (by using an ```identifier```).

**Kind**: static typedef of <code>Schema</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| target_id | <code>Number</code> | The target's unique identifier (assigned by the backend). In other words, the identifier for the entire group. |
| [description] | <code>String</code> | The description of the target. In other words, the description of the entire group. |
| [identifier] | <code>String</code> | The identifier for the specific item within the group. For example, within the group of stock quotes, the symbol "AAPL" is the identifier for Apple. **This is required when a new alert.** |
| identifier_description | <code>String</code> | The description of the a target's ```identifier```. |
| type | <code>String</code> |  |


* * *

### Schema.AlertIdentifier :id=schemaalertidentifier
>A subset of [Alert](#SchemaAlert) properties. An [Alert](#SchemaAlert) can be substituted
for this type.

**Kind**: static typedef of <code>Schema</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [alert_id] | <code>String</code> | The alert's unique identifier (assigned by the backend). |
| user_id | <code>String</code> | The alert owner's unique identifier. |
| alert_system | <code>String</code> | The alert owner's domain. |


* * *

### Schema.AlertQuery :id=schemaalertquery
>Parameters used when running a query for alerts.

**Kind**: static typedef of <code>Schema</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| user_id | <code>String</code> | A value to match against an alert's ```user_id``` property. |
| alert_system | <code>String</code> | A value to match against an alert's ```alert_system``` property. |
| [alert_system_key] | <code>String</code> | A value to match against an alert's ```alert_system_key``` property. |


* * *

### Schema.UserIdentifier :id=schemauseridentifier
>The compound key for a system user.

**Kind**: static typedef of <code>Schema</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| user_id | <code>String</code> | The alert owner's unique identifier. |
| alert_system | <code>String</code> | The alert owner's domain. |


* * *

## Enums :id=enums
>A namespace for enumerations.

**Kind**: global namespace  

* [Enums](#Enums) : <code>object</code>
    * _static_
        * [.AlertState](#EnumsAlertState) : <code>enum</code>
        * [.AlertBehaviour](#EnumsAlertBehaviour) : <code>enum</code>
        * [.PropertyType](#EnumsPropertyType) : <code>enum</code>


* * *

### Enums.AlertState :id=enumsalertstate
>The mutually-exclusive states an [Alert](#SchemaAlert) can inhabit.

**Kind**: static enum of <code>Enums</code>  
**Properties**

| Name | Description |
| --- | --- |
| Inactive | The alert is not processing. No notifications will be generated. |
| Starting | The alert is attempting to transition to the ```Active``` state. |
| Active | The alert is tracking; however, its conditions have not yet been met. |
| Scheduled | The alert is not currently tracking; however, it is scheduled to become ```Active``` in the future. |
| Stopping | The alert is attempting to transition to the ```Inactive``` state. |
| Triggered | The alert's conditions have been met. Functionally speaking, this is equivalent to the ```Inactive``` state. |


* * *

### Enums.AlertBehaviour :id=enumsalertbehaviour
>The possible ways an [Alert](#SchemaAlert) can react after its conditions have been met.

**Kind**: static enum of <code>Enums</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| terminate | <code>String</code> | When the alert becomes ```Active```, it begins tracking immediately. Once the alert's conditions have been met, notifications are published and tracking stops. The alert will transition to ```Triggered``` state. This is the default behavior. |
| continue | <code>String</code> | When the alert becomes ```Active```, it begins tracking immediately. Once the alert's conditions have been met, notifications are published and tracking continues. The alert will remain in the ```Active``` state. This is useful for news alerts. |
| schedule | <code>String</code> | When the alert becomes ```Active```, it waits until the until a scheduled time to begin tracking. Once an alert's conditions have been met, notifications will be published and tracking stops; however, The alert will remain in the ```Active``` state waiting to begin tracking again at the next scheduled time. This behavior is rarely used. |


* * *

### Enums.PropertyType :id=enumspropertytype
>The possible value types for a [Property](#SchemaProperty).

**Kind**: static enum of <code>Enums</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| number | <code>String</code> | A simple number. |
| object | <code>String</code> | A complex object (with one or more of its own properties). |
| percent | <code>String</code> | A number which represents a percentage where 1.0 represents 100% and 0.5 represents 50%. |
| string | <code>String</code> | A simple string. |


* * *

