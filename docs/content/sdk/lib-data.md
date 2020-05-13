## Contents {docsify-ignore}

* [Enums](#Enums) 

* [Schema](#Schema) 


* * *

## Enums :id=enums
>A namespace for enumerations.

**Kind**: global namespace  

* [Enums](#Enums) : <code>object</code>
    * _static_
        * [.AlertBehaviour](#EnumsAlertBehaviour) : <code>enum</code>
        * [.AlertState](#EnumsAlertState) : <code>enum</code>


* * *

### Enums.AlertBehaviour :id=enumsalertbehaviour
>The possible ways an [Alert](#SchemaAlert) can react after it has been published.

**Kind**: static enum of <code>Enums</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| terminate | <code>String</code> | When the alert becomes ```Active```, it begins tracking immediately. Once the alert's conditions have been met, notifications are published and tracking stops. The alert will transition to ```Triggered``` state. This is the default behavior. |
| continue | <code>String</code> | When the alert becomes ```Active```, it begins tracking immediately. Once the alert's conditions have been met, notifications are published and tracking continues. The alert will remain in the ```Active``` state. This is useful for news alerts. |
| schedule | <code>String</code> | When the alert becomes ```Active```, it waits until the until a scheduled time to begin tracking. Once an alert's conditions have been met, notifications will be published and tracking stops; however, The alert will remain in the ```Active``` state waiting to begin tracking again at the next scheduled time. This behavior is rarely used. |


* * *

### Enums.AlertState :id=enumsalertstate
>The possible states an [Alert](#SchemaAlert) can inhabit.

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

## Schema :id=schema
>A meta namespace containing structural contracts of anonymous objects.

**Kind**: global namespace  

* [Schema](#Schema) : <code>object</code>
    * _static_
        * [.AlertFilter](#SchemaAlertFilter) : <code>Object</code>
        * [.Alert](#SchemaAlert) : <code>Object</code>
        * [.AlertFilter](#SchemaAlertFilter) : <code>Object</code>


* * *

### Schema.AlertFilter :id=schemaalertfilter
>The arguments which can be used with [AlertManager](/content/sdk/lib?id=/content/sdk/lib?id=alertmanager).

**Kind**: static typedef of <code>Schema</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [user_id] | <code>String</code> | The identifier of the authenticated user. |
| [alert_system] | <code>String</code> | The domain of the authenticated user. |


* * *

### Schema.Alert :id=schemaalert
>A user-defined set of conditions which is tracked by the remote service.
Once the conditions are met, a notification will be generated.

**Kind**: static typedef of <code>Schema</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [alert_id] | <code>String</code> | The alert's unique identifier. This property will be assigned by the backend (when the alert is created). |
| user_id | <code>String</code> | The unique identifier of the alert's owner. |
| alert_system | <code>String</code> | The domain of the alert's owner. |
| [alert_behaviour] | [<code>AlertBehaviour</code>](#EnumsAlertBehaviour) | Defines the alerts behavior after its conditions have been met. The ```terminate``` behavior is default. |
| [user_notes] | <code>String</code> |  |
| [alert_state] | [<code>AlertState</code>](#EnumsAlertState) | The alert's current status. This property is managed by the backend. |
| [alert_type] | <code>String</code> | Used to classify the alert, controlling "default" publishing rules, if no publishers have been explicitly specified. This happens by matching the "active_alert_type" property of a [PublisherTypeDefault](PublisherTypeDefault). |
| [automatic_reset] | <code>Boolean</code> |  |
| [create_date] | <code>String</code> |  |
| effectivePublishers | <code>Array.&lt;Publisher&gt;</code> |  |
| last_start_date | <code>String</code> |  |
| last_trigger_date | <code>String</code> |  |
| name | <code>String</code> |  |
| conditions | <code>Array.&lt;Condition&gt;</code> |  |
| publishers | <code>Array.&lt;Publisher&gt;</code> |  |
| schedules | <code>Array.&lt;AlertResetSchedule&gt;</code> |  |
| tracking_server_id | <code>String</code> |  |


* * *

### Schema.AlertFilter :id=schemaalertfilter
>The arguments which can be used with [AlertManager](/content/sdk/lib?id=/content/sdk/lib?id=alertmanager).

**Kind**: static typedef of <code>Schema</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| alert_system_key | <code>String</code> | - |


* * *

