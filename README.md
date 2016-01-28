# alerts-management-client

## Javascript library for managing Barchart alerts

The Barchart Alert system provides notifications (e.g. SMS messages, emails, etc) to
Barchart users when user-defined events occur. These events are typically based on
market date (e.g. when a stock trades in excess of a given price). 

This library allows a user to create, delete, and otherwise manage their alerts.


##Setup

This library is intended for use in the browser or headless JavaScript environments
(i.e. Node.js). It has been released via the usual package managers.


###npm

To import the library as a dependency to your application using npm, use the following command:


	npm install alerts-management-client -S
	

###bower

To import the library as a dependency to your application using bower, use the following command:


	bower install alerts-management-client -S
	

###git

The git repository is publically-accessible here:


	https://github.com/barchart/alerts-client-js


##Usage

The Barchart Alert Management system exposes both REST and socket.io[http://socket.io] endpoints. 
However, this library is a convience-wrapper fro interacting with the Barchart Alert
Management system. So, instead of invoking these transports directly, and worrying about the 
details of the protocol, the consumers can make single-line method calls to perform asynchronous 
operations (e.g. create alert, delete alert, etc).


###Example

An working example browser implementation can be found in the git repository at:


	/example/browser/example.html
	

Clone the git repository and open the HTML page in a browser. The consumer
code is contained within a script block of the HTML.


###Initialization (Using REST)
 
In the browser, an object has been added to the global namespace. Connect as follows:


	var alertManager = new Barchart.Alerts.RestAlertManager();


Alternately, the URL and port of the alert management system can be passed to the 
constructor:


	var alertManager = new Barchart.Alerts.RestAlertManager('alerts-management-stage.elasticbeanstalk.com', 80);


Then, call the connect method before using any operations:

	alertManager.connect()
		.then(function() {
			// ready
		});
		
		
###Initialization (Using Socket.IO)
 
To use a Socket.IO transport, change the constructor to:

	var alertManager = new Barchart.Alerts.SocketIOAlertManager();
	
Specify the URL and port as follows:


	var alertManager = new Barchart.Alerts.SocketIOAlertManager('alerts-management-stage.elasticbeanstalk.com', 80);
	

And, finally, call the connect method before invoking any other operations:
	
	alertManager.connect()
		.then(function() {
			// ready
		});


###Asynchronous Operations

All operations are asynchronous. The result of any method call will be an A+ style promise. Here
is an example:


	alertManager.getServerVersion()
		.then(function(version) {
			console.log(version.semver);
		})
		.catch(functoin(error) {
			console.log('A problem occurred.');
		});

##Data

The library uses a JSON-in, JSON-out architecture. All data exchanged is in JSON format. 
Requests must supply JSON data. Responses are composed of JSON data.

The following data structures are important:

###Target

A "target" refers to a type of object that can be observed.

    {
        "target_id": 1,
        "description": "equity",
        "identifier_description": "symbol"
    }


###Property

A "property" refers to an attribute of a target. The value of
a "property" can be checked using an "operator" object. 

    {
        "property_id": 18,
        "description": [
            "Average Volume",
            "200 Day"
        ],
        "group": "Technical",
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

The "valid_operators" array references the "operator" objects
that can be used in conjunction with this "property" to
create a "condition." So, refer to the example above. This
"property" describes the 200-day average volume for an equity. 
The  "valid_operators" array tells us that operators 2 and 3 
(greater-than and less-than) can be used to build an 
alert "condition" however it would not be valid to pair any
other operators with this "property."


###Operator

A comparison operation that can be applied to the "property" value
of a "target" object.

    {
        "operator_id": 4,
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
        ]
    }

The operator.operand_options lists the possible values which can be used
as an "operand" when using the operator. If operator.operand_options has
no items, then there no restriction is placed upon an "operand" value.


###Condition

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
            "operator_name": "greater-than",
            "display": {
                "short": ">",
                "long": "greater than"
            },
            "operand_type": "number",
            "operand": "200"
        }
    }


###PublisherType

A "publisher type" defines a mechanism for notifying users.

    {
        "publisher_type_id": 1,
        "transport": "sms",
        "provider": "twilio"
    }


###Publisher

A "publisher" defines the rules for notification of an end user. An
alert can have multiple publishers.

    {
        "publisher_id": "9c864a19-ce77-4a87-8cd6-e0810ecb120e",
        "recipient": "123-456-7890",
        "format": "It is a good time to buy Telsa stock.",
        "type": {
            "publisher_type_id": 1,
            "transport": "sms",
            "provider": "twilio"
        }
    }


