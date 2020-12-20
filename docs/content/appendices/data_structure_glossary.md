## Alert

**An "alert" is a container for [conditions](#Condition).** It is a top-level, stand-alone object. It has an owner. It exists in a mutually-exclusive state (e.g. inactive, starting, started, or triggered). All child conditions must evaluate to true before the alert will trigger.

Here is an example — using the fewest fields necessary — to create a new alert:

```json (psuedo)
{
	"user_id": "me",
	"alert_system": "barchart.com",
	"name": "My First Alert",
	"conditions": [ { /* See the "Condition" section */ } ]
}
```

_Refer to [```Schema.Alert```](/content/sdk/lib-data?id=schemaalert) for a formal definition._

## Condition

**A "condition" constitutes a logical expression which is repeatedly evaluated as a data feed is processed.** A condition is always contained within an [alert](#Alert).

Here is an example — using the fewest fields necessary — to create a condition (for use within an [alert](#Alert)):

```json (psuedo)
{
	"property": { /* See the "Property" section */ },
	"operator": { /* See the "Operator" section */ }
}
```

_Refer to [```Schema.Condition```](/content/sdk/lib-data?id=schemacondition) for a formal definition._

## Operator

**An "operator" refers to a mechanism for comparison.** For example, greater than, less than, and equals are operators. Operator objects include an ```operand``` property. The operand is used to complete the right-hand side of an expression (e.g. "greater than $600"). An operator is a component of a [condition](#Condition).

Here is an example — using the fewest fields necessary — to create an operator (for use as part of a [condition](#Condition)):

```json
{
	"operator_id": 2,
	"operand": "600"
}
```

_Refer to [```Schema.Operator```](/content/sdk/lib-data?id=schemaoperator) for a formal definition._

## Property

**A "property" is the observed attribute of the streaming data source**. For example, the last price (of a stock quote) is a property. A property is a component of a [condition](#Condition).

Here is an example — using the fewest fields necessary — to create a property (for use as part of a [condition](#Condition)):

```json (psuedo)
{
	"property_id": 1,
	"target": { /* /* See the "Target" section */ */ }
}
```

_Refer to [```Schema.Property```](/content/sdk/lib-data?id=schemaproperty) for a formal definition._

## Target

**A "target" identifies a specific entity.** For example, Apple stock is a target. Microsoft stock is a different target. Specific targets are differentiated using the ```identifier``` attribute.

Here is an example — using the fewest fields necessary — to create a target (for use as part of a [property](#Property)):

```json
{
	"identifier": "AAPL"
}
```

_Refer to [```Schema.Target```](/content/sdk/lib-data?id=schematarget) for a formal definition._

## Publisher

**A "publisher" describes the rules for sending one type of notification (e.g. email) after an alert triggers** A publisher is always contained within an [alert](#Alert). If an alert has no publishers; notifications are controlled entirely by user preferences.

Here is an example — using the fewest fields necessary — to create a publisher (for use within an [alert](#Alert)):

```json (psuedo)
{
  "publishers": [
	{
	  "type": {
		"publisher_type_id": 1
	  },
	  "use_default_recipient": false,
	  "recipient": "312-867-5309"
	}
  ]
}
```

_Refer to [```Schema.Publisher```](/content/sdk/lib-data?id=schemapublisher) for a formal definition._



