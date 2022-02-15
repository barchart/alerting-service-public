When an _alert's_ conditions are met, a _trigger_ object is created. Here is an example:

```json
{
  "alert_id": "8814c5d7-6adc-4783-b94c-15cc668e68f2",
  "user_id":"me",
  "alert_system": "barchart.com",
  "trigger_status":"Unread",
  "trigger_date":"1608176496477",
  "trigger_status_date":"1608176496569",
  "trigger_title":"TSLA (Tesla Inc)",
  "trigger_description":"TSLA traded for 622.77"
}
```

## Trigger Retrieval

A history of _trigger_ objects can be retrieved for a specific user. Also, they can be filtered for:

* Date — Creation after a specific date
* Status — _Read_ or _Unread_

#### Using the SDK

Use the [```AlertManager.retrieveTriggers```](/content/sdk/lib?id=alertmanagerretrievetriggers) function to get a snapshot of existing _trigger_ objects.

Alternately, it may be preferable to use the [```AlertManager.subscribeTriggers```](/content/sdk/lib?id=alertmanagersubscribetriggers) function since existing _trigger_ objects are returned immediately after a subscription is established (see the next section for details).

```js
const query = { };

const earliest = new Date(2020, 11, 1) // December 1, 2020, local time.

query.user_id = 'me';
query.alert_system = 'barchart.com';
query.trigger_date = earliest.getTime();
query.trigger_status = 'Unread';

alertManager.retrieveTriggers(query)
	.then((triggers) => {
		triggers.forEach(t => console.log(t));
	});
```

#### Using the API

```shell
curl 'https://alerts-management-demo.barchart.com/alert/triggers/users/barchart.com/me?trigger_date=1606806000000&trigger_status=Unread' \
  -X 'GET' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJ1c2VySWQiOiJtZSIsImFsZXJ0X3N5c3RlbSI6ImJhcmNoYXJ0LmNvbSIsImNvbnRleHRJZCI6ImJhcmNoYXJ0LmNvbSIsImlhdCI6MTYwODI5MzQzM30.QFY6GphC1tGXJPNExJw2nqnjfU8heYTvKw16OKusQPw' 
```

## Trigger Subscriptions

The following events can occur during the life of a _trigger_ object:

* It is _created_ — because the referenced alert's conditions were met
* It is _updated_ — because the trigger was flagged as read or unread
* It is _deleted_ — because the referenced alert was deleted

#### Using the SDK

The [```AlertManager.subscribeTriggers```](/content/sdk/lib?id=alertmanagersubscribetriggers) function registers callbacks, as follows:

```js
const handleTriggersChanged = (triggers) => {
	triggers.forEach((t) => {
		console.log(`A trigger was changed, status is [ ${t.trigger_status} ]`);
	});
};

const handleTriggersDeleted = (triggers) => {
	triggers.forEach((t) => {
		console.log(`A trigger was deleted for [ ${t.alert_id} ]`);
	});
};

const handleTriggersCreated = (triggers) => {
	triggers.forEach((t) => {
		console.log(`A trigger was created for [ ${t.alert_id} ]`);
	});
};

const query = { };

query.user_id = 'me';
query.alert_system = 'barchart.com';

const subscripton = alertManager.subscribeTriggers(query, handleTriggersChanged, handleTriggersDeleted, handleTriggersCreated);
```

NOTE: After a subscription has been established, the [```Callbacks.TriggersMutatedCallback```](/content/sdk/lib-callbacks?id=callbackstriggersmutatedcallback) will be invoked, passing an array of all existing _trigger_ objects. This eliminates the need to explicitly invoke the [```AlertManager.retrieveTriggers```](/content/sdk/lib?id=alertmanagerretrievetriggers) function (to synchronize state).

To stop the subscription, do the following:

```js
subscription.dispose();
```

#### Using the API

Short polling must be used to simulate a subscription.

## Read/Unread Flags

Each _trigger_ can be flagged a _Read_ or _Unread_. The status of a single trigger can be changed. Or the status of all triggers, belonging to a user, can be changed.

#### Using the SDK

To mark a single _trigger_ as _Read_ (or _Unread_), use the [```AlertManager.updateTrigger```](/content/sdk/lib?id=alertmanagerupdateTrigger) function:

```js
const data = { };

data.alert_id = '8814c5d7-6adc-4783-b94c-15cc668e68f2';
data.trigger_date = '1608176496477';
data.trigger_status = 'Read';

alertManager.updateTrigger(data)
	.then((trigger) => {
		// Single trigger updated.
	});
```

To mark all _triggers_ as _Read_ (or _Unread_) for a user, use the [```AlertManager.updateTriggers```](/content/sdk/lib?id=alertmanagerupdateTriggers) function:

```js
const data = { };

data.user_id = 'me';
data.alert_system = 'barchart.com';
data.trigger_status = 'Read';

alertManager.updateTriggers(data)
	.then((triggers) => {
		// All triggers updated.
	});
```

#### Using the API

Mark a single trigger as _Read_:

```shell
curl 'https://alerts-management-demo.barchart.com/alert/triggers/8814c5d7-6adc-4783-b94c-15cc668e68f2/1608176496477' \
  -X 'PUT' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJ1c2VySWQiOiJtZSIsImFsZXJ0X3N5c3RlbSI6ImJhcmNoYXJ0LmNvbSIsImNvbnRleHRJZCI6ImJhcmNoYXJ0LmNvbSIsImlhdCI6MTYwODI5MzQzM30.QFY6GphC1tGXJPNExJw2nqnjfU8heYTvKw16OKusQPw' \
  --data-binary '{"trigger_status":"Read"}'
```

Mark all triggers as _Read_:

```shell
curl 'https://alerts-management-demo.barchart.com/alert/triggers/users/barchart.com/me' \
  -X 'PUT' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJ1c2VySWQiOiJtZSIsImFsZXJ0X3N5c3RlbSI6ImJhcmNoYXJ0LmNvbSIsImNvbnRleHRJZCI6ImJhcmNoYXJ0LmNvbSIsImlhdCI6MTYwODI5MzQzM30.QFY6GphC1tGXJPNExJw2nqnjfU8heYTvKw16OKusQPw' \
  --data-binary '{"trigger_status":"Read"}'
```



