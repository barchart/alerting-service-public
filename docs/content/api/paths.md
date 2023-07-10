# Paths

## GET /server/version 

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

## POST /alerts 

> Creates a new alert.

**Summary**: Create Alert.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Request Body

**Content Type**: application/json

**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| name | <code>String</code> | false | false |  |
| user_id | <code>String</code> | true | false |  |
| alert_behavior | <code>String</code> | false | false |  |
| alert_system | <code>String</code> | true | false |  |
| alert_type | <code>String</code> | false | false |  |
| user_notes | <code>String</code> | false | false |  |
| conditions | <code>Array&lt;object&gt;</code> | true | false |  |
| conditions[i].property | <code>Object</code> | false | false |  |
| conditions[i].property.property_id | <code>Integer</code> | false | false |  |
| conditions[i].property.target | <code>Object</code> | false | false |  |
| conditions[i].property.target.identifier | <code>String</code> | false | false |  |
| conditions[i].operator | <code>Object</code> | false | false |  |
| conditions[i].operator.operator_id | <code>Integer</code> | false | false |  |
| conditions[i].operator.operand | <code>String</code> | false | false |  |
| publishers | <code>Array&lt;object&gt;</code> | false | false |  |
| publishers[i].publisher_id | <code>String</code> | false | false |  |
| publishers[i].use_default_recipient | <code>Boolean</code> | false | false |  |
| publishers[i].recipient | <code>String</code> | false | false |  |
| publishers[i].format | <code>String</code> | false | false |  |
| publishers[i].type | <code>Object</code> | false | false |  |
| publishers[i].type.publisher_type_id | <code>Integer</code> | false | false |  |
| schedules | <code>Array</code> | false | false |  |

**Example**:

```json
{
  "name": "Buy TSLA",
  "user_id": "me",
  "alert_behavior": "terminate",
  "alert_system": "barchart.com",
  "alert_type": "price",
  "user_notes": "Time to buy Tesla Motors stock",
  "conditions": [
    {
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
    }
  ],
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

**Response Type:** [<code>Alert</code>](/content/api/components?id=schemasAlert)

**Example**:

```
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
      "format": "It is a good time to buy Tesla stock.",
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
      "format": "It is a good time to buy Tesla stock.",
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

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

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

## GET /alerts/{alert_id} 

> Retrieves an existing alert.

**Summary**: Retrieve Alert.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| alert_id | <code>String</code> | true | false | The UUID for the alert. |

#### Responses

**Status Code**: 200

> A JSON document, conforming to the alert schema, representing requested alert.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Alert</code>](/content/api/components?id=schemasAlert)

**Example**:

```
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
      "format": "It is a good time to buy Tesla stock.",
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
      "format": "It is a good time to buy Tesla stock.",
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

## DELETE /alerts/{alert_id} 

> Deletes an existing alert, stopping it, if necessary.

**Summary**: Delete Alert

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| alert_id | <code>String</code> | true | false | The UUID for the alert |

#### Responses

**Status Code**: 200

> A JSON document, conforming to the alert schema, representing the deleted alert.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Alert</code>](/content/api/components?id=schemasAlert)

**Example**:

```
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
      "format": "It is a good time to buy Tesla stock.",
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
      "format": "It is a good time to buy Tesla stock.",
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

**Status Code**: 500

> The alert does not exist.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| message | <code>String</code> | false | false |  |

**Example**:

```json
{
  "message": "Alert could not be deleted."
}
```

* * *

## PUT /alerts/{alert_id} 

> Starts or stops an alert.

**Summary**: Start/Stop Alert.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
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

**Response Type:** [<code>Alert</code>](/content/api/components?id=schemasAlert)

**Example**:

