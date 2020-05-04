## Schema :id=schema
**Kind**: global namespace  
>A meta namespace containing structural contracts of anonymous objects.


* * *

### Schema.Alert :id=schemaalert
**Kind**: static typedef of <code>Schema</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| alert_id | <code>String</code> | The alert's unique identifier. |
| alert_system | <code>String</code> |  |
| alert_system_key | <code>String</code> |  |
| user_id | <code>String</code> |  |
| [user_notes] | <code>String</code> |  |
| [alert_state] | <code>Enums.AlertState</code> |  |
| [alert_behaviour] | <code>Enums.AlertBehaviour</code> | Used to control what happens after an alert's conditions are met. |
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

>An "alert" consists of one or more [Condition](Condition) objects and one or more
[Publisher](Publisher) objects.


* * *

