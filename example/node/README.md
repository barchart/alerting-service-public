# @barchart/alerts-client-js/example/node

### Overview

Three Node.js scripts which use this SDK to interact with the Barchart Alerting Service.

### Scripts

* example.js — Instantiates an `AlertManager` and uses it to retrieves a list of alerts owned by a specific user. 
* example2.js — Instantiates an `AlertManager` and uses it to create a new alert.
* example3.js — Instantiates an `AlertManager` and uses it to list, create, and delete an alert template.
* example4.js — Instantiates an `AlertManager` and uses it to set ordering for templates (with hardcoded identifiers).
* example5.js — Instantiates an `AlertManager` and uses it to delete a template (with a hardcoded identifier).
* example6.js — Instantiates an `AlertManager` and uses it to subscribe to changes to templates.
* example7.js — Instantiates an `AlertManager` and uses it to retrieve properties and group them into a tree structure.
* example8.js — Instantiates an `AlertManager` and uses it start all alerts (for the user).
* example9.js — Instantiates an `AlertManager` and uses it get properties and templates (then filter them for validity for a symbol).

These scripts also illustrate:

* Usage of a `JwtProvider` to generate the token required to authenticate with the remote service.
* Usage of a `LoggerProvider` to define a strategy for writing logs.

### Parameters

* user_id — required - Your username.
* alert_system — optional - Your context (provided to you by Barchart).
* host — optional — The hostname of the remote service.
* port — optional — The TCP port of the remote service.
* mode — optional — Defines one of two possible transports -- either `http` or `socket.io`.

### Examples

```shell
node example.js --user_id=me
node example.js --user_id=me --mode=http
node example.js --user_id=me --host=localhost --port=3010
```