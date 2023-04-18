## Data Format

The Barchart Alerting Service communicates using [JSON](https://en.wikipedia.org/wiki/JSON) data. You send JSON-formatted objects to the backend. You receive JSON-formatted in response. **This section describes the schema of these JSON objects.**

After reviewing this page, the [Appendices: Data Structure Glossary](/content/appendices/data_structure_glossary) may also be helpful.

## Alert Structure Basics

An _alert_ is our top-level object. Here is a visualization of an alert, showing its important internal structures:

```text
├── Alert
│   ├── Condition(s)
│   │   ├── Condition 1 (required)
│   │   ├── Condition 2 (optional)
│   ├── Publisher(s)
│   │   ├── Publisher 1 (optional)
```

Every alert has at least one _condition_ which defines:

* the type of data feed we connect to (i.e. the _target_ object),
* the attribute of the data stream we want to observe (i.e. the _property_ object), and
* the conditional logic we apply to the data feed (i.e. the _operator_ and _operand_ objects).

You can visualize the _condition_ for Apple stock reaching $600, as follows:

```text

├── Condition:
│   ├── Property: (Last Price)
│   │   └── Target: (AAPL stock)
│   ├── Operator: (Greater Than)
│   │   └── Operand: ($600)
```

Finally, a _publisher_ describes instructions for notifying the alert's owner when the alert's conditions are met. In most cases, an alert will not have publisher objects. Instead, it's common to define universal notification instructions on a user-by-user basis.

Here is an actual JSON object, representing an alert:

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
				"operand": 600
			}
		}
	],
	"publishers": [

	]
}
```
## Downloading Metadata

In order to compose _condition_ objects, for your alerts, you'll need the listings of:

* _targets_ — data feeds which can be observed (e.g. a stock quote)
* _properties_ — attributes of the data feed being observed (e.g. last price)
* _operators_ — comparisons which can be applied to properties (e.g. greater than)

#### Using the SDK

```js
const promises = [
	alertManager.getTargets(),
	alertManager.getProperties(),
	alertManager.getOperators()
];

return Promise.all(promises)
	.then((results) => {
		const availableTargets = results[0];
		const availableProperties = results[1];
		const availableOperators = results[2];
	});
```

#### Using the API

```shell
curl 'https://alerts-management-demo.barchart.com/alert/targets' \
  -X 'GET' \
  -H 'Accept: application/json'
```

```shell
curl 'https://alerts-management-demo.barchart.com/alert/targets/properties' \
  -X 'GET' \
  -H 'Accept: application/json'
```

```shell
curl 'https://alerts-management-demo.barchart.com/alert/operators' \
  -X 'GET' \
  -H 'Accept: application/json'
```

## Composing Alerts

Each _alert_ is represented by a JSON object. At a minimum, we must define (a) the _alert_ owner, and (b) a set of _conditions_ for the alert, as follows:

```json
{
	"user_id": "me",
	"alert_system": "barchart.com",
	"conditions": [ ]
}
```

Technically speaking, this _alert_ object is valid. However, it won't be useful without at least one _condition_ (more on that [below](#composing-conditions)).

Additional properties are optional:

* ```name``` — Ad hoc text.
* ```user_notes``` — Ad hoc text.
* ```alert_type``` — See the [Advanced Features](#using-advanced-features) section, below.
* ```alert_behaviour``` — See the [Advanced Features](#using-advanced-features) section, below.
* ```schedules``` — See the [Advanced Features](#using-advanced-features) section, below.

Also, refer to [```Schema.Alert```](/content/sdk/lib-data?id=schemaalert) for a formal definition of the data structure.

## Composing Conditions

In order to define a conditional statement as a JSON object, you need to:

* Specify the identifier of the _target_, using a ```String``` value — usually a stock symbol,
* Specify a _property_, using the numeric ```property_id``` value,
* Specify an _operator_, using the numeric ```operator_id``` value, and
* Specify an _operand_ value — usually a ```Number``` value.

Using the same example — Apple stock's last price is greater than $600 — our JSON object looks like this (comments added):

```
{
	"property": {
		"property_id": 1, <-- The numeric identifier of the "last price" property (see metadata for properties)
		"target": {
			"identifier": "AAPL" <-- The stock symbol
		}
	},
	"operator": {
		"operator_id": 2, <-- The numeric identifier of the "greater than" operator (see metadata for operators)
		"operand": "600" <-- A value complete our logical expression, (AAPL.last-price > 600)
	}
}
```

Also, refer to [```Schema.Condition```](/content/sdk/lib-data?id=schemacondition) for a formal definition of the data structure.

## Composing Publishers

Most alerts do not use publishers. Instead, most alerts rely on user preferences to determine how notifications should be handled. 

See the [Key Concepts: Configuring Notifications](/content/concepts/configuring_notifications) for more details.

## Using Advanced Features

#### Adjusting Alert Behavior

The `alert_behavior` attribute is optional. However, the following values can be specified:

* `continue`
* `continue_daily`
* `schedule`
* `schedule_once`
* `terminate`

The `terminate` option describes the system's default behavior. Once the alert's conditions are met, notifications are sent and the alert stops.

The `continue` and `continue_daily` options prevent the alert from stopping after its conditions are met. The `continue_daily` behavior prevents an alert from triggering more than once per day.

The `schedule` and `schedule_once` options allow an alert to "sleep" until some point in the future. When the scheduled time arrives, the alert will "wake up" and evaluate its conditions. The `schedule_once` behavior will stop the alert if its conditions are met.

When using the `schedule` and `schedule_once` options, a `schedules` attribute must be added to the alert, defining the days and times the alert should "wake up" and evaluate its conditions. Here is an example:

```json
{
	"user_id": "me",
	"alert_system": "barchart.com",
	"name": "My Scheduled Alert",
	"alert_behavior": "schedule",
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
				"operand": 600
			}
		}
	],
	"schedules": [
		{
			"time": "08:00",
			"day": "Monday",
			"timezone": "America/Denver"
		},
		{
			"time": "13:00",
			"day": "Friday",
			"timezone": "America/Denver"
		}
	]
}
```