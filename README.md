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
However, this library is essentially a convience-wrapper interacting with the Barchart Alert 
Management system. So, instead of invoking these transports directly, and worrying about the 
details of the protocol, the consumers can make single-line method calls to perform asynchronous 
operations (e.g. create alert, delete alert, etc).

###Browser Dependencies

When using this library in a brower, jQuery must be loaded.


###Example

An working example browser implementation can be found in the git repository at:


	/example/browser/example.html
	

Clone the git repository and open the HTML page in a browser. The consumer
code is contained within a script block of the HTML.


###Initialization

In the browser, an object has been added to the global namespace. Connect as follows:


	var alertManager = new Barchart.Alerts.RestAlertManager();


Alternately, the URL and port of the alert management system can be passed to the 
constructor:


	var alertManager = new Barchart.Alerts.RestAlertManager('alerts-management-stage.elasticbeanstalk.com', 80);


###Data

The library uses a JSON-in, JSON-out architecture. All data exchanged is in JSON format. 
Requests must supply JSON data. Responses are composed of JSON data.


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

###getConditionOperators

Returns a list of all the conditions that are currently supported by
the alert management system. Each alert has at least one condition.
When creating an alert, the "alert_condition_operator_id" must
be referenced (see "createAlert" example below).

JSON-in:

	{
	}
	
JSON-out:

	[
	  {
	    "alert_condition_operator_id": 1,
	    "description": "price above",
	    "trigger_value_required": true,
	    "trigger_value_type": "number",
	    "alert_condition_target_id": 1,
	    "object_description": "equity",
	    "identifier_description": "symbol"
	  },
	  {
	    "alert_condition_operator_id": 2,
	    "description": "price below", 
	    "trigger_value_required": true,
	    "trigger_value_type": "number",
	    "alert_condition_target_id": 1,
	    "object_description": "equity",
	    "identifier_description": "symbol"
	  }
	]


###getPublisherTypes

Returns a list of all the publishing mechanisms that are currently 
supported by the alert management system. Each alert bas at least
one publisher. When creating an alert, the "alert_condition_operator_id" must
be referenced (see "createAlert" example below).

JSON-in:

	{
	}
	
JSON-out:

	[
	  {
	    "alert_publisher_type_id": 1,
	    "transport": "sms",
	    "provider": "twillio"
	  },
	  { 
	    "alert_publisher_type_id": 2,
	    "transport": "email",
	    "provider": "ses"
	  }
	]
	
	
###createAlert

The following JSON object can be used to create an alert (with one trigger
condition and two publishers).

JSON-in:

	{
	  "user_id":"barchart-test-user",
	  "name":"TSLA above 225",
	  "conditions":[
		{
	      "alert_condition_operator_id": 1,
		  "target_identifier": "TSLA",
		  "trigger_value": "225"
		}
	  ],
	  "publishers":[
		{
		  "alert_publisher_type_id": 2,
		  "recipient":"bryan.ingle@barchart.com",
		  "format":"The price of TSLA is above $225."
		},
		{
		  "alert_publisher_type_id":1,
		  "recipient":"123-456-7890",
		  "format":"The price of TSLA is above $225."
		}
	  ]
	}


Upon successful creation of the alert, the server will respond with something like the
following. Identifiers (UUID) are assigned and additional fields are added.

JSON-out:
	
	{
	  "alert_id": "59ddfd0b-89db-4886-85c3-eb8e7a289390",
	  "user_id": "barchart-test-user",
	  "name": "TSLA above 225",
	  "create_date": "1453219187105",
	  "alert_state": "Inactive",
	  "conditions":[
		{
		  "alert_id": "59ddfd0b-89db-4886-85c3-eb8e7a289390",
		  "alert_condition_id": "e3db4fb7-3fec-45eb-a4b4-b07c97954afc",
		  "target_identifier": "TSLA",
		  "trigger_value": "225",
		  "alert_condition_operator_id": 1,
		  "description": "price above",
		  "trigger_value_required": true,
		  "trigger_value_type": "number",
		  "alert_condition_target_id": 1,
		  "object_description": "equity",
		  "identifier_description": "symbol"
		}
	  ],
	  "publishers":[
		{
		  "alert_id": "59ddfd0b-89db-4886-85c3-eb8e7a289390",
		  "alert_publisher_id": "54a4ec80-b39e-487c-a83c-7fadab047d8f",
		  "alert_publisher_type_id": 2,
		  "recipient": "bryan.ingle@barchart.com",
		  "format": "The price of TSLA is above $225.",
	      "transport": "email",
	      "provider": "ses"
		},
		{
		  "alert_id": "59ddfd0b-89db-4886-85c3-eb8e7a289390",
		  "alert_publisher_id": "ee2dfe1d-a7a0-43e4-9ac5-8b696481f595",
		  "alert_publisher_type_id": 1,
		  "recipient": "123-456-7890",
		  "format": "The price of TSLA is above $225.",
		  "transport": "sms",
		  "provider": "twillio"
		}
	  ]
	}


###retrieveAlert

Gets a single alert object, using its identifier:

JSON-in:

	{
	  "alert_id": "59ddfd0b-89db-4886-85c3-eb8e7a289390"
	}
  	
JSON-out:

	same as "createAlert" JSON-out sample.
	

###deleteAlert

Deletes a single alert, using its identifier:

JSON-in:

	{
	  "alert_id": "59ddfd0b-89db-4886-85c3-eb8e7a289390"
	}
  	
JSON-out:

	same as "createAlert" JSON-out sample.


###resetAlert

Causes an alert to begin testing for matched conditions. Notifications
will be sent as soon as the alert conditions are matched.

JSON-in:

	{
	  "alert_id": "59ddfd0b-89db-4886-85c3-eb8e7a289390"
	}
  	
JSON-out:

	same as "createAlert" JSON-out sample.
	
###disableAlert

Stops an alert from processing. No notifications will be sent.

JSON-in:

	{
	  "alert_id": "59ddfd0b-89db-4886-85c3-eb8e7a289390"
	}
  	
JSON-out:

	same as "createAlert" JSON-out sample.

###retrieveAlerts

Retrieves all the alerts for a user account:

JSON-in:

	{
	  "user_id": "barchart-test-user"
	}
  	
JSON-out:

	An array of items, same as "createAlert" JSON-out sample.
