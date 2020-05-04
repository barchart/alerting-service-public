## Contents {docsify-ignore}

* [JwtPayload](#JwtPayload) 

* [JwtProvider](#JwtProvider) 

* [Callbacks](#Callbacks) 

## JwtPayload :id=jwtpayload
**Kind**: global class  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/security/JwtPayload  
**File**: /lib/security/JwtPayload.js  
>A simple object which contains properties that must be included in a JWT token.


* [JwtPayload](#JwtPayload)
    * [.userId](#JwtPayloaduserId) ⇒ <code>String</code>
    * [.alertSystem](#JwtPayloadalertSystem) ⇒ <code>String</code>
    * [.forSigning()](#JwtPayloadforSigning) ⇒ <code>String</code>


* * *

### jwtPayload.userId :id=jwtpayloaduserid
**Kind**: instance property of <code>JwtPayload</code>  
**Returns**: <code>String</code>  
**Access**: public  
>The unique identifier of the authenticated user. This value must match
the [Schema.Alert#user_id](Schema.Alert#user_id) of any alert you attempt to create, edit, or delete.


* * *

### jwtPayload.alertSystem :id=jwtpayloadalertsystem
**Kind**: instance property of <code>JwtPayload</code>  
**Returns**: <code>String</code>  
**Access**: public  
>The authenticated user's domain. In the demo environment, use your company name. This value must
match the [Schema.Alert#alert_system](Schema.Alert#alert_system) of any alert you attempt to create, edit, or delete.


* * *

### jwtPayload.forSigning() :id=jwtpayloadforsigning
**Kind**: instance method of <code>JwtPayload</code>  
**Returns**: <code>String</code>  
**Access**: public  
>Returns the simple object representation, used for signing a token.


* * *

## JwtProvider :id=jwtprovider
**Kind**: global class  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/security/JwtProvider  
**File**: /lib/security/JwtProvider.js  
>Provides JWT tokens to the adapters (i.e. [AdapterBase](/content/sdk/lib-adapters?id=adapterbase) implementations).


* * *

### jwtProvider.getToken() :id=jwtprovidergettoken
**Kind**: instance method of <code>JwtProvider</code>  
**Returns**: <code>Promise.&lt;String&gt;</code>  
**Access**: public  
>Reads the current JWT token, refreshing if necessary.


* * *

## Callbacks :id=callbacks
**Kind**: global namespace  
>A meta namespace containing signatures of anonymous functions.


* * *

### Callbacks.JwtTokenGenerator :id=callbacksjwttokengenerator
**Kind**: static typedef of <code>Callbacks</code>  
**Returns**: <code>String</code> \| <code>Promise.&lt;String&gt;</code>  
**Access**: public  
>The signature for a function which generates signs a JWT token.


* * *

