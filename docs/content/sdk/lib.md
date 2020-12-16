## AlertManager :id=alertmanager
> The <strong>central component of the SDK</strong>. It is responsible for connecting to Barchart's
> Alerting Service, querying existing alerts, creating new alerts, and monitoring the status
> of existing alerts.

**Kind**: global class  
**Extends**: <code>Disposable</code>  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/AlertManager  
**File**: /lib/AlertManager.js  

* [AlertManager](#AlertManager) ⇐ <code>Disposable</code>
    * _instance_
        * [.connect(jwtProvider)](#AlertManagerconnect) ⇒ [<code>Promise.&lt;AlertManager&gt;</code>](#AlertManager)
        * [.retrieveAlert(alert)](#AlertManagerretrieveAlert) ⇒ [<code>Promise.&lt;Schema.Alert&gt;</code>](/content/sdk/lib-data?id=schemaalert)
        * [.retrieveAlerts(query)](#AlertManagerretrieveAlerts) ⇒ [<code>Promise.&lt;Array.&lt;Schema.Alert&gt;&gt;</code>](/content/sdk/lib-data?id=schemaalert)
        * [.subscribeAlerts(query, changeCallback, deleteCallback, createCallback, triggerCallback)](#AlertManagersubscribeAlerts) ⇒ <code>Disposable</code>
        * [.createAlert(alert)](#AlertManagercreateAlert) ⇒ [<code>Promise.&lt;Schema.Alert&gt;</code>](/content/sdk/lib-data?id=schemaalert)
        * [.editAlert(alert)](#AlertManagereditAlert) ⇒ [<code>Promise.&lt;Schema.Alert&gt;</code>](/content/sdk/lib-data?id=schemaalert)
        * [.deleteAlert(alert)](#AlertManagerdeleteAlert) ⇒ [<code>Promise.&lt;Schema.Alert&gt;</code>](/content/sdk/lib-data?id=schemaalert)
        * [.enableAlert(alert)](#AlertManagerenableAlert) ⇒ [<code>Promise.&lt;Schema.Alert&gt;</code>](/content/sdk/lib-data?id=schemaalert)
        * [.enableAlerts(query)](#AlertManagerenableAlerts) ⇒ <code>Promise.&lt;Boolean&gt;</code>
        * [.disableAlert(alert)](#AlertManagerdisableAlert) ⇒ [<code>Promise.&lt;Schema.Alert&gt;</code>](/content/sdk/lib-data?id=schemaalert)
        * [.disableAlerts(query)](#AlertManagerdisableAlerts) ⇒ <code>Promise.&lt;Boolean&gt;</code>
        * [.retrieveTriggers(query)](#AlertManagerretrieveTriggers) ⇒ [<code>Promise.&lt;Array.&lt;Schema.Trigger&gt;&gt;</code>](/content/sdk/lib-data?id=schematrigger)
        * [.subscribeTriggers(query, changeCallback, deleteCallback, createCallback)](#AlertManagersubscribeTriggers) ⇒ <code>Disposable</code>
        * [.updateTrigger(query)](#AlertManagerupdateTrigger) ⇒ [<code>Promise.&lt;Schema.Trigger&gt;</code>](/content/sdk/lib-data?id=schematrigger)
        * [.updateTriggers(query)](#AlertManagerupdateTriggers) ⇒ [<code>Promise.&lt;Array.&lt;Schema.Trigger&gt;&gt;</code>](/content/sdk/lib-data?id=schematrigger)
        * [.checkSymbol(symbol)](#AlertManagercheckSymbol) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.getTargets()](#AlertManagergetTargets) ⇒ [<code>Promise.&lt;Array.&lt;Schema.Target&gt;&gt;</code>](/content/sdk/lib-data?id=schematarget)
        * [.getProperties()](#AlertManagergetProperties) ⇒ [<code>Promise.&lt;Array.&lt;Schema.Property&gt;&gt;</code>](/content/sdk/lib-data?id=schemaproperty)
        * [.getOperators()](#AlertManagergetOperators) ⇒ [<code>Promise.&lt;Array.&lt;Schema.Operator&gt;&gt;</code>](/content/sdk/lib-data?id=schemaoperator)
        * [.getServerVersion()](#AlertManagergetServerVersion) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.getUser()](#AlertManagergetUser) ⇒ [<code>Promise.&lt;Schema.UserIdentifier&gt;</code>](/content/sdk/lib-data?id=schemauseridentifier)
    * _static_
        * [.version](#AlertManagerversion) ⇒ <code>String</code>
    * _constructor_
        * [new AlertManager(host, port, secure, adapterClazz)](#new_AlertManager_new)


* * *

### alertManager.connect(jwtProvider) :id=alertmanagerconnect
> Attempts to establish a connection to the backend. This function should be invoked
> immediately following instantiation. Once the resulting promise resolves, a
> connection has been established and other instance methods can be used.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: [<code>Promise.&lt;AlertManager&gt;</code>](#AlertManager)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| jwtProvider | [<code>JwtProvider</code>](/content/sdk/lib-security?id=jwtprovider) | <p>Your implementation of [JwtProvider](/content/sdk/lib-security?id=jwtprovider).</p> |


* * *

### alertManager.retrieveAlert(alert) :id=alertmanagerretrievealert
> Gets a single alert by its identifier.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: [<code>Promise.&lt;Schema.Alert&gt;</code>](/content/sdk/lib-data?id=schemaalert)  
**Access**: public  

| Param | Type |
| --- | --- |
| alert | [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert) \| [<code>Schema.AlertIdentifier</code>](/content/sdk/lib-data?id=schemaalertidentifier) | 


* * *

### alertManager.retrieveAlerts(query) :id=alertmanagerretrievealerts
> Gets a set of alerts, matching query criteria.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: [<code>Promise.&lt;Array.&lt;Schema.Alert&gt;&gt;</code>](/content/sdk/lib-data?id=schemaalert)  
**Access**: public  

| Param | Type |
| --- | --- |
| query | [<code>Schema.AlertQuery</code>](/content/sdk/lib-data?id=schemaalertquery) | 


* * *

### alertManager.subscribeAlerts(query, changeCallback, deleteCallback, createCallback, triggerCallback) :id=alertmanagersubscribealerts
> Registers four separate callbacks which will be invoked when alerts are created,
> deleted, changed, or triggered.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: <code>Disposable</code>  

| Param | Type |
| --- | --- |
| query | <code>Object</code> | 
| query.alert_id | <code>String</code> | 
| query.alert_system | <code>String</code> | 
| changeCallback | [<code>Callbacks.AlertMutatedCallback</code>](/content/sdk/lib-callbacks?id=callbacksalertmutatedcallback) | 
| deleteCallback | [<code>Callbacks.AlertDeletedCallback</code>](/content/sdk/lib-callbacks?id=callbacksalertdeletedcallback) | 
| createCallback | [<code>Callbacks.AlertCreatedCallback</code>](/content/sdk/lib-callbacks?id=callbacksalertcreatedcallback) | 
| triggerCallback | [<code>Callbacks.AlertTriggeredCallback</code>](/content/sdk/lib-callbacks?id=callbacksalerttriggeredcallback) | 


* * *

### alertManager.createAlert(alert) :id=alertmanagercreatealert
> Creates a new alert.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: [<code>Promise.&lt;Schema.Alert&gt;</code>](/content/sdk/lib-data?id=schemaalert)  
**Access**: public  

| Param | Type |
| --- | --- |
| alert | [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert) | 


* * *

### alertManager.editAlert(alert) :id=alertmanagereditalert
> Performs a synthetic update operation on an existing alert. The
> existing alert is deleted. Then, a new alert is created in its
> place. The new alert will have the same identifier.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: [<code>Promise.&lt;Schema.Alert&gt;</code>](/content/sdk/lib-data?id=schemaalert)  
**Access**: public  

| Param | Type |
| --- | --- |
| alert | [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert) | 


* * *

### alertManager.deleteAlert(alert) :id=alertmanagerdeletealert
> Deletes an existing alert.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: [<code>Promise.&lt;Schema.Alert&gt;</code>](/content/sdk/lib-data?id=schemaalert)  
**Access**: public  

| Param | Type |
| --- | --- |
| alert | [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert) | 


* * *

### alertManager.enableAlert(alert) :id=alertmanagerenablealert
> Sends a request to transition an alert to the <code>Active</code> state.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: [<code>Promise.&lt;Schema.Alert&gt;</code>](/content/sdk/lib-data?id=schemaalert)  
**Access**: public  

| Param | Type |
| --- | --- |
| alert | [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert) \| [<code>Schema.AlertIdentifier</code>](/content/sdk/lib-data?id=schemaalertidentifier) | 


* * *

### alertManager.enableAlerts(query) :id=alertmanagerenablealerts
> Sends a request to transition all alerts owned by a user to the <code>Active</code> state.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: <code>Promise.&lt;Boolean&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| query | [<code>Schema.AlertQuery</code>](/content/sdk/lib-data?id=schemaalertquery) | 


* * *

### alertManager.disableAlert(alert) :id=alertmanagerdisablealert
> Sends a request to transition an alert to the <code>Inactive</code> state.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: [<code>Promise.&lt;Schema.Alert&gt;</code>](/content/sdk/lib-data?id=schemaalert)  
**Access**: public  

| Param | Type |
| --- | --- |
| alert | [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert) \| [<code>Schema.AlertIdentifier</code>](/content/sdk/lib-data?id=schemaalertidentifier) | 


* * *

### alertManager.disableAlerts(query) :id=alertmanagerdisablealerts
> Sends a request to transition all alerts owned by a user to the <code>Inactive</code> state.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: <code>Promise.&lt;Boolean&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| query | [<code>Schema.AlertQuery</code>](/content/sdk/lib-data?id=schemaalertquery) | 


* * *

### alertManager.retrieveTriggers(query) :id=alertmanagerretrievetriggers
> Gets a set of alert triggers, matching query criteria.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: [<code>Promise.&lt;Array.&lt;Schema.Trigger&gt;&gt;</code>](/content/sdk/lib-data?id=schematrigger)  
**Access**: public  

| Param | Type |
| --- | --- |
| query | <code>Object</code> | 
| query.user_id | <code>String</code> | 
| query.alert_system | <code>String</code> | 
| [query.trigger_date] | <code>String</code> | 
| [query.trigger_status] | <code>String</code> | 


* * *

### alertManager.subscribeTriggers(query, changeCallback, deleteCallback, createCallback) :id=alertmanagersubscribetriggers
> Registers three separate callbacks which will be invoked when triggers are created,
> deleted, changed.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: <code>Disposable</code>  

| Param | Type |
| --- | --- |
| query | <code>Object</code> | 
| query.alert_id | <code>String</code> | 
| query.alert_system | <code>String</code> | 
| changeCallback | [<code>Callbacks.TriggersMutatedCallback</code>](/content/sdk/lib-callbacks?id=callbackstriggersmutatedcallback) | 
| deleteCallback | [<code>Callbacks.TriggersDeletedCallback</code>](/content/sdk/lib-callbacks?id=callbackstriggersdeletedcallback) | 
| createCallback | [<code>Callbacks.TriggersCreatedCallback</code>](/content/sdk/lib-callbacks?id=callbackstriggerscreatedcallback) | 


* * *

### alertManager.updateTrigger(query) :id=alertmanagerupdatetrigger
> Updates the status (i.e. read/unread) for a single alert trigger.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: [<code>Promise.&lt;Schema.Trigger&gt;</code>](/content/sdk/lib-data?id=schematrigger)  
**Access**: public  

| Param | Type |
| --- | --- |
| query | <code>Object</code> | 
| query.alert_id | <code>String</code> | 
| [query.trigger_date] | <code>String</code> | 
| [query.trigger_status] | <code>String</code> | 


* * *

### alertManager.updateTriggers(query) :id=alertmanagerupdatetriggers
> Updates the status (i.e. read/unread) for all alert triggers which match
> the query criteria.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: [<code>Promise.&lt;Array.&lt;Schema.Trigger&gt;&gt;</code>](/content/sdk/lib-data?id=schematrigger)  
**Access**: public  

| Param | Type |
| --- | --- |
| query | <code>Object</code> | 
| query.user_id | <code>String</code> | 
| [query.alert_system] | <code>String</code> | 
| [query.trigger_status] | <code>String</code> | 


* * *

### alertManager.checkSymbol(symbol) :id=alertmanagerchecksymbol
> When constructing alert conditions, we often refer to a stock by
> its symbol. This function will validate the symbol before you
> attempt to assign it to the <code>identifier</code> property of a
> <code>Target</code> object. In some cases, an alternate (alias) symbol
> will be returned. If the symbol returned is different, you must
> use the alternate symbol.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: <code>Promise.&lt;String&gt;</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>String</code> | <p>The symbol to check</p> |


* * *

### alertManager.getTargets() :id=alertmanagergettargets
> Retrieves the entire list of targets which are available to the
> system.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: [<code>Promise.&lt;Array.&lt;Schema.Target&gt;&gt;</code>](/content/sdk/lib-data?id=schematarget)  
**Access**: public  

* * *

### alertManager.getProperties() :id=alertmanagergetproperties
> Retrieves the entire list of properties which are available to the
> system.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: [<code>Promise.&lt;Array.&lt;Schema.Property&gt;&gt;</code>](/content/sdk/lib-data?id=schemaproperty)  
**Access**: public  

* * *

### alertManager.getOperators() :id=alertmanagergetoperators
> Retrieves the entire list of operators which are available to the
> system.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: [<code>Promise.&lt;Array.&lt;Schema.Operator&gt;&gt;</code>](/content/sdk/lib-data?id=schemaoperator)  
**Access**: public  

* * *

### alertManager.getServerVersion() :id=alertmanagergetserverversion
> Returns the version number of the remote service you are connected to.

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: <code>Promise.&lt;String&gt;</code>  
**Access**: public  

* * *

### alertManager.getUser() :id=alertmanagergetuser
> Returns the current user (according to the JWT token which is embedded
> in the request).

**Kind**: instance method of [<code>AlertManager</code>](#AlertManager)  
**Returns**: [<code>Promise.&lt;Schema.UserIdentifier&gt;</code>](/content/sdk/lib-data?id=schemauseridentifier)  
**Access**: public  

* * *

### AlertManager.version :id=alertmanagerversion
> Returns the version of the SDK.

**Kind**: static property of [<code>AlertManager</code>](#AlertManager)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### new AlertManager(host, port, secure, adapterClazz) :id=new_alertmanager_new
**Kind**: constructor of [<code>AlertManager</code>](#AlertManager)  

| Param | Type | Description |
| --- | --- | --- |
| host | <code>String</code> | <p>Barchart Alerting Service's hostname.</p> |
| port | <code>Number</code> | <p>Barchart Alerting Service's TCP port number.</p> |
| secure | <code>Boolean</code> | <p>If true, the transport layer will use encryption (e.g. HTTPS, WSS, etc).</p> |
| adapterClazz | <code>function</code> | <p>The transport strategy. Specifically, the constructor function for a class extending [AdapterBase](/content/sdk/lib-adapters?id=adapterbase).</p> |


* * *

