# alerts-management-client

## Javascript library for managing Barchart alerts

The Barchart Alert system provides notifications (e.g. SMS messages, emails, etc) to
Barchart users when user-defined events occur. These events are typically based on
market data (e.g. when a stock trades in excess of a given price).

This library allows a user to create, delete, and otherwise manage their alerts.


## Setup

This library is intended for use in the browser or headless JavaScript environments
(i.e. Node.js). It has been released via the usual package managers.


### npm

To import the library as a dependency to your application using npm, use the following command:


	npm install @barchart/alerts-client-js -S


### git

The git repository is publicly-accessible here:


	https://github.com/barchart/alerts-client-js


## Usage

The Barchart Alert Management system exposes both REST and [socket.io](http://socket.io) endpoints.
However, this library is a convenience-wrapper for interacting with the Barchart Alert
Management system. So, instead of invoking these transports directly, and worrying about the
details of the protocol, the consumers can make single-line method calls to perform asynchronous
operations (e.g. create alert, delete alert, etc).


### Example

An working example browser implementation can be found in the git repository at:


	/example/browser/example.html


Clone the git repository and open the HTML page in a browser. The consumer
code is contained within a script block of the HTML.


### Initialization (Using Socket.IO transport)

In the browser, an object has been added to the global namespace. Connect as follows:


	var alertManager = new Barchart.Alerts.AlertManager();


Alternately, the URL and port of the alert management host/port can be passed to the
constructor:


	var alertManager = new Barchart.Alerts.AlertManager('alerts-management-stage.barchart.com', 80);


Then, call the connect method before using any operations:

	alertManager.connect()
		.then(function() {
			// ready
		});


### Initialization (Using HTTP/REST transport)

To use a simple REST transport (instead of socket.io transport), change the constructor to:


	var alertManager = new Barchart.Alerts.AlertManager('alerts-management-stage.barchart.com', 80, 'rest');


And, finally, call the connect method before invoking any other operations:

	alertManager.connect()
		.then(function() {
			// ready
		});

### Disposal

Once you have finished using the AlertManager, please call the "dispose" function, as follows:


	alertManager.dispose()


This will release connections to the server. After dispose has been called, you will
need to create a new instance of the AlertManager, if you futher interactions are
necessary.


### Asynchronous Operations

All operations are asynchronous. The result of any method call will be an A+ style promise. Here
is an example:


	alertManager.getServerVersion()
		.then(function(version) {
			console.log(version.semver);
		})
		.catch(function(error) {
			console.log('A problem occurred.');
		});

## Data

The library uses a JSON-in, JSON-out architecture. All data exchanged is in JSON format.
Requests must supply JSON data. Responses are composed of JSON data.

The following data structures are important:

### Target

A "target" refers to a type of object that can be observed.

	{
		"target_id": 1,
		"description": "equity",
		"identifier_type": "symbol",
		"identifier_description": "symbol"
	}


### Property

A "property" refers to an attribute of a target. The value of
a "property" can be checked using an "operator" object.

	{
		"property_id": 18,
		"type": "number",
		"description": [
			"Average Volume",
			"200 Day"
		],
		"descriptionShort": [
			"Average Volume",
			"200 Day"
		],
		"group": "Technical",
		"category": [ "Liquidity" ],
		"target": {
			"target_id": 1,
			"description": "equity",
			"identifier_description": "symbol"
		},
		"valid_operators": [
			2,
			3
		]
	}

* The "valid_operators" array references the "operator" objects
that can be used in conjunction with this "property" to
create a "condition." So, refer to the example above. This
"property" describes the 200-day average volume for an equity.
The  "valid_operators" array tells us that operators 2 and 3
(greater-than and less-than) can be used to build an
alert "condition" however it would not be valid to pair any
other operators with this "property."

* The "type" property indicates if the value of the property
is expected to be a string, a number, a number (percent), or
even a complex object.


### Operator

A comparison operation that can be applied to the "property" value
of a "target" object.

	{
		"operator_id": 4,
		"operator_type": "binary",
		"operator_name": "is-indicator",
		"display": {
			"short": "=",
			"long": "is"
		},
		"operand_type": "string",
		"operand_options": [
			"Buy",
			"Sell",
			"Hold"
		],
		"operand_literal": true
	}

The operator.operand_options lists the possible values which can be used
as an "operand" when using the operator. If operator.operand_options has
no items, then there no restriction is placed upon an "operand" value.


### Condition

A "condition" is the comparison between a "property" value using an "operator" object.
The "target" of the "property" must include an "identifier" and the "operator" must
include an "operand" value. Alerts can have multiple conditions.

	{
		"condition_id": "0ce4e213-8fbf-442a-a3f5-2356a5eca09f",
		"property": {
			"property_id": 10,
			"description": [
				"Moving Average",
				"50 Day"
			],
			"descriptionShort": [
				"Moving Average",
				"50 Day"
			],
			"group": "Technical",
			"target": {
					"target_id": 1,
					"description": "equity",
					"identifier_description": "symbol",
					"identifier": "TSLA"
			}
		},
		"operator": {
			"operator_id": 2,
			"operator_type": "binary",
			"operator_name": "greater-than",
			"display": {
				"short": ">",
				"long": "greater than"
			},
			"operand_type": "number",
			"operand": "200.00",
			"operand_display": "200.00"
		}
	}


### PublisherType

A "publisher type" defines a mechanism for notifying users.

	{
		"publisher_type_id": 1,
		"transport": "sms",
		"provider": "twilio"
	}


### PublisherTypeDefault

A "publisher type" that includes the default recipient for a user.

	{
		"publisher_type_id": 1,
		"transport": "sms",
		"provider": "twilio",
		"alert_system": "barchart.com",
		"user_id": "barchart-test-user",
		"default_recipient": "123-456-7890",
		"default_recipient_hmac": "94b6239ae1d309a46163bb1e2f64213170ef201fb3f99ed1908caee899a34d2b"
		"active_alert_types": [
			"price",
			"news"
		]
	}

Presence of the "default_recipient_hmac" field indicates that the recipient has been "verified."


### Publisher

A "publisher" defines the rules for notification of an end user. An
alert can have multiple publishers.

	{
		"publisher_id": "9c864a19-ce77-4a87-8cd6-e0810ecb120e",
		"use_default_recipient" false,
		"recipient": "123-456-7890",
		"format": "It is a good time to buy Telsa stock.",
		"type": {
			"publisher_type_id": 1,
			"transport": "sms",
			"provider": "twilio"
		}
	}


### Alert

An "alert" consists of one or more "condition" objects and one or more
"publisher" objects.

	{
		"alert_id": "39b633bf-8993-491d-b544-bdc9deed60be",
		"alert_state": "Inactive",
		"alert_system": "barchart.com",
		"user_id": "barchart-test-user",
		"alert_type": "price",
		"alert_behavior": "Terminate",
		"name": "Buy TSLA",
		"user_notes": "Time to buy Tesla Motors stock",
		"automatic_reset": true,
		"create_date": "1453673000873",
		"last_trigger_date": "145367399999",
		"conditions": [ ],
		"publishers": [ ],
		"schedules": [ ]
	}

* If the alert has never been triggered, the "last_trigger_date" property will be omitted.
* The "alert_type" is an optional field that is used to classify the alert. It is used to decide "default" publishing rules (if no publishers have been specified). This happens by matching the "active_alert_type" property of a PublisherTypeDefault object.
* The "alert_behavior" is an optional field that is used to control what happens after an alert's conditions are met. See the description of "Alert Behaviors" below.


### AlertResetSchedule

If an alert is configured to use the "Schedule" behavior, this object
defines a time for the alert to resume processing.

	{
		"alert_id": "39b633bf-8993-491d-b544-bdc9deed60be",
		"schedule_id": "14179194-f00a-4372-9fe7-32d5e300e574",
		"time": "14:30"
		"day": "Wednesday"
		"timezone": "America/Chicago"
	}

* The "timezone" property refers to a timezone name according to the Moment.js[http://momentjs.com/timezone/docs/#/data-loading/getting-zone-names/]. If omitted, this property will default to "America/Chicago"


### MarketDataConfiguration

Many alert conditions depend on market data feeds. This data structure
defines the parameters for the market data feed which will be used
to evaluate conditions (for a given user).

	{
		"configuration_id": "71193b92-fe99-4ab7-a83a-92465bec88e2",
		"alert_system": "barchart.com",
		"user_id": "barchart-test-user",
		"market_data_id": "my-fancy-market-data-user-id"
	}


## Data (Enumerations)


#### Alert States

* **Inactive** - The alert is not processing. It will not begin processing until started (see alertManager.enableAlert).
* **Starting** - The alert is attempting to transition to the "Active" state. If the transition succeeds, the state will become "Active;" otherwise the state will revert to "Inactive."
* **Active** - The alert is processing; however, its conditions have not yet been met. The alert will stay in the "Active" state until the user stops it (see alertManager.disableAlert) or until the conditions are met.
* **Scheduled** - The alert is waiting until a scheduled time to resume processing (only applies to alert's using the "Schedule" behavior).
* **Stopping** - The user has requested that alert processing stop. Once this operation is complete, the alert will return to the "Inactive" state.
* **Triggered** - The alert's conditions have been met. The alert can be manually restarted (see alertManager.enableAlert).


#### Alert Behaviors

* **Terminate** - Once an alert's conditions have been met, the alert will be published, the state will become "Triggered," and processing stops. This is the default behavior.
* **Schedule** - Once an alert's conditions have been met, the alert will be published and processing stops. However, processing will resume according to the alert's reset schedule. During the time an alert is waiting to reset, it remains in the "Active" state.


#### Operator Types

* **Unary** - A unary operator does not require an "operand" value.
* **Binary** - A binary operator requires an "operand" value.


## AlertManager Operations


### getServerVersion

Returns the version of the server in a JSON object, as follows:

JSON-in:

	{
	}

JSON-out:

	{
	  "semver": "0.0.1"
	}


### getTargets

Returns an array of the supported "Target" objects.

JSON-in:

	{
	}

JSON-out:

	An array of "Target" objects


### getProperties

Returns an array of supported "Property" objects.

JSON-in:

	{
	}

JSON-out:

	An array of "property" objects


### getOperators

Returns an array of supported "Operator" objects.

JSON-in:

	{
	}

JSON-out:

	An array of "Operator" objects


### getPublisherTypes

Returns an array of supported "PublisherType" objects.

JSON-in:

	{
	}

JSON-out:

	An array of "PublisherType" objects


### getPublisherTypeDefaults

Returns an array of "PublisherTypeDefault" objects.

JSON-in:

	{
		"user_id": "barchart-test-user",
		"alert_system": "barchart.com"
	}

JSON-out:

	An array of "PublisherTypeDefault" objects


### assignPublisherTypeDefault

Updates a PublisherTypeDefault for a specific user.

JSON-in:

	{
		"publisher_type_id": 1,
		"user_id": "barchart-test-user",
		"alert_system": "barchart.com",
		"default_recipient": "123-456-7890",
		"default_recipient_hmac": "94b6239ae1d309a46163bb1e2f64213170ef201fb3f99ed1908caee899a34d2b"
		"active_alert_types": [
			"price",
			"news"
		],
		"allow_window_start": "06:00",
		"allow_window_end": "20:30",
		"allow_window_timezone": "America/Chicago"
	}

JSON-out:

	An "PublisherTypeDefault" object.

Field details:

* active_alert_types - An array of strings. If the alert's type matches
a value contained within this array, then alert will be published using
the publisher type. Currently valid strings are: ("news" and "price").
* allow_window_start - When an alert is triggered, if the current time
is after the "allow_window_start" time and before the "allow_window_end"
time, then the publisher will be used. Otherwise the triggered alert
will not be published (using this publisher type). No restriction exists
if the value of this property is null.
* allow_window_end - When an alert is triggered, if the current time
is after the "allow_window_start" time and before the "allow_window_end"
time, then the publisher will be used. Otherwise the triggered alert
will not be published (using this publisher type). No restriction exists
if the value of this property is null.
* allow_window_timezone - The timezones that qualify the "allow_window_start"
and "allow_window_end" times. Use the Barchart.Alerts.timezone.getTimezones
function to get a list of valid timezone strings.
* default_recipient_hmac is optional. If you have "verified" the recipient
please include the HMAC; otherwise, omit this property;


### getMarketDataConfiguration

Returns a "MarketDataConfiguration" object, for the specified user.

JSON-in:

	{
		"user_id": "barchart-test-user",
		"alert_system": "barchart.com"
	}

JSON-out:

	A "MarketDataConfiguration" object.


### assignMarketDataConfiguration

Updates the MarketDataConfiguration for a specific user.

JSON-in:

	{
		"user_id": "barchart-test-user",
		"alert_system": "barchart.com",
		"market_data_id": "my-fancy-market-data-user-id"
	}

JSON-out:

	A "MarketDataConfiguration" object.


### createAlert

The following JSON object can be used to create an alert. The input is a
simplified version of the "Alert" object.

JSON-in (example 1, required properties):

	{
		"name": "My First Alert",
		"user_id": "barchart-test-user",
		"alert_system": "barchart.com",
		"automatic_reset": false,
		"alert_type": "price",
		"user_notes": "This alert was created for fun and profit."
		"conditions": [ {
			"property": {
				"property_id": 1,
				"target":{
					"identifier": "AAPL"
				}
			},
			"operator":{
				"operator_id": 3,
				"operand": "99"
			}
		} ],
		"publishers":[ {
			"type": {
				"publisher_type_id": 1
			},
			"use_default_recipient": false,
			"recipient": "123-456-7890",
			"format": "Apple stock is falling"
			}, {
		   "type": {
			   "publisher_type_id": 1
		   },
		   "use_default_recipient": true,
		   "format": "Apple stock is falling"
	   } ]
	}

JSON-in (example 1, with reset schedule, Monday-Friday at 5:30 PM):

	{
		"name": "My Scheduled Alert",
		"user_id": "barchart-test-user",
		"alert_system": "barchart.com",
		"automatic_reset": false,
		"alert_type": "price",
		"alert_behavior": "schedule",
		"user_notes": "This alert was created for repeated fun and profit."
		"conditions": [ {
			"property": {
				"property_id": 1,
				"target":{
					"identifier": "AAPL"
				}
			},
			"operator":{
				"operator_id": 3,
				"operand": "99"
			}
		} ],
		"schedules": [
			{
				"time": "17:30",
				"day": "Monday",
				"timezone": "America/Chicago"
			}, {
				"time": "17:30",
				"day": "Tuesday",
				"timezone": "America/Chicago"
			}, {
				"time": "17:30",
				"day": "Wednesday",
				"timezone": "America/Chicago"
			}, {
				"time": "17:30",
				"day": "Thursday",
				"timezone": "America/Chicago"
			},  {
				"time": "17:30",
				"day": "Friday",
				"timezone": "America/Chicago"
			}
		]
	}

JSON-out:

	An "Alert" object.


### retrieveAlert

Gets a single "Alert" object, using its identifier:

JSON-in:

	{
		"alert_id": "59ddfd0b-89db-4886-85c3-eb8e7a289390"
	}

JSON-out:

	An "Alert" object.


### editAlert

A composite operation that deletes an existing alert and then recreates it.

JSON-in:

	An "Alert" object.

JSON-out:

	An "Alert" object.


### enableAlert

Causes an "Alert" object to begin testing for matched conditions.
Notifications will be sent as soon as the alert conditions are matched.

JSON-in:

	{
		"alert_id": "59ddfd0b-89db-4886-85c3-eb8e7a289390"
	}

JSON-out:

	The "Alert" object that was enabled.


### disableAlert

Stops an "Alert" object from processing. No notifications will be sent.

JSON-in:

	{
		"alert_id": "59ddfd0b-89db-4886-85c3-eb8e7a289390"
	}

JSON-out:

	The "Alert" object that was disabled.


### deleteAlert

Deletes a single "Alert" object, using its identifier:

JSON-in:

	{
		"alert_id": "59ddfd0b-89db-4886-85c3-eb8e7a289390"
	}

JSON-out:

	The "Alert" object that was deleted.


### retrieveAlerts

Retrieves all the "Alert" objects for a user account:

JSON-in (example 1, required properties):

	{
		"user_id": "barchart-test-user",
		"alert_system": "barchart.com"
	}

JSON-in (example 2, optional filter, only "price" alerts):

	{
		"user_id": "barchart-test-user",
		"alert_system": "barchart.com",
		"filter": {
			"alert_type": "price"
		}
	}

JSON-in (example 3, optional filter, only alerts refer to AAPL):

	{
		"user_id": "barchart-test-user",
		"alert_system": "barchart.com",
		"filter": {
			"symbol": "AAPL"
		}
	}

JSON-in (example 4, optional filter, only alerts where the target is AAPL):

	{
		"user_id": "barchart-test-user",
		"alert_system": "barchart.com",
		"filter": {
			"target": {
				"identifier": "AAPL"
			}
		}
	}

JSON-in (example 5, optional filter, only alerts where a condition refers to AAPL):

	{
		"user_id": "barchart-test-user",
		"alert_system": "barchart.com",
		"filter": {
			"condition": {
				"operand": "AAPL"
			}
		}
	}

JSON-out:

	An array of "Alert" objects belonging to the specified user.


### subscribeAlerts(query, changeCallback, deleteCallback, createCallback, triggerCallback)

Provides notification, via callbacks, when an alert has been created, changed, or
deleted, or triggered for a specific user.

Also, in order to maintain synchronized, after subscribeAlerts is called, the consumer
will receive each pre-existing alert via the changeCallback. Also, if the client loses
connection to the server, each pre-existing alert will be sent to the changeCallback.

JSON-in (the "query" parameter):

	{
		"alert_system": "barchart.com",
		"user_id": "barchart-test-user"
	}

JSON-out:

	Alert objects are passed to the callbacks.

## Utility Functions

### Barchart.Alerts.timezone.getTimezones

Returns an array of strings describe valid timezones.


### Barchart.Alerts.timezone.guessTimezone

Returns a string that represents a guess of the user's current
timezone. A null value is returned if a guess cannot be made.


## Unit Testing

Gulp and Jasmine are used. Execute unit tests, as follows:

	gulp test