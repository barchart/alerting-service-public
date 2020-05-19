## AlertManager :id=alertmanager
>The **central component of the SDK**. It is responsible for connecting to Barchart's
Alert Service, querying existing alerts, creating new alerts, and monitoring the status
of existing alerts.

**Kind**: global class  
**Extends**: <code>Disposable</code>  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/AlertManager  
**File**: /lib/AlertManager.js  

* [AlertManager](#AlertManager) ⇐ <code>Disposable</code>
    * _instance_
        * [.connect(jwtProvider)](#AlertManagerconnect) ⇒ <code>Promise.&lt;AlertManager&gt;</code>
        * [.createAlert(alert)](#AlertManagercreateAlert) ⇒ <code>Promise.&lt;Schema.Alert&gt;</code>
        * [.editAlert(alert)](#AlertManagereditAlert) ⇒ <code>Promise.&lt;Alert&gt;</code>
        * [.deleteAlert(alert)](#AlertManagerdeleteAlert) ⇒ <code>Promise.&lt;Schema.Alert&gt;</code>
        * [.retrieveAlert(alert)](#AlertManagerretrieveAlert) ⇒ <code>Promise.&lt;Schema.Alert&gt;</code>
        * [.retrieveAlerts(query)](#AlertManagerretrieveAlerts) ⇒ <code>Promise.&lt;Array.&lt;Alert&gt;&gt;</code>
        * [.enableAlert(alert)](#AlertManagerenableAlert) ⇒ <code>Promise.&lt;Schema.Alert&gt;</code>
        * [.enableAlerts(query)](#AlertManagerenableAlerts) ⇒ <code>Promise.&lt;Boolean&gt;</code>
        * [.disableAlert(alert)](#AlertManagerdisableAlert) ⇒ <code>Promise.&lt;Schema.Alert&gt;</code>
        * [.disableAlerts(query)](#AlertManagerdisableAlerts) ⇒ <code>Promise.&lt;Boolean&gt;</code>
        * [.checkSymbol(symbol)](#AlertManagercheckSymbol) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.getTargets()](#AlertManagergetTargets) ⇒ <code>Promise.&lt;Array.&lt;Schema.Target&gt;&gt;</code>
        * [.getProperties()](#AlertManagergetProperties) ⇒ <code>Promise.&lt;Array.&lt;Schema.Property&gt;&gt;</code>
        * [.getUser()](#AlertManagergetUser) ⇒ <code>Promise.&lt;UserIdentifier&gt;</code>
    * _static_
        * [.version](#AlertManagerversion) ⇒ <code>String</code>
    * _constructor_
        * [new AlertManager(host, port, secure, adapterClazz)](#new_AlertManager_new)


* * *

### alertManager.connect(jwtProvider) :id=alertmanagerconnect
>Attempts to establish a connection to the backend. This function should be invoked
immediately following instantiation. Once the resulting promise resolves, a
connection has been established and other instance methods can be used.

**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;AlertManager&gt;</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| jwtProvider | [<code>JwtProvider</code>](/content/sdk/lib-security?id=jwtprovider) | Your implementation of [JwtProvider](/content/sdk/lib-security?id=/content/sdk/lib-security?id=jwtprovider). |


* * *

### alertManager.createAlert(alert) :id=alertmanagercreatealert
>Creates a new alert.

**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;Schema.Alert&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| alert | [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schema.alert) | 


* * *

### alertManager.editAlert(alert) :id=alertmanagereditalert
>Performs a synthetic update operation on an existing alert. The
existing alert is deleted. Then, a new alert is created in its
place. The new alert will have the same identifier.

**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;Alert&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| alert | [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schema.alert) | 


* * *

### alertManager.deleteAlert(alert) :id=alertmanagerdeletealert
>Deletes an existing alert.

**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;Schema.Alert&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| alert | [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schema.alert) | 


* * *

### alertManager.retrieveAlert(alert) :id=alertmanagerretrievealert
>Gets a single alert by its identifier.

**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;Schema.Alert&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| alert | [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schema.alert) \| [<code>Schema.AlertIdentifier</code>](/content/sdk/lib-data?id=schema.alertidentifier) | 


* * *

### alertManager.retrieveAlerts(query) :id=alertmanagerretrievealerts
>Gets the set of alerts which match a query.

**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;Array.&lt;Alert&gt;&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| query | [<code>Schema.AlertQuery</code>](/content/sdk/lib-data?id=schema.alertquery) | 


* * *

### alertManager.enableAlert(alert) :id=alertmanagerenablealert
>Sends a request to transition an alert to the ```Active``` state.

**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;Schema.Alert&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| alert | [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schema.alert) \| [<code>Schema.AlertIdentifier</code>](/content/sdk/lib-data?id=schema.alertidentifier) | 


* * *

### alertManager.enableAlerts(query) :id=alertmanagerenablealerts
>Sends a request to transition all alerts owned by a user to the ```Active``` state.

**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;Boolean&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| query | [<code>Schema.AlertQuery</code>](/content/sdk/lib-data?id=schema.alertquery) | 


* * *

### alertManager.disableAlert(alert) :id=alertmanagerdisablealert
>Sends a request to transition an alert to the ```Inactive``` state.

**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;Schema.Alert&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| alert | [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schema.alert) \| [<code>Schema.AlertIdentifier</code>](/content/sdk/lib-data?id=schema.alertidentifier) | 


* * *

### alertManager.disableAlerts(query) :id=alertmanagerdisablealerts
>Sends a request to transition all alerts owned by a user to the ```Inactive``` state.

**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;Boolean&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| query | [<code>Schema.AlertQuery</code>](/content/sdk/lib-data?id=schema.alertquery) | 


* * *

### alertManager.checkSymbol(symbol) :id=alertmanagerchecksymbol
>When constructing alert conditions, we often refer to a stock by
its symbol. This function will validate the symbol before you
attempt to assign it to the ```identifier``` property of a
```Target``` object. In some cases, an alternate (alias) symbol
will be returned. If the symbol returned is different, you must
use the alternate symbol.

**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;String&gt;</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>String</code> | The symbol to check |


* * *

### alertManager.getTargets() :id=alertmanagergettargets
>Retrieves the entire list of targets which are available to the
system.

**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;Array.&lt;Schema.Target&gt;&gt;</code>  
**Access**: public  

* * *

### alertManager.getProperties() :id=alertmanagergetproperties
>Retrieves the entire list of properties which are available to the
system.

**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;Array.&lt;Schema.Property&gt;&gt;</code>  
**Access**: public  

* * *

### alertManager.getUser() :id=alertmanagergetuser
>Returns the current user (according to the JWT token which is embedded
in the request).

**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;UserIdentifier&gt;</code>  
**Access**: public  

* * *

### AlertManager.version :id=alertmanagerversion
>Returns the version of the SDK.

**Kind**: static property of <code>AlertManager</code>  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### new AlertManager(host, port, secure, adapterClazz) :id=new_alertmanager_new
**Kind**: constructor of <code>AlertManager</code>  

| Param | Type | Description |
| --- | --- | --- |
| host | <code>String</code> | Barchart Alert Service's hostname. |
| port | <code>Number</code> | Barchart Alert Service's TCP port number. |
| secure | <code>Boolean</code> | If true, the transport layer will use encryption (e.g. HTTPS, WSS, etc). |
| adapterClazz | <code>function</code> | The transport strategy. Specifically, the constructor function for a class extending [AdapterBase](/content/sdk/lib-adapters?id=/content/sdk/lib-adapters?id=adapterbase). |


* * *

