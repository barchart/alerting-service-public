# Components

## Responses

### Unauthorized :id=responsesunauthorized
> The unauthorized access.

**Content Type**: <code>application/json</code>

**Response Type:** <code><code>Object</code></code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| message | <code>String</code> | false | false |  |

**Example**:

```json
{
  "message": "unauthorized"
}
```

* * *

## Schemas

### Alert :id=schemasalert
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
| create_date | <code>String</code> | false | false |  |
| last_trigger_date | <code>String</code> | false | true |  |
| last_start_date | <code>String</code> | false | true |  |
| conditions | [<code>Array&lt;Condition&gt;</code>](#schemasCondition) | false | false |  |
| publishers | [<code>Array&lt;Publisher&gt;</code>](#schemasPublisher) | false | false |  |
| tracking_server_id | <code>Integer</code> | false | true |  |
| schedules | <code>Array</code> | false | false |  |
| effectivePublishers | [<code>Array&lt;Publisher&gt;</code>](#schemasPublisher) | false | false |  |


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

### Publisher :id=schemaspublisher
**Type**: <code>Object</code>

>A &quot;publisher&quot; defines the rules for notification once an alert has been triggered. An alert can have multiple publishers.

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| publisher_id | <code>String</code> | false | false |  |
| use_default_recipient | <code>Boolean</code> | false | false |  |
| recipient | <code>String</code> | false | false |  |
| format | <code>String</code> | false | false |  |
| timing | <code>Object</code> | false | false |  |
| timing.timezon | <code>String</code> | false | false |  |
| type | <code>Object</code> | false | false |  |
| type.publisher_type_id | <code>Integer</code> | false | false |  |
| type.transport | <code>String</code> | false | false |  |
| type.provider | <code>String</code> | false | false |  |


**Example**:

```json
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
```

* * *

### Operator :id=schemasoperator
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
| display | <code>Object</code> | false | false |  |
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

### Condition :id=schemascondition
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| condition_id | <code>String</code> | false | false |  |
| name | <code>String</code> | false | false |  |
| operator | [<code>Operator</code>](#schemasOperator) | false | false |  |
| property | [<code>Property</code>](#schemasProperty) | false | false |  |
| templates | <code>Object</code> | false | false |  |
| templates.condition | <code>String</code> | false | false |  |
| templates.trigger | <code>Object</code> | false | false |  |
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

### Property :id=schemasproperty
**Type**: <code>Object</code>

>A &quot;property&quot; refers to an attribute of a target. The value of a &quot;property&quot; can be checked using an &quot;operator&quot; object.

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
| target | [<code>Target</code>](#schemasTarget) | false | false |  |
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

### Target :id=schemastarget
**Type**: <code>Object</code>

>A &quot;target&quot; refers to a type of object which can be observed. Each target has one or more properties.

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| description | <code>String</code> | true | false |  |
| display | <code>String</code> | false | true |  |
| identifier | <code>String</code> | false | false |  |
| identifier_description | <code>String</code> | true | false |  |
| qualifier_descriptions | <code>Array</code> | false | false |  |
| qualifier_descriptions[i] | <code>String</code> | false | false |  |
| kind | <code>String</code> | false | true |  |
| target_id | <code>Integer</code> | true | false |  |
| type | <code>String</code> | true | false |  |


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

### Template :id=schemastemplate
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| template_id | <code>String</code> | false | false |  |
| alert_system | <code>String</code> | false | false |  |
| user_id | <code>String</code> | false | false |  |
| name | <code>String</code> | false | false |  |
| create_date | <code>String</code> | false | false |  |
| conditions | [<code>Array&lt;Condition&gt;</code>](#schemasCondition) | false | false |  |


**Example**:

```json
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

### TemplateCondition :id=schemastemplatecondition
**Type**: <code>Object</code>

>A &quot;Condition&quot; without target.

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| template_condition_id | <code>String</code> | false | false |  |
| operator | [<code>Operator</code>](#schemasOperator) | false | false |  |
| property | [<code>Property</code>](#schemasProperty) | false | false |  |
| templates | <code>Object</code> | false | false |  |
| templates.condition | <code>String</code> | false | false |  |
| templates.trigger | <code>Object</code> | false | false |  |
| templates.trigger.email | <code>String</code> | false | false |  |
| templates.trigger.sms | <code>String</code> | false | false |  |


**Example**:

```json
{
  "template_condition_id": "38a3f731-0f87-40b7-a33b-dd9c792998e2",
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

### Trigger :id=schemastrigger
**Type**: <code>Object</code>

>An alert trigger status shows status of alert trigger.

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| alert_id | <code>String</code> | true | false |  |
| alert_name | <code>String</code> | true | false |  |
| alert_system | <code>String</code> | true | false |  |
| user_id | <code>String</code> | true | false |  |
| trigger_date | <code>String</code> | true | false |  |
| trigger_status | <code>String</code> | true | false |  |
| trigger_status_date | <code>String</code> | true | false |  |
| trigger_title | <code>String</code> | true | false |  |
| trigger_description | <code>String</code> | true | false |  |
| trigger_additional_data | <code>Object</code> | false | false |  |
| trigger_additional_data.type | <code>String</code> | false | false |  |
| trigger_additional_data.data | <code>Object</code> | false | false |  |
| trigger_additional_data.data.url | <code>String</code> | false | false |  |


**Example**:

```json
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

## Security

### JWT :id=securityjwt

>The JWT authorization

**Type**: http bearer

#### Headers
| Name | Format | Example |
| ---- | ------ | ------- |
| Authorization | JWT | Authorization: Bearer <code>&lt;Token&gt;</code> |

* * *


