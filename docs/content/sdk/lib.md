## AlertManager :id=alertmanager
>The **central component of the SDK**. It is responsible for connecting to Barchart's
Alert Service, querying existing alerts, creating new alerts, and monitoring alert status.

**Kind**: global class  
**Extends**: <code>Disposable</code>  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/AlertManager  
**File**: /lib/AlertManager.js  

* [AlertManager](#AlertManager) ⇐ <code>Disposable</code>
    * _instance_
        * [.connect(jwtProvider)](#AlertManagerconnect) ⇒ <code>Promise.&lt;AlertManager&gt;</code>
        * [.createAlert(alert)](#AlertManagercreateAlert) ⇒ <code>Promise.&lt;Array.&lt;any&gt;&gt;</code>
        * [.retrieveAlerts(query)](#AlertManagerretrieveAlerts) ⇒ <code>Promise.&lt;Array.&lt;Alert&gt;&gt;</code>
        * [.checkSymbol(symbol)](#AlertManagercheckSymbol) ⇒ <code>Promise.&lt;String&gt;</code>
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
| jwtProvider | <code>JwtProvider</code> | Your implementation of [JwtProvider](/content/sdk/lib-security?id=jwtprovider). |


* * *

### alertManager.createAlert(alert) :id=alertmanagercreatealert
>Creates a new alert.

**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;Array.&lt;any&gt;&gt;</code>  

| Param | Type |
| --- | --- |
| alert | <code>Schema.Alert</code> | 


* * *

### alertManager.retrieveAlerts(query) :id=alertmanagerretrievealerts
>Returns [Alert](Alert) objects for the current user. Optional filtering
can be applied.

**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;Array.&lt;Alert&gt;&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| query | <code>Schema.AlertFilter</code> | 


* * *

### alertManager.checkSymbol(symbol) :id=alertmanagerchecksymbol
>Checks to ensure a instrument's symbol is valid and the instrument
has not been marked as expired. In some cases a different symbol
will be returned. When this happens the alternate symbol should be
used.

**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;String&gt;</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>String</code> | The symbol to check |


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
| host | <code>String</code> | The host name of the Alert Service. |
| port | <code>Number</code> | The TCP port of the Alert Service. |
| secure | <code>Boolean</code> | If true, the transport layer will use encryption (e.g. HTTPS, WSS, etc). |
| adapterClazz | <code>function</code> | The transport strategy. Specifically, the constructor function for a class extending [AdapterBase](/content/sdk/lib-adapters?id=adapterbase). |


* * *

