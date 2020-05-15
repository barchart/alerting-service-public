## Contents {docsify-ignore}

* [AdapterBase](#AdapterBase) 

* [AdapterForHttp](#AdapterForHttp) 

* [AdapterForSocketIo](#AdapterForSocketIo) 

* [AdapterForWebSockets](#AdapterForWebSockets) 

* [Callbacks](#Callbacks) 


* * *

## AdapterBase :id=adapterbase
>The abstract definition for a transport strategy between the [AlertManager](/content/sdk/lib?id=/content/sdk/lib?id=alertmanager) and
the backend. As a consumer of the SDK, it is unlikely you will need to implement this
class. However, you will need to select an existing implementation and pass it to your
[AlertManager](/content/sdk/lib?id=/content/sdk/lib?id=alertmanager) instance. Two existing implementations are included in the SDK.
One uses pure HTTP requests. The other uses the [Socket.IO](https://socket.io/docs/)
library.

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
        * *[.connect(jwtProvider)](#AdapterBaseconnect) ⇒ <code>Promise.&lt;AdapterBase&gt;</code>*
    * _constructor_
        * *[new AdapterBase(host, port, secure, onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered)](#new_AdapterBase_new)*


* * *

### adapterBase.host :id=adapterbasehost
>The hostname of the Barchart Alert Service.

**Kind**: instance property of <code>AdapterBase</code>  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterBase.port :id=adapterbaseport
>The TCP port number of the Barchart Alert Service.

**Kind**: instance property of <code>AdapterBase</code>  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterBase.secure :id=adapterbasesecure
>Indicates if encryption will be used (e.g. WSS, HTTPS).

**Kind**: instance property of <code>AdapterBase</code>  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterBase.connect(jwtProvider) :id=adapterbaseconnect
>Connects to the backend.

**Kind**: instance method of <code>AdapterBase</code>  
**Returns**: <code>Promise.&lt;AdapterBase&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| jwtProvider | [<code>JwtProvider</code>](/content/sdk/lib-security?id=jwtprovider) | 


* * *

### new AdapterBase(host, port, secure, onAlertCreated, onAlertMutated, onAlertDeleted, onAlertTriggered) :id=new_adapterbase_new
**Kind**: constructor of <code>AdapterBase</code>  

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
>A backend communication strategy implemented with purely with HTTP requests
(using the [Axios](https://github.com/axios/axios) library). Short polling
is used for data feeds.

**Kind**: global class  
**Extends**: <code>AdapterBase</code>  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/adapters/AdapterForHttp  
**File**: /lib/adapters/AdapterForHttp.js  

* [AdapterForHttp](#AdapterForHttp) ⇐ <code>AdapterBase</code>
    * _instance_
        * [.host](#AdapterBasehost) ⇒ <code>String</code>
        * [.port](#AdapterBaseport) ⇒ <code>String</code>
        * [.secure](#AdapterBasesecure) ⇒ <code>String</code>
        * [.connect(jwtProvider)](#AdapterBaseconnect) ⇒ <code>Promise.&lt;AdapterBase&gt;</code>


* * *

### adapterForHttp.host :id=adapterforhttphost
>The hostname of the Barchart Alert Service.

**Kind**: instance property of <code>AdapterForHttp</code>  
**Overrides**: [<code>host</code>](#AdapterBasehost)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterForHttp.port :id=adapterforhttpport
>The TCP port number of the Barchart Alert Service.

**Kind**: instance property of <code>AdapterForHttp</code>  
**Overrides**: [<code>port</code>](#AdapterBaseport)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterForHttp.secure :id=adapterforhttpsecure
>Indicates if encryption will be used (e.g. WSS, HTTPS).

**Kind**: instance property of <code>AdapterForHttp</code>  
**Overrides**: [<code>secure</code>](#AdapterBasesecure)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterForHttp.connect(jwtProvider) :id=adapterforhttpconnect
>Connects to the backend.

**Kind**: instance method of <code>AdapterForHttp</code>  
**Overrides**: [<code>connect</code>](#AdapterBaseconnect)  
**Returns**: <code>Promise.&lt;AdapterBase&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| jwtProvider | [<code>JwtProvider</code>](/content/sdk/lib-security?id=jwtprovider) | 


* * *

## AdapterForSocketIo :id=adapterforsocketio
>A backend communication strategy implemented with the [Socket.IO](https://socket.io/docs/) library.
The Socket.IO will use a WebSocket in modern browsers.

**Kind**: global class  
**Extends**: <code>AdapterBase</code>  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/adapters/AdapterForSocketIo  
**File**: /lib/adapters/AdapterForSocketIo.js  

* [AdapterForSocketIo](#AdapterForSocketIo) ⇐ <code>AdapterBase</code>
    * _instance_
        * [.host](#AdapterBasehost) ⇒ <code>String</code>
        * [.port](#AdapterBaseport) ⇒ <code>String</code>
        * [.secure](#AdapterBasesecure) ⇒ <code>String</code>
        * [.connect(jwtProvider)](#AdapterBaseconnect) ⇒ <code>Promise.&lt;AdapterBase&gt;</code>


* * *

### adapterForSocketIo.host :id=adapterforsocketiohost
>The hostname of the Barchart Alert Service.

**Kind**: instance property of <code>AdapterForSocketIo</code>  
**Overrides**: [<code>host</code>](#AdapterBasehost)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterForSocketIo.port :id=adapterforsocketioport
>The TCP port number of the Barchart Alert Service.

**Kind**: instance property of <code>AdapterForSocketIo</code>  
**Overrides**: [<code>port</code>](#AdapterBaseport)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterForSocketIo.secure :id=adapterforsocketiosecure
>Indicates if encryption will be used (e.g. WSS, HTTPS).

**Kind**: instance property of <code>AdapterForSocketIo</code>  
**Overrides**: [<code>secure</code>](#AdapterBasesecure)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterForSocketIo.connect(jwtProvider) :id=adapterforsocketioconnect
>Connects to the backend.

**Kind**: instance method of <code>AdapterForSocketIo</code>  
**Overrides**: [<code>connect</code>](#AdapterBaseconnect)  
**Returns**: <code>Promise.&lt;AdapterBase&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| jwtProvider | [<code>JwtProvider</code>](/content/sdk/lib-security?id=jwtprovider) | 


* * *

## AdapterForWebSockets :id=adapterforwebsockets
>A backend communication adapter implemented with WebSockets. Coming in version 4.1.0.

**Kind**: global class  
**Extends**: <code>AdapterBase</code>  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/adapters/AdapterForWebSockets  
**File**: /lib/adapters/AdapterForWebSockets.js  

* [AdapterForWebSockets](#AdapterForWebSockets) ⇐ <code>AdapterBase</code>
    * _instance_
        * [.host](#AdapterBasehost) ⇒ <code>String</code>
        * [.port](#AdapterBaseport) ⇒ <code>String</code>
        * [.secure](#AdapterBasesecure) ⇒ <code>String</code>
        * [.connect(jwtProvider)](#AdapterBaseconnect) ⇒ <code>Promise.&lt;AdapterBase&gt;</code>


* * *

### adapterForWebSockets.host :id=adapterforwebsocketshost
>The hostname of the Barchart Alert Service.

**Kind**: instance property of <code>AdapterForWebSockets</code>  
**Overrides**: [<code>host</code>](#AdapterBasehost)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterForWebSockets.port :id=adapterforwebsocketsport
>The TCP port number of the Barchart Alert Service.

**Kind**: instance property of <code>AdapterForWebSockets</code>  
**Overrides**: [<code>port</code>](#AdapterBaseport)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterForWebSockets.secure :id=adapterforwebsocketssecure
>Indicates if encryption will be used (e.g. WSS, HTTPS).

**Kind**: instance property of <code>AdapterForWebSockets</code>  
**Overrides**: [<code>secure</code>](#AdapterBasesecure)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### adapterForWebSockets.connect(jwtProvider) :id=adapterforwebsocketsconnect
>Connects to the backend.

**Kind**: instance method of <code>AdapterForWebSockets</code>  
**Overrides**: [<code>connect</code>](#AdapterBaseconnect)  
**Returns**: <code>Promise.&lt;AdapterBase&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| jwtProvider | [<code>JwtProvider</code>](/content/sdk/lib-security?id=jwtprovider) | 


* * *

## Callbacks :id=callbacks
>A meta namespace containing signatures of anonymous functions.

**Kind**: global namespace  

* [Callbacks](#Callbacks) : <code>object</code>
    * _static_
        * [.AlertCreatedCallback](#CallbacksAlertCreatedCallback) ⇒ [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schema.alert)
        * [.AlertMutatedCallback](#CallbacksAlertMutatedCallback) ⇒ [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schema.alert)
        * [.AlertDeletedCallback](#CallbacksAlertDeletedCallback) ⇒ [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schema.alert)
        * [.AlertTriggeredCallback](#CallbacksAlertTriggeredCallback) ⇒ [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schema.alert)


* * *

### Callbacks.AlertCreatedCallback :id=callbacksalertcreatedcallback
>The function signature for a callback which notifies the [AlertManager](/content/sdk/lib?id=/content/sdk/lib?id=alertmanager)
after a new alert has been created.

**Kind**: static typedef of <code>Callbacks</code>  
**Returns**: [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schema.alert)  
**Access**: public  

* * *

### Callbacks.AlertMutatedCallback :id=callbacksalertmutatedcallback
>The function signature for a callback which notifies the [AlertManager](/content/sdk/lib?id=/content/sdk/lib?id=alertmanager)
after an alert mutates (e.g. the ```alert_state``` property changes).

**Kind**: static typedef of <code>Callbacks</code>  
**Returns**: [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schema.alert)  
**Access**: public  

* * *

### Callbacks.AlertDeletedCallback :id=callbacksalertdeletedcallback
>The function signature for a callback which notifies the [AlertManager](/content/sdk/lib?id=/content/sdk/lib?id=alertmanager)
after an alert has been deleted.

**Kind**: static typedef of <code>Callbacks</code>  
**Returns**: [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schema.alert)  
**Access**: public  

* * *

### Callbacks.AlertTriggeredCallback :id=callbacksalerttriggeredcallback
>The function signature for a callback which notifies the [AlertManager](/content/sdk/lib?id=/content/sdk/lib?id=alertmanager)
after an alert has been triggered.

**Kind**: static typedef of <code>Callbacks</code>  
**Returns**: [<code>Schema.Alert</code>](/content/sdk/lib-data?id=schema.alert)  
**Access**: public  

* * *

