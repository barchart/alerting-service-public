## Demos

Two sample applications were built with this SDK. They could provide some insight into SDK features and usage.

### Web Application

A single-page HTML application allows you to configure, start, stop, edit, delete, and monitor alerts.

You can find the source code here:

* */example/browser/example.html*
* */example/browser/js/startup.js*

This application is also hosted at:

https://examples.aws.barchart.com/alerts-client-js/example.html

### Node.js

A simple Node.js script connects to the _demo_ environment and retrieves a list of alerts. You can find the source code here:

* */example/node/example.js*

To run the script, make sure required dependencies are installed:

```shell
npm install
```

Then, execute it:

```shell
node ./example/node/example.js {user_id}
```

## Setup

As a consumer of the Barchart Alert Service, you have two options:

1. Connect and communicate with the backend _by embedding this SDK in your software_, or
2. Connect and communicate with the backend _by direct interaction with the REST interface_.

**If you choose to use the SDK**, you can install it from NPM (Node Package Manager), as follows:

```shell
npm install @barchart/alerts-client-js -S
```

**Otherwise, if you choose not to use the SDK**, please finish reviewing this page, then refer to the [API Reference](/content/api) section.

## Environments

Two instances of the Barchart Alert Service are always running:

#### Demo

The _demo_ environment can be used for integration and evaluation purposes. It can be accessed at ```alerts-management-demo.barchart.com``` and has two significant limitations:

* data saved in the _demo_ environment is purged nightly, and
* data saved in the _demo_ environment can be accessed by anyone.

#### Production

The _production_ environment does not permit permit anonymous connections. **Contact Barchart at solutions@barchart.com or (866) 333-7587 for assistance configuring your account.**

## Authentication

[JSON Web Tokens](https://en.wikipedia.org/wiki/JSON_Web_Token) — called JWT — are used for authentication and authorization. Each request made to the backend must include a token. Generating these tokens is surprisingly easy -- refer to the [Key Concepts: Security](/content/concepts/security) section for details.

In the _demo_ environment, token generation follows these rules:

* All tokens are signed with the ```HMAC-SHA256``` (aka ```HS256```) algorithm
* All tokens are signed with the ```"public-knowledge-1234567890"``` secret

Since the signing secret is available to everyone (see above), there is no expectation of privacy; the _demo_ environment is for testing and evaluation only.

In the the _production_ environment, you must exchange a _"secret"_  with Barchart — in the form of a [public/private key pair](https://en.wikipedia.org/wiki/Public-key_cryptography). Consequently, your data will be secure.

Regardless of environment, the token payload uses two fields:

* ```user_id``` is the unique identifier of the current user
*```alert_system``` is a unique identifier for your organization (use "barchart.com" in the _demo_ environment).

## Connecting

#### Using the SDK

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

Alternately, we could a WebSocket transport (preferred), by swapping the adapter:

```js
const AdapterForSocketIo = require('@barchart/lib/adapters/AdapterForSocketIo');
```

#### Using the API

If you choose to work directly with the REST interface, you won't need to perform a "connect" action. Each HTTP request is independently authorized by the backend. You simply need to include a JWT token in the _Authorization_ header of each request.

## Defining an Alert

To create an alert, we must construct an object which conforms to the ```Alert``` definition. To accommodate a wide variety of features, the schema is non-trivial and an in-depth discussion can be found in the [Key Concepts: Data Structures](/content/concepts/data_structures) section.

For now, here is simple ```Alert``` object with a single condition — Apple stock trades over $600 per share:

```json
{
	"user_id": "me",
	"alert_system": "barchart.com",
	"name": "My First Alert"
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

After we've defined the alert, we need to persist it. The backend will assign an ```alert_id``` value and the complete ```Alert``` object will be returned to us.

#### Using the SDK

```js
alertManager.createAlert(alertToCreate)
	.then((alert) => {
		console.log(`A new alert was created with ID: [ ${alert.alert_id} ].`);
	});
```

#### Using the API

```shell
curl 'http://localhost:3000/alerts' \
  -X 'POST' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJhbGVydF9zeXN0ZW0iOiJiYXJjaGFydC5jb20iLCJpYXQiOjE1ODk0MTEyNzl9.SxyC8s_CKhPyzcNmM_h_TRMiNSx3YstKGmAb2IOWqgM' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"user_id":"me","alert_system":"barchart.com","name":"My First Alert","conditions":[{"property":{"property_id":1,"target":{"identifier":"AAPL"}},"operator":{"operator_id":2,"operand":"600"}}]}'
```

## Starting an Alert

After an ```Alert``` is created, the ```alert_state``` will be ```Inactive```. We must start the alert to begin tracking its conditions.

#### Using the SDK

To start the alert, pass the ```Alert``` object to the ```AlertManager.enableAlert``` function:

```js
alertManager.enableAlert(alert)
	.then(() => {
		// Alert is starting ...
	});
```

To stop the alert, pass the ```Alert``` object to the ```AlertManager.disableAlert``` function:

```js
alertManager.disableAlert(alert)
	.then(() => {
		// Alert is stopping ...
	});
```

#### Using the API

The REST-ful operation to start an alert updates its ```alert_state``` property to ```Starting```:

```shell
curl 'http://localhost:3000/alerts/ef5acb88-d747-48d2-b8d2-713cf351c012' \
  -X 'PUT' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJhbGVydF9zeXN0ZW0iOiJiYXJjaGFydC5jb20iLCJpYXQiOjE1ODk0MTEyNzl9.SxyC8s_CKhPyzcNmM_h_TRMiNSx3YstKGmAb2IOWqgM' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"alert_id":"ef5acb88-d747-48d2-b8d2-713cf351c012","alert_state":"Starting"}'
```

The REST-ful operation to stop an alert updates its ```alert_state``` property to ```Stopping```:

```shell
curl 'http://localhost:3000/alerts/ef5acb88-d747-48d2-b8d2-713cf351c012' \
  -X 'PUT' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJhbGVydF9zeXN0ZW0iOiJiYXJjaGFydC5jb20iLCJpYXQiOjE1ODk0MTEyNzl9.SxyC8s_CKhPyzcNmM_h_TRMiNSx3YstKGmAb2IOWqgM' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"alert_id":"ef5acb88-d747-48d2-b8d2-713cf351c012","alert_state":"Stopping"}'
```