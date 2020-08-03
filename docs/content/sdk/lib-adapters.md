## Contents {docsify-ignore}

* [AdapterBase](#AdapterBase) 

* [AdapterForHttp](#AdapterForHttp) 

* [AdapterForSocketIo](#AdapterForSocketIo) 

* [AdapterForWebSockets](#AdapterForWebSockets) 

* [Callbacks](#Callbacks) 


* * *

## AdapterBase :id=adapterbase
> <p>The abstract definition for a transport strategy between the [AlertManager](/content/sdk/lib?id=alertmanager) and
> the backend. As a consumer of the SDK, it is unlikely you will need to implement this
> class. However, you will need to select an existing implementation and pass it to your
> [AlertManager](/content/sdk/lib?id=alertmanager) instance. Two existing implementations are included in the SDK.
> One uses pure HTTP requests. The other uses the <a href="https://socket.io/docs/">Socket.IO</a>
> library.</p>

**Kind**: global abstract class  
**Extends**: <code>Disposable</code>  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/adapters/AdapterBase  
**File**: /lib/adapters/AdapterBase.js  
**See**

- [AdapterForHttp](/content/sdk/lib-adapters?id=adapterforhttp)
- [AdapterForSocketIo](/content/sdk/lib-adapters?id=adapterforsocketio)


* *[AdapterBase](#AdapterBase) ⇐ <code>Disposable</code>*
    * _instance_
        * *[.host](#AdapterBasehost) ⇒ <code>String</code>*
        * *[.port](#AdapterBaseport) ⇒ <code>String</code>*
        * *[.secure](#AdapterBasesecure) ⇒ <code>String</code>*
        * *[.connect(jwtProvider)](#AdapterBaseconnect) ⇒ [<code>Promise.&lt;AdapterBase&gt;</code>](#AdapterBase)*
    * _constructor_
        * *[new AdapterBase(host, port, secure, onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered)](#new_AdapterBase_new)*


* * *

### adapterBase.host :id=adapterbasehost
> <p>The hostname of the Barchart Alert Service.</p>

**Kind**: instance property of [<code>AdapterBase</code>](#AdapterBase)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterBase.port :id=adapterbaseport
> <p>The TCP port number of the Barchart Alert Service.</p>

**Kind**: instance property of [<code>AdapterBase</code>](#AdapterBase)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterBase.secure :id=adapterbasesecure
> <p>Indicates if encryption will be used (e.g. WSS, HTTPS).</p>

**Kind**: instance property of [<code>AdapterBase</code>](#AdapterBase)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterBase.connect(jwtProvider) :id=adapterbaseconnect
> <p>Connects to the backend.</p>

**Kind**: instance method of [<code>AdapterBase</code>](#AdapterBase)  
**Returns**: [<code>Promise.&lt;AdapterBase&gt;</code>](#AdapterBase)  
**Access**: public  

| Param | Type |
| --- | --- |
| jwtProvider | [<code>JwtProvider</code>](/content/sdk/lib-security?id=jwtprovider) | 


* * *

### new AdapterBase(host, port, secure, onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered) :id=new_adapterbase_new
**Kind**: constructor of [<code>AdapterBase</code>](#AdapterBase)  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 
| port | <code>Number</code> | 
| secure | <code>Boolean</code> | 
| onAlertCreated | [<code>AlertCreatedCallback</code>](#CallbacksAlertCreatedCallback) | 
| onAlertMutated | [<code>AlertMutatedCallback</code>](#CallbacksAlertMutatedCallback) | 
| onAlertDeleted | [<code>AlertDeletedCallback</code>](#CallbacksAlertDeletedCallback) | 
| onAlertTriggered | [<code>AlertTriggeredCallback</code>](#CallbacksAlertTriggeredCallback) | 


* * *

## AdapterForHttp :id=adapterforhttp
> <p>A backend communication strategy implemented with purely with HTTP requests
> (using the <a href="https://github.com/axios/axios">Axios</a> library). Short polling
> is used for data feeds.</p>

**Kind**: global class  
**Extends**: [<code>AdapterBase</code>](#AdapterBase)  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/adapters/AdapterForHttp  
**File**: /lib/adapters/AdapterForHttp.js  

* [AdapterForHttp](#AdapterForHttp) ⇐ [<code>AdapterBase</code>](#AdapterBase)
    * _instance_
        * [.host](#AdapterBasehost) ⇒ <code>String</code>
        * [.port](#AdapterBaseport) ⇒ <code>String</code>
        * [.secure](#AdapterBasesecure) ⇒ <code>String</code>
        * [.connect(jwtProvider)](#AdapterBaseconnect) ⇒ [<code>Promise.&lt;AdapterBase&gt;</code>](#AdapterBase)


* * *

### adapterForHttp.host :id=adapterforhttphost
> <p>The hostname of the Barchart Alert Service.</p>

**Kind**: instance property of [<code>AdapterForHttp</code>](#AdapterForHttp)  
**Overrides**: [<code>host</code>](#AdapterBasehost)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterForHttp.port :id=adapterforhttpport
> <p>The TCP port number of the Barchart Alert Service.</p>

**Kind**: instance property of [<code>AdapterForHttp</code>](#AdapterForHttp)  
**Overrides**: [<code>port</code>](#AdapterBaseport)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterForHttp.secure :id=adapterforhttpsecure
> <p>Indicates if encryption will be used (e.g. WSS, HTTPS).</p>

**Kind**: instance property of [<code>AdapterForHttp</code>](#AdapterForHttp)  
**Overrides**: [<code>secure</code>](#AdapterBasesecure)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterForHttp.connect(jwtProvider) :id=adapterforhttpconnect
> <p>Connects to the backend.</p>

**Kind**: instance method of [<code>AdapterForHttp</code>](#AdapterForHttp)  
**Overrides**: [<code>connect</code>](#AdapterBaseconnect)  
**Returns**: [<code>Promise.&lt;AdapterBase&gt;</code>](#AdapterBase)  
**Access**: public  

| Param | Type |
| --- | --- |
| jwtProvider | [<code>JwtProvider</code>](/content/sdk/lib-security?id=jwtprovider) | 


* * *

## AdapterForSocketIo :id=adapterforsocketio
> <p>A backend communication strategy implemented with the <a href="https://socket.io/docs/">Socket.IO</a> library.
> The Socket.IO will use a WebSocket in modern browsers.</p>

**Kind**: global class  
**Extends**: [<code>AdapterBase</code>](#AdapterBase)  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/adapters/AdapterForSocketIo  
**File**: /lib/adapters/AdapterForSocketIo.js  

* [AdapterForSocketIo](#AdapterForSocketIo) ⇐ [<code>AdapterBase</code>](#AdapterBase)
    * _instance_
        * [.host](#AdapterBasehost) ⇒ <code>String</code>
        * [.port](#AdapterBaseport) ⇒ <code>String</code>
        * [.secure](#AdapterBasesecure) ⇒ <code>String</code>
        * [.connect(jwtProvider)](#AdapterBaseconnect) ⇒ [<code>Promise.&lt;AdapterBase&gt;</code>](#AdapterBase)


* * *

### adapterForSocketIo.host :id=adapterforsocketiohost
> <p>The hostname of the Barchart Alert Service.</p>

**Kind**: instance property of [<code>AdapterForSocketIo</code>](#AdapterForSocketIo)  
**Overrides**: [<code>host</code>](#AdapterBasehost)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterForSocketIo.port :id=adapterforsocketioport
> <p>The TCP port number of the Barchart Alert Service.</p>

**Kind**: instance property of [<code>AdapterForSocketIo</code>](#AdapterForSocketIo)  
**Overrides**: [<code>port</code>](#AdapterBaseport)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterForSocketIo.secure :id=adapterforsocketiosecure
> <p>Indicates if encryption will be used (e.g. WSS, HTTPS).</p>

**Kind**: instance property of [<code>AdapterForSocketIo</code>](#AdapterForSocketIo)  
**Overrides**: [<code>secure</code>](#AdapterBasesecure)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterForSocketIo.connect(jwtProvider) :id=adapterforsocketioconnect
> <p>Connects to the backend.</p>

**Kind**: instance method of [<code>AdapterForSocketIo</code>](#AdapterForSocketIo)  
**Overrides**: [<code>connect</code>](#AdapterBaseconnect)  
**Returns**: [<code>Promise.&lt;AdapterBase&gt;</code>](#AdapterBase)  
**Access**: public  

| Param | Type |
| --- | --- |
| jwtProvider | [<code>JwtProvider</code>](/content/sdk/lib-security?id=jwtprovider) | 


* * *

## AdapterForWebSockets :id=adapterforwebsockets
> <p>A backend communication adapter implemented with WebSockets. Coming in version 4.1.0.</p>

**Kind**: global class  
**Extends**: [<code>AdapterBase</code>](#AdapterBase)  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/adapters/AdapterForWebSockets  
**File**: /lib/adapters/AdapterForWebSockets.js  

* [AdapterForWebSockets](#AdapterForWebSockets) ⇐ [<code>AdapterBase</code>](#AdapterBase)
    * _instance_
        * [.host](#AdapterBasehost) ⇒ <code>String</code>
        * [.port](#AdapterBaseport) ⇒ <code>String</code>
        * [.secure](#AdapterBasesecure) ⇒ <code>String</code>
        * [.connect(jwtProvider)](#AdapterBaseconnect) ⇒ [<code>Promise.&lt;AdapterBase&gt;</code>](#AdapterBase)


* * *

### adapterForWebSockets.host :id=adapterforwebsocketshost
> <p>The hostname of the Barchart Alert Service.</p>

**Kind**: instance property of [<code>AdapterForWebSockets</code>](#AdapterForWebSockets)  
**Overrides**: [<code>host</code>](#AdapterBasehost)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterForWebSockets.port :id=adapterforwebsocketsport
> <p>The TCP port number of the Barchart Alert Service.</p>

**Kind**: instance property of [<code>AdapterForWebSockets</code>](#AdapterForWebSockets)  
**Overrides**: [<code>port</code>](#AdapterBaseport)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterForWebSockets.secure :id=adapterforwebsocketssecure
> <p>Indicates if encryption will be used (e.g. WSS, HTTPS).</p>

**Kind**: instance property of [<code>AdapterForWebSockets</code>](#AdapterForWebSockets)  
**Overrides**: [<code>secure</code>](#AdapterBasesecure)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterForWebSockets.connect(jwtProvider) :id=adapterforwebsocketsconnect
> <p>Connects to the backend.</p>

**Kind**: instance method of [<code>AdapterForWebSockets</code>](#AdapterForWebSockets)  
**Overrides**: [<code>connect</code>](#AdapterBaseconnect)  
**Returns**: [<code>Promise.&lt;AdapterBase&gt;</code>](#AdapterBase)  
**Access**: public  

| Param | Type |
| --- | --- |
| jwtProvider | [<code>JwtProvider</code>](/content/sdk/lib-security?id=jwtprovider) | 


* * *

## Callbacks :id=callbacks
> <p>A meta namespace containing signatures of anonymous functions.</p>

**Kind**: global namespace  

* [Callbacks](#Callbacks) : <code>object</code>
    * _static_
        * [.AlertCreatedCallback](#CallbacksAlertCreatedCallback) ⇒ [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert)
        * [.AlertMutatedCallback](#CallbacksAlertMutatedCallback) ⇒ [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert)
        * [.AlertDeletedCallback](#CallbacksAlertDeletedCallback) ⇒ [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert)
        * [.AlertTriggeredCallback](#CallbacksAlertTriggeredCallback) ⇒ [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert)


* * *

### Callbacks.AlertCreatedCallback :id=callbacksalertcreatedcallback
> <p>The function signature for a callback which notifies the [AlertManager](/content/sdk/lib?id=alertmanager)
> after a new alert has been created.</p>

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Returns**: [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert)  
**Access**: public  

* * *

### Callbacks.AlertMutatedCallback :id=callbacksalertmutatedcallback
> <p>The function signature for a callback which notifies the [AlertManager](/content/sdk/lib?id=alertmanager)
> after an alert mutates (e.g. the <code>alert_state</code> property changes).</p>

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Returns**: [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert)  
**Access**: public  

* * *

### Callbacks.AlertDeletedCallback :id=callbacksalertdeletedcallback
> <p>The function signature for a callback which notifies the [AlertManager](/content/sdk/lib?id=alertmanager)
> after an alert has been deleted.</p>

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Returns**: [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert)  
**Access**: public  

* * *

### Callbacks.AlertTriggeredCallback :id=callbacksalerttriggeredcallback
> <p>The function signature for a callback which notifies the [AlertManager](/content/sdk/lib?id=alertmanager)
> after an alert has been triggered.</p>

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Returns**: [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schemaalert)  
**Access**: public  

* * *

