## System Integration

As a consumer of the Barchart Alert Service, your software will:

* Create alerts, and
* Observe and maintain those alerts.

Barchart uses commercially reasonable procedures to ensure your data is safe:

* All data is encrypted before transmission (using HTTP over SSL/TLS).
* All requests are authorized:
  * The requestor's identity is verified, and
  * The requestor's authority to perform the action (e.g. read an alert) is verified.

**Authorization uses [JSON Web Tokens](https://en.wikipedia.org/wiki/JSON_Web_Token) technology.**

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
* as the ```alert_system``` property of each JSON Web Token (JWT) you create (see below).

## Your Users

Each of your users must have a unique identifier. You are responsible for picking a user's unique identifier. A user's identifier is must be assigned to:

* the ```user_id``` property of any ```Alert``` you create (on behalf of that user), and
* the ```user_id``` property of each JSON Web Token (JWT) you create (see below).

## JSON Web Tokens

Each request you send to the backend must include a [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token).

### Payload

The token payload has two required claims, for example:

```json
{
	"user_id": "some-user"
	"alert_system": "your-domain",
}
```

The backend will _decode_ the token and _verify_ its authenticity (using a shared secret). We've glossed of the underlying mechanics of JWT — plenty of good information is available online (e.g. [here](https://jwt.io/introduction/)).

### Signing

All tokens must be _signed_ with a shared secret. Each environment uses different algorithms and signing secrets.

#### Demo

Here are the connection details:

* Hostname:```alerts-management-demo.barchart.com```
* Port: ```443```
* Algorithm: ```HMAC-SHA256``` (aka ```HS256```)
* Secret: ```"public-knowledge-1234567890"```

Since the _demo_ environment is intended for testing and evaluation purposes only, the _"secret"_ is intentionally publicized. Data saved in the demo environment can be viewed and manipulated by anyone. Use caution with any sensitive data.

#### Production

Here are the connection details:

* Hostname:```alerts-management-prod.barchart.com```
* Port: ```443```
* Algorithm: Agreed upon when your account is configured
* Secret: Agreed upon when your account is configured

When you're ready to move to production, you'll need to generate a [public/private key pair](https://en.wikipedia.org/wiki/Public-key_cryptography). To generate new keys, use the following (with no passphrase):

```shell
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

Once you're done, use the private key — called ```jwtRS256.key``` — to sign tokens and send the public key — called ```jwtRS256.key.pub``` — to Barchart.

**Contact us at solutions@barchart.com or (866) 333-7587 for assistance configuring your account.**

## Using the SDK

Your system is responsible for initial authentication, for example:

* Perhaps users are identified by username and password.
* Perhaps users are identified using an SSO technology.
* Perhaps users are assumed to be valid because your software runs in a trusted environment.

Since your system _"knows"_ which user is active, it is also _responsible for token generation_.

First, write a function to return a signed token. The function must conform to the [```Schema.JwtTokenGenerator```](/content/sdk/lib-security?id=callbacksjwttokengenerator) contract — it accepts no arguments and returns a ```String``` (synchronously or asynchronously). For example:

```js
function getJwtToken() {
	return Promise.resolve()
		.then(() => {
			// Generate a signed token and return it. You'll probably want to delegate
			// the actual work to a remote service. This helps to ensure your JWT signing
			// secret cannot be compromised.

			return token;
		});
}
```

The hard part is over. Instantiate a [```JwtProvider```](/content/sdk/lib-security?id=jwtprovider) and pass the aforementioned function. Finally, call the [```AlertManager.connect```](/content/sdk/lib?id=alertmanagerconnect) function, as follows:

```js
alertManager.connect(new JwtProvider(getJwtToken))
	.then(() => {
		// Ready to use ...
	});
```

## Using the API

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

Under no circumstances should your JWT secret be accessible to anyone outside of your organization. If someone outside your organization obtains your signing secret, they could interact with the Barchart Alert Service on your behalf.

If you are developing a web application, you should not generate tokens inside the web browser. A clever user could read your JWT secret (from the web browser) and use it to impersonate other users.

Your secret should be protected. Tokens should only be generated by from a trusted backend.

