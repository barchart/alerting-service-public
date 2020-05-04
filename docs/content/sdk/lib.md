## AlertManager :id=alertmanager
**Kind**: global class  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/AlertManager  
**File**: /lib/AlertManager.js  
>The entry point for interacting with the Barchart's Alert Service.


* [AlertManager](#AlertManager)
    * _instance_
        * [.connect(jwtProvider)](#AlertManagerconnect) ⇒ <code>Promise.&lt;AlertManager&gt;</code>
        * [.checkSymbol(symbol)](#AlertManagercheckSymbol) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.createAlert(alert)](#AlertManagercreateAlert) ⇒ <code>Promise.&lt;Array.&lt;any&gt;&gt;</code>
    * _static_
        * [.version()](#AlertManagerversion) ⇒ <code>String</code>


* * *

### alertManager.connect(jwtProvider) :id=alertmanagerconnect
**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;AlertManager&gt;</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| jwtProvider | <code>JwtProvider</code> | An implementation of [JwtProvider](/content/sdk/lib-security?id=jwtprovider) used to supply JWT tokens. |

>Establishes a connection to Barchart's Alert Service. Invoke this function (and wait for
the resulting promise to resolve) before attempting to use other instance functions.


* * *

### alertManager.checkSymbol(symbol) :id=alertmanagerchecksymbol
**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;String&gt;</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>String</code> | The symbol to check |

>Checks to ensure a instrument's symbol is valid and the instrument
has not been marked as expired. In some cases a different symbol
will be returned. When this happens the alternate symbol should be
used.


* * *

### alertManager.createAlert(alert) :id=alertmanagercreatealert
**Kind**: instance method of <code>AlertManager</code>  
**Returns**: <code>Promise.&lt;Array.&lt;any&gt;&gt;</code>  

| Param |
| --- |
| alert | 


* * *

### AlertManager.version() :id=alertmanagerversion
**Kind**: static method of <code>AlertManager</code>  
**Returns**: <code>String</code>  
**Access**: public  
>Returns the version of the SDK.


* * *

