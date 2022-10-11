## Callbacks :id=callbacks
> A meta namespace containing signatures of anonymous functions.

**Kind**: global namespace  

* [Callbacks](#Callbacks) : <code>object</code>
    * _static_
        * [.AlertCreatedCallback](#CallbacksAlertCreatedCallback) : <code>function</code>
        * [.AlertMutatedCallback](#CallbacksAlertMutatedCallback) : <code>function</code>
        * [.AlertDeletedCallback](#CallbacksAlertDeletedCallback) : <code>function</code>
        * [.AlertTriggeredCallback](#CallbacksAlertTriggeredCallback) : <code>function</code>
        * [.TriggersCreatedCallback](#CallbacksTriggersCreatedCallback) : <code>function</code>
        * [.TriggersMutatedCallback](#CallbacksTriggersMutatedCallback) : <code>function</code>
        * [.TriggersDeletedCallback](#CallbacksTriggersDeletedCallback) : <code>function</code>
        * [.TemplateCreatedCallback](#CallbacksTemplateCreatedCallback) : <code>function</code>
        * [.TemplateMutatedCallback](#CallbacksTemplateMutatedCallback) : <code>function</code>
        * [.TemplateDeletedCallback](#CallbacksTemplateDeletedCallback) : <code>function</code>
        * [.ConnectionStatusChangedCallback](#CallbacksConnectionStatusChangedCallback) : <code>function</code>


* * *

### Callbacks.AlertCreatedCallback :id=callbacksalertcreatedcallback
> The function signature for a callback which is invoked after
> a new alert has been created.

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| alert | [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert) | 


* * *

### Callbacks.AlertMutatedCallback :id=callbacksalertmutatedcallback
> The function signature for a callback which is invoked after
> an alert mutates (e.g. the <code>alert_state</code> property changes).

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| alert | [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert) | 


* * *

### Callbacks.AlertDeletedCallback :id=callbacksalertdeletedcallback
> The function signature for a callback which is invoked after
> an alert has been deleted.

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| alert | [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert) | 


* * *

### Callbacks.AlertTriggeredCallback :id=callbacksalerttriggeredcallback
> The function signature for a callback which is invoked after
> an alert has been triggered.

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| alert | [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert) | 


* * *

### Callbacks.TriggersCreatedCallback :id=callbackstriggerscreatedcallback
> The function signature for a callback which is invoked after
> after new trigger(s) have been created.

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| triggers | [<code>Array.&lt;Schema.Trigger&gt;</code>](/content/sdk/lib-data?id=schematrigger) | 


* * *

### Callbacks.TriggersMutatedCallback :id=callbackstriggersmutatedcallback
> The function signature for a callback which is invoked after
> trigger(s) mutate (e.g. the <code>trigger_status</code> property changes).

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| triggers | [<code>Array.&lt;Schema.Trigger&gt;</code>](/content/sdk/lib-data?id=schematrigger) | 


* * *

### Callbacks.TriggersDeletedCallback :id=callbackstriggersdeletedcallback
> The function signature for a callback which is invoked after
> trigger(s) have been deleted (because the associated alert
> was deleted).

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| triggers | [<code>Array.&lt;Schema.Trigger&gt;</code>](/content/sdk/lib-data?id=schematrigger) | 


* * *

### Callbacks.TemplateCreatedCallback :id=callbackstemplatecreatedcallback
> The function signature for a callback which is invoked after
> a new template has been created.

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| template | [<code>Schema.Template</code>](/content/sdk/lib-data?id=schematemplate) | 


* * *

### Callbacks.TemplateMutatedCallback :id=callbackstemplatemutatedcallback
> The function signature for a callback which is invoked after
> a template mutates.

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| template | [<code>Schema.Template</code>](/content/sdk/lib-data?id=schematemplate) | 


* * *

### Callbacks.TemplateDeletedCallback :id=callbackstemplatedeletedcallback
> The function signature for a callback which is invoked after
> a template has been deleted.

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| template | [<code>Schema.Template</code>](/content/sdk/lib-data?id=schematemplate) | 


* * *

### Callbacks.ConnectionStatusChangedCallback :id=callbacksconnectionstatuschangedcallback
> The function signature for a callback which is invoked the status
> of the connection to the remote service changes.

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| status | <code>String</code> | 


* * *