```
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
      "format": "It is a good time to buy Tesla stock.",
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
      "format": "It is a good time to buy Tesla stock.",
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

## GET /alerts/users/{alert_system}/{user_id} 

> Retrieves all alerts for a single user.

**Summary**: Retrieve Alerts For User.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| user_id | <code>String</code> | true | false | The unique identifier of the user (in the :alert_system) |
| alert_system | <code>String</code> | true | false | The name of the user's system (e.g. "barchart.com" or "grains.com") |

#### Responses

**Status Code**: 200

> A JSON document, containing an array of alert objects.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Alert&gt;</code>](/content/api/components?id=schemasAlert)

**Example**:

```
[
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
        "format": "It is a good time to buy Tesla stock.",
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
        "format": "It is a good time to buy Tesla stock.",
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
]
```

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

## PUT /alerts/users/{alert_system}/{user_id} 

> Starts or stops an zero to many alerts for a single user.

**Summary**: Start/Stop Multiple Alerts For User

**Security**: 
[JWT](/content/api/components?id=securityJWT)
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

**Response Type:** [<code>Array&lt;Alert&gt;</code>](/content/api/components?id=schemasAlert)

**Example**:

```
[
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
        "format": "It is a good time to buy Tesla stock.",
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
        "format": "It is a good time to buy Tesla stock.",
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
]
```

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

## GET /alerts/users/{alert_system}/{user_id}/{alert_system_key} 

> Retrieves all alerts, for a single user, which have a specific "alert_system_key" property value.

**Summary**: Retrieve Alerts By Remote System Key

**Security**: 
[JWT](/content/api/components?id=securityJWT)
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

**Response Type:** [<code>Array&lt;Alert&gt;</code>](/content/api/components?id=schemasAlert)

**Example**:

```
[
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
        "format": "It is a good time to buy Tesla stock.",
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
        "format": "It is a good time to buy Tesla stock.",
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
]
```

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

## GET /templates/users/{alert_system}/{user_id} 

> Retrieves all templates for a single user.

**Summary**: Retrieve Templates For User.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| user_id | <code>String</code> | true | false | The unique identifier of the user (in the :alert_system) |
| alert_system | <code>String</code> | true | false | The name of the user's system (e.g. "barchart.com" or "grains.com") |

#### Responses

**Status Code**: 200

> A JSON document, containing an array of template objects.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Template&gt;</code>](/content/api/components?id=schemasTemplate)

**Example**:

```
[
  {
    "template_id": "39b633bf-8993-491d-b544-bdc9deed60be",
    "alert_system": "string",
    "user_id": "barchart-test-user",
    "name": "Example template",
    "create_date": "1453673000873",
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
    ]
  }
]
```

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

## DELETE /templates/{template_id} 

> Deletes an existing template, stopping it, if necessary.

**Summary**: Delete Template

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| template_id | <code>String</code> | true | false | The UUID for the template |

#### Responses

**Status Code**: 200

> A JSON document, conforming to the alert schema, representing the deleted template.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Template</code>](/content/api/components?id=schemasTemplate)

**Example**:

```
{
  "template_id": "39b633bf-8993-491d-b544-bdc9deed60be",
  "alert_system": "string",
  "user_id": "barchart-test-user",
  "name": "Example template",
  "create_date": "1453673000873",
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
  ]
}
```

* * *

**Status Code**: 500

> The template does not exist.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| message | <code>String</code> | false | false |  |

**Example**:

```json
{
  "message": "Template could not be deleted."
}
```

* * *

## POST /templates 

> Creates a new template.

**Summary**: Create Template.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Request Body

**Content Type**: application/json

**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| name | <code>String</code> | false | false |  |
| user_id | <code>String</code> | true | false |  |
| alert_system | <code>String</code> | true | false |  |
| conditions | <code>Array&lt;object&gt;</code> | true | false |  |
| conditions[i].property | <code>Object</code> | false | false |  |
| conditions[i].property.property_id | <code>Integer</code> | false | false |  |
| conditions[i].operator | <code>Object</code> | false | false |  |
| conditions[i].operator.operator_id | <code>Integer</code> | false | false |  |
| conditions[i].operator.operand | <code>String</code> | false | false |  |

**Example**:

```json
{
  "name": "Example template",
  "user_id": "me",
  "alert_system": "barchart.com",
  "conditions": [
    {
      "property": {
        "property_id": 1
      },
      "operator": {
        "operator_id": 3,
        "operand": "99"
      }
    }
  ]
}
```

#### Responses

**Status Code**: 200

> A JSON document, conforming to the alert schema, representing the newly created template.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Alert</code>](/content/api/components?id=schemasAlert)

**Example**:

```
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
      "format": "It is a good time to buy Tesla stock.",
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
      "format": "It is a good time to buy Tesla stock.",
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

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 500

> The reason for the failure, which is typically caused by POST data that does not conform the the template schema.

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

## GET /alert/market/configuration/{alert_system}/{user_id} 

> Retrieves default publishing information for a single user.

**Summary**: Retrieve Market Data Configuration For User

