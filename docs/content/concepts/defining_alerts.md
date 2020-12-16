## Data Format

The Barchart Alerting Service communicates using [JSON](https://en.wikipedia.org/wiki/JSON) data. You send JSON-formatted objects to the backend. You receive JSON-formatted in response. **This section describes the schema for these JSON objects.**

## Alert Structure Concepts

An **alert** is our top-level object. Here is a visualization of an alert, showing its important internal structures:

```text
├── Alert
│   ├── Condition(s)
│   │   ├── Property
│   │   │   └── Target
│   │   ├── Operator
│   │   │   └── Operand
│   ├── Publisher(s)
```

Each alert has at least one **condition** which defines:

* the type of data feed we connect to (i.e. the **target** object),
* the attribute of the data stream we want to observe (i.e. the **property** object), and
* the conditional logic we apply to the data feed (i.e. the **operator** and **operand** objects).

You can visualize the **condition** for Apple stock reaching $600, as follows:

```text

├── Condition 1:
│   ├── Property: (Last Price)
│   │   └── Target: (AAPL stock)
│   ├── Operator: (Greater Than)
│   │   └── Operand: ($600)
```

Finally, a **publisher** defines the notification instructions for a specific alert. In most cases, an alert will not have publisher objects. Instead, it's common to define default notification rules which apply to all the alerts owned by a specific user.

Finally, here is the *actual* JSON object, representing the alert:

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

## Building Alerts

## Building Conditions

### Required Metadata For Conditions

In order to build conditional statements, you'll need the listings of:

* _targets_ — things which can be observed (e.g. a stock quote)
* _properties_ — attributes of the object being observed (e.g. last price)
* _operators_ — comparisons which can be applied to properties (e.g. greater than)

Request listings of this metadata as follows:

```js
const promises = [
	alertManager.getTargets(),
	alertManager.getProperties(),
	alertManager.getOperators()
];

return Promise.all(promises)
	.then(results) => {
		const availableTargets = results[0];
		const availableProperties = results[1];
		const availableOperators = results[2];
	});
```

### JSON Format For Conditions

In order to define a conditional statement as a JSON object, you need to:

* Specify the desired _property_ using the numeric ```property_id``` value,
* Specify the desired _target_ using a string value (usually a stock symbol),
* Specify the desired _operator_ using the numeric ```operator_id``` value,

Using the same example — Apple stock's last price is greater than $600 — our JSON object looks like this (comments added):

```json (psuedo)
{
	"property": {
		"property_id": 1, <-- The numeric identifier of the "last price" property (see metadata for properties)
		"target": {
			"identifier": "AAPL" <-- The stock symbol
		}
	},
	"operator": {
		"operator_id": 2, <-- The numeric value of the "greater than" operator (see metadata for operators)
		"operand": "600" <-- The value to use
	}
}
```

### Natural Language Text

At present, you must construct JSON objects which conform to the [Condition](/content/sdk/lib-data?id=schemacondition) schema. However, natural language conditional statements will be supported soon. As of yet, the syntax is has not been finalized; however, it will look something like this:

* "AAPL.last-price > 600"
* "AAPL.bid-size < AAPL.ask-size"

## Structure Glossary

### Alert

**An "alert" is essentially a container for conditions.** It has an owner. It always exists one, mutually-exclusive state (e.g. inactive, starting, started, or triggered). All conditions must evaluate to true before the alert will trigger.

Here is an example — using the fewest fields necessary — to create a new alert:

```json (psuedo)
{
	"user_id": "me",
	"alert_system": "barchart.com",
	"name": "My First Alert"
	"conditions": [ /* See below */ ]
}
```

_Refer to [```Schema.Alert```](/content/sdk/lib-data?id=schemaalert) for a formal definition._

### Condition

**A "condition" is a logical statement which is repeatedly evaluated as streaming data is processed.** For example, "The price of Apple stock is higher than $600" is a condition. A "condition" belongs to an alert.

Here is an example — using the fewest fields necessary — to create a condition (for use with an alert):

```json (psuedo)
{
	"property": { /* See below */ },
	"operator": { /* See below */ }
}
```

_Refer to [```Schema.Condition```](/content/sdk/lib-data?id=schemacondition) for a formal definition._

### Property

**A "property" is the observed attribute of the streaming data source**. For example, the _last price_ (of a stock quote) is a property.

Here is an example — using the fewest fields necessary — to create a property (for use with a condition):

```json (psuedo)
{
	"property_id": 1,
	"target": { /* See below */ }
}
```

_Refer to [```Schema.Property```](/content/sdk/lib-data?id=schemaproperty) for a formal definition._

### Target

**A "target" identifies a specific entity.** For example, Apple stock is a target. Microsoft stock is a different target. They are differentiated by the ```identifier``` property value.

Here is an example — using the fewest fields necessary — to create a target (for use a property):

```json
{
	"identifier": "AAPL"
}
```

_Refer to [```Schema.Target```](/content/sdk/lib-data?id=schematarget) for a formal definition._

### Operator

**An "operator" refers to mechanism for comparison.** For example, _greater than_, _less than_, and _equals_ are operators. Operator objects include an ```operand``` property. The operand is used to complete the right-hand side of an expression (e.g. "greater than $600").

Here is an example — using the fewest fields necessary — to create an operator (for use with a condition):

```json
{
	"operator_id": 2,
	"operand": "600"
}
```

_Refer to [```Schema.Operator```](/content/sdk/lib-data?id=schemaoperator) for a formal definition._


