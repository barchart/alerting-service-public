# API Reference

## Alert Management 3.1.37 {docsify-ignore}
    
> The Node.js server that exposes client interfaces creating, starting, and stopping alerts.

## OpenAPI Definition {docsify-ignore}

[Download](/static/openapi.yaml)

## Contents {docsify-ignore}

* [Servers](#Servers)
* [Components](#Components)
* [Paths](#Paths)

## Servers {docsify-ignore}

* [http://alerts-management-stage.barchart.com](http://alerts-management-stage.barchart.com)  - Stage server

## Components {docsify-ignore}

### Schemas 

* [Alert](/content/api/components?id=schemasAlert)
* [Publisher](/content/api/components?id=schemasPublisher)
* [Operator](/content/api/components?id=schemasOperator)
* [Condition](/content/api/components?id=schemasCondition)
* [Property](/content/api/components?id=schemasProperty)
* [Target](/content/api/components?id=schemasTarget)

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