**Security**: 
[JWT](/content/api/components?id=securityJWT)
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
| alert_system | <code>String</code> | true | false |  |
| user_id | <code>String</code> | true | false |  |
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

## GET /alert/targets 

> Retrieves a list of valid targets.

**Summary**: Retrieve Targets

#### Responses

**Status Code**: 200

> A JSON document containing an array of targets, conforming to the target schema.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Target&gt;</code>](/content/api/components?id=schemasTarget)

**Example**:

```
[
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
]
```

* * *

## GET /alert/targets/properties 

> Retrieves a list of valid properties (of targets).

**Summary**: Retrieve Properties

#### Responses

**Status Code**: 200

> A JSON document containing an array of properties, conforming to the property schema.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Property&gt;</code>](/content/api/components?id=schemasProperty)

**Example**:

```
[
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
]
```

* * *

## GET /alert/operators 

> Retrieves a list of operators (for use in conjunction with properties).

**Summary**: Retrieve Operators

#### Responses

**Status Code**: 200

> A JSON document containing an array of operators, conforming to the operator schema.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Operator</code>](/content/api/components?id=schemasOperator)

**Example**:

```
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

## GET /alert/modifiers 

> Retrieves a list of modifiers (for use in conjunction with properties).

**Summary**: Retrieve Modifiers

#### Responses

**Status Code**: 200

> A JSON document containing an array of modifiers, conforming to the modifier schema.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Array&lt;Object&gt;</code>
    
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
[
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
]
```

* * *

## GET /alert/publishers 

> Retrieves a list of publishers.

**Summary**: Retrieve Publisher Types

#### Responses

**Status Code**: 200

> A JSON document containing an array of publisher types, conforming to the publisher-type schema.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Array&lt;Object&gt;</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| publisher_type_id | <code>Integer</code> | false | false |  |
| transport | <code>String</code> | false | false |  |
| provider | <code>String</code> | false | false |  |

**Example**:

```json
[
  {
    "publisher_type_id": 1,
    "transport": "sms",
    "provider": "twilio"
  }
]
```

* * *

## GET /alert/publishers/default/{alert_system}/{user_id} 

> Retrieves default publishing information for a single user.

**Summary**: Retrieve Publisher Type Defaults For User

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| alert_system | <code>String</code> | true | false | The name of the user's system (e.g. "barchart.com" or "grains.com") |
| user_id | <code>String</code> | true | false | The unique identifier of the user (in the :alert_system) |

#### Responses

**Status Code**: 200

> A JSON document, containing an array of publisher-type-default objects.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Array&lt;Object&gt;</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| publisher_type_id | <code>Integer</code> | false | false |  |
| transport | <code>String</code> | false | false |  |
| provider | <code>String</code> | false | false |  |
| user_id | <code>String</code> | false | false |  |
| alert_system | <code>String</code> | false | false |  |
| default_recipient | <code>String</code> | false | true |  |
| default_recipient_hmac | <code>String</code> | false | true |  |
| allow_window_timezone | <code>String</code> | false | true |  |
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
    "default_recipient_hmac": "94b6239ae1d309a46163bb1e2f64213170ef201fb3f99ed1908caee899a34d2b",
    "allow_window_timezone": "America/Chicago",
    "allow_window_start": "06:00",
    "allow_window_end": "20:30",
    "active_alert_types": [
      "price"
    ]
  }
]
```

* * *

## PUT /alert/publishers/default/{alert_system}/{user_id}/{publisher_type_id} 

> Updates default publishing information for a single user.

**Summary**: Save Publisher Type Defaults For User

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| user_id | <code>String</code> | true | false | The unique identifier of the user (in the :alert_system) |
| alert_system | <code>String</code> | true | false | The name of the user's system (e.g. "barchart.com" or "grains.com") |
| publisher_type_id | <code>Integer</code> | true | false | The publisher type to change. |

#### Request Body

**Content Type**: application/json

**Type**: <code>Array&lt;Object&gt;</code>

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
[
  {
    "publisher_type_id": 1,
    "user_id": "me",
    "alert_system": "barchart.com",
    "default_recipient": "2489539701",
    "allow_window_timezone": "America/Chicago",
    "allow_window_start": "06:00",
    "allow_window_end": "20:30",
    "active_alert_types": [
      "price"
    ]
  }
]
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
| default_recipient_hmac | <code>String</code> | false | true |  |
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
    "default_recipient_hmac": "94b6239ae1d309a46163bb1e2f64213170ef201fb3f99ed1908caee899a34d2b",
    "allow_window_timezone": "America/Chicago",
    "allow_window_start": "06:00",
    "allow_window_end": "20:30",
    "active_alert_types": [
      "price"
    ]
  }
]
```

