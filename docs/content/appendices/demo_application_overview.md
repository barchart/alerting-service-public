## Source code

For demonstration purposes, three applications have been built with this SDK. The source code for these applications is stored in [GitHib repository for this SDK](https://github.com/barchart/alerts-client-js). Clone the repository, as follows:

```shell
git clone git@github.com:barchart/alerts-client-js.git
```

Then, the ```example/``` folder, you will find three sub-folders:

* ```example/browser/``` - The web application.
* ```example/mobile/``` - The mobile application.
* ```example/node/``` - The Node.js scripts.

Each of these folders contains a ```README.md``` file with detailed instructions for build and execution of the demo applications.

## The Web Application

A dynamic, single-page HTML5 web application allows you to interact with the Barchart Alerting Service:

* Login to the demo environment.
* View existing alerts.
* Crete new alerts.
* Start and stop alerts.
* Configure user notification preferences.
* Review alert trigger history.
* Mark alert triggers as read (or unread).

You can quickly load the web application here:

https://examples.aws.barchart.com/alerts-client-js/example.html

## The Mobile App

Built with [React Native](https://reactnative.dev/), our mobile app is compatible with iOS and Android devices. It's features include:

* View existing alerts.
* Start and stop alerts.
* Registering for push notifications sent via [Apple APNs](https://en.wikipedia.org/wiki/Apple_Push_Notification_service) or [Google FCM](https://firebase.google.com/docs/cloud-messaging).
* Receive push notifications when alerts trigger (via APNs or FCM).
* Review alert trigger history.
* Mark alert triggers as read (or unread).

## The Node.js Scripts

Very simple Node.js scripts demonstrate the most basic features of the SDK, for example:

* Create your ```AlertManager``` instance.
* Configure your ```AlertManager``` to use tokens (JWT) for security.
* Download a list of existing alerts.
* Create a new alert.
* Use the logging framework embedded withing the SDK.


