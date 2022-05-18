Once you have [composed an alert](/content/concepts/composing_alerts) in JSON format, it can be saved, started, stopped, and deleted.

## Saving an Alert

Let's define an _alert_ with one condition — _Apple stock trades over $600 per share:_

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
	]
}
```

#### Using the SDK

We can save the _alert_ by calling the [```AlertManager.createAlert```](/content/sdk/lib?id=alertmanagercreatealert) function.

```js
alertManager.createAlert(alertToCreate)
	.then((saved) => {
		console.log(`A new alert was created with ID: [ ${saved.alert_id} ]`);
	});
```

#### Using the API

Or, we can save the _alert_ by sending a ```POST``` request to the [```/alerts```](/content/api/paths?id=post-alerts) endpoint.

```shell
curl 'https://alerts-management-demo.barchart.com/alerts' \
  -X 'POST' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJhbGVydF9zeXN0ZW0iOiJiYXJjaGFydC5jb20iLCJpYXQiOjE1ODk0MTEyNzl9.SxyC8s_CKhPyzcNmM_h_TRMiNSx3YstKGmAb2IOWqgM' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"user_id":"me","alert_system":"barchart.com","name":"My First Alert","conditions":[{"property":{"property_id":1,"target":{"identifier":"AAPL"}},"operator":{"operator_id":2,"operand":"600"}}]}'
```

#### JSON Result

One the _alert_ has been saved, it's echoed back to us with additional properties — most notably, the ```alert_id``` property:

```json
{
    "alert_id": "3a36d266-875d-4eaf-8c24-05021c9208c4", 
    "alert_type": null, 
    "alert_behavior": "terminate", 
    "alert_state": "Inactive", 
    "alert_system": "barchart.com", 
    "alert_system_key": null, 
    "user_id": "me", 
    "name": "My First Alert", 
    "user_notes": null, 
    "automatic_reset": false, 
    "create_date": "1608488910248", 
    "last_trigger_date": null, 
    "last_start_date": null, 
    "tracking_server_id": null, 
    "conditions": [ 
      { 
        "condition_id": "074431a9-54af-4f7e-b85b-0c34c5bca96e", 
        "property": { 
          "property_id": 1, 
          "description": [ 
            "Last" 
          ], 
          "descriptionShort": [ 
            "Last" 
          ], 
          "accessor": [ 
            "lastPrice" 
          ], 
          "group": "Quote", 
          "category": [ 
            "Prices & Volume" 
          ], 
          "target": { 
            "target_id": 1, 
            "description": "basic", 
            "type": "symbol", 
            "identifier_description": "symbol", 
            "identifier": "AAPL", 
            "display": null, 
            "kind": null 
          }, 
          "type": "number", 
          "format": "price" 
        }, 
        "operator": { 
          "operator_id": 2, 
          "operator_name": "greater-than", 
          "display": { 
            "short": ">", 
            "medium": "greater than", 
            "long": "greater than" 
          }, 
          "operator_type": "binary", 
          "operand_type": "number", 
          "operand_literal": true, 
          "operand": "600", 
          "operand_display": "600" 
        }, 
        "name": "Last greater than ", 
        "templates": { 
          "trigger": { 
            "email": "Traded for {{{event.format.lastPrice}}}", 
            "sms": "{{{property.target.identifier}}}{{#if event.tradeTime}} traded for {{{event.format.lastPrice}}} {{#if event.tradeTimeDisplay}}at {{{event.tradeTimeDisplay}}} {{/if}}on {{{event.tradeDateDisplay}}}{{else}} was priced at {{{event.format.lastPrice}}} as of {{{event.timeDateDisplay}}}{{/if}}" 
          }, 
          "condition": "Last greater than {{{operator.format.operand}}}" 
        } 
      } 
    ], 
    "publishers": [], 
    "effectivePublishers": [], 
    "schedules": [] 
  }
```

## Starting an Alert

An _alert_ is inert until activated. Once activated, the backend will begin monitoring and evaluating its _conditions_. Only _alerts_ in the ```Inactive``` or ```Triggered``` states can be activated.

#### Using the SDK

Call the [```AlertManager.enableAlert```](/content/sdk/lib?id=alertmanagerenablealert) function. Pass the entire alert. Or, pass an abbreviated object with an ```alert_id``` property.

```js
const abbreviated = { };

abbreviated.alert_id = alert.alert_id;

alertManager.enableAlert(abbreviated)
	.then((updated) => {
		console.log(`Alert [ ${updated.alert_id} ] state is now [ ${updated.alert_state} ]`);
	});
```

#### Using the API

Or, we can activate an _alert_ by sending a ```PUT``` request to the [```/alerts/{id}```](/content/api/paths?id=put-alertsalert_id) endpoint. We must specify the desired ```alert_state``` property as ```Starting```.

```shell
curl 'https://alerts-management-demo.barchart.com/alerts/3a36d266-875d-4eaf-8c24-05021c9208c4' \
  -X 'PUT' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJhbGVydF9zeXN0ZW0iOiJiYXJjaGFydC5jb20iLCJpYXQiOjE1ODk0MTEyNzl9.SxyC8s_CKhPyzcNmM_h_TRMiNSx3YstKGmAb2IOWqgM' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"alert_id":"3a36d266-875d-4eaf-8c24-05021c9208c4","alert_state":"Starting"}'
