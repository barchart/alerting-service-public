# @barchart/alerts-mobile-demo

### Overview

A simple mobile application, written using this JavaScript SDK and [React Native](https://reactnative.dev/).

### Screen Captures

### Requirements

The push notification feature of the application requires:

* Authorize Barchart to send push notifications on your behalf (see [below](#authorizing-push-notifications)).
* Run the app on an actual device — not a simulator

### Build and Execution Instructions

#### Apple iOS

First, 

1. Install [Apple Xcode](https://developer.apple.com/xcode/)
2. Open the `XCode > Preferences` menu and sign in with an Apple ID with membership to the valid team (see [below](#apple-developer-teams)).

![Signing & Capabilities](.images/01_Xcode_preferences.png)
   
Next, configure the project:

1. Run `brew install watchman` command.
2. Run `npm install` command from the root folder of the repository.
3. Run `yarn install` command from the `example/mobile` folder.
4. Run `npx pod-install` command from the `example/mobile/ios` folder.
   * If the command fails, consult this [article](https://stackoverflow.com/questions/51768515/cocoa-pods-install-on-ios-project-not-working).
5. Open `example/mobile/ios/alertclientmobile.xcworkspace` file with XCode.

6. Click on `alertclientmobile` on the left sidebar and go to the `Signing & Capabilities` section, then:
   * Set your Team (e.g. `Barchart.com, Inc.`).
   * Set the Bundle Identifier (e.g. `com.barchart.alerts-client-demo`).
   * Ensure the `Remote Notifications` option is checked.
   * Ensure the `Push Notifications` capability had been enabled.
7. Connect your iOS device to the computer.
8. Select your iOS device in Xcode.
9. Build and run the application using the play button. This may take several minutes.
10. Once the application loads, grant it permissions to receive push notifications.

![Signing & Capabilities](.images/02_Xcode_project_settings.png)

#### Android

Coming soon.

### Authorizing Push Notifications

#### Apple Developer Teams

You must be a member of an Apple Developer Team. Furthermore, you must grant Barchart permission to send push notifications on your behalf of your organization.

Contact Barchart and provide the following information:

* Your APNs token signing key — in the form of a ```.p8``` file.
* Your ten character identifier for the aforementioned the signing key.
* Your ten character identifier for your Apple Developer Team.

Instructions for collecting this information can be found here:

* [Establishing a Token-Based Connection to APNs](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/establishing_a_token-based_connection_to_apns)

#### Google Firebase Cloud Messaging

Coming soon.
