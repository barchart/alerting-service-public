## Callbacks :id=callbacks
> A meta namespace containing signatures of anonymous functions.

**Kind**: global namespace  

* [Callbacks](#Callbacks) : <code>object</code>
    * _static_
        * [.AlertCreatedCallback](#CallbacksAlertCreatedCallback) ⇒ [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert)
        * [.AlertMutatedCallback](#CallbacksAlertMutatedCallback) ⇒ [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert)
        * [.AlertDeletedCallback](#CallbacksAlertDeletedCallback) ⇒ [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert)
        * [.AlertTriggeredCallback](#CallbacksAlertTriggeredCallback) ⇒ [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert)
        * [.TriggersCreatedCallback](#CallbacksTriggersCreatedCallback) ⇒ [<code>Array.&lt;Schema.Trigger&gt;</code>](/content/sdk/lib-data?id=schematrigger)
        * [.TriggersMutatedCallback](#CallbacksTriggersMutatedCallback) ⇒ [<code>Array.&lt;Schema.Trigger&gt;</code>](/content/sdk/lib-data?id=schematrigger)
        * [.TriggersDeletedCallback](#CallbacksTriggersDeletedCallback) ⇒ [<code>Array.&lt;Schema.Trigger&gt;</code>](/content/sdk/lib-data?id=schematrigger)


* * *

### Callbacks.AlertCreatedCallback :id=callbacksalertcreatedcallback
> The function signature for a callback which is invoked after
> a new alert has been created.

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Returns**: [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert)  
**Access**: public  

* * *

### Callbacks.AlertMutatedCallback :id=callbacksalertmutatedcallback
> The function signature for a callback which is invoked after
> an alert mutates (e.g. the <code>alert_state</code> property changes).

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Returns**: [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert)  
**Access**: public  

* * *

### Callbacks.AlertDeletedCallback :id=callbacksalertdeletedcallback
> The function signature for a callback which is invoked after
> an alert has been deleted.

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Returns**: [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert)  
**Access**: public  

* * *

### Callbacks.AlertTriggeredCallback :id=callbacksalerttriggeredcallback
> The function signature for a callback which is invoked after
> an alert has been triggered.

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Returns**: [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert)  
**Access**: public  

* * *

### Callbacks.TriggersCreatedCallback :id=callbackstriggerscreatedcallback
> The function signature for a callback which is invoked after
> after new trigger(s) have been created.

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Returns**: [<code>Array.&lt;Schema.Trigger&gt;</code>](/content/sdk/lib-data?id=schematrigger)  
**Access**: public  

* * *

### Callbacks.TriggersMutatedCallback :id=callbackstriggersmutatedcallback
> The function signature for a callback which is invoked after
> trigger(s) mutate (e.g. the <code>trigger_status</code> property changes).

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Returns**: [<code>Array.&lt;Schema.Trigger&gt;</code>](/content/sdk/lib-data?id=schematrigger)  
**Access**: public  

* * *

### Callbacks.TriggersDeletedCallback :id=callbackstriggersdeletedcallback
> The function signature for a callback which is invoked after
> trigger(s) have been deleted (because the associated alert
> was deleted).

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Returns**: [<code>Array.&lt;Schema.Trigger&gt;</code>](/content/sdk/lib-data?id=schematrigger)  
**Access**: public  

* * *

