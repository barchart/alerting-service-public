## System Integration

The Barchart Alerting Service uses commercially reasonable procedures to ensure your data is safe. All data is encrypted during transmission (using HTTP over SSL/TLS). Furthermore, each interaction is authorized using a [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token).

## Token Generation

#### Overview

Your system is responsible for authentication, for example:

* Perhaps users are identified by username and password.
* Perhaps users are identified by an SSO technology.
* Perhaps users are assumed to be valid because your software runs in a trusted environment.

Each interaction with the Barchart Alerting Service must include a cryptographic token. **Since your system authenticated the user, it is responsible for generating a token.** Barchart will _decode_ your token and _verify_ its authenticity (using a shared secret).

#### Token Payload

The token payload must include two claims:

* The user's identifier (selected by you).
* The user's organization (provided to you).

Two formats are acceptable:

**Preferred**

```json
{
	"userId": "123456789",
	"contextId": "Your Organization"
}
```

**Alternative**

```json
{
	"user_id": "123456789",
	"alert_system": "Your Organization"
}
```

#### Token Signing Secrets

Each environment uses different cryptographic algorithms and signing secrets.

**Demo Environment:**

Since the _demo_ environment is intended for testing and evaluation purposes only, the secret is intentionally publicized (see below). Data saved to the _demo_ environment can be viewed and manipulated by anyone. Do not store sensitive data in the _demo_ environment.

* Hostname:```alerts-management-demo.barchart.com```
* Port: ```443```
* Algorithm: ```HMAC-SHA256``` (aka ```HS256```)
* Secret: ```"public-knowledge-1234567890"```

**Production Environment:**

When you're ready to move to production, you'll need to generate a [public/private key pair](https://en.wikipedia.org/wiki/Public-key_cryptography) (see below).

* Hostname:```alerts-management-prod.barchart.com```
* Port: ```443```
* Algorithm: Agreed upon when your account is configured
* Secret: Exchanged when your account is configured

**Contact us at solutions@barchart.com or (866) 333-7587 for assistance configuring your account.**

#### Token Signing Example

Here are guidelines for token generation:

* The signing secret (e.g. private key or secret string) is not exposed.
* The signing system should be trusted to keep time correctly.
* The cryptography uses battle-tested code. This means you'll probably want to find a third-party library to help.

Here is an example written for Node.js using the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#readme) library.

```js
const jwt = require('jsonwebtoken');

const claims = {
	userId: 'me',
	contextId: 'barchart'
};

const secret = 'public-knowledge-1234567890';
const token = jwt.sign(claims, secret, { algorithm: 'HS256', expiresIn: '2 days' });
```

## Token Usage

#### Using the SDK

First, write a function that retrieves a signed token from a trusted source. The function must conform to the [```Schema.JwtTokenGenerator```](/content/sdk/lib-security?id=callbacksjwttokengenerator) contract — which accepts no arguments and returns a ```String``` (synchronously or asynchronously). For example:

```js
function getJwtToken() {
	return Promise.resolve()
		.then(() => {
			// Retreive a signed token and return it. You'll probably want to delegate
			// the actual work to a remote service. This helps to ensure your JWT signing
			// secret cannot be compromised.

			return token;
		});
}
```

Next, instantiate a [```JwtProvider```](/content/sdk/lib-security?id=jwtprovider) and pass the aforementioned function. Finally, call the [```AlertManager.connect```](/content/sdk/lib?id=alertmanagerconnect) function, as follows:

```js
alertManager.connect(new JwtProvider(getJwtToken, 60 * 1000 * 5))
	.then(() => {
		// Ready to use ...
	});
```

#### Using the API

Each HTTP request must include a token. After you generate the token, add it to the ```Authorization``` header of your HTTP request. For example, here is the cURL command to get for all alerts owned by ```me@barchart.com```:

```shell
curl 'https://alerts-management-demo.barchart.com/alerts/users/barchart.com/me' \
  -X 'GET' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJhbGVydF9zeXN0ZW0iOiJiYXJjaGFydC5jb20iLCJpYXQiOjE1ODk0MTEyNzl9.SxyC8s_CKhPyzcNmM_h_TRMiNSx3YstKGmAb2IOWqgM'
```

If we decode the token — try [this tool](https://jwt.io/) — you'll see the token payload refers to ```me@barchart.com```:

```json
{
  "user_id": "me",
  "alert_system": "barchart.com",
  "iat": 1589411279
}
```

When using this token, we can only interact with alerts owned by ```me@barchart.com```.

## Best Practices

Under no circumstances should your JWT signing secret be accessible to anyone outside your organization. Anyone who has your secret could connect to Barchart and impersonate your users.

If you are developing a web application, you should not generate tokens inside the web browser. A clever user could read your JWT secret. Instead, your web application should retrieve tokens from a trusted backend.