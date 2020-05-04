# Alert Management 3.1.37
    
> The Node.js server that exposes client interfaces creating, starting, and stopping alerts.

## Contents 

* [Servers](#Servers)
* [Paths](#Paths)

## Servers

* [http://alerts-management-stage.barchart.com](http://alerts-management-stage.barchart.com)  - Stage server

## Components

### Schemas 

#### Alert :id=SchemasAlert

**Type**: <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| alert_id | <code>String</code> | false | false |  |
| alert_state | <code>String</code> | false | false |  |
| alert_system | <code>String</code> | false | false |  |
| alert_state_key | <code>String</code> | false | true |  |
| alert_type | <code>String</code> | false | true |  |
| alert_behavior | <code>String</code> | false | false |  |
| user_id | <code>String</code> | false | false |  |
| name | <code>String</code> | false | false |  |
| user_notes | <code>String</code> | false | true |  |
| system_notes | <code>Object</code> | false | false |  |
| automatic_reset | <code>Boolean</code> | false | false |  |
| create_date | <code>String</code> | false | false |  |
| last_trigger_date | <code>String</code> | false | true |  |
| last_start_date | <code>String</code> | false | true |  |
| conditions | [<code>Array&lt;Condition&gt;</code>](#schemasCondition) |  | false |  |
| publishers | [<code>Array&lt;Publisher&gt;</code>](#schemasPublisher) |  | false |  |
| tracking_server_id | <code>Integer</code> | false | true |  |
| schedules | <code>Array</code> | false | false |  |
| effectivePublishers | [<code>Array&lt;Publisher&gt;</code>](#schemasPublisher) |  | false |  |

**Example**:

```json
{
  "alert_id": "39b633bf-8993-491d-b544-bdc9deed60be",
  "alert_state": "Inactive",
  "alert_system": "barchart.com",
  "alert_state_key": "abcdef",
  "alert_type": "price",
  "alert_behavior": "Terminate",
  "user_id": "barchart-test-user",
  "name": "Buy TSLA",
  "user_notes": "Time to buy Tesla Motors stock",
  "system_notes": {},
  "automatic_reset": true,
  "create_date": "1453673000873",
  "last_trigger_date": "145367399999",
  "last_start_date": "145367399999",
  "conditions": [
    {
      "condition_id": "38a3f731-0f87-40b7-a33b-dd9c792998e2",
      "name": "Gap Down is greater than 10.00",
      "operator": {
        "operator_id": 4,
        "operator_type": "binary",
        "operator_name": "is-indicator",
        "operand_options": [
          [
            "Buy",
            "Sell",
            "Hold"
          ]
        ],
        "operand_literal": true,
        "operand_display": "10",
        "operand": "10",
        "display": {
          "short": ">",
          "medium": "greater than",
          "long": "greater than"
        },
        "modifiers": [
          1,
          2,
          3
        ]
      },
      "property": {
        "property_id": 18,
        "type": "number",
        "format": "0,0.00",
        "group": "Technical",
        "accessor": [
          "gapDown"
        ],
        "category": [
          "Gap & Range Change"
        ],
        "description": [
          "Gap Down"
        ],
        "descriptionShort": [
          "Gap Down"
        ],
        "target": {
          "description": "basic",
          "display": "string",
          "identifier": "TSLA",
          "identifier_description": "symbol",
          "qualifier_descriptions": [
            [
              "location",
              "delivery date"
            ]
          ],
          "kind": "string",
          "target_id": 1,
          "type": "symbol"
        },
        "valid_operators": [
          44
        ],
        "sortOrder": 912
      },
      "templates": {
        "condition": "Gap Down is greater than {{{operator.format.operand}}}",
        "trigger": {
          "email": "Gap Down is {{{event.format.gapDown}}}",
          "sms": "Gap Down for {{{property.target.identifier}}} is {{{event.format.gapDown}}}"
        }
      }
    }
  ],
  "publishers": [
    {
      "publisher_id": "9c864a19-ce77-4a87-8cd6-e0810ecb120e",
      "use_default_recipient": false,
      "recipient": "123-456-7890",
      "format": "It is a good time to buy Telsa stock.",
      "timing": {
        "timezon": "America/Chicago"
      },
      "type": {
        "publisher_type_id": 1,
        "transport": "sms",
        "provider": "twilio"
      }
    }
  ],
  "tracking_server_id": 0,
  "schedules": [
    []
  ],
  "effectivePublishers": [
    {
      "publisher_id": "9c864a19-ce77-4a87-8cd6-e0810ecb120e",
      "use_default_recipient": false,
      "recipient": "123-456-7890",
      "format": "It is a good time to buy Telsa stock.",
      "timing": {
        "timezon": "America/Chicago"
      },
      "type": {
        "publisher_type_id": 1,
        "transport": "sms",
        "provider": "twilio"
      }
    }
  ]
}
```

* * *

#### Publisher :id=SchemasPublisher

**Type**: <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| publisher_id | <code>String</code> | false | false |  |
| use_default_recipient | <code>Boolean</code> | false | false |  |
| recipient | <code>String</code> | false | false |  |
| format | <code>String</code> | false | false |  |
| timing | <code>Object</code> |  | false |  |
| timing.timezon | <code>String</code> | false | false |  |
| type | <code>Object</code> |  | false |  |
| type.publisher_type_id | <code>Integer</code> | false | false |  |
| type.transport | <code>String</code> | false | false |  |
| type.provider | <code>String</code> | false | false |  |

**Example**:

```json
{
  "publisher_id": "9c864a19-ce77-4a87-8cd6-e0810ecb120e",
  "use_default_recipient": false,
  "recipient": "123-456-7890",
  "format": "It is a good time to buy Telsa stock.",
  "timing": {
    "timezon": "America/Chicago"
  },
  "type": {
    "publisher_type_id": 1,
    "transport": "sms",
    "provider": "twilio"
  }
}
```

* * *

#### Operator :id=SchemasOperator

**Type**: <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| operator_id | <code>Integer</code> | false | false |  |
| operator_type | <code>String</code> | false | false |  |
| operator_name | <code>String</code> | false | false |  |
| operand_options | <code>Array</code> | false | false |  |
| operand_options[i] | <code>String</code> | false | false |  |
| operand_literal | <code>Boolean</code> | false | false |  |
| operand_display | <code>String</code> | false | false |  |
| operand | <code>String</code> | false | false |  |
| display | <code>Object</code> |  | false |  |
| display.short | <code>String</code> | false | false |  |
| display.medium | <code>String</code> | false | false |  |
| display.long | <code>String</code> | false | false |  |
| modifiers | <code>Array</code> | false | false |  |
| modifiers[i] | <code>Integer</code> | false | false |  |

**Example**:

```json
{
  "operator_id": 4,
  "operator_type": "binary",
  "operator_name": "is-indicator",
  "operand_options": [
    [
      "Buy",
      "Sell",
      "Hold"
    ]
  ],
  "operand_literal": true,
  "operand_display": "10",
  "operand": "10",
  "display": {
    "short": ">",
    "medium": "greater than",
    "long": "greater than"
  },
  "modifiers": [
    1,
    2,
    3
  ]
}
```

* * *

#### Condition :id=SchemasCondition

**Type**: <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| condition_id | <code>String</code> | false | false |  |
| name | <code>String</code> | false | false |  |
| operator | [<code>Operator</code>](#schemasOperator) |  | false |  |
| property | [<code>Property</code>](#schemasProperty) |  | false |  |
| templates | <code>Object</code> |  | false |  |
| templates.condition | <code>String</code> | false | false |  |
| templates.trigger | <code>Object</code> |  | false |  |
| templates.trigger.email | <code>String</code> | false | false |  |
| templates.trigger.sms | <code>String</code> | false | false |  |

**Example**:

```json
{
  "condition_id": "38a3f731-0f87-40b7-a33b-dd9c792998e2",
  "name": "Gap Down is greater than 10.00",
  "operator": {
    "operator_id": 4,
    "operator_type": "binary",
    "operator_name": "is-indicator",
    "operand_options": [
      [
        "Buy",
        "Sell",
        "Hold"
      ]
    ],
    "operand_literal": true,
    "operand_display": "10",
    "operand": "10",
    "display": {
      "short": ">",
      "medium": "greater than",
      "long": "greater than"
    },
    "modifiers": [
      1,
      2,
      3
    ]
  },
  "property": {
    "property_id": 18,
    "type": "number",
    "format": "0,0.00",
    "group": "Technical",
    "accessor": [
      "gapDown"
    ],
    "category": [
      "Gap & Range Change"
    ],
    "description": [
      "Gap Down"
    ],
    "descriptionShort": [
      "Gap Down"
    ],
    "target": {
      "description": "basic",
      "display": "string",
      "identifier": "TSLA",
      "identifier_description": "symbol",
      "qualifier_descriptions": [
        [
          "location",
          "delivery date"
        ]
      ],
      "kind": "string",
      "target_id": 1,
      "type": "symbol"
    },
    "valid_operators": [
      44
    ],
    "sortOrder": 912
  },
  "templates": {
    "condition": "Gap Down is greater than {{{operator.format.operand}}}",
    "trigger": {
      "email": "Gap Down is {{{event.format.gapDown}}}",
      "sms": "Gap Down for {{{property.target.identifier}}} is {{{event.format.gapDown}}}"
    }
  }
}
```

* * *

#### Property :id=SchemasProperty

**Type**: <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| property_id | <code>Integer</code> | false | false |  |
| type | <code>String</code> | false | false |  |
| format | <code>String</code> | false | false |  |
| group | <code>String</code> | false | false |  |
| accessor | <code>Array</code> | false | false |  |
| accessor[i] | <code>String</code> | false | false |  |
| category | <code>Array</code> | false | false |  |
| category[i] | <code>String</code> | false | false |  |
| description | <code>Array</code> | false | false |  |
| description[i] | <code>String</code> | false | false |  |
| descriptionShort | <code>Array</code> | false | false |  |
| descriptionShort[i] | <code>String</code> | false | false |  |
| target | [<code>Target</code>](#schemasTarget) |  | false |  |
| valid_operators | <code>Array</code> | false | false |  |
| valid_operators[i] | <code>Integer</code> | false | false |  |
| sortOrder | <code>Integer</code> | false | false |  |

**Example**:

```json
{
  "property_id": 18,
  "type": "number",
  "format": "0,0.00",
  "group": "Technical",
  "accessor": [
    "gapDown"
  ],
  "category": [
    "Gap & Range Change"
  ],
  "description": [
    "Gap Down"
  ],
  "descriptionShort": [
    "Gap Down"
  ],
  "target": {
    "description": "basic",
    "display": "string",
    "identifier": "TSLA",
    "identifier_description": "symbol",
    "qualifier_descriptions": [
      [
        "location",
        "delivery date"
      ]
    ],
    "kind": "string",
    "target_id": 1,
    "type": "symbol"
  },
  "valid_operators": [
    44
  ],
  "sortOrder": 912
}
```

* * *

#### Target :id=SchemasTarget

**Type**: <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| description | <code>String</code> | false | false |  |
| display | <code>String</code> | false | true |  |
| identifier | <code>String</code> | false | false |  |
| identifier_description | <code>String</code> | false | false |  |
| qualifier_descriptions | <code>Array</code> | false | false |  |
| qualifier_descriptions[i] | <code>String</code> | false | false |  |
| kind | <code>String</code> | false | true |  |
| target_id | <code>Integer</code> | false | false |  |
| type | <code>String</code> | false | false |  |

**Example**:

```json
{
  "description": "basic",
  "display": "string",
  "identifier": "TSLA",
  "identifier_description": "symbol",
  "qualifier_descriptions": [
    [
      "location",
      "delivery date"
    ]
  ],
  "kind": "string",
  "target_id": 1,
  "type": "symbol"
}
```

* * *


## Paths

### GET /server/version 

> Retrieves the current server version.

**Summary**: Get Server Version.

#### Responses

**Status Code**: 200

> A JSON document, containing a single attribute called semver.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| semver | <code>String</code> | false | false |  |

**Example**:

```json
{
  "semver": "3.1.37"
}
```

* * *

### POST /alerts 

> Creates a new alert.

**Summary**: Create Alert.

#### Request Body
    
**Content Type**: application/json

**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| name | <code>String</code> | false | false |  |
| alert_behavior | <code>String</code> | false | false |  |
| user_id | <code>String</code> | false | false |  |
| alert_system | <code>String</code> | false | false |  |
| alert_type | <code>String</code> | false | false |  |
| user_notes | <code>String</code> | false | false |  |
| automatic_reset | <code>Boolean</code> | false | false |  |
| conditions | <code>Object</code> |  | false |  |
| conditions.property | <code>Object</code> |  | false |  |
| conditions.property.property_id | <code>Integer</code> | false | false |  |
| conditions.property.target | <code>Object</code> |  | false |  |
| conditions.property.target.identifier | <code>String</code> | false | false |  |
| conditions.operator | <code>Object</code> |  | false |  |
| conditions.operator.operator_id | <code>Integer</code> | false | false |  |
| conditions.operator.operand | <code>String</code> | false | false |  |
| publishers | <code>Array&lt;object&gt;</code> | false | false |  |
| publishers[i].publisher_id | <code>String</code> | false | false |  |
| publishers[i].use_default_recipient | <code>Boolean</code> | false | false |  |
| publishers[i].recipient | <code>String</code> | false | false |  |
| publishers[i].format | <code>String</code> | false | false |  |
| publishers[i].type | <code>Object</code> |  | false |  |
| publishers[i].type.publisher_type_id | <code>Integer</code> | false | false |  |
| schedules | <code>Array</code> | false | false |  |

**Example**:

```json
{
  "name": "Buy TSLA",
  "alert_behavior": "Terminate",
  "user_id": "barchart-test-user",
  "alert_system": "barchart.com",
  "alert_type": "price",
  "user_notes": "Time to buy Tesla Motors stock",
  "automatic_reset": true,
  "conditions": {
    "property": {
      "property_id": 1,
      "target": {
        "identifier": "AAPL"
      }
    },
    "operator": {
      "operator_id": 3,
      "operand": "99"
    }
  },
  "publishers": [
    {
      "publisher_id": "9c864a19-ce77-4a87-8cd6-e0810ecb120e",
      "use_default_recipient": false,
      "recipient": "123-456-7890",
      "format": "It is a good time to buy Telsa stock.",
      "type": {
        "publisher_type_id": 1
      }
    }
  ],
  "schedules": []
}
```

#### Responses

**Status Code**: 200

> A JSON document, conforming to the alert schema, representing the newly created alert.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Alert&gt;</code>](#schemasAlert)

* * *

**Status Code**: 500

> The reason for the failure, which is typically caused by POST data that does not conform the the alert schema.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| message | <code>String</code> | false | false |  |

**Example**:

```json
{
  "message": "The argument [ query.user_id ] must be a [ string ]"
}
```

* * *

### GET /alerts/{alert_id} 

> Retrieves an existing alert.

**Summary**: Retrieve Alert.

#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| alert_id | <code>String</code> | true | false | The UUID for the alert. |

#### Responses

**Status Code**: 200

> A JSON document, conforming to the alert schema, representing requested alert.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Alert&gt;</code>](#schemasAlert)

* * *

**Status Code**: 404

> The alert does not exist.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| message | <code>String</code> | false | false |  |

**Example**:

```json
{
  "message": "no data"
}
```

* * *

### DELETE /alerts/{alert_id} 

> Deletes an existing alert, stopping it, if necessary.

**Summary**: Delete Alert

#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| alert_id | <code>String</code> | true | false | The UUID for the alert |

#### Responses

**Status Code**: 200

> A JSON document, conforming to the alert schema, representing the deleted alert.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Alert&gt;</code>](#schemasAlert)

* * *

**Status Code**: 404

> The alert does not exist.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| message | <code>String</code> | false | false |  |

**Example**:

```json
{
  "message": "no data"
}
```

* * *

### PUT /alerts/{alert_id} 

> Starts or stops an alert.

**Summary**: Start/Stop Alert.

#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| alert_id | <code>String</code> | true | false | The UUID for the alert |

#### Request Body
    
**Content Type**: application/json

**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| alert_id | <code>String</code> | false | false |  |
| alert_state | <code>String</code> | false | false |  |

**Example**:

```json
{
  "alert_id": "6bc32e9d-50ba-4f26-a633-a3cb3884b504",
  "alert_state": "Starting"
}
```

#### Responses

**Status Code**: 200

> A JSON document, conforming to the alert schema. The response will not be returned until the alert has started (or stopped).

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Alert&gt;</code>](#schemasAlert)

* * *

**Status Code**: 404

> The alert does not exist.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| message | <code>String</code> | false | false |  |

**Example**:

```json
{
  "message": "no data"
}
```

* * *

**Status Code**: 500

> The alert cannot be started (e.g. you are attempting to start an alert that has already been started).

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| message | <code>String</code> | false | false |  |

**Example**:

```json
{
  "message": "string"
}
```

* * *

### GET /alerts/users/{alert_system}/{user_id} 

> Retrieves all alerts for a single user.

**Summary**: Retrieve Alerts For User.

#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| user_id | <code>String</code> | true | false | The unique identifier of the user (in the :alert_system) |
| alert_system | <code>String</code> | true | false | The name of the user's system (e.g. "barchart.com" or "grains.com") |

#### Responses

**Status Code**: 200

> A JSON document, containing an array of alert objects.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Alert&gt;</code>](#schemasAlert)

* * *

**Status Code**: 500

> A JSON document, containing an error.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| message | <code>String</code> | false | false |  |

**Example**:

```json
{
  "message": "string"
}
```

* * *

### PUT /alerts/users/{alert_system}/{user_id} 

> Starts or stops an zero to many alerts for a single user.

**Summary**: Start/Stop Multiple Alerts For User

#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| user_id | <code>String</code> | true | false | The unique identifier of the user (in the :alert_system) |
| alert_system | <code>String</code> | true | false | The name of the user's system (e.g. "barchart.com" or "grains.com") |

#### Request Body
    
**Content Type**: application/json

**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| alert_id | <code>String</code> | false | false |  |
| alert_state | <code>String</code> | false | false |  |
| user_id | <code>String</code> | false | false |  |

**Example**:

```json
{
  "alert_id": "6bc32e9d-50ba-4f26-a633-a3cb3884b504",
  "alert_state": "Starting",
  "user_id": "6bc32e9d-50ba-4f26-a633-a3cb3884b504"
}
```

#### Responses

**Status Code**: 200

> A JSON document, containing an array of alert objects.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Alert&gt;</code>](#schemasAlert)

* * *

**Status Code**: 500

> A JSON document, containing an error.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| message | <code>String</code> | false | false |  |

**Example**:

```json
{
  "message": "string"
}
```

* * *

### GET /alerts/users/{alert_system}/{user_id}/{alert_system_key} 

> Retrieves all alerts, for a single user, which have a specific &quot;alert_system_key&quot; property value.

**Summary**: Retrieve Alerts By Remote System Key

#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| user_id | <code>String</code> | true | false | The unique identifier of the user (in the :alert_system) |
| alert_system | <code>String</code> | true | false | The name of the user's system (e.g. "barchart.com" or "grains.com") |
| alert_system_key | <code>String</code> | true | false | The key (specified by the remote system at creation) to match |

#### Responses

**Status Code**: 200

> A JSON document, containing an array of alert objects.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Alert&gt;</code>](#schemasAlert)

* * *

**Status Code**: 500

> A JSON document, containing an error.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| message | <code>String</code> | false | false |  |

**Example**:

```json
{
  "message": "string"
}
```

* * *

### GET /alert/market/configuration/{alert_system}/{user_id} 

> Retrieves default publishing information for a single user.

**Summary**: Retrieve Market Data Configuration For User

#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| alert_system | <code>String</code> | true | false | The name of the user's system (e.g. "barchart.com" or "grains.com") |
| user_id | <code>String</code> | true | false | The unique identifier of the user (in the :alert_system) |

#### Responses

**Status Code**: 200

> A JSON document that conforms to the market-data-configuration schema.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| alert_system | <code>String</code> | false | false |  |
| user_id | <code>String</code> | false | false |  |
| configuration_id | <code>String</code> | false | false |  |
| market_data_id | <code>String</code> | false | false |  |

**Example**:

```json
{
  "alert_system": "barchart.com",
  "user_id": "string",
  "configuration_id": "6bc32e9d-50ba-4f26-a633-a3cb3884b504",
  "market_data_id": "bri"
}
```

* * *

### GET /alert/targets 

> Retrieves a list of valid targets.

**Summary**: Retrieve Targets

#### Responses

**Status Code**: 200

> A JSON document containing an array of targets, conforming to the target schema.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Target&gt;</code>](#schemasTarget)

* * *

### GET /alert/targets/properties 

> Retrieves a list of valid properties (of targets).

**Summary**: Retrieve Properties

#### Responses

**Status Code**: 200

> A JSON document containing an array of properties, conforming to the property schema.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Property&gt;</code>](#schemasProperty)

* * *

### GET /alert/operators 

> Retrieves a list of operators (for use in conjunction with properties).

**Summary**: Retrieve Operators

#### Responses

**Status Code**: 200

> A JSON document containing an array of operators, conforming to the operator schema.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Operator&gt;</code>](#schemasOperator)

* * *

### GET /alert/modifiers 

> Retrieves a list of modifiers (for use in conjunction with properties).

**Summary**: Retrieve Modifiers

#### Responses

**Status Code**: 200

> A JSON document containing an array of modifiers, conforming to the modifier schema.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| modifier_id | <code>String</code> | false | false |  |
| name | <code>String</code> | false | false |  |
| display | <code>String</code> | false | false |  |
| display_short | <code>String</code> | false | false |  |
| type | <code>String</code> | false | false |  |
| format | <code>String</code> | false | true |  |
| operand_index | <code>Integer</code> | false | false |  |
| target_types | <code>Array</code> | false | false |  |
| target_types[i] | <code>String</code> | false | false |  |

**Example**:

```json
{
  "modifier_id": 3,
  "name": "convert-price-currency",
  "display": "convert price currency",
  "display_short": "convert price currency",
  "type": "string",
  "format": "0.00%",
  "operand_index": 0,
  "target_types": [
    "number",
    "percent"
  ]
}
```

* * *

### GET /alert/publishers 

> Retrieves a list of publishers.

**Summary**: Retrieve Publisher Types

#### Responses

**Status Code**: 200

> A JSON document containing an array of publisher types, conforming to the publisher-type schema.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| publisher_type_id | <code>Integer</code> | false | false |  |
| transport | <code>String</code> | false | false |  |
| provider | <code>String</code> | false | false |  |

**Example**:

```json
{
  "publisher_type_id": 1,
  "transport": "sms",
  "provider": "twilio"
}
```

* * *

### GET /alert/publishers/default/{alert_system}/{user_id} 

> Retrieves default publishing information for a single user.

**Summary**: Retrieve Publisher Type Defaults For User

#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| alert_system | <code>String</code> | true | false | The name of the user's system (e.g. "barchart.com" or "grains.com") |
| user_id | <code>String</code> | true | false | The unique identifier of the user (in the :alert_system) |

#### Responses

**Status Code**: 200

> A JSON document, containing an array of publisher-type-default objects.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| publisher_type_id | <code>Integer</code> | false | false |  |
| transport | <code>String</code> | false | false |  |
| provider | <code>String</code> | false | false |  |
| user_id | <code>String</code> | false | false |  |
| alert_system | <code>String</code> | false | false |  |
| default_recipient | <code>String</code> | false | false |  |
| default_recipient_hmac | <code>String</code> | false | false |  |
| allow_window_timezone | <code>String</code> | false | false |  |
| allow_window_start | <code>String</code> | false | true |  |
| allow_window_end | <code>String</code> | false | true |  |
| active_alert_types | <code>Array</code> | false | false |  |
| active_alert_types[i] | <code>String</code> | false | false |  |

**Example**:

```json
{
  "publisher_type_id": 1,
  "transport": "sms",
  "provider": "twilio",
  "user_id": "string",
  "alert_system": "barchart.com",
  "default_recipient": "2489539701",
  "default_recipient_hmac": "string",
  "allow_window_timezone": "America/Chicago",
  "allow_window_start": "string",
  "allow_window_end": "string",
  "active_alert_types": [
    "price"
  ]
}
```

* * *

### PUT /alert/publishers/default/{alert_system}/{user_id}/{publisher_type_id} 

> Updates default publishing information for a single user.

**Summary**: Save Publisher Type Defaults For User

#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| user_id | <code>String</code> | true | false | The unique identifier of the user (in the :alert_system) |
| alert_system | <code>String</code> | true | false | The name of the user's system (e.g. "barchart.com" or "grains.com") |
| publisher_type_id | <code>Integer</code> | true | false | The publisher type to change. |

#### Request Body
    
**Content Type**: application/json

**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| publisher_type_id | <code>Integer</code> | false | false |  |
| user_id | <code>String</code> | false | false |  |
| alert_system | <code>String</code> | false | false |  |
| default_recipient | <code>String</code> | false | false |  |
| allow_window_timezone | <code>String</code> | false | false |  |
| allow_window_start | <code>String</code> | false | true |  |
| allow_window_end | <code>String</code> | false | true |  |
| active_alert_types | <code>Array</code> | false | false |  |
| active_alert_types[i] | <code>String</code> | false | false |  |

**Example**:

```json
{
  "publisher_type_id": 1,
  "user_id": "string",
  "alert_system": "barchart.com",
  "default_recipient": "2489539701",
  "allow_window_timezone": "America/Chicago",
  "allow_window_start": "string",
  "allow_window_end": "string",
  "active_alert_types": [
    "price"
  ]
}
```

#### Responses

**Status Code**: 200

> A JSON document, containing the updated publisher-type-default

**Content Type**: <code>application/json</code>

**Response Type:** <code>Array&lt;Object&gt;</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| publisher_type_id | <code>Integer</code> | false | false |  |
| transport | <code>String</code> | false | false |  |
| provider | <code>String</code> | false | false |  |
| user_id | <code>String</code> | false | false |  |
| alert_system | <code>String</code> | false | false |  |
| default_recipient | <code>String</code> | false | false |  |
| default_recipient_hmac | <code>String</code> | false | false |  |
| allow_window_timezone | <code>String</code> | false | false |  |
| allow_window_start | <code>String</code> | false | true |  |
| allow_window_end | <code>String</code> | false | true |  |
| active_alert_types | <code>Array</code> | false | false |  |
| active_alert_types[i] | <code>String</code> | false | false |  |

**Example**:

```json
[
  {
    "publisher_type_id": 1,
    "transport": "sms",
    "provider": "twilio",
    "user_id": "string",
    "alert_system": "barchart.com",
    "default_recipient": "2489539701",
    "default_recipient_hmac": "string",
    "allow_window_timezone": "America/Chicago",
    "allow_window_start": "string",
    "allow_window_end": "string",
    "active_alert_types": [
      "price"
    ]
  }
]
```

* * *

