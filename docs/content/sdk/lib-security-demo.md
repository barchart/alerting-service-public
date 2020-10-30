## Functions :id=functions
> A meta namespace of pure functions.

**Kind**: global namespace  

* * *

### Functions.getJwtGenerator(userId, alertSystem) :id=functionsgetjwtgenerator
> Returns a [Callbacks.JwtTokenGenerator](/content/sdk/lib-security?id=callbacksjwttokengenerator) function. The resulting function will
> generate a token allowing you to impersonate any user in the test environment. It will
> not work in the production environment. Instead, connection to the production environment
> requires you to sign your tokens with a private certificate (and provide Barchart the
> matching public certificate).

**Kind**: static method of [<code>Functions</code>](#Functions)  
**Returns**: [<code>Callbacks.JwtTokenGenerator</code>](/content/sdk/lib-security?id=callbacksjwttokengenerator)  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/security/demo/getJwtGenerator  
**File**: /lib/security/demo/getJwtGenerator.js  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>String</code> | <p>The identifier of the user to impersonate.</p> |
| alertSystem | <code>String</code> | <p>The domain of the user who will be impersonated.</p> |


* * *

