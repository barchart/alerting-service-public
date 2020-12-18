Your mobile apps can receive push notifications from the Barchart Alerting Service. However, some minor configuration is required.

## Authorize Barchart

Barchart must be authorized to send push notifications on your behalf.

#### Apple (iOS)

Push notifications from the Barchart Alerting Service are delivered via Apple Notification Service (APNs). Apple validates each notification using JSON Web Tokens. To generate a token, we require:

* Your APNs token signing key — in the form of a ```.p8``` file.
* Your ten character identifier for the aforementioned the signing key.
* Your ten character identifier for your Apple Developer Team.

Refer to this article from Apple for more details:

* [Establishing a Token-Based Connection to APNs](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/establishing_a_token-based_connection_to_apns)

#### Android

Coming soon.

## Configure Your App

Barchart requires specific information to properly route notifications to the correct users and devices. This routing information changes as users (a) install, (b) login to your mobile app.

#### Apple (iOS)

Make a slight change to your mobile app. Each time a user logs in, collect the following information and send it to Barchart:

* ```UserID``` — Combine `user_id` and `alert_system` with an ampersand.
* ```BundleID``` — Refers to the app itself.
* ```DeviceID``` — Refers to the device and installation (can be obtained from your app at runtime)

```curl
curl 'https://push-notifications-stage.aws.barchart.com/v1/apns/registerDevice' \
  -X 'POST' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"UserID":"me@barchart.com", "BundleID": "com.barchart.alert-demo-app", "DeviceID": "b1d86f93ea5468ebc32514cfbb4c8ea1ffa81107426552104476f530b534e025", "RealtimeUserID": "-"}'
```

#### Android

Coming soon.












