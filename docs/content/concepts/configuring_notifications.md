## Notification Options

A running alert "triggers" when all of its conditions are met. When an alert triggers, notifications are published.

The Barchart Alerting Service support four types of notifications:

* Email — transmitted via [Amazon SES](https://aws.amazon.com/ses/).
* Text Message - transmitted via [Twilio](https://www.twilio.com/).
* Mobile Push Notification - via [Apple APNS](https://en.wikipedia.org/wiki/Apple_Push_Notification_service) or [Google FCM](https://firebase.google.com/docs/cloud-messaging).
* Web Hook - via an HTTP(S) POST to your web service.

An alert can be configured to publish notifications via some, all, or none of these strategies.

## Configuring User Preferences

## Notification Selection Algorithm

#### Route to a Specific Recipient

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

#### Route to a Default Recipient

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

#### Route based on the Alert Type

```json
{
  "alert_type": "price",
  "publishers": [ ]
}
```






