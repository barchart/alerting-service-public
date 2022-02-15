## State Transitions

An _alert_ is ```Inactive``` when it is created. 

Here are the most common states for an alert:

* ```Inactive``` - The alert is not processing. No notifications will be generated.
* ```Starting``` - The alert is attempting to transition to the ```Active``` state.
* ```Active``` - The alert is tracking; however, its conditions have not yet been met.
* ```Stopping``` - The alert is attempting to transition to the ```Inactive``` state.
* ```Triggered``` - The alert's conditions have been met. Functionally speaking, this is equivalent to the ```Inactive``` state.

Here is a visualization of possible state transitions:

![Alert State Diagram](../images/states.svg)

## Alert Retrieval

Existing _alert_ objects can be retrieved for a specific user.

#### Using the SDK

Use the [```AlertManager.retrieveAlerts```](/content/sdk/lib?id=alertmanagerretrievealerts) function to get a snapshot of existing _alert_ objects. 

Alternately, it may be preferable to use the [```AlertManager.subscribeAlerts```](/content/sdk/lib?id=alertmanagersubscribealerts) function since existing _alert_ objects are returned immediately after a subscription is established (see the next section for details).

```js
const query = { };

query.user_id = 'me';
query.alert_system = 'barchart.com';

alertManager.retrieveAlerts(query)
	.then((alerts) => {
		triggers.forEach(a => console.log(a));
	});
```

#### Using the API

```shell
curl 'https://alerts-management-demo.barchart.com/alerts/users/barchart.com/me' \
  -X 'GET' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJhbGVydF9zeXN0ZW0iOiJiYXJjaGFydC5jb20iLCJpYXQiOjE1ODk0MTEyNzl9.SxyC8s_CKhPyzcNmM_h_TRMiNSx3YstKGmAb2IOWqgM'
```

## Alert Subscriptions

The following events can occur during the life of a _alert_ object:

* It is _created_ — in response to a user request
* It is _updated_ — when its state changes — in response to a user request (or an automated system decision)
* It is _deleted_ — in response to a user request
* It is _triggered_ — when its conditions are met

#### Using the SDK

The [```AlertManager.subscribeAlerts```](/content/sdk/lib?id=alertmanagersubscribealerts) function registers callbacks, as follows:

```js
const handleAlertChanged = (alert) => {
	console.log(`Alert [ ${alert.alert_id} ] changed status to [ ${a.alert_state} ]`);
};

const handleAlertDeleted = (alert) => {
	console.log(`Alert [ ${alert.alert_id} ] was deleted`);
};

const handleAlertCreated = (alert) => {
	console.log(`Alert [ ${alert.alert_id} ] was created`);
};

const handleAlertTriggered = (alert) => {
	console.log(`Alert [ ${alert.alert_id} ] was triggered`);
};

const query = { };

query.user_id = 'me';
query.alert_system = 'barchart.com';

const subscripton = alertManager.subscribeAlerts(query, handleAlertChanged, handleAlertDeleted, handleAlertCreated, handleAlertTriggered);
```

NOTE: After a subscription has been established, the [```Callbacks.AlertMutatedCallback```](/content/sdk/lib-callbacks?id=callbacksalertmutatedcallback) will be triggered once for each existing _alert_ object. This eliminates the need to explicitly invoke the [```AlertManager.retrieveAlerts```](/content/sdk/lib?id=alertmanagerretrievealerts) function (to synchronize state).

To stop the subscription, do the following:

```js
subscription.dispose();
```

#### Using the API

Short polling must be used to simulate a subscription.