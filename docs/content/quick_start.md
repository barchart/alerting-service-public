## Setup

As a consumer of the Barchart Alerting Service, you have two options:

1. Connect and communicate with the backend _by embedding this SDK in your software_, or
2. Connect and communicate with the backend _by direct interaction with the REST interface_.

**If you choose to use the SDK**, you can install it from NPM (Node Package Manager), as follows:

```shell
npm install @barchart/alerts-client-js -S
```

**Otherwise, if you choose not to use the SDK**, please finish reviewing this page, then refer to the [API Reference](/content/api_reference) section.

## Environments

Two instances of the Barchart Alerting Service are always running:

#### Demo

The _demo_ environment can be used for integration and evaluation purposes. It can be accessed at ```alerts-management-demo.barchart.com``` and has two significant limitations:

* data saved in the _demo_ environment is **purged every four hours**, and
* data saved in the _demo_ environment can be **accessed by anyone**.

#### Production

The _production_ environment does not permit anonymous connections. **Contact Barchart at solutions@barchart.com or (866) 333-7587 for assistance configuring your account.**

## Authorization

[JSON Web Tokens](https://en.wikipedia.org/wiki/JSON_Web_Token) — called JWT — are used for authorization. Each request made to the backend must include a token. Generating these tokens is surprisingly easy -- refer to the [Key Concepts: Securing the Connection](/content/concepts/security) section for details.

In the _demo_ environment, token generation follows these rules:

* All tokens are signed with the ```HMAC-SHA256``` (aka ```HS256```) algorithm
* All tokens are signed with the ```"public-knowledge-1234567890"``` secret

Since the signing secret is available to everyone (see above), there can be no expectation of privacy; the _demo_ environment is for testing and evaluation only.

In the _production_ environment, you must exchange a secret with Barchart — in the form of a [public/private key pair](https://en.wikipedia.org/wiki/Public-key_cryptography). Consequently, your data will be secure.

Regardless of environment, the token payload uses two fields:

* ```alert_system``` — a unique identifier for your organization (use "barchart.com" in the _demo_ environment).
* ```user_id``` — the unique identifier of the current user. 

## Connecting

#### Using the SDK

The SDK provides an easy-to-use, promise-based mechanism for sending (and receiving) data. It does not require you to have knowledge of the transport layer.

Connect to the remote service, using the adapter for HTTP transport, as follows:

```js
const AlertManager = require('@barchart/alerts-client-js/lib/AlertManager'),
	AdapterForSocketIo = require('@barchart/alerts-client-js/lib/adapters/AdapterForSocketIo'),
	JwtProvider = require('@barchart/alerts-client-js/lib/security/JwtProvider'),
	jwtGeneratorFactory = require('@barchart/alerts-client-js/lib/security/demo/getJwtGenerator');

const host = 'alerts-management-demo.barchart.com';
const port = 443;
const secure = true;

const alertManager = new AlertManager(host, port, secure, AdapterForSocketIo);

const jwtGenerator = jwtGeneratorFactory('me', 'barchart.com');
const jwtRefreshInterval = 60 * 1000 * 5;

alertManager.connect(new JwtProvider(jwtGenerator, jwtRefreshInterval))
	.then(() => {
		// connected ...
	});
```

#### Using the API

If you choose to work directly with the REST interface, you won't need to perform a "connect" action. Each HTTP request is independently authorized by the backend. You simply need to include a JWT token in the _Authorization_ header of each request.

## Defining an Alert

First, we must construct an object which conforms to the [```Alert```](/content/sdk/lib-data?id=schemaalert) schema. By way of example, here is simple ```Alert``` object with one condition — _notify me when Apple stock trades over $600 per share:_

```json
{
	"user_id": "me",
	"alert_system": "barchart.com",
	"name": "My First Alert",
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
	],
	"publishers": [
		{
			"type": {
				"publisher_type_id": 2
			},
			"recipient": "example@gmail.com",
			"use_default_recipient": false
		}
	]
}
```

Glancing at this object probably raises more questions that it answers, for example:

* What is a ```Condition```?
* What is a ```Property```?
* What is a ```Target```?
* What is a ```Publisher```?

Refer to [Key Concepts: Composing Alerts](/content/concepts/composing_alerts) for an in-depth discussion of these objects.

## Creating an Alert

Assuming we've defined an alert (see [above](#defining-an-alert)), we need to save it. The backend will assign an ```alert_id``` value and return a _complete_ ```Alert``` object to you.

#### Using the SDK

```js
alertManager.createAlert(alertToCreate)
	.then((alert) => {
		console.log(`A new alert was created with ID: [ ${alert.alert_id} ].`);
	});
```

#### Using the API

```shell
curl 'https://alerts-management-demo.barchart.com/alerts' \
  -X 'POST' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJhbGVydF9zeXN0ZW0iOiJiYXJjaGFydC5jb20iLCJpYXQiOjE1ODk0MTEyNzl9.SxyC8s_CKhPyzcNmM_h_TRMiNSx3YstKGmAb2IOWqgM' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"user_id":"me","alert_system":"barchart.com","name":"My First Alert","conditions":[{"property":{"property_id":1,"target":{"identifier":"AAPL"}},"operator":{"operator_id":2,"operand":"600"}}],"publishers":[{"type":{"publisher_type_id":2},"recipient":"example@gmail.com","use_default_recipient": false}]}'
```

## Starting an Alert

After an ```Alert``` has been saved, its ```alert_state``` will be ```Inactive```. To begin _tracking_ an alert's conditions, we must start the alert.

#### Using the SDK

To start the alert, use the ```AlertManager.enableAlert``` function:

```js
alertManager.enableAlert(alert)
	.then(() => {
		// Alert is starting ...
	});
```

To stop the alert, use the ```AlertManager.disableAlert``` function:

```js
alertManager.disableAlert(alert)
	.then(() => {
		// Alert is stopping ...
	});
```

#### Using the API

The REST-ful operation to start an alert updates object, setting its ```alert_state``` property to ```Starting```:

```shell
curl 'https://alerts-management-demo.barchart.com/alerts/ef5acb88-d747-48d2-b8d2-713cf351c012' \
  -X 'PUT' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJhbGVydF9zeXN0ZW0iOiJiYXJjaGFydC5jb20iLCJpYXQiOjE1ODk0MTEyNzl9.SxyC8s_CKhPyzcNmM_h_TRMiNSx3YstKGmAb2IOWqgM' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"alert_id":"ef5acb88-d747-48d2-b8d2-713cf351c012","alert_state":"Starting"}'
```

The REST-ful operation to stop alert updates object, setting its ```alert_state``` property to ```Stopping```:

```shell
curl 'https://alerts-management-demo.barchart.com/alerts/ef5acb88-d747-48d2-b8d2-713cf351c012' \
  -X 'PUT' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJhbGVydF9zeXN0ZW0iOiJiYXJjaGFydC5jb20iLCJpYXQiOjE1ODk0MTEyNzl9.SxyC8s_CKhPyzcNmM_h_TRMiNSx3YstKGmAb2IOWqgM' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"alert_id":"ef5acb88-d747-48d2-b8d2-713cf351c012","alert_state":"Stopping"}'
```

## Retrieving Alerts

You can retrieve all alerts (for the current user), as follows:

#### Using the SDK

Executing the ```AlertManager.retrieveAlerts``` function will return a snapshot of the current user's alerts. However, in most cases, it is preferable to use the ```AlertManager.subscribeAlerts``` function -- refer to the [Key Concepts: Monitoring Alerts](/content/concepts/monitoring_alerts?id=alert-subscriptions) section for details.

```js
const query = { };

query.user_id = 'me';
query.alert_system = 'barchart.com';

alertManager.retrieveAlerts(query)
	.then((alerts) => {
		console.log(`Retrieved alerts [ ${alerts.length} ] for [ ${query.user_id}@${query.alert_system} ]`);
	});
```

#### Using the API

```shell
curl 'https://alerts-management-demo.barchart.com/alerts/users/barchart.com/me' \
  -X 'GET' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJhbGVydF9zeXN0ZW0iOiJiYXJjaGFydC5jb20iLCJpYXQiOjE1ODk0MTEyNzl9.SxyC8s_CKhPyzcNmM_h_TRMiNSx3YstKGmAb2IOWqgM'
```

## Demo Applications

Sometimes learning by example is best. Three applications were built using this SDK:

* A single-page, HTML5 web application,
* A mobile application, compatible with iOS and Android devices, and
* Simple Node.js scripts.

You can load the web application by clicking [here](https://examples.aws.barchart.com/alerts-client-js/example.html). To explore the other applications, visit [Appendix: Demo Application Overview](/content/appendices/demo_application_overview).



