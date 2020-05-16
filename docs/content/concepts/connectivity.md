## Connectivity

The backend accepts connections using two secure protocols:

* WebSockets (implemented with [Socket.IO](https://socket.io/))
  * Recommended for interactive clients
  * Supported by SDK (see [```AdapterForSocketIO```](/content/sdk/lib-adapters?id=adapterforsocketio))
  * Events are pushed from the server.
* HTTPS
  * Recommended for non-interactive clients
  * Endpoints structured as a REST-ful web service
  * Supported by SDK (see [```AdapterForSocketHttp```](/content/sdk/lib-adapters?id=adapterforhttp))
  * Possible to consume directly — without using this SDK (see [API Documentation](/content/api_reference))
  * Events are not pushed from the server (must be simulated with short polling)
* Coming soon
  * Pure WebSocket (to be implemented without Socket.IO)

### Selection

Picking a protocol simply requires you to pass an "adapter" to the [```AlertManager```], as follows:

```js
```

or

```js
```
