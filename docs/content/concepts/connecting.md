## Protocol Options

The Barcahrt Alerting Service supports two secure protocols:

* **WebSockets**
  * Recommended for interactive clients.
  * Persistent full-duplex communication between SDK and backend.
  * True subscriptions to state changes are possible. Events are pushed from the backend.
  * Supported by SDK, see [```AdapterForSocketIO```](/content/sdk/lib-adapters?id=adapterforsocketio) class.
* **HTTPS**
  * Recommended for non-interactive clients, events are not pushed from the server — subscriptions must be simulated with short polling.
  * Discrete, request/response communication model.
  * True subscriptions to state changes are not possible. However, short polling can be used to simulate subscriptions.
  * Supported by SDK, see [```AdapterForSocketHttp```](/content/sdk/lib-adapters?id=adapterforhttp) class.
  * Possible to consume directly — without using this SDK. Refer to the [API Reference](/content/api_reference) section for details.

## Using the SDK

First, create an instance of the [```AlertManager```](/content/sdk/lib?id=alertmanager) class. In general, will only need to create one instance. Pick a transport protocol by passing an "adapter" as follows:

```js
const AdapterForSocketIo = require('@barchart/alerts-client-js/lib/adapters/AdapterForSocketIo');

const host = 'alerts-management-demo.barchart.com';
const port = 443;
const secure = true;

const manager = new AlertManager(host, port, secure, AdapterForSocketIo);
```

or, alternately:

```js
const AdapterForHttp = require('@barchart/alerts-client-js/lib/adapters/AdapterForHttp');

const host = 'alerts-management-demo.barchart.com';
const port = 443;
const secure = true;

const manager = new AlertManager(host, port, secure, AdapterForHttp);
```

Tip: Only ```require``` (or ```import```) the adapter you intend to use — this will reduce the size of your bundled code.

## Using the API

There is no need to perform a _connect_ action when using the REST-ful API — each request is completely independent.
