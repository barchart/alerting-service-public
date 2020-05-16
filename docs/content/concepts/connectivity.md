## Connection Options

The backend accepts connections using two secure protocols:

* **WebSockets**
  * Recommended for interactive clients.
  * Persistent full-duplex communication between SDK and backend.
  * Implemented with [Socket.IO](https://socket.io/)
  * Supported by SDK (see [```AdapterForSocketIO```](/content/sdk/lib-adapters?id=adapterforsocketio)).
  * Events are pushed from the server.
* **HTTPS**
  * Recommended for non-interactive clients.
  * Discrete request/response model.
  * Endpoints structured as a REST-ful web service.
  * Supported by SDK (see [```AdapterForSocketHttp```](/content/sdk/lib-adapters?id=adapterforhttp)).
  * Possible to consume directly — without using this SDK (see [API Documentation](/content/api_reference)).
  * Events are not pushed from the server (must be simulated with short polling).
* **Coming soon**
  * Pure WebSocket (to be implemented without Socket.IO).
  * In the SDK, changing the transport is a one-line code chhange (see below).

## Connection Adapters

Picking a protocol requires you to provide an "adapter" when you instantiate the [```AlertManager```](/content/sdk/lib?id=alertmanager), as follows:

```js
const AdapterForSocketIo = require('@barchart/alert-client-js/lib/adapters/AdapterForSocketIo');

const host = 'alerts-management-demo.barchart.com';
const port = 443;
const secure = true;

const manager = new AlertManager(host, port, secure, AdapterForSocketIo);
```

or

```js
const AdapterForHttp = require('@barchart/alert-client-js/lib/adapters/AdapterForHttp');

const host = 'alerts-management-demo.barchart.com';
const port = 443;
const secure = true;

const manager = new AlertManager(host, port, secure, AdapterForHttp);
```

Adding a ```require``` statement (or ```import``` statement) for only the adapter being used should reduce the size of any "bundled" code you generate.
