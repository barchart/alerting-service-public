## Contents {docsify-ignore}

* [JwtPayload](#JwtPayload) 

* [JwtProvider](#JwtProvider) 

* [Callbacks](#Callbacks) 


* * *

## JwtPayload :id=jwtpayload
> An object which contains the required assertions for a token.

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
> The unique identifier of the authenticated user. This value must match
> the [Schema.Alert#user_id](#schemaalertuser_id) of any alert you attempt to create, edit, or delete.

**Kind**: instance property of [<code>JwtPayload</code>](#JwtPayload)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### jwtPayload.alertSystem :id=jwtpayloadalertsystem
> The authenticated user's domain. In the demo environment, use your company name. This value must
> match the [Schema.Alert#alert_system](#schemaalertalert_system) of any alert you attempt to create, edit, or delete.

**Kind**: instance property of [<code>JwtPayload</code>](#JwtPayload)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### jwtPayload.forSigning() :id=jwtpayloadforsigning
> Returns the simple object representation, used for signing a token.

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
> Generates and caches a signed token (using a delegate). The cached token
> is refreshed periodically. An instance of this class is required by
> the [AdapterBase](/content/sdk/lib-adapters?id=adapterbase) implementations.

**Kind**: global class  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/security/JwtProvider  
**File**: /lib/security/JwtProvider.js  

* [JwtProvider](#JwtProvider)
    * _instance_
        * [.getToken()](#JwtProvidergetToken) ⇒ <code>Promise.&lt;String&gt;</code>
    * _static_
        * [.fromTokenGenerator(tokenGenerator, [refreshInterval])](#JwtProviderfromTokenGenerator) ⇒ [<code>JwtProvider</code>](#JwtProvider)
        * [.forDemo(userId, contextId, alertSystem, [permissions], [refreshInterval])](#JwtProviderforDemo) ⇒ [<code>JwtProvider</code>](#JwtProvider)
        * [.forDevelopment(userId, contextId, alertSystem, [permissions], [refreshInterval])](#JwtProviderforDevelopment) ⇒ [<code>JwtProvider</code>](#JwtProvider)
        * [.forAdmin(userId, contextId, alertSystem, [permissions], [refreshInterval])](#JwtProviderforAdmin) ⇒ [<code>JwtProvider</code>](#JwtProvider)
    * _constructor_
        * [new JwtProvider(tokenGenerator, [refreshInterval])](#new_JwtProvider_new)


* * *

### jwtProvider.getToken() :id=jwtprovidergettoken
> Reads the current token, refreshing if necessary.

**Kind**: instance method of [<code>JwtProvider</code>](#JwtProvider)  
**Returns**: <code>Promise.&lt;String&gt;</code>  
**Access**: public  

* * *

### JwtProvider.fromTokenGenerator(tokenGenerator, [refreshInterval]) :id=jwtproviderfromtokengenerator
> A factory for [JwtProvider](/content/sdk/lib-security?id=jwtprovider) which is an alternative to the constructor.

**Kind**: static method of [<code>JwtProvider</code>](#JwtProvider)  
**Returns**: [<code>JwtProvider</code>](#JwtProvider)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| tokenGenerator | [<code>JwtTokenGenerator</code>](#CallbacksJwtTokenGenerator) | <p>An anonymous function which returns a signed JWT.</p> |
| [refreshInterval] | <code>Number</code> | <p>The number of milliseconds which must pass before a new JWT is generated. A zero value means the token should never be refreshed. A null or undefined value means the token is not cached.</p> |


* * *

### JwtProvider.forDemo(userId, contextId, alertSystem, [permissions], [refreshInterval]) :id=jwtproviderfordemo
> Builds a [JwtProvider](/content/sdk/lib-security?id=jwtprovider) which will generate tokens impersonating the specified
> user. These tokens will only work in the &quot;test&quot; environment.</p>
> <p>Recall, the &quot;test&quot; environment is not &quot;secure&quot; -- any data saved here can be accessed
> by anyone (using this feature). Furthermore, data is periodically purged from the
> test environment.

**Kind**: static method of [<code>JwtProvider</code>](#JwtProvider)  
**Returns**: [<code>JwtProvider</code>](#JwtProvider)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>String</code> | <p>The identifier of the user to impersonate.</p> |
| contextId | <code>String</code> | <p>The context identifier of the user to impersonate.</p> |
| alertSystem | <code>String</code> | <p>The domain of the user who will be impersonated.</p> |
| [permissions] | <code>String</code> | <p>The desired permission level.</p> |
| [refreshInterval] | <code>Number</code> | <p>The number of milliseconds which must pass before a new JWT is generated. A null or undefined value means the token is not cached.</p> |


* * *

### JwtProvider.forDevelopment(userId, contextId, alertSystem, [permissions], [refreshInterval]) :id=jwtproviderfordevelopment
> Builds a [JwtProvider](/content/sdk/lib-security?id=jwtprovider) which will generate tokens impersonating the specified
> user. The &quot;development&quot; environment is for Barchart use only and access is restricted
> to Barchart's internal network.

**Kind**: static method of [<code>JwtProvider</code>](#JwtProvider)  
**Returns**: [<code>JwtProvider</code>](#JwtProvider)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>String</code> | <p>The user identifier to impersonate.</p> |
| contextId | <code>String</code> | <p>The context identifier of the user to impersonate.</p> |
| alertSystem | <code>String</code> | <p>The domain of the user who will be impersonated.</p> |
| [permissions] | <code>String</code> | <p>The desired permission level.</p> |
| [refreshInterval] | <code>Number</code> | <p>The number of milliseconds which must pass before a new JWT is generated. A null or undefined value means the token is not cached.</p> |


* * *

### JwtProvider.forAdmin(userId, contextId, alertSystem, [permissions], [refreshInterval]) :id=jwtproviderforadmin
> Builds a [JwtProvider](/content/sdk/lib-security?id=jwtprovider) which will generate tokens impersonating the specified
> user. The &quot;admin&quot; environment is for Barchart use only and access is restricted
> to Barchart's internal network.

**Kind**: static method of [<code>JwtProvider</code>](#JwtProvider)  
**Returns**: [<code>JwtProvider</code>](#JwtProvider)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>String</code> | <p>The user identifier to impersonate.</p> |
| contextId | <code>String</code> | <p>The context identifier of the user to impersonate.</p> |
| alertSystem | <code>String</code> | <p>The domain of the user who will be impersonated.</p> |
| [permissions] | <code>String</code> | <p>The desired permission level.</p> |
| [refreshInterval] | <code>Number</code> | <p>The number of milliseconds which must pass before a new JWT is generated. A null or undefined value means the token is not cached.</p> |


* * *

### new JwtProvider(tokenGenerator, [refreshInterval]) :id=new_jwtprovider_new
**Kind**: constructor of [<code>JwtProvider</code>](#JwtProvider)  

| Param | Type | Description |
| --- | --- | --- |
| tokenGenerator | [<code>JwtTokenGenerator</code>](#CallbacksJwtTokenGenerator) | <p>An anonymous function which returns a signed JWT.</p> |
| [refreshInterval] | <code>Number</code> | <p>The number of milliseconds which must pass before a new JWT is generated. A null or undefined value means the token is not cached.</p> |


* * *

## Callbacks :id=callbacks
> A meta namespace containing signatures of anonymous functions.

**Kind**: global namespace  

* * *

### Callbacks.JwtTokenGenerator :id=callbacksjwttokengenerator
> A function which returns a signed token.

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Returns**: <code>String</code> \| <code>Promise.&lt;String&gt;</code>  
**Access**: public  

* * *

