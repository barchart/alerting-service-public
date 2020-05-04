## Setup

This SDK has been published to Node Package Manager (NPM). The package is named *@barchart/alerts-client-js*. It can be installed as follows:

```shell
> npm install @barchart/alerts-client-js -S
```

If you aren't using NPM, you can download the SDK directly from GitHub at https://github.com/barchart/alerts-client-js.

## Authentication

The _production_ environment does not permit anonymous connections. **Contact Barchart at solutions@barchart.com or (866) 333-7587 for assistance configuring your account.**

However, you can use our _test_ environment for evaluation purposes. The _test_ environment has two significant limitations:

* all data saved in the environment is purged each night, and
* all data saved in the environment can be accessed by anyone on the Internet.

### JWT

The Barchart Alert Service uses [JWT](https://en.wikipedia.org/wiki/JSON_Web_Token) for authentication and authorization.

When connecting to the _test_ environment, a simple tool (included in the SDK) can be used to create tokens.

When connecting to the _production_ environment, you will need to generate and sign a token. The process is surprisingly simple and more detail can be found in the [Key Concepts: Security](/content/concepts/security) section.

## Connecting

In general, to connect to the Barchart Alert Service, you need:

* a mechanism to generate JWT tokens, and
* a mechanism to send (and receive) data to (and from) the backend.

### Using the SDK

The SDK provides an easy-to-use, promise-based mechanism for sending (and receiving) data. It does not require you to have knowledge of the transport layer.

We connect, using HTTP transport, as follows:

```js
const AlertManager = require('@barchart/alert-client-js/lib/AlertManager'),
	AdapterForHttp = require('@barchart/lib/adapters/AdapterForHttp'),
	jwtGeneratorFactory = require('@barchart/lib/security/demo/getJwtGenerator');

const host = 'alerts-management-test.barchart.com';
const port = 443;
const secure = true;

const alertManager = new AlertManager(host, port, secure, AdapterForHttp);

alertManager.connect(jwtGeneratorFactory('me', 'example.com'))
	.then(() => {
		// connected ...
	});
```

Once connected, we can request a list of alerts (belonging to me@example.com) as follows:

```js
```

Once connected, we could create a new alert as follows:

```js
```

### Using the API

## Demos

A prebuilt, single-page web application was built with this SDK. It could provide some insight into the features and usage of the SDK.

You can find the source code here:

* /example/browser/example.html
* /example/browser/js/startup.js

The application is also hosted at:

https://examples.aws.barchart.com/alerts-client-js/example.html





