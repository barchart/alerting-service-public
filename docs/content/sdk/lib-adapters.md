## Contents {docsify-ignore}

* [AdapterBase](#AdapterBase) 

* [AdapterForHttp](#AdapterForHttp) 

* [AdapterForSocketIo](#AdapterForSocketIo) 

* [AdapterForWebSockets](#AdapterForWebSockets) 

* [Callbacks](#Callbacks) 

## AdapterBase :id=adapterbase
**Kind**: global abstract class  
**Extends**: <code>Disposable</code>  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/adapters/AdapterBase  
**File**: /lib/adapters/AdapterBase.js  
**See**

- [AdapterForHttp](/content/sdk/lib-adapters?id=adapterforhttp)
- [AdapterForSocketIo](/content/sdk/lib-adapters?id=adapterforsocketio)

>The abstract definition for a transport strategy between the [AlertManager](/content/sdk/lib?id=alertmanager) and
the backend. As a consumer of the SDK, it is unlikely you will need to implement this
class. However, you will need to select an existing implementation and pass it to your
[AlertManager](/content/sdk/lib?id=alertmanager) instance. Two existing implementations are included in the SDK.
One uses pure HTTP requests. The other uses the [Socket.IO](https://socket.io/docs/)
library.


* * *

## AdapterForHttp :id=adapterforhttp
**Kind**: global class  
**Extends**: <code>AdapterBase</code>  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/adapters/AdapterForHttp  
**File**: /lib/adapters/AdapterForHttp.js  
>A backend communication strategy implemented with HTTP requests. Commands
to the backend are issued via HTTP requests. Data feeds from the server are
handled via simple short polling.


* * *

## AdapterForSocketIo :id=adapterforsocketio
**Kind**: global class  
**Extends**: <code>AdapterBase</code>  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/adapters/AdapterForSocketIo  
**File**: /lib/adapters/AdapterForSocketIo.js  
>A backend communication strategy implemented with the [Socket.IO](https://socket.io/docs/) library.
The Socket.IO will use a WebSocket in modern browsers.


* * *

## AdapterForWebSockets :id=adapterforwebsockets
**Kind**: global class  
**Extends**: <code>AdapterBase</code>  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/adapters/AdapterForWebSockets  
**File**: /lib/adapters/AdapterForWebSockets.js  
>A backend communication adapter implemented with WebSockets. Coming in version 4.1.0.


* * *

## Callbacks :id=callbacks
**Kind**: global namespace  
>A meta namespace containing signatures of anonymous functions.


* [Callbacks](#Callbacks) : <code>object</code>
    * [.AlertCreatedCallback](#CallbacksAlertCreatedCallback) ⇒ <code>Object</code>
    * [.AlertMutatedCallback](#CallbacksAlertMutatedCallback) ⇒ <code>Object</code>
    * [.AlertDeletedCallback](#CallbacksAlertDeletedCallback) ⇒ <code>Object</code>
    * [.AlertTriggeredCallback](#CallbacksAlertTriggeredCallback) ⇒ <code>Object</code>


* * *

### Callbacks.AlertCreatedCallback :id=callbacksalertcreatedcallback
**Kind**: static typedef of <code>Callbacks</code>  
**Returns**: <code>Object</code>  
**Access**: public  
>The function signature for a callback which notifies the [AlertManager](/content/sdk/lib?id=alertmanager)
after a new alert has been created.


* * *

### Callbacks.AlertMutatedCallback :id=callbacksalertmutatedcallback
**Kind**: static typedef of <code>Callbacks</code>  
**Returns**: <code>Object</code>  
**Access**: public  
>The function signature for a callback which notifies the [AlertManager](/content/sdk/lib?id=alertmanager)
after an alert mutates (e.g. its stage changes).


* * *

### Callbacks.AlertDeletedCallback :id=callbacksalertdeletedcallback
**Kind**: static typedef of <code>Callbacks</code>  
**Returns**: <code>Object</code>  
**Access**: public  
>The function signature for a callback which notifies the [AlertManager](/content/sdk/lib?id=alertmanager)
after an alert has been deleted.


* * *

### Callbacks.AlertTriggeredCallback :id=callbacksalerttriggeredcallback
**Kind**: static typedef of <code>Callbacks</code>  
**Returns**: <code>Object</code>  
**Access**: public  
>The function signature for a callback which notifies the [AlertManager](/content/sdk/lib?id=alertmanager)
after an alert has been triggered.


* * *

