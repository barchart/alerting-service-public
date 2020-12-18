## Notification Options

Once an alert's conditions are met, notifications are published. The Barchart Alerting Service support four notification options:

* Email — transmitted via [Amazon SES](https://aws.amazon.com/ses/).
* Text Message — transmitted via [Twilio](https://www.twilio.com/).
* Mobile Push Notification — via [Apple APNS](https://en.wikipedia.org/wiki/Apple_Push_Notification_service) or [Google FCM](https://firebase.google.com/docs/cloud-messaging).
* Web Hook — via an HTTP(S) POST to your web service.

When an alert triggers, notifications can be published using some or all of these strategies.

## User Preferences

For each type of notification, a user can set default preferences, including:

* The notification address — A phone number, an email address, etc.
* Do-not-disturb rules — A window of time during which notification will not be dispatched, even if an alert triggers.

Furthermore, the user may associate an ```alert_type``` with one (or more) notification strategies. For example:

* A user might want all notifications for _price_ alerts to be sent via both email and text message. 
* A user might want all notifications for _news_ alerts to be sent only via email.

## Downloading Metadata

Each notification option is represented as a [```PublisherType```](/content/sdk/lib-data?id=schemapublishertype) object. Download a listing, as follows:

#### Using the SDK

```js
return alertManager.getPublisherTypes()
	.then((publisherTypes) => {
		publisherTypes.forEach((pt) => {
			console.log(`[ ${pt.transport} ] has identifier [ ${pt.publisher_type_id} ]`);	
		});	
	});
```

#### Using the API

```shell
curl 'https://alerts-management-demo.barchart.com/alert/publishers' \ 
  -X 'GET' \
  -H 'Accept: application/json'
```

## Loading User Preferences

User preferences are stored as [```PublisherTypeDefault```](/content/sdk/lib-data?id=schemapublishertypedefault) objects, for example:

```json
{
	"publisher_type_id": 1,
	"transport": "sms",
	"provider": "twilio",
	"user_id": "me",
	"alert_system": "barchart.com",
	"default_recipient": "312-867-5309",
	"default_recipient_hmac": null,
	"allow_window_timezone": "America/Chicago",
	"allow_window_start": "06:00",
	"allow_window_end": "22:00",
	"active_alert_types": [
		"news","price"
	]
}
```

The following information is conveyed:

* Send text messages to 312-867-5309, by default.
* Do not send any messages between the hours of 10:00 PM and 06:00 PM (Chicago time).
* Notifications for _price_ and _news_ alerts should be sent via text message, by default.

#### Using the SDK

```js
const query = { };

query.user_id = 'me';
query.alert_system = 'barchart.com';

return alertManager.getPublisherTypeDefaults()
	.then((publisherTypeDefaults) => {
		console.log(`The user [ ${query.user_id} ] has [ ${publisherTypeDefaults.length} ] preferences`);
	});
```

#### Using the API

```shell
curl 'https://alerts-management-demo.barchart.com/alert/publishers/default/barchart.com/me' \
  -X 'GET' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJ1c2VySWQiOiJtZSIsImFsZXJ0X3N5c3RlbSI6ImJhcmNoYXJ0LmNvbSIsImNvbnRleHRJZCI6ImJhcmNoYXJ0LmNvbSIsImlhdCI6MTYwODI5MzQzM30.QFY6GphC1tGXJPNExJw2nqnjfU8heYTvKw16OKusQPw' 
```

## Setting User Preferences

#### Using the SDK

```js
const ptd = { };

ptd.publisher_type_id = 1;
ptd.user_id = 'me';
ptd.alert_system = 'barchart.com';
ptd.default_recipient = '222-333-4444';
ptd.allow_window_timezone = 'America/Chicago';
ptd.allow_window_start = '08:00';
ptd.allow_window_end = '17:00';
ptd.active_alert_types = [ 'price' ];

return alertManager.assignPublisherTypeDefault(ptd)
	.then((saved) => {
		console.log(saved);
	});
```

#### Using the API

```shell
curl 'https://alerts-management-demo.barchart.com/alert/publishers/default/barchart.com/me/1' \
  -X 'PUT' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJ1c2VySWQiOiJtZSIsImFsZXJ0X3N5c3RlbSI6ImJhcmNoYXJ0LmNvbSIsImNvbnRleHRJZCI6ImJhcmNoYXJ0LmNvbSIsImlhdCI6MTYwODI5MzQzM30.QFY6GphC1tGXJPNExJw2nqnjfU8heYTvKw16OKusQPw' \
  --data-binary '{"publisher_type_id": 1, "default_recipient": "222-333-4444", "allow_window_timezone":"America/Chicago"}'
```

## Notification Selection Algorithm

#### 1. Route to a Specific Recipient

Coming soon.

```json
{
  "publishers": [
	{
	  "type": {
		"publisher_type_id": 1
	  },
	  "use_default_recipient": false,
	  "recipient": "111-111-1111"
	}
  ]
}
```

#### 2. Route to a Default Recipient

Coming soon.

```json
{
  "publishers": [
	{
	  "type": {
		"publisher_type_id": 1
	  },
	  "use_default_recipient": true
	}
  ]
}
```

#### 3. Route based on the Alert Type

Coming soon.

```json
{
  "alert_type": "price",
  "publishers": [ ]
}
```

```json
{
	"publisher_type_id": 1,
	"user_id": "me",
	"alert_system": "barchart.com",
	"default_recipient": "222-222-2222",
	"allow_window_timezone": "America/Chicago",
	"allow_window_start": null,
	"allow_window_end": null,
	"active_alert_types": [
		"price"
	]
}
```

#### 3. Don't Send a Notification

Coming soon.





