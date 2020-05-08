## Contents {docsify-ignore}

* [JwtPayload](#JwtPayload) 

* [JwtProvider](#JwtProvider) 

* [Callbacks](#Callbacks) 


* * *

## JwtPayload :id=jwtpayload
>An object which contains the required assertions for a token.

**Kind**: global class  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/security/JwtPayload  
**File**: /lib/security/JwtPayload.js  

* [JwtPayload](#JwtPayload)
    * _instance_
        * [.userId](#JwtPayloaduserId) ⇒ <code>String</code>
        * [.alertSystem](#JwtPayloadalertSystem) ⇒ <code>String</code>
        * [.forSigning()](#JwtPayloadforSigning) ⇒ <code>String</code>
    * _constructor_
        * [new JwtPayload(userId, alertSystem)](#new_JwtPayload_new)


* * *

### jwtPayload.userId :id=jwtpayloaduserid
>The unique identifier of the authenticated user. This value must match
the [Schema.Alert#user_id](Schema.Alert#user_id) of any alert you attempt to create, edit, or delete.

**Kind**: instance property of <code>JwtPayload</code>  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### jwtPayload.alertSystem :id=jwtpayloadalertsystem
>The authenticated user's domain. In the demo environment, use your company name. This value must
match the [Schema.Alert#alert_system](Schema.Alert#alert_system) of any alert you attempt to create, edit, or delete.

**Kind**: instance property of <code>JwtPayload</code>  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### jwtPayload.forSigning() :id=jwtpayloadforsigning
>Returns the simple object representation, used for signing a token.

**Kind**: instance method of <code>JwtPayload</code>  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### new JwtPayload(userId, alertSystem) :id=new_jwtpayload_new
**Kind**: constructor of <code>JwtPayload</code>  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>String</code> | The unique identifier of the authenticated user. |
| alertSystem | <code>String</code> | The authenticated user's domain. In the demo environment, use your company name. In the production environment, Barchart will assign a value to use. |


* * *

## JwtProvider :id=jwtprovider
>Generates and caches a signed token (using a delegate). The cached token
is refreshed periodically. An instance of this class is required by
the [AdapterBase](/content/sdk/lib-adapters?id=/content/sdk/lib-adapters?id=adapterbase) implementations.

**Kind**: global class  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/security/JwtProvider  
**File**: /lib/security/JwtProvider.js  

* [JwtProvider](#JwtProvider)
    * _instance_
        * [.getToken()](#JwtProvidergetToken) ⇒ <code>Promise.&lt;String&gt;</code>
    * _constructor_
        * [new JwtProvider(generator, interval)](#new_JwtProvider_new)


* * *

### jwtProvider.getToken() :id=jwtprovidergettoken
>Reads the current token, refreshing if necessary.

**Kind**: instance method of <code>JwtProvider</code>  
**Returns**: <code>Promise.&lt;String&gt;</code>  
**Access**: public  

* * *

### new JwtProvider(generator, interval) :id=new_jwtprovider_new
**Kind**: constructor of <code>JwtProvider</code>  

| Param | Type | Description |
| --- | --- | --- |
| generator | [<code>JwtTokenGenerator</code>](#CallbacksJwtTokenGenerator) | An anonymous function which returns a signed JWT token. |
| interval | <code>Number</code> | The number of milliseconds which must pass before a new JWT token is generated. |


* * *

## Callbacks :id=callbacks
>A meta namespace containing signatures of anonymous functions.

**Kind**: global namespace  

* * *

### Callbacks.JwtTokenGenerator :id=callbacksjwttokengenerator
>A function which returns a signed token.

**Kind**: static typedef of <code>Callbacks</code>  
**Returns**: <code>String</code> \| <code>Promise.&lt;String&gt;</code>  
**Access**: public  

* * *