* * *

## GET /alert/triggers/users/{alert_system}/{user_id} 

> Retrieves a list of alerts trigger statuses.

**Summary**: Retrieve Alert Trigger Statuses

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| user_id | <code>String</code> | true | false | The user id. |
| alert_system | <code>String</code> | true | false | The alert system. |

#### Query Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| trigger_date | <code>String</code> | false | false | Gets alert trigger statuses after this date |
| trigger_status | <code>String</code> | false | false | Gets triggers with this status |

#### Responses

**Status Code**: 200

> A JSON document containing an array of alert trigger statuses

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Trigger&gt;</code>](/content/api/components?id=schemasTrigger)

**Example**:

```
[
  {
    "alert_id": "b78b30e3-8af5-48a5-8998-0989269ad9d0",
    "alert_name": "Last greater than 200.00",
    "alert_system": "barchart.com",
    "user_id": "barchart-test-user",
    "trigger_date": "1605874379489",
    "trigger_status": "Read",
    "trigger_status_date": "1606227202480",
    "trigger_title": "MSFT",
    "trigger_description": "MSFT traded for 214.86 at 10:34 ET on 12/14/20",
    "trigger_additional_data": {
      "type": "news",
      "data": {
        "url": "https://barchart.com/story/stocks/quotes/TSLA/news/1085745/view"
      }
    }
  }
]
```

* * *

## PUT /alert/triggers/users/{alert_system}/{user_id} 

> Updates specific alert trigger statuses.

**Summary**: Updates an alert trigger statuses

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| user_id | <code>String</code> | true | false | The user id. |
| alert_system | <code>String</code> | true | false | The alert system. |

#### Request Body

**Content Type**: application/json

**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| trigger_status | <code>String</code> | false | false |  |

**Example**:

```json
{
  "trigger_status": "Unread"
}
```

#### Responses

**Status Code**: 200

> A JSON document, conforming to the alert trigger status.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Trigger</code>](/content/api/components?id=schemasTrigger)

**Example**:

```
{
  "alert_id": "b78b30e3-8af5-48a5-8998-0989269ad9d0",
  "alert_name": "Last greater than 200.00",
  "alert_system": "barchart.com",
  "user_id": "barchart-test-user",
  "trigger_date": "1605874379489",
  "trigger_status": "Read",
  "trigger_status_date": "1606227202480",
  "trigger_title": "MSFT",
  "trigger_description": "MSFT traded for 214.86 at 10:34 ET on 12/14/20",
  "trigger_additional_data": {
    "type": "news",
    "data": {
      "url": "https://barchart.com/story/stocks/quotes/TSLA/news/1085745/view"
    }
  }
}
```

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

## PUT /alert/triggers/{alert_id}/{trigger_date} 

> Updates all alert trigger status for the user.

**Summary**: Updates an alert trigger statuses

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| alert_id | <code>String</code> | true | false | The alert id. |
| trigger_date | <code>String</code> | true | false | The alert system. |

#### Request Body

**Content Type**: application/json

**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| trigger_status | <code>String</code> | false | false |  |

**Example**:

```json
{
  "trigger_status": "Unread"
}
```

#### Responses

**Status Code**: 200

> A JSON document, conforming to the alert trigger statuses.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Trigger&gt;</code>](/content/api/components?id=schemasTrigger)

**Example**:

```
[
  {
    "alert_id": "b78b30e3-8af5-48a5-8998-0989269ad9d0",
    "alert_name": "Last greater than 200.00",
    "alert_system": "barchart.com",
    "user_id": "barchart-test-user",
    "trigger_date": "1605874379489",
    "trigger_status": "Read",
    "trigger_status_date": "1606227202480",
    "trigger_title": "MSFT",
    "trigger_description": "MSFT traded for 214.86 at 10:34 ET on 12/14/20",
    "trigger_additional_data": {
      "type": "news",
      "data": {
        "url": "https://barchart.com/story/stocks/quotes/TSLA/news/1085745/view"
      }
    }
  }
]
```

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

