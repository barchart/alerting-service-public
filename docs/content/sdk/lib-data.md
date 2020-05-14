## Contents {docsify-ignore}

* [Enums](#Enums) 

* [Schema](#Schema) 


* * *

## Enums :id=enums
>A namespace for enumerations.

**Kind**: global namespace  

* [Enums](#Enums) : <code>object</code>
    * _static_
        * [.AlertState](#EnumsAlertState) : <code>enum</code>
        * [.AlertBehaviour](#EnumsAlertBehaviour) : <code>enum</code>


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

## Schema :id=schema
>A meta namespace containing structural contracts of anonymous objects.

**Kind**: global namespace  

* [Schema](#Schema) : <code>object</code>
    * _static_
        * [.Alert](#SchemaAlert) : <code>Object</code>
        * [.AlertIdentifier](#SchemaAlertIdentifier) : <code>Object</code>
        * [.AlertQuery](#SchemaAlertQuery) : <code>Object</code>


* * *

### Schema.Alert :id=schemaalert
>An "alert" is the system's **primary** data structure. An "alert" is essentially
a collection of "conditions" to monitor. All required must be present to create a
new alert.

**Kind**: static typedef of <code>Schema</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [alert_id] | <code>String</code> | The alert's unique identifier (assigned by the backend). |
| [name] | <code>String</code> | The name of the alert (if not provided, the backend will attempt to generate a name). |
| user_id | <code>String</code> | The alert owner's unique identifier. |
| alert_system | <code>String</code> | The alert owner's domain. |
| [alert_state] | [<code>AlertState</code>](#EnumsAlertState) | The alert's current status (managed by the backend). |
| [alert_behaviour] | [<code>AlertBehaviour</code>](#EnumsAlertBehaviour) | The alert's strategy for handling state changes after its conditions are met —```terminate``` is the default value. |
| [create_date] | <code>String</code> | The time the alert was created (milliseconds since epoch). |
| [last_start_date] | <code>String</code> | The last time the alert was started (milliseconds since epoch). |
| [last_trigger_date] | <code>String</code> | The last time the alert was triggered (milliseconds since epoch). |
| [user_notes] | <code>String</code> |  |
| [alert_type] | <code>String</code> | Used to classify the alert, controlling "default" publishing rules, if no publishers have been explicitly specified. This happens by matching the "active_alert_type" property of a [PublisherTypeDefault](PublisherTypeDefault). |
| [automatic_reset] | <code>Boolean</code> |  |
| conditions | <code>Array.&lt;Condition&gt;</code> |  |
| [schedules] | <code>Array.&lt;AlertResetSchedule&gt;</code> |  |
| [publishers] | <code>Array.&lt;Publisher&gt;</code> |  |
| [effectivePublishers] | <code>Array.&lt;Publisher&gt;</code> |  |
| [tracking_server_id] | <code>String</code> |  |


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

