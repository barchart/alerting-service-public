## Alert

**An "alert" is essentially a container for conditions.** It has an owner. It always exists one, mutually-exclusive state (e.g. inactive, starting, started, or triggered). All child conditions must evaluate to true before the alert will trigger.

Here is an example — using the fewest fields necessary — to create a new alert:

```json (psuedo)
{
	"user_id": "me",
	"alert_system": "barchart.com",
	"name": "My First Alert"
	"conditions": [ { /* See below */ } ]
}
```

_Refer to [```Schema.Alert```](/content/sdk/lib-data?id=schemaalert) for a formal definition._

## Condition

**A "condition" is a logical statement which is continuously evaluated as a data feed processed.** Waiting for the price of Apple stock to exceed $600 is a condition. A condition is always contained within an alert.

Here is an example — using the fewest fields necessary — to create a condition (for use with an alert):

```json (psuedo)
{
	"property": { /* See below */ },
	"operator": { /* See below */ }
}
```

_Refer to [```Schema.Condition```](/content/sdk/lib-data?id=schemacondition) for a formal definition._

## Operator

**An "operator" refers to mechanism for comparison.** For example, greater than, less than, and equals are operators. Operator objects include an ```operand``` property. The operand is used to complete the right-hand side of an expression (e.g. "greater than $600"). An operator is a component of a condition.

Here is an example — using the fewest fields necessary — to create an operator (for use with a condition):

```json
{
	"operator_id": 2,
	"operand": "600"
}
```

_Refer to [```Schema.Operator```](/content/sdk/lib-data?id=schemaoperator) for a formal definition._

## Property

**A "property" is the observed attribute of the streaming data source**. For example, the last price (of a stock quote) is a property. An operator is a component of a condition.

Here is an example — using the fewest fields necessary — to create a property (for use with a condition):

```json (psuedo)
{
	"property_id": 1,
	"target": { /* See below */ }
}
```

_Refer to [```Schema.Property```](/content/sdk/lib-data?id=schemaproperty) for a formal definition._

## Target

**A "target" identifies a specific entity.** For example, Apple stock is a target. Microsoft stock is a different target. Targets are differentiated using the ```identifier``` attribute.

Here is an example — using the fewest fields necessary — to create a target (for use a property):

```json
{
	"identifier": "AAPL"
}
```

_Refer to [```Schema.Target```](/content/sdk/lib-data?id=schematarget) for a formal definition._