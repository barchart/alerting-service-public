## Protocol Options

The Barchart Alerting Service supports two secure protocols:

* **WebSockets**
  * Recommended for interactive clients.
  * Persistent, full-duplex communication between the SDK and the backend.
  * True subscriptions to state changes are possible. Events are pushed from the backend.
  * Supported by SDK, see [```AdapterForSocketIO```](/content/sdk/lib-adapters?id=adapterforsocketio) class.
* **HTTPS**
  * Recommended for non-interactive clients, since events are not pushed from the server.
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

Once the ```AlertManager``` has been instantiated, the ```start``` function should be invoked, passing a ```JwtProvider``` instance. A discussion of the ```JwtProvider``` can be found in the next section — [Key Concepts: Securing the Connection](/content/concepts/securing_the_connection).

## Using the API

There is no need to perform a _connect_ action when using the REST-ful API — each request is completely independent. However, each request must include a JWT token as the ```Authorization``` header. Details can be found in the next section — [Key Concepts: Securing the Connection](/content/concepts/securing_the_connection)

## Environments

Two instances of the Barchart Alerting Service are always running:

#### Demo

The _demo_ environment can be used for integration and evaluation purposes. It can be accessed at ```alerts-management-demo.barchart.com``` and has two significant limitations:

* data saved in the _demo_ environment is **purged every four hours**, and
* data saved in the _demo_ environment can be **accessed by anyone**.

#### Production

The _production_ environment does not permit anonymous connections. **Contact Barchart at solutions@barchart.com or (866) 333-7587 for assistance configuring your account.**
