## Contents {docsify-ignore}

* [Logger](#Logger) 

* [LoggerFactory](#LoggerFactory) 

* [LoggerProvider](#LoggerProvider) 

* [Schema](#Schema) 


* * *

## Logger :id=logger
> <p>An interface for writing log messages. An implementation of this
> class is returned by [LoggerProvider.getLogger](#loggerprovidergetlogger).</p>

**Kind**: global abstract class  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/logging/Logger  
**File**: /lib/logging/Logger.js  

* *[Logger](#Logger)*
    * _instance_
        * **[.log()](#Loggerlog)**
        * **[.trace()](#Loggertrace)**
        * **[.debug()](#Loggerdebug)**
        * **[.info()](#Loggerinfo)**
        * **[.warn()](#Loggerwarn)**
        * **[.error()](#Loggererror)**


* * *

### logger.log() :id=loggerlog
> <p>Writes a log message.</p>

**Kind**: instance abstract method of [<code>Logger</code>](#Logger)  
**Access**: public  

| Param | Type |
| --- | --- |
| ... | [<code>Loggable</code>](#SchemaLoggable) | 


* * *

### logger.trace() :id=loggertrace
> <p>Writes a log message at &quot;trace&quot; level.</p>

**Kind**: instance abstract method of [<code>Logger</code>](#Logger)  
**Access**: public  

| Param | Type |
| --- | --- |
| ... | [<code>Loggable</code>](#SchemaLoggable) | 


* * *

### logger.debug() :id=loggerdebug
> <p>Writes a log message at &quot;debug&quot; level.</p>

**Kind**: instance abstract method of [<code>Logger</code>](#Logger)  
**Access**: public  

| Param | Type |
| --- | --- |
| ... | [<code>Loggable</code>](#SchemaLoggable) | 


* * *

### logger.info() :id=loggerinfo
> <p>Writes a log message at &quot;info&quot; level.</p>

**Kind**: instance abstract method of [<code>Logger</code>](#Logger)  
**Access**: public  

| Param | Type |
| --- | --- |
| ... | [<code>Loggable</code>](#SchemaLoggable) | 


* * *

### logger.warn() :id=loggerwarn
> <p>Writes a log message at &quot;warn&quot; level.</p>

**Kind**: instance abstract method of [<code>Logger</code>](#Logger)  
**Access**: public  

| Param | Type |
| --- | --- |
| ... | [<code>Loggable</code>](#SchemaLoggable) | 


* * *

### logger.error() :id=loggererror
> <p>Writes a log message at &quot;error&quot; level.</p>

**Kind**: instance abstract method of [<code>Logger</code>](#Logger)  
**Access**: public  

| Param | Type |
| --- | --- |
| ... | [<code>Loggable</code>](#SchemaLoggable) | 


* * *

## LoggerFactory :id=loggerfactory
> <p>Container for static functions which control logging within the SDK.</p>

**Kind**: global class  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/logging/LoggerFactory  
**File**: /lib/logging/LoggerFactory.js  

* [LoggerFactory](#LoggerFactory)
    * _static_
        * [.configureForConsole()](#LoggerFactoryconfigureForConsole)
        * [.configureForSilence()](#LoggerFactoryconfigureForSilence)
        * [.configure(provider)](#LoggerFactoryconfigure)
        * [.getLogger(category)](#LoggerFactorygetLogger) ⇒ [<code>Logger</code>](#Logger)


* * *

### LoggerFactory.configureForConsole() :id=loggerfactoryconfigureforconsole
> <p>Configures the SDK to write log messages to the console.</p>

**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  

* * *

### LoggerFactory.configureForSilence() :id=loggerfactoryconfigureforsilence
> <p>Configures the SDK to mute all log messages.</p>

**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  

* * *

### LoggerFactory.configure(provider) :id=loggerfactoryconfigure
> <p>Configures the library to delegate any log messages to a custom
> implementation of the [LoggerProvider](/content/sdk/lib-logging?id=loggerprovider) class.</p>

**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  

| Param | Type |
| --- | --- |
| provider | [<code>LoggerProvider</code>](#LoggerProvider) | 


* * *

### LoggerFactory.getLogger(category) :id=loggerfactorygetlogger
> <p>Returns an instance of [Logger](/content/sdk/lib-logging?id=logger) for a specific category.</p>

**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Returns**: [<code>Logger</code>](#Logger)  
**Access**: public  

| Param | Type |
| --- | --- |
| category | <code>String</code> | 


* * *

## LoggerProvider :id=loggerprovider
> <p>A contract for generating [Logger](/content/sdk/lib-logging?id=logger) instances. For custom logging
> the SDK consumer should implement this class and pass it to the
> [configure](#loggerfactoryconfigure) function.</p>

**Kind**: global abstract class  
**Access**: public  
**Import**: @barchart/alerts-client-js/lib/logging/LoggerProvider  
**File**: /lib/logging/LoggerProvider.js  

* * *

### loggerProvider.getLogger(category) :id=loggerprovidergetlogger
> <p>Returns an instance of [Logger](/content/sdk/lib-logging?id=logger).</p>

**Kind**: instance method of [<code>LoggerProvider</code>](#LoggerProvider)  
**Returns**: [<code>Logger</code>](#Logger)  
**Access**: public  

| Param | Type |
| --- | --- |
| category | <code>String</code> | 


* * *

## Schema :id=schema
> <p>A meta namespace containing structural contracts of anonymous objects.</p>

**Kind**: global namespace  

* * *

### Schema.Loggable :id=schemaloggable
> <p>Something which can be logged (e.g. <code>String</code>, <code>Number</code>, or <code>Object</code>). Ultimately,
> the [Logger](/content/sdk/lib-logging?id=logger) implementation will determine the method (e.g. using <code>JSON.stringify</code> or
> <code>toString</code>).</p>

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Access**: public  

* * *

