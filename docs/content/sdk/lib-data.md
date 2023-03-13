## Contents {docsify-ignore}

* [Schema](#Schema) 

* [Enums](#Enums) 


* * *

## Schema :id=schema
> A meta namespace containing structural contracts of anonymous objects.

**Kind**: global namespace  

* [Schema](#Schema) : <code>object</code>
    * _static_
        * [.Alert](#SchemaAlert) : <code>Object</code>
        * [.Condition](#SchemaCondition) : <code>Object</code>
        * [.Property](#SchemaProperty) : <code>Object</code>
        * [.Target](#SchemaTarget) : <code>Object</code>
        * [.Operator](#SchemaOperator) : <code>Object</code>
        * [.Publisher](#SchemaPublisher) : <code>Object</code>
        * [.AlertIdentifier](#SchemaAlertIdentifier) : <code>Object</code>
        * [.AlertQuery](#SchemaAlertQuery) : <code>Object</code>
        * [.UserIdentifier](#SchemaUserIdentifier) : <code>Object</code>
        * [.PublisherType](#SchemaPublisherType) : <code>Object</code>
        * [.PublisherTypeDefault](#SchemaPublisherTypeDefault) : <code>Object</code>
        * [.Template](#SchemaTemplate) : <code>Object</code>
        * [.TemplateCondition](#SchemaTemplateCondition) : <code>Object</code>
        * [.TemplateSortOrderDefinition](#SchemaTemplateSortOrderDefinition) : <code>Object</code>
        * [.TemplateQuery](#SchemaTemplateQuery) : <code>Object</code>
        * [.Trigger](#SchemaTrigger) : <code>Object</code>


* * *

### Schema.Alert :id=schemaalert
> An &quot;alert&quot; is the system's <strong>primary</strong> data structure. An &quot;alert&quot; is essentially
> a collection of <code>conditions</code> which the backend monitors.</p>
> <p>All required properties must be present to create a new alert. Once an alert has been
> created, the backend will &quot;fill in&quot; any omitted properties. For example, if you create
> an alert without a <code>publishers</code> property, the backend will add the property and
> assign an empty array. This applies to all component types.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [alert_id] | <code>String</code> | <p>The alert's unique identifier (assigned by the backend, omit when creating a new alert).</p> |
| [template_id] | <code>String</code> | <p>The template identifier, if this alert was created from a template (otherwise null).</p> |
| [name] | <code>String</code> | <p>The name of the alert (if not provided, the backend will attempt to generate a name).</p> |
| user_id | <code>String</code> | <p>The alert owner's unique identifier.</p> |
| alert_system | <code>String</code> | <p>The alert owner's domain.</p> |
| [alert_state] | [<code>AlertState</code>](#EnumsAlertState) | <p>The alert's current status. Managed by the backend.</p> |
| [alert_behaviour] | [<code>AlertBehaviour</code>](#EnumsAlertBehaviour) | <p>The alert's strategy for handling state changes after its conditions are met —<code>terminate</code> is the default value.</p> |
| [create_date] | <code>String</code> | <p>The time the alert was created (milliseconds since epoch). Managed by the backend.</p> |
| [last_start_date] | <code>String</code> | <p>The last time the alert was started (milliseconds since epoch). Managed by the backend.</p> |
| [last_trigger_date] | <code>String</code> | <p>The last time the alert was triggered (milliseconds since epoch). Managed by the backend.</p> |
| [user_notes] | <code>String</code> | <p>Ad hoc text.</p> |
| [alert_type] | <code>String</code> | <p>Used to classify the alert, controlling &quot;default&quot; publishing rules, if no publishers have been explicitly specified. This happens by matching the &quot;active_alert_type&quot; property of a [PublisherTypeDefault](#publishertypedefault).</p> |
| conditions | [<code>Array.&lt;Condition&gt;</code>](#SchemaCondition) | <p>The conditions which cause an the alert to be triggered. If multiple conditions are present, they must all be satisfied before the alert will be triggered.</p> |
| [publishers] | [<code>Array.&lt;Publisher&gt;</code>](#SchemaPublisher) | <p>The rules for sending notifications when the alert is triggered. This is optional. In most cases, it's best to rely on the default rules bound to the alert's owner.</p> |
| [effectivePublishers] | [<code>Array.&lt;Publisher&gt;</code>](#SchemaPublisher) | <p>A read-only property added by the backend listing the &quot;effective&quot; rules which will be used to publish notifications. Any rules in the &quot;publishers&quot; property take precedence, then the default rules for the alert's owner are applied.</p> |
| [schedules] | <code>Array.&lt;AlertResetSchedule&gt;</code> |  |


* * *

### Schema.Condition :id=schemacondition
> A &quot;condition&quot; is a statement that is evaluated by the backend (as streaming data is processed).</p>
> <p>For example, &quot;Apple stock's last price is higher than $600&quot; is a condition. Using this example,
> the &quot;property&quot; object denotes &quot;Apple stock's last price&quot; and the &quot;operator&quot; object denotes &quot;higher
> than $600.&quot;</p>
> <p>Only required fields are necessary to create a condition (for use with a new alert object).

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| condition_id | <code>String</code> | <p>The condition's unique identifier (assigned by the backend).</p> |
| [name] | <code>String</code> | <p>The name of the condition (if not provided, the backend will attempt to generate a name). Managed by the backend.</p> |
| property | [<code>Property</code>](#SchemaProperty) | <p>The &quot;property&quot; which is being evaluated (e.g. last price).</p> |
| operator | [<code>Operator</code>](#SchemaOperator) | <p>The &quot;operator&quot; to use to evaluate the <code>property</code> (e.g. greater than).</p> |


* * *

### Schema.Property :id=schemaproperty
> A &quot;property&quot; is an attribute of a &quot;condition&quot; referring to a streaming data source. A property includes
> a [Target](#target). For example, the <strong>last price</strong> of the stock quote is a property. Specifying &quot;Apple&quot; stock,
> as opposed to some other company, is the target.</p>
> <p>A property is a key component of a [Condition](#schemacondition).

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| property_id | <code>Number</code> | <p>The property's unique identifier (assigned by the backend).</p> |
| [target] | [<code>Target</code>](#SchemaTarget) | <p>Points to a concrete object (e.g. Apple common stock versus Microsoft common stock). Managed by the backend.</p> |
| [type] | [<code>PropertyType</code>](#EnumsPropertyType) | <p>The attribute's value type (e.g. a number or a string). Managed by the backend.</p> |
| [valid_operators] | [<code>Array.&lt;Operator&gt;</code>](#SchemaOperator) | <p>A list of operators which can be used with this [Property](#schemaproperty) to create a [Condition](#schemacondition). Managed by the backend.</p> |
| [category] | <code>Array.&lt;String&gt;</code> | <p>A grouping container for the property. Useful when displaying a list of properties. Managed by the backend.</p> |
| [description] | <code>Array.&lt;String&gt;</code> | <p>A description of the property (broken into one or more components). Managed by the backend.</p> |
| [descriptionShort] | <code>Array.&lt;String&gt;</code> | <p>Similar to <code>description</code> but with condensed or abbreviated wording. Managed by the backend.</p> |
| [sortOrder] | <code>Number</code> | <p>A suggested ranking for use when displaying a list of properties. Managed by the backend.</p> |


* * *

### Schema.Target :id=schematarget
> A &quot;target&quot; refers to an entire group of objects (e.g. stock quotes). When used to
> build an alert, a target has an <code>identifier</code> which points to the specific object
> (within the group).</p>
> <p>To use an example, a stock quote is a group of objects. The stock quote for Apple
> refers to a specific item within the group (by using an <code>identifier</code>).

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| target_id | <code>Number</code> | <p>The target's unique identifier (assigned by the backend). In other words, the identifier for the entire group.</p> |
| [description] | <code>String</code> | <p>The description of the target. In other words, the description of the entire group. Managed by the backend.</p> |
| [identifier] | <code>String</code> | <p>The identifier for the specific item within the group. For example, within the group of stock quotes, the symbol &quot;AAPL&quot; is the identifier for Apple. <strong>This is required when a new alert.</strong></p> |
| identifier_description | <code>String</code> | <p>The description of the a target's <code>identifier</code>. Managed by the backend.</p> |
| type | [<code>TargetType</code>](#EnumsTargetType) | <p>Indicates if the target's identifier is an instrument symbol (e.g. AAPL). Managed by the backend.</p> |


* * *

### Schema.Operator :id=schemaoperator
> A logical &quot;operator&quot; which can be used in a conditional expression. When
> when as part of a [Condition](#condition), the operator also includes an
> <code>operand</code> value.</p>
> <p>For example, take the phrase  &quot;greater than $600.&quot; The &quot;operator&quot;
> refers to &quot;greater than&quot; and the &quot;operand&quot; refers to &quot;$600.&quot;

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| operator_id | <code>Number</code> | <p>The operator's unique identifier (assigned by the backend).</p> |
| [operator_name] | <code>String</code> | <p>A description of the operator. Managed by the backend.</p> |
| [operator_type] | [<code>OperatorType</code>](#EnumsOperatorType) | <p>Managed by the backend.</p> |
| [operand_type] | [<code>OperandType</code>](#EnumsOperandType) | <p>Describes the data type for an operand (e.g. for $600, the type is &quot;number&quot;). Managed by the backend.</p> |
| [operand_literal] | <code>Boolean</code> | <p>Indicates if the operand is a concrete value (e.g. $600). If not, the operand is a reference to a variable. Managed by the backend.</p> |
| [operand_options] | <code>Array.&lt;String&gt;</code> | <p>Lists the possible values which can be used as an <code>operand</code>; if the array has no items, then there is no restriction on possible values. Managed by the backend.</p> |
| [display.short] | <code>String</code> | <p>A short description of the operator (usually one character). Managed by the backend.</p> |
| [display.medium] | <code>String</code> | <p>A medium-length description of the operator. Managed by the backend.</p> |
| [display.long] | <code>String</code> | <p>A full-length description of the operator. Managed by the backend.</p> |
| [modifiers] | <code>Array</code> |  |


* * *

### Schema.Publisher :id=schemapublisher
> A &quot;publisher&quot; describes the rules for sending a specific type of notification when an alert triggers.</p>
> <p>Only required fields are necessary to create a publisher (for use with a new alert object).

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>Object</code> |  |
| type.publisher_type_id | <code>Number</code> | <p>The identifier of the [PublisherType](#schemapublishertype) this rule applies to.</p> |
| [recipient] | <code>String</code> | <p>The addressing data required to deliver a notification. For email notifications, an email address. For SMS notifications, a phone number.</p> |
| [use_default_recipient] | <code>Boolean</code> | <p>If present (and true), the recipient property is ignored; in favor the of default_recipient from the user's corresponding [PublisherTypeDefault](#schemapublishertypedefault).</p> |


* * *

### Schema.AlertIdentifier :id=schemaalertidentifier
> A subset of [Alert](#schemaalert) properties. An [Alert](#schemaalert) can be substituted
> for this type.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [alert_id] | <code>String</code> | <p>The alert's unique identifier (assigned by the backend).</p> |
| user_id | <code>String</code> | <p>The alert owner's unique identifier.</p> |
| alert_system | <code>String</code> | <p>The alert owner's domain.</p> |


* * *

### Schema.AlertQuery :id=schemaalertquery
> Parameters used when running a query for alerts.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| user_id | <code>String</code> | <p>A value to match against an alert's <code>user_id</code> property.</p> |
| alert_system | <code>String</code> | <p>A value to match against an alert's <code>alert_system</code> property.</p> |
| [alert_system_key] | <code>String</code> | <p>A value to match against an alert's <code>alert_system_key</code> property.</p> |


* * *

### Schema.UserIdentifier :id=schemauseridentifier
> The compound key for a system user.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| user_id | <code>String</code> | <p>The alert owner's unique identifier.</p> |
| alert_system | <code>String</code> | <p>The alert owner's domain.</p> |


* * *

### Schema.PublisherType :id=schemapublishertype
> An object which describes a notification strategy.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| publisher_type_id | <code>Number</code> | <p>The identifier of the notification strategy.</p> |
| transport | <code>String</code> | <p>A description of the notification strategy.</p> |
| provider | <code>String</code> | <p>A description of the mechanism used to deliver the notification.</p> |


* * *

### Schema.PublisherTypeDefault :id=schemapublishertypedefault
> An object which describes a user's preferences for one type of
> notification strategy (e.g. email or text messages).

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| publisher_type_id | <code>Number</code> | <p>The identifier of the referenced [PublisherType](#schemapublishertype).</p> |
| user_id | <code>String</code> | <p>The owner of the preference.</p> |
| alert_system | <code>String</code> | <p>The domain of the user who owns the preference.</p> |
| default_recipient | <code>String</code> | <p>Strategy-dependent routing instructions (e.g. a phone number or an email address).</p> |
| [allow_window_start] | <code>String</code> | <p>The time of day, formatted as HH:MM, to begin allowing notifications to be sent.</p> |
| [allow_window_end] | <code>String</code> | <p>The time of day, formatted as HH:MM, to stop allowing notifications to be sent.</p> |
| [allow_window_timezone] | <code>String</code> | <p>The timezone which applies to allow_window_start and allow_window_end.</p> |
| active_alert_types | <code>Array.&lt;String&gt;</code> | <p>Applies this rule to any alert any alert with a matching &quot;alert_type&quot; property value.</p> |


* * *

### Schema.Template :id=schematemplate
> A template.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [template_id] | <code>String</code> | <p>The template's unique identifier (assigned by the backend, omit when creating a new template).</p> |
| [name] | <code>String</code> | <p>The name of the template (if not provided, the backend will attempt to generate a name).</p> |
| [description] | <code>String</code> | <p>The description of the template.</p> |
| [frequency] | <code>String</code> | <p>A text description that indicates how (or if) schedules should be added when creating new alerts from this template.</p> |
| [alert_type] | <code>String</code> | <p>Same as the &quot;alert_type&quot; property of an Alert object.</p> |
| [use_as_default] | <code>Boolean</code> | <p>Indicates if this is the default template for a given &quot;alert_type&quot; property value.</p> |
| user_id | <code>String</code> | <p>The template owner's unique identifier.</p> |
| alert_system | <code>String</code> | <p>The template owner's domain.</p> |
| sort_order | <code>Number</code> | <p>The order, relative to other templates, this template should be displayed in.</p> |
| [create_date] | <code>String</code> | <p>The time the alert was created (milliseconds since epoch). Managed by the backend.</p> |
| conditions | [<code>Array.&lt;TemplateCondition&gt;</code>](#SchemaTemplateCondition) | <p>An array of conditions without target.</p> |


* * *

### Schema.TemplateCondition :id=schematemplatecondition
> A template condition.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| template_condition_id | <code>String</code> | <p>The template's condition unique identifier (assigned by the backend).</p> |
| [name] | <code>String</code> | <p>The name of the template condition (if not provided, the backend will attempt to generate a name). Managed by the backend.</p> |
| property | [<code>Property</code>](#SchemaProperty) | <p>The &quot;property&quot; which is being evaluated (e.g. last price).</p> |
| operator | [<code>Operator</code>](#SchemaOperator) | <p>The &quot;operator&quot; to use to evaluate the <code>property</code> (e.g. greater than).</p> |


* * *

### Schema.TemplateSortOrderDefinition :id=schematemplatesortorderdefinition
> Parameters used when running a query for templates.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| template_id | <code>String</code> | <p>The template's unique identifier.</p> |
| sort_order | <code>Number</code> | <p>The order, relative to other templates, this template should be displayed in.</p> |


* * *

### Schema.TemplateQuery :id=schematemplatequery
> Parameters used when running a query for templates.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| user_id | <code>String</code> | <p>A value to match against an alert's <code>user_id</code> property.</p> |
| alert_system | <code>String</code> | <p>A value to match against an alert's <code>alert_system</code> property.</p> |


* * *

### Schema.Trigger :id=schematrigger
> When all of an alert's conditions are met, the alert triggers. An alert
> may be triggered multiple times. This object contains information
> regarding an alert trigger and can be marked as read (or unread).

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| alert_id | <code>String</code> | <p>The alert's unique identifier.</p> |
| alert_name | <code>String</code> | <p>The name of the alert (at the time the trigger was created).</p> |
| user_id | <code>String</code> | <p>The alert owner's unique identifier.</p> |
| alert_system | <code>String</code> | <p>The alert owner's domain.</p> |
| trigger_date | <code>String</code> | <p>The time the alert was triggered (milliseconds since epoch).</p> |
| trigger_status | [<code>TriggerStatus</code>](#EnumsTriggerStatus) | <p>The status of the trigger.</p> |
| trigger_status_date | <code>String</code> | <p>The last time the alert trigger status was updated (milliseconds since epoch).</p> |
| trigger_title | <code>String</code> | <p>A human-readable title.</p> |
| trigger_description | <code>String</code> | <p>A human-readable description.</p> |
| trigger_additional_data | <code>Object</code> | <p>An additional data.</p> |


* * *

## Enums :id=enums
> A namespace for enumerations.

**Kind**: global namespace  

* [Enums](#Enums) : <code>object</code>
    * _static_
        * [.AlertState](#EnumsAlertState) : <code>enum</code>
        * [.AlertBehaviour](#EnumsAlertBehaviour) : <code>enum</code>
        * [.PropertyType](#EnumsPropertyType) : <code>enum</code>
        * [.OperandType](#EnumsOperandType) : <code>enum</code>
        * [.OperatorType](#EnumsOperatorType) : <code>enum</code>
        * [.TargetType](#EnumsTargetType) : <code>enum</code>
        * [.TriggerStatus](#EnumsTriggerStatus) : <code>enum</code>


* * *

### Enums.AlertState :id=enumsalertstate
> The mutually-exclusive states an [Alert](#schemaalert) can inhabit.

**Kind**: static enum of [<code>Enums</code>](#Enums)  
**Properties**

| Name | Description |
| --- | --- |
| Inactive | <p>The alert is not processing. No notifications will be generated.</p> |
| Starting | <p>The alert is attempting to transition to the <code>Active</code> state.</p> |
| Active | <p>The alert is tracking; however, its conditions have not yet been met.</p> |
| Stopping | <p>The alert is attempting to transition to the <code>Inactive</code> state.</p> |
| Triggered | <p>The alert's conditions have been met. Functionally speaking, this is equivalent to the <code>Inactive</code> state.</p> |
| Expired | <p>Tracking was stopped because the alert condition can never be met (e.g. a futures contract has expired, no further updates to the feed are possible).</p> |
| Suspended | <p>The tracking was suspended for system maintenance.</p> |
| Orphaned | <p>Either tracking was suspended for system maintenance or an error occurred which forced tracking to stop.</p> |


* * *

### Enums.AlertBehaviour :id=enumsalertbehaviour
> The possible ways an [Alert](#schemaalert) can react after its conditions have been met.

**Kind**: static enum of [<code>Enums</code>](#Enums)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| terminate | <code>String</code> | <p>When the alert becomes <code>Active</code>, it begins tracking immediately. Once the alert's conditions have been met, notifications are published and tracking stops. The alert will transition to <code>Triggered</code> state. This is the default behavior.</p> |
| continue | <code>String</code> | <p>When the alert becomes <code>Active</code>, it begins tracking immediately. Once the alert's conditions have been met, notifications are published and tracking continues. The alert will remain in the <code>Active</code> state. This is useful for news alerts.</p> |
| schedule | <code>String</code> | <p>When the alert becomes <code>Active</code>, it waits until the until a scheduled time to begin tracking. Once an alert's conditions have been met, notifications will be published and tracking stops; however, The alert will remain in the <code>Active</code> state waiting to begin tracking again at the next scheduled time. This behavior is rarely used.</p> |


* * *

### Enums.PropertyType :id=enumspropertytype
> The possible value types for a [Property](#schemaproperty).

**Kind**: static enum of [<code>Enums</code>](#Enums)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| number | <code>String</code> | <p>A simple number.</p> |
| string | <code>String</code> | <p>A simple string.</p> |
| percent | <code>String</code> | <p>A number which represents a percentage where 1.0 represents 100% and 0.5 represents 50%.</p> |
| object | <code>String</code> | <p>A complex object (with one or more of its own properties).</p> |


* * *

### Enums.OperandType :id=enumsoperandtype
> Describes the type of an operator's operand. For example, in the phrase &quot;greater
> than $600,&quot; where the operand is &quot;$600,&quot; the type is a number.

**Kind**: static enum of [<code>Enums</code>](#Enums)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| number | <code>String</code> | <p>A simple number.</p> |
| string | <code>String</code> | <p>A simple string.</p> |


* * *

### Enums.OperatorType :id=enumsoperatortype
**Kind**: static enum of [<code>Enums</code>](#Enums)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| unary | <code>String</code> | <p>The operator does not require an operand.</p> |
| binary | <code>String</code> | <p>The operator requires one operand.</p> |


* * *

### Enums.TargetType :id=enumstargettype
> Categories a target's identifier.

**Kind**: static enum of [<code>Enums</code>](#Enums)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| string | <code>String</code> | <p>The target's identifier is a simple string.</p> |
| symbol | <code>String</code> | <p>The target's identifier is an instrument symbol (e.g. &quot;AAPL&quot; for Apple stock).</p> |


* * *

### Enums.TriggerStatus :id=enumstriggerstatus
> Describes whether an alert has been acknowledged (in the same way an email
> can be marked as &quot;read&quot; or &quot;unread&quot;).

**Kind**: static enum of [<code>Enums</code>](#Enums)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| Read | <code>String</code> | <p>The alert trigger has been acknowledged.</p> |
| Unread | <code>String</code> | <p>The alert trigger has not been acknowledged.</p> |


* * *

