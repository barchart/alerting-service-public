## Synopsis

The Barchart Alert Service communicates using JSON data. We send JSON objects to the backend and we receive JSON objects in response.

The top-level object is called an  _"alert"_. Here is a visualization of an alert, showing important component structures:

```text
├── Alert
│   ├── Condition(s)
│   │   ├── Property
│   │   │   └── Target
│   │   ├── Operator
│   │   │   └── Operand
│   ├── Publisher(s)
```

## Alert

Refer to [```Schema.Alert```](/content/sdk/lib-data?id=schemaalert) for a formal definition of the _"alert"_ data structure.

## Condition

Refer to [```Schema.Condition```](/content/sdk/lib-data?id=schemacondition) for a formal definition of the _"condition"_ data structure.

### Property

Refer to [```Schema.Property```](/content/sdk/lib-data?id=schemaproperty) for a formal definition of the _"property"_ data structure.

### Target

Refer to [```Schema.Target```](/content/sdk/lib-data?id=schematarget) for a formal definition of the _"target"_ data structure.

### Operator

Refer to [```Schema.Operator```](/content/sdk/lib-data?id=schemaoperator) for a formal definition of the _"operator"_ data structure.

## Publisher

Refer to [```Schema.Publisher```](/content/sdk/lib-data?id=schemapublisher) for a formal definition of the _"publisher"_ data structure.

