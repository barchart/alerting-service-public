# API Reference

## Barchart Alerting Service 4.19.0 {docsify-ignore}
    
> Define and manage alert conditions and notifications using Barchart&#x27;s REST-ful web service

## OpenAPI Definition {docsify-ignore}

[Download](static/openapi.yaml)

## Contents {docsify-ignore}

* [Servers](#Servers)
* [Components](#Components)
* [Paths](#Paths)

## Servers {docsify-ignore}

* [https://alerts-management-demo.barchart.com](https://alerts-management-demo.barchart.com)  - Demo (evaluation and testing only)
* [https://alerts-management-prod.barchart.com](https://alerts-management-prod.barchart.com)  - Production

## Components {docsify-ignore}

### Responses 

* [Unauthorized](/content/api/components?id=responsesUnauthorized)

### Schemas 

* [Alert](/content/api/components?id=schemasAlert)
* [Publisher](/content/api/components?id=schemasPublisher)
* [Operator](/content/api/components?id=schemasOperator)
* [Condition](/content/api/components?id=schemasCondition)
* [Property](/content/api/components?id=schemasProperty)
* [Target](/content/api/components?id=schemasTarget)
* [Template](/content/api/components?id=schemasTemplate)
* [TemplateCondition](/content/api/components?id=schemasTemplateCondition)
* [Trigger](/content/api/components?id=schemasTrigger)

### Security 

* [JWT](/content/api/components?id=securityJWT)


## Paths {docsify-ignore}

* [GET /server/version](/content/api/paths?id=get-serverversion)
* [POST /alerts](/content/api/paths?id=post-alerts)
* [GET /alerts/{alert_id}](/content/api/paths?id=get-alertsalert_id)
* [DELETE /alerts/{alert_id}](/content/api/paths?id=delete-alertsalert_id)
* [PUT /alerts/{alert_id}](/content/api/paths?id=put-alertsalert_id)
* [GET /alerts/users/{alert_system}/{user_id}](/content/api/paths?id=get-alertsusersalert_systemuser_id)
* [PUT /alerts/users/{alert_system}/{user_id}](/content/api/paths?id=put-alertsusersalert_systemuser_id)
* [GET /alerts/users/{alert_system}/{user_id}/{alert_system_key}](/content/api/paths?id=get-alertsusersalert_systemuser_idalert_system_key)
* [GET /templates/users/{alert_system}/{user_id}](/content/api/paths?id=get-templatesusersalert_systemuser_id)
* [DELETE /templates/{template_id}](/content/api/paths?id=delete-templatestemplate_id)
* [POST /templates](/content/api/paths?id=post-templates)
* [GET /alert/market/configuration/{alert_system}/{user_id}](/content/api/paths?id=get-alertmarketconfigurationalert_systemuser_id)
* [GET /alert/targets](/content/api/paths?id=get-alerttargets)
* [GET /alert/targets/properties](/content/api/paths?id=get-alerttargetsproperties)
* [GET /alert/operators](/content/api/paths?id=get-alertoperators)
* [GET /alert/modifiers](/content/api/paths?id=get-alertmodifiers)
* [GET /alert/publishers](/content/api/paths?id=get-alertpublishers)
* [GET /alert/publishers/default/{alert_system}/{user_id}](/content/api/paths?id=get-alertpublishersdefaultalert_systemuser_id)
* [PUT /alert/publishers/default/{alert_system}/{user_id}/{publisher_type_id}](/content/api/paths?id=put-alertpublishersdefaultalert_systemuser_idpublisher_type_id)
* [GET /alert/triggers/users/{alert_system}/{user_id}](/content/api/paths?id=get-alerttriggersusersalert_systemuser_id)
* [PUT /alert/triggers/users/{alert_system}/{user_id}](/content/api/paths?id=put-alerttriggersusersalert_systemuser_id)
* [PUT /alert/triggers/{alert_id}/{trigger_date}](/content/api/paths?id=put-alerttriggersalert_idtrigger_date)
