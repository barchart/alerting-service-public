# @barchart/alerts-mobile-demo

### Overview

This is an example application that connects to the **[Barchart](https://www.barchart.com) Alerting Service**.

This app is written using [React Native](https://reactnative.dev/).

### How to run

> You must be added to the Barchart Apple Development Team.

> You must run the application on a real device. Push Notifications will not work on the simulator.

Here is a step-by-step guide how to run and test the application:

1. Run `yarn install` command in the root folder of the repository.
2. Run `yarn install` command in the `example/mobile` folder.
3. Run `npx pod-install` command in the `example/mobile/ios` folder.
4. Open `example/mobile/ios/alertclientmobile.xcworkspace` file with XCode.
5. Go to `XCode -> Preferences` and make sure that you are in the Barchart Development Team.

![Preferences](.images/1.png)

6. Click on the `alertclientmobile` on the left sidebar and go to the `Signing & Capabilities` section. Make sure that this section looks like on this picture.

   6.1. Team must be `Barchart.com, Inc.`.

   6.2. Bundle Identifier must be `com.barchart.alerts-client-demo`.

   6.3. `Remote notifications` and `Push Notifications` must be enabled.

![Signing & Capabilities](.images/2.png)

7. Connect your iPhone to your macOS device, select your iPhone as a target to run the application, and click the run button (It may ask for a password for a Key Chain).

![Select your device](.images/3.png)

8. The Application will ask for notification permissions. Allow it.

9. Use app.