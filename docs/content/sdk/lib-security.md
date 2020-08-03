## Contents {docsify-ignore}

* [JwtPayload](#JwtPayload) 

* [JwtProvider](#JwtProvider) 

* [Callbacks](#Callbacks) 


* * *

## JwtPayload :id=jwtpayload
> <p>An object which contains the required assertions for a token.</p>

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
> <p>The unique identifier of the authenticated user. This value must match
> the [Schema.Alert#user_id](#schemaalertuser_id) of any alert you attempt to create, edit, or delete.</p>

**Kind**: instance property of [<code>JwtPayload</code>](#JwtPayload)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### jwtPayload.alertSystem :id=jwtpayloadalertsystem
> <p>The authenticated user's domain. In the demo environment, use your company name. This value must
> match the [Schema.Alert#alert_system](#schemaalertalert_system) of any alert you attempt to create, edit, or delete.</p>

**Kind**: instance property of [<code>JwtPayload</code>](#JwtPayload)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### jwtPayload.forSigning() :id=jwtpayloadforsigning
> <p>Returns the simple object representation, used for signing a token.</p>

**Kind**: instance method of [<code>JwtPayload</code>](#JwtPayload)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### new JwtPayload(userId, alertSystem) :id=new_jwtpayload_new
**Kind**: constructor of [<code>JwtPayload</code>](#JwtPayload)  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>String</code> | <p>The unique identifier of the authenticated user.</p> |
| alertSystem | <code>String</code> | <p>The authenticated user's domain. In the demo environment, use your company name. In the production environment, Barchart will assign a value to use.</p> |


* * *

## JwtProvider :id=jwtprovider
> <p>Generates and caches a signed token (using a delegate). The cached token
> is refreshed periodically. An instance of this class is required by
> the [AdapterBase](/content/sdk/lib-adapters?id=adapterbase) implementations.</p>

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
> <p>Reads the current token, refreshing if necessary.</p>

**Kind**: instance method of [<code>JwtProvider</code>](#JwtProvider)  
**Returns**: <code>Promise.&lt;String&gt;</code>  
**Access**: public  

* * *

### new JwtProvider(generator, interval) :id=new_jwtprovider_new
**Kind**: constructor of [<code>JwtProvider</code>](#JwtProvider)  

| Param | Type | Description |
| --- | --- | --- |
| generator | [<code>JwtTokenGenerator</code>](#CallbacksJwtTokenGenerator) | <p>An anonymous function which returns a signed JWT token.</p> |
| interval | <code>Number</code> | <p>The number of milliseconds which must pass before a new JWT token is generated.</p> |


* * *

## Callbacks :id=callbacks
> <p>A meta namespace containing signatures of anonymous functions.</p>

**Kind**: global namespace  

* * *

### Callbacks.JwtTokenGenerator :id=callbacksjwttokengenerator
> <p>A function which returns a signed token.</p>

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Returns**: <code>String</code> \| <code>Promise.&lt;String&gt;</code>  
**Access**: public  

* * *

