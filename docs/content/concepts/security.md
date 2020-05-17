## System Integration

As a consumer of the Barchart Alert Service, your software will:

* Create alerts on behalf of your users (or your systems), and
* Observe and maintain those alerts.

Barchart established commercially reasonable procedures to ensure your data is safe:

* All data transferred between you and our service is encrypted (using HTTP over SSL/TLS).
* All requests made to the service are authenticated and authorized, that is:
  * The requestor is verified, and
  * The requestor has authority to perform the action (e.g. read an alert).

Barchart uses [JSON Web Tokens](https://en.wikipedia.org/wiki/JSON_Web_Token) to authenticate and authorize your interactions (see below).

## Your Domain

Your domain is a container for users. Your users own alerts. A domain can be conceptualized as follows:

```text
├── domain
│   ├── users
│   │   ├── user A
│   │   │   ├── alert 1
│   │   │   ├── alert 3
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

Each request you send to the backend must include a [JSON Web Tokens](https://en.wikipedia.org/wiki/JSON_Web_Token).

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

All tokens must be _signed_ with a shared secret. In the demo environment -- at --

### Best Practices

