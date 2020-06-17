**This page lists discrete actions which can be executed.** Each action described here includes:

* a ink to SDK reference,
* an example invocation using SDK,
* a link to Open API definition, and
* an example cURL request to the API

## Metadata Lookup

_This section is incomplete, more coming soon._

### List Available Targets

A [```Target```](/content/concepts/alert_data_structure?id=target) is a category of streaming data. This operation returns a listing of available targets.

**SDK**

For more information, refer to the [```AlertManager.getTargets```](/content/sdk/lib?id=alertmanagergettargets) function. Here is an example:

```js
alertManager.getTargets()
	.then((targets) => {
		console.log(targets, null, 2);
	});
```

**API**

For more information, refer to the [```/alert/targets```](content/api/paths?id=get-alerttargets) endpoint. Here is an example:

```shell
curl 'https://alerts-management-demo.barchart.com/alert/targets' \
  -X 'GET' \
  -H 'Accept: */*'
```
### List Available Properties

A [```Property```](/content/concepts/alert_data_structure?id=property) an observable attribute of a target. This operation returns a listing of available properties.

**SDK**

For more information, refer to the [```AlertManager.getProperties```](/content/sdk/lib?id=alertmanagergetproperties) function. Here is an example:

```js
alertManager.getProperties()
	.then((properties) => {
		console.log(properties, null, 2);
	});
```

**API**

For more information, refer to the [```/alert/targets/properties```](/content/api/paths?id=get-alerttargetsproperties) endpoint. Here is an example:

```shell
curl 'https://alerts-management-demo.barchart.com/alert/targets/properties' \
  -X 'GET' \
  -H 'Accept: */*'
```

## Alert Actions

_This section is incomplete, more coming soon._

## Alert Subscriptions

_This section is incomplete, more coming soon._
