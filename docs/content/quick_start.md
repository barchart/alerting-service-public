## Setup

This SDK has been published to Node Package Manager (NPM). The package is named *@barchart/alerts-client-js*. It can be installed as follows:

```shell
> npm install @barchart/alerts-client-js -S
```

If you aren't using NPM, you can download the SDK directly from GitHub at https://github.com/barchart/alerts-client-js.

## Authentication

The _production_ environment does not permit anonymous connections. **Contact Barchart at solutions@barchart.com or (866) 333-7587 for assistance configuring your account.**

However, you can use our _test_ environment for evaluation purposes. The _test_ environment has two significant limitations:

* data saved in the _test_ environment is purged nightly, and
* data saved in the _test_ environment is accessible to anyone (on the Internet).

### JWT

The Barchart Alert Service uses [JWT](https://en.wikipedia.org/wiki/JSON_Web_Token) for authentication and authorization.

When connecting to the _test_ environment, a simple tool (included in the SDK) can be used to create tokens. Since these tokens can be created by anyone, there is no expectation of privacy in the _test_ environment.

When connecting to the _production_ environment, you will need to generate and sign a token. The process is surprisingly simple and more detail can be found in the [Key Concepts: Security](/content/concepts/security) section.

## Connecting

In general, to connect to the Barchart Alert Service, you need:

* a mechanism to generate JWT tokens, and
* a mechanism to send (and receive) data to (and from) the backend.

### Using the API

If you bypass this SDK entirely and work with the REST interface directly, you don't need to perform a "connect" action. Each HTTP request is independently authorized by the backend. You simply need to include a JWT token in the _Authorization_ header of each request.

### Using the SDK

The SDK provides an easy-to-use, promise-based mechanism for sending (and receiving) data. It does not require you to have knowledge of the transport layer.

We connect, using the adapter for HTTP transport, as follows:

```js
const AlertManager = require('@barchart/alert-client-js/lib/AlertManager'),
	AdapterForHttp = require('@barchart/lib/adapters/AdapterForHttp'),
	jwtGeneratorFactory = require('@barchart/lib/security/demo/getJwtGenerator');

const host = 'alerts-management-test.barchart.com';
const port = 443;
const secure = true;

const alertManager = new AlertManager(host, port, secure, AdapterForHttp);

alertManager.connect(jwtGeneratorFactory('me', 'barchart.com'))
	.then(() => {
		// connected ...
	});
```

## Defining an Alert

To create an alert, we must define an must construct an object which conforms to the ```Alert``` schema. To accommodate a wide variety of features, this schema is non-trivial. An in-depth discussion of the schema found in the [Key Concepts: Data Structures](/content/concepts/data_structures) section of the documentation.

For now, here is an object, representing an alert with condition -- Apple stock trades over $600 per share:

```json
{
	"user_id": "me",
	"alert_system": "barchart.com",
	"automatic_reset": false,
	"alert_behavior": "terminate"
	"conditions": [
		{
			"property": {
				"property_id": 1,
				"target": {
					"identifier": "AAPL"
				}
			},
			"operator": {
				"operator_id": 2,
				"operand": "600"
			}
		}
	]
}
```

## Creating an Alert

### Using the API

### Using the SDK

Once connected, we can request a list of alerts, as follows:

```js
alertManager.retrieveAlerts({ user_id: 'me', alert_system: 'barchart.com' })
	.then((alerts) => {
		// process alerts ...
	});
```

Now, let's create a new alert.

Once we have our data object, we simply call ```AlertManager.createAlert```, as follows:

```js
alertManager.createAlert(alertToCreate)
	.then((alert) => {
		console.log(`A new alert was created, the alert's ID is: [ ${alert.alert_id} ].`);
	});
```

Finally, we can instruct the backend to begin tracking this alert, as follows:

```js
alertManager.enableAlert(alert)
	.then(() => {
		// Alert tracking is starting ...
	});
```

## Demos

Two sample applications were built with this SDK. They could provide some insight into SDK features and usage.

### Web Browsers

A single-page HTML application allows you to configure, start, stop, edit, delete, and monitor alerts.

You can find the source code here:

* /example/browser/example.html
* /example/browser/js/startup.js

The application is also hosted at:

https://examples.aws.barchart.com/alerts-client-js/example.html

### Node.js

A simple Node.js script connects to the _test_ environment and retrieves a list of alerts. You can find the source code in the */example/node* folder.

To run the script, make sure required dependencies are installed:

```shell
npm install
```

Then, execute it, as follows:

```shell
node ./example/node/example.js {user_id}
```



