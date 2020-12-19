## Data Format

The Barchart Alerting Service communicates using [JSON](https://en.wikipedia.org/wiki/JSON) data. You send JSON-formatted objects to the backend. You receive JSON-formatted in response. **This section describes the schema of these JSON objects.**

After reviewing this page, the [Appendices: Data Structure Glossary](/content/appendices/data_structure_glossary) may also be helpful.

## Alert Structure Basics

An _alert_ is our top-level object. Here is a visualization of an alert, showing its important internal structures:

```text
├── Alert
│   ├── Condition(s)
│   │   ├── Property
│   │   │   └── Target
│   │   ├── Operator
│   │   │   └── Operand
│   ├── Publisher(s)
```

Every alert has at least one _condition_ which defines:

* the type of data feed we connect to (i.e. the _target_ object),
* the attribute of the data stream we want to observe (i.e. the _property_ object), and
* the conditional logic we apply to the data feed (i.e. the _operator_ and _operand_ objects).

You can visualize the _condition_ for Apple stock reaching $600, as follows:

```text

├── Condition 1:
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
				"operand": "600"
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

Coming soon.

## Composing Conditions

In order to define a conditional statement as a JSON object, you need to:

* Specify a _target_ identifier, using a ```String``` value — usually a stock symbol,
* Specify the desired _property_, using the numeric ```property_id``` value,
* Specify the desired _operator_, using the numeric ```operator_id``` value, and
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

## Composing Publishers

Most alerts do not define any publishers. Instead, most alerts rely on global user preferences to determine how notifications should be handled. 

See the [Key Concepts: Configuring Notifications](/content/appendices/configuring_notifications) for more details.

## Using Advanced Features

Coming soon.