###Alert

An "alert" consists of one or more "condition" objects and one or more
"publisher" objects.

    {
        "alert_id": "39b633bf-8993-491d-b544-bdc9deed60be",
        "alert_state": "Inactive",
        "alert_system": "barchart.com",
        "user_id": "barchart-test-user",
        "name": "Buy TSLA",
        "automatic_reset": true,
        "create_date": "1453673000873",
        "last_trigger_date": "145367399999",
        "conditions": [ ],
        "publishers": [ ]
    }
    
If the alert has never been triggered, the "last_trigger_date" property will be omitted.

 
####Alert States

* **Inactive** - The alert is not processing. It will not begin processing until started (see alertManager.enableAlert).
* **Starting** - The alert is attempting to transition to the "Active" state. If the transition succeeds, the state will become "Active;" otherwise the state will revert to "Inactive." 
* **Active** - The alert is processing; however, its conditions have not yet been met. The alert will stay in the "Active" state until the user stops it (see alertManager.disableAlert) or until the conditions are met.
* **Stopping** - The user has requested that alert processing stop. Once this operation is complete, the alert will return to the "Inactive" state.
* **Triggered** - The alert's conditions have been met. The alert can be manually restarted (see alertManager.enableAlert).


##AlertManager Operations

###getServerVersion

Returns the version of the server in a JSON object, as follows:

JSON-in:

	{
	}
	
JSON-out:

	{
	  "semver": "0.0.1"
	}


###getTargets

Returns an array of the supported "Target" objects.

JSON-in:

	{
	}

JSON-out:

	An array of "Target" objects


###getProperties

Returns an array of supported "Property" objects.

JSON-in:

	{
	}
	
JSON-out:

	An array of "property" objects


###getOperators

Returns an array of supported "Operator" objects.

JSON-in:

	{
	}

JSON-out:

	An array of "Operator" objects


###getPublisherTypes

Returns an array of supported "PublisherType" objects.

JSON-in:

	{
	}

JSON-out:

	An array of "PublisherType" objects

	
###createAlert

The following JSON object can be used to create an alert. The input is a
simplified version of the "Alert" object.

JSON-in:

	{
	    "name": "My Test Alert",
	    "user_id": "barchart-test-user",
	    "alert_system": "barchart.com",
	    "automatic_reset": false,
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
            "recipient": "123-456-7890",
            "format": "Apple stock is falling"
        } ]
    }

JSON-out:
	
	An "Alert" object.


###retrieveAlert

Gets a single "Alert" object, using its identifier:

JSON-in:

	{
	    "alert_id": "59ddfd0b-89db-4886-85c3-eb8e7a289390"
	}
  	
JSON-out:

	An "Alert" object.


###editAlert

A composite operation that deletes an existing alert and then recreates it.

JSON-in:

	An "Alert" object.

JSON-out:

	An "Alert" object.


###enableAlert

Causes an "Alert" object to begin testing for matched conditions.
Notifications will be sent as soon as the alert conditions are matched.

JSON-in:

	{
	    "alert_id": "59ddfd0b-89db-4886-85c3-eb8e7a289390"
	}
  	
JSON-out:

	The "Alert" object that was enabled.


###disableAlert

Stops an "Alert" object from processing. No notifications will be sent.

JSON-in:

	{
	    "alert_id": "59ddfd0b-89db-4886-85c3-eb8e7a289390"
	}
  	
JSON-out:

	The "Alert" object that was disabled.


###deleteAlert

Deletes a single "Alert" object, using its identifier:

JSON-in:

	{
	    "alert_id": "59ddfd0b-89db-4886-85c3-eb8e7a289390"
	}

JSON-out:

	The "Alert" object that was deleted.


###retrieveAlerts

Retrieves all the "Alert" objects for a user account:

JSON-in (example 1, required properties):

	{
	    "user_id": "barchart-test-user",
	    "alert_system": "barchart.com",
	}
  	
JSON-in (example 2, optional filter, restricting results to alerts that refer to AAPL):

	{
		"user_id": "barchart-test-user",
		"alert_system": "barchart.com",
		"filter": {
			"target": {
				identifier: "AAPL"
			}
		}
	}
 	
JSON-out:

	An array of "Alert" objects belonging to the specified user.


##Unit Testing

Gulp and Jasmine are used. Execute unit tests, as follows:

	gulp test