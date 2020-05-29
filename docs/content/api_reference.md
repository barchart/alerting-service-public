# API Reference

## Barchart Alert Service 4.0.1 {docsify-ignore}
    
> Define and manage alert conditions and notifications using Barchart&#x27;s REST-ful web service

## OpenAPI Definition {docsify-ignore}

[Download](static/openapi.yaml)

## Contents {docsify-ignore}

* [Servers](#Servers)
* [Components](#Components)
* [Paths](#Paths)
* [Try Me](#tryme)

## Servers {docsify-ignore}

* [https://alerts-management-demo.barchart.com](https://alerts-management-demo.barchart.com)  - Demo (evaluation and testing only)
* [https://alerts-management.barchart-prod.com](https://alerts-management.barchart-prod.com)  - Production

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
* [GET /alert/market/configuration/{alert_system}/{user_id}](/content/api/paths?id=get-alertmarketconfigurationalert_systemuser_id)
* [GET /alert/targets](/content/api/paths?id=get-alerttargets)
* [GET /alert/targets/properties](/content/api/paths?id=get-alerttargetsproperties)
* [GET /alert/operators](/content/api/paths?id=get-alertoperators)
* [GET /alert/modifiers](/content/api/paths?id=get-alertmodifiers)
* [GET /alert/publishers](/content/api/paths?id=get-alertpublishers)
* [GET /alert/publishers/default/{alert_system}/{user_id}](/content/api/paths?id=get-alertpublishersdefaultalert_systemuser_id)
* [PUT /alert/publishers/default/{alert_system}/{user_id}/{publisher_type_id}](/content/api/paths?id=put-alertpublishersdefaultalert_systemuser_idpublisher_type_id)

## Try Me :id=tryme {docsify-ignore}

**Try Me** page allows anyone to interact with the API’s resources without having any of the implementation logic in place. It’s automatically generated from a OpenAPI Specification, with the visual documentation making it easy for back end implementation and client side consumption.

> You can test the API by following link: [Try Me](content/api/try)