```

#### JSON Result

Once the start command is processed, the _alert_ is echoed back to us with updated property values — most notably, the ```alert_state``` property.

## Stopping an Alert

When ```Active``` _alert_ is stopped, the backend will cease monitoring and evaluating its _conditions_. 

#### Using the SDK

Call the [```AlertManager.disableAlert```](/content/sdk/lib?id=alertmanagerdisablealert) function. Pass the entire alert. Or, pass an abbreviated object with an ```alert_id``` property.

```js
const abbreviated = { };

abbreviated.alert_id = alert.alert_id;

alertManager.disableAlert(abbreviated)
	.then((updated) => {
		console.log(`Alert [ ${updated.alert_id} ] state is now [ ${updated.alert_state} ]`);
	});
```

#### Using the API

Or, we can deactivate an _alert_ by sending a ```PUT``` request to the [```/alerts/{id}```](/content/api/paths?id=put-alertsalert_id) endpoint. We must specify the desired ```alert_state``` property as ```Stopping```.

```shell
curl 'https://alerts-management-demo.barchart.com/alerts/3a36d266-875d-4eaf-8c24-05021c9208c4' \
  -X 'PUT' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJhbGVydF9zeXN0ZW0iOiJiYXJjaGFydC5jb20iLCJpYXQiOjE1ODk0MTEyNzl9.SxyC8s_CKhPyzcNmM_h_TRMiNSx3YstKGmAb2IOWqgM' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"alert_id":"3a36d266-875d-4eaf-8c24-05021c9208c4","alert_state":"Stopping"}'
```

#### JSON Result

Once the stop command is processed, the _alert_ is echoed back to us with updated property values — most notably, the ```alert_state``` property.

## Starting All Alerts

All of a user's _alerts_ can be started with one command.

#### Using the SDK

Call the [```AlertManager.enableAlerts```](/content/sdk/lib?id=alertmanagerenablealerts) function.

```js
const payload = { };

payload.user_id = 'me';
payload.alert_system = 'barchart.com';

alertManager.enableAlerts(payload)
	.then((success) => {
		console.log(`Command to start all alerts executed.`);
	});
```

#### Using the API

Or, we can activate all of a user's _alerts_ by sending a ```PUT``` request to the [```/alerts/{alert_system}/{user}```](/content/api/paths?id=put-alertsusersalert_systemuser_id) endpoint. We must specify the desired ```alert_state``` property as ```Starting```.

```shell
curl 'https://alerts-management-demo.barchart.com/alerts/users/barchart.com/me' \
  -X 'PUT' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJhbGVydF9zeXN0ZW0iOiJiYXJjaGFydC5jb20iLCJpYXQiOjE1ODk0MTEyNzl9.SxyC8s_CKhPyzcNmM_h_TRMiNSx3YstKGmAb2IOWqgM' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"alert_state":"Starting"}'
```

#### JSON Result

Once the start command is processed, a JSON array is returned. The array will contain each _alert_ that is starting.

## Stopping All Alerts

All of a user's _alerts_ can be stopped with one command.

#### Using the SDK

Call the [```AlertManager.disableAlerts```](/content/sdk/lib?id=alertmanagerdisablealerts) function.

```js
const payload = { };

payload.user_id = 'me';
payload.alert_system = 'barchart.com';

alertManager.disableAlerts(payload)
	.then((success) => {
		console.log(`Command to stop all alerts executed.`);
	});
```

#### Using the API

Or, we can deactivate all of a user's _alerts_ by sending a ```PUT``` request to the [```/alerts/{alert_system}/{user}```](/content/api/paths?id=put-alertsusersalert_systemuser_id) endpoint. We must specify the desired ```alert_state``` property as ```Stopping```.

```shell
curl 'https://alerts-management-demo.barchart.com/alerts/users/barchart.com/me' \
  -X 'PUT' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJhbGVydF9zeXN0ZW0iOiJiYXJjaGFydC5jb20iLCJpYXQiOjE1ODk0MTEyNzl9.SxyC8s_CKhPyzcNmM_h_TRMiNSx3YstKGmAb2IOWqgM' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"alert_state":"Stopping"}'
```

#### JSON Result

Once the stop command is processed, a JSON array is returned. The array will contain each _alert_ that is stopping.

## Deleting an Alert

Any _alert_ can be deleted. If an ```Active``` alert is deleted, monitoring will stop immediately.

#### Using the SDK

Call the [```AlertManager.deleteAlert```](/content/sdk/lib?id=alertmanagerdeletealert) function. Pass the entire alert. Or, pass an abbreviated object with an ```alert_id``` property.

```js
const abbreviated = { };

abbreviated.alert_id = alert.alert_id;

alertManager.deleteAlert(abbreviated)
	.then((deleted) => {
		console.log(`Alert [ ${deleted.alert_id} ] was deleted`);
	});
```

#### Using the API

Or, we can delete an _alert_ by sending a ```DELETE``` request to the [```/alerts/{id}```](/content/api/paths?id=delete-alertsalert_id) endpoint.

```shell
curl 'https://alerts-management-demo.barchart.com/alerts/3a36d266-875d-4eaf-8c24-05021c9208c4' \
  -X 'DELETE' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJhbGVydF9zeXN0ZW0iOiJiYXJjaGFydC5jb20iLCJpYXQiOjE1ODk0MTEyNzl9.SxyC8s_CKhPyzcNmM_h_TRMiNSx3YstKGmAb2IOWqgM' \
  -H 'Content-Type: application/json;charset=UTF-8'
```