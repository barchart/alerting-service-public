## Connection Options

The backend accepts connections using two secure protocols:

* **WebSockets**
  * Recommended for interactive clients.
  * Persistent full-duplex communication between SDK and backend.
  * Implemented with the [Socket.IO](https://socket.io/) library.
  * Supported by SDK, see [```AdapterForSocketIO```](/content/sdk/lib-adapters?id=adapterforsocketio) class.
  * Events are pushed from the server.
* **HTTPS**
  * Recommended for non-interactive clients.
  * Discrete, request/response communication model.
  * Endpoints structured as a REST-ful web service.
  * Supported by SDK, see [```AdapterForSocketHttp```](/content/sdk/lib-adapters?id=adapterforhttp) class.
  * Possible to consume directly — without using this SDK (see [API Reference](/content/api_reference)) documentation.
  * Events are not pushed from the server — subscriptions must be simulated with short polling.
* **Coming soon**
  * Pure WebSocket (to be implemented without Socket.IO).

## Using the SDK

The first step is to create an instance if the [```AlertManager```](/content/sdk/lib?id=alertmanager) class. In general, you application will use one instance. Picking a protocol requires you to provide an "adapter" ```AlertManager```, as follows:

```js
const AdapterForSocketIo = require('@barchart/alert-client-js/lib/adapters/AdapterForSocketIo');

const host = 'alerts-management-demo.barchart.com';
const port = 443;
const secure = true;

const manager = new AlertManager(host, port, secure, AdapterForSocketIo);
```

or, alternately:

```js
const AdapterForHttp = require('@barchart/alert-client-js/lib/adapters/AdapterForHttp');

const host = 'alerts-management-demo.barchart.com';
const port = 443;
const secure = true;

const manager = new AlertManager(host, port, secure, AdapterForHttp);
```

_Tip: Only ```require``` (or ```import```) the adapter you intend to use — this will reduce the size of your bundled code._

## Using the API

There is no need to perform a _connect_ action when using the REST-ful API — each request is completely independent.
