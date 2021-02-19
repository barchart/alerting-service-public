# Release Notes

## 4.3.0
**Technical Enhancements**

* Upgraded the [@barchart/common-js](https://github.com/barchart/common-js) library to the next major version (4).
* Updated the `AlertManager` class to use the promise timeout mechanism found in the [@barchart/common-js](https://github.com/barchart/common-js) library.


## 4.2.0
**New Features**

* Added support for additional JSON data which can be included in alert trigger history. For example, the alert trigger item for news alerts will now include a link to the news article itself.
  
**Other**

* Updated OpenAPI file.

## 4.1.1
**Other**

* The [documentation site](https://docs.barchart.com/alerts/#/) is now complete.

## 4.1.0
**New Features**

* Publishing alerts via mobile push notification is now supported.
* Each time an alert is triggered, a persistent ```Trigger``` object is created.
* Queries for ```Trigger``` objects are now supported.
* Subscriptions to ```Trigger``` creation, mutation, and deletion are now supported.
* The status of a ```Trigger``` can be set to _Read_ or _Unread_.

**Technical Enhancements**

* The `JwtPayload.forSigning` function now emits an object which uses standard Barchart properties (i.e. `userId` instead of `user_id` and `contextId` instead of `alert_system`).
* The `getJwtGenrator` function no longer signs tokens. Instead, it delegates token signing to a web service.
* The `refreshInterval` parameter of the `JwtProvider` constructor is now optional.
* The `JwtProvider` now applies some jitter to the `refreshInterval` parameter.
* Added `.npmrc` file to reduce the clutter contained in a published NPM package.

**Other**

* The [documentation site](https://docs.barchart.com/alerts/#/) has been expanded, clarified, and improved.



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

