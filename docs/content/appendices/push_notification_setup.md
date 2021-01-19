## Requirements

To enable support for push notifications to your mobile apps, you need to:

* Authorize Barchart to send push notifications on your behalf, and
* Adjust your mobile app needs to register itself with Barchart.

## Authorizing Barchart

Barchart must be authorized to send push notifications on your behalf.

#### Apple (iOS)

Push notifications from the Barchart Alerting Service are delivered via Apple Notification Service (APNs). Apple validates each notification using a JSON Web Token. To generate a token, we require:

* Your APNs token signing key — in the form of a ```.p8``` file.
* Your ten character identifier for the aforementioned the signing key.
* Your ten character identifier for your Apple Developer Team.

This article explains how to get the required information:

* [Establishing a Token-Based Connection to APNs](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/establishing_a_token-based_connection_to_apns)

#### Android

Coming soon.

## Registering User Devices

Barchart requires specific information to properly route notifications to the correct users and devices.

#### Apple (iOS)

Make a slight change to your mobile app. Each time a user logs in, collect the following information and send it to Barchart:

* ```UserID``` — Combine `user_id` and `alert_system` with an ampersand.
* ```BundleID``` — Refers to the app itself.
* ```DeviceID``` — Refers to the device and installation (can be [obtained from your app at runtime](https://developer.apple.com/documentation/usernotifications/registering_your_app_with_apns))

Two environments exist, use the appropriate one:

* Production — push-notifications.aws.barchart.com
* Demo — push-notifications-stage.aws.barchart.com

Here is an example:

```curl
curl 'https://push-notifications-stage.aws.barchart.com/v1/apns/registerDevice' \
  -X 'POST' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"UserID":"me@barchart.com", "BundleID": "com.barchart.alert-demo-app", "DeviceID": "b1d86f93ea5468ebc32514cfbb4c8ea1ffa81107426552104476f530b534e025", "RealtimeUserID": "me@barchart.com"}'
```

#### Android

Coming soon.

## Push Notification Payload

#### Apple (iOS)

```json
{
	aps: {
		alert: {
			"title": "Alert System",
			"body": "Barchart.com ALERT ‒ TSLA traded for 823.50 at 18:59 ET on 01/15/21."
		}
	},
	"custom-data": {
		"alert_id":"a28fb91d-520a-485e-bd19-22dc6f0f6105",
		"trigger_date":"1610755232945",
		"trigger_title":"TSLA",
		"trigger_description":"TSLA traded for 823.50 at 18:59 ET on 01/15/21"
	}
}
```

#### Android

Coming soon.











