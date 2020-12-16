# Release Notes

## 4.20.0
**New Features**

* Alerts can now be flagged as read (or unread).
* Updated the documentation — improved the `Key Concepts: Alert Notifications` section.

**Technical Enhancements**

* The `JwtPayload.forSigning` function will not emit an object which uses standard Barchart properties (i.e. `userId` instead of `user_id` and `contextId` instead of `alert_system`).
* The `getJwtGenrator` function no longer signs tokens. Instead, it delegates token signing to a web service.
* The `refreshInterval` parameter of the `JwtProvider` constructor is now optional.
* The `JwtProvider` now applies some jitter to the `refreshInterval` parameter.



## 4.0.6
**No functional changes**

* The ```package-lock.json``` file was removed and an ```.nmprc``` file was added. Dependency locking should be managed by the SDK consumer.
* The documentation was updated (specifically, the Security section).

## 4.0.1
**Initial Public Release**

* **Visibility**
  * GitHub repository's access level changed to public.
  * Published to NPM as a [public package](https://www.npmjs.com/package/@barchart/alerts-client-js).
  * MIT License applied.
* **Documentation**
  * [JSDoc](https://jsdoc.app/) completed and updated in code files.
  * [OpenAPI](https://www.openapis.org/) definition added.
  * Documentation site [published to GitHub Pages](https://barchart.github.io/alerts-client-js/).
* **Breaking Changes**
  * All environments now require JSON Web Tokens (JWT) for authentication and authorization.
  * The ```JwtProvider``` class has been refactored and moved.
  * The ```AlertManager``` constructor now requires an ```AdapterBase``` (specifies HTTP or WebSocket).

