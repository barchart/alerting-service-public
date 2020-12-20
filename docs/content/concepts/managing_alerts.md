Once you have [composed an alert](/content/concepts/composing_alerts), it can be saved, started, stopped, and deleted.

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

We can save it using the [```AlertManager.createAlert```](/content/sdk/lib?id=alertmanagercreatealert) function.

```js
alertManager.createAlert(alertToCreate)
	.then((alert) => {
		console.log(`A new alert was created with ID: [ ${alert.alert_id} ]`);
	});
```

#### Using the API

Or, we can save it using the [```/alerts```](/content/api/paths?id=post-alerts) endpoint.

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



## Stopping an Alert

#### Using the SDK

#### Using the API

## Starting an Alert

#### Using the SDK

#### Using the API

## Deleting an Alert

#### Using the SDK

#### Using the API