## System Integration

As a consumer of the Barchart Alert Service, your software will:

* Create alerts on behalf of your users (or your systems), and
* Observe and maintain those alerts.

Barchart established commercially reasonable procedures to ensure your data is safe:

* All data is encrypted before transmission (using HTTP over SSL/TLS).
* All requests are authenticated and authorized, that is:
  * The requestor's identity is verified, and
  * The requestor's authority to perform the action (e.g. read an alert) is verified.

The Alert Service uses [JSON Web Tokens](https://en.wikipedia.org/wiki/JSON_Web_Token) to authenticate and authorize your interactions (see below).

## Your Domain

Your domain is a container for users. Your users own alerts. A domain can be conceptualized as follows:

```text
├── domain
│   ├── users
│   │   ├── user A
│   │   │   ├── alert 1
│   │   │   ├── alert 2
│   │   │   └── alert 3
│   │   ├── user B
│   │   │   └── alert 4
```

Your domain is a simple ```String``` value. This value is used in two important ways:

* as the ```alert_system``` property of any ```Alert``` you create, and
* as the ```alert_system``` property of the payload of any JSON Web Token (JWT) you create.

Each alert has a  which must use this value. It must also be included in the JWT token you generate (see below).

## Your Users

Each of your users must have a unique identifier. User identifiers as assigned to:

* the ```user_id``` property of any ```Alert``` you create (on behalf of that user), and
* the ```user_id``` property of the payload of any JWT you generate (on behalf of that user).

## JSON Web Tokens

Each request you send to the backend must include a [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token).

### Payload

The token payload has two required properties (a.k.a claims or assertions):

```json
{
	"user_id": "some-user"
	"alert_system": "your-domain",
}
```

The backend will _decode_ the token and _verify_ its authenticity (using a shared secret). We've glossed of the underlying mechanics of JWT, but that's outside of the scope of this documentation -- plenty of good information is available online (e.g. [here](https://jwt.io/introduction/)).

### Signing

All tokens must be _signed_ with a shared secret. Each environment uses different algorithms and signing secrets.

#### Demo

Here are the connection details:

* Hostname:```alerts-management-demo.barchart.com```
* Port: ```443```
* Algorithm: ```HMAC-SHA256``` (aka ```HS256```)
* Secret: ```"public-knowledge-1234567890"```

Since the demo environment is intended for testing and evaluation purposes only, the _"secret"_ is shared intentionally. This means data saved in the demo environment can be viewed and manipulated by anyone. Use caution with any sensitive data.

#### Production

Here are the connection details:

* Hostname:```alerts-management-prod.barchart.com```
* Port: ```443```
* Algorithm: Agreed upon when your account is configured
* Secret: Agreed upon when your account is configured

Once you're ready to move to production, you'll need to exchange a public/private key pair with Barchart. **Contact us at solutions@barchart.com or (866) 333-7587 for assistance configuring your account.**

## Using the SDK

Your system is responsible for initial authentication, for example:

* Perhaps your user was challenged for a username and password.
* Perhaps your user was identified using an SSO technique.
* Perhaps the user is a system process running in a trusted environment.

Since your system _"knows"_ which user is active and it is _also responsible for token generation_.

First, write a function to return a signed token. The function must conform to the [```Schema.JwtTokenGenerator```](/content/sdk/lib-security?id=callbacksjwttokengenerator) contract — it accepts no arguments and returns a ```String``` (synchronously or asynchronously). For example:

```js
function getJwtToken() {
	return Promise.resolve() {
		// Generate a signed token and return it. You'll probably want to defer
		// this to an internal, secure service (ensuring your JWT signing secret
		// is not compromised).

		return token;
	}
}
```

Once you've implemented this function, the hard part is over. Simply give it to the ```start``` function of your ```AlertManager``` instance:

```js
alertManager.start(getJwtToken)
	.then(() => {
		// Ready to use ...
	});
```

## Using the API

Conceptually, the approach is identical if your choose to use the REST interface directly. You still need to generate a token. After you generate the token, add it to the ```Authorization``` header of your HTTP request. For example, here is the cURL command to get for all alerts owned by ```me@barchart.com```:

```shell
curl 'https://alerts-management-demo.barchart.com/alerts/users/barchart.com/me' \
  -X 'GET' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWUiLCJhbGVydF9zeXN0ZW0iOiJiYXJjaGFydC5jb20iLCJpYXQiOjE1ODk0MTEyNzl9.SxyC8s_CKhPyzcNmM_h_TRMiNSx3YstKGmAb2IOWqgM'
```

If we decode the token — try [this tool](https://jwt.io/) — you'll see the token payload refers to ```me@barchart.com````:

```json
{
  "user_id": "me",
  "alert_system": "barchart.com",
  "iat": 1589411279
}
```

As a result, when using this token, only actions for alerts owned by ```me@barchart.com``` are accepted (i.e. authorized). An action for a different user will be rejected.

## Best Practices

Under no circumstances should your JWT secret be accessible to anyone outside of your organization. If your secret is lost, security can be compromised.

For example, if you are developing a web application, you should not generate tokens inside the web browser. A clever user could read your JWT secret (from the web browser) and use it to impersonate other users.

Instead, your secret should be protected. Tokens should only be generated by from a trusted backend.

