## AlertManager :id=AlertManager
>The entry point for interacting with the Barchart's Alert Service.

**Kind**: global class  
**Extends**: <code>Disposable</code>  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/AlertManager  
**File**: /lib/AlertManager.js  

* [AlertManager](#AlertManager) ⇐ <code>Disposable</code>
    * _instance_
        * [.connect(jwtProvider)](#AlertManagerconnect) ⇒ <code>Promise.&lt;AlertManager&gt;</code>
        * [.checkSymbol(symbol)](#AlertManagercheckSymbol) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.createAlert(alert)](#AlertManagercreateAlert) ⇒ <code>Promise.&lt;Array.&lt;any&gt;&gt;</code>
    * _static_
        * [.version()](#AlertManagerversion) ⇒ <code>String</code>
    * _constructor_
        * [new AlertManager(host, port, secure, adapterClazz)](#new_AlertManager_new)


* * *

### alertManager.connect(jwtProvider) :id=AlertManager#connect
>Establishes a connection to Barchart's Alert Service. Invoke this function (and wait for
the resulting promise to resolve) before attempting to use other instance functions.

**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;AlertManager&gt;</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| jwtProvider | <code>JwtProvider</code> | An implementation of [JwtProvider](/content/sdk/lib-security?id=undefined) used to supply JWT tokens. |


* * *

### alertManager.checkSymbol(symbol) :id=AlertManager#checkSymbol
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

### alertManager.createAlert(alert) :id=AlertManager#createAlert
**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;Array.&lt;any&gt;&gt;</code>  

| Param |
| --- |
| alert | 


* * *

### AlertManager.version() :id=AlertManager.version
>Returns the version of the SDK.

**Kind**: static method of <code>AlertManager</code>  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### new AlertManager(host, port, secure, adapterClazz) :id=new_AlertManager_new
**Kind**: constructor of <code>AlertManager</code>  

| Param | Type | Description |
| --- | --- | --- |
| host | <code>String</code> | The host name of Barchart's Alert Service. |
| port | <code>Number</code> | The TCP port used to connect to the Alert Service. |
| secure | <code>Boolean</code> | If true, the transport layer will use encryption (e.g. HTTPS, WSS, etc). |
| adapterClazz | <code>function</code> | The constructor (function) for a class extending [AdapterBase](/content/sdk/lib-adapters?id=undefined). This defines the transport strategy. |


* * *

