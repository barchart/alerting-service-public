# @barchart/alerts-client-js/example/browser

### Overview

A simple reference application which demonstrates the capabilities of the Barchart Alerting Service using this SDK.

### Running the Application

Two options exist:

* Load the `example.html` page in the `browser` folder in a web browser.
* Load the hosted version of the page at https://examples.aws.barchart.com/alerts-client-js/example.html.

### Application Architecture

#### Source Files

This is a single-page browser application written with [Knockout.js](https://knockoutjs.com/), consisting of three source files:

* `index.html` — Initial HTML page, including with [Knockout.js](https://knockoutjs.com/) templates with reactive data binding directives.
* `js/example.js` — JavaScript source, including [Knockout.js](https://knockoutjs.com/) observables, data models, and event-handling functions.
* `example.css` — Simple stylesheet.

#### Build

Generate the JavaScript bundle (referenced by `index.html`) as follows:

```shell
npm install
gulp build-example-bundle
```
