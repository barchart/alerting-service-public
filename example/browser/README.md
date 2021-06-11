# @barchart/alerts-client-js/example/browser

A simple reference application to demonstrate the capabilities of the Barchart Alerting Service using this SDK.

### Running the Application

Two options exist:

* Load the `example.html` page in the `browser` folder in a web browser.
* Load the hosted version of the page at https://examples.aws.barchart.com/alerts-client-js/example.html.

### Architecture

#### Source Files

This is a single-page browser application written with [Knockout.js](https://knockoutjs.com/), consisting of three source files:

* `index.html` — The initial HTML page along with [Knockout.js](https://knockoutjs.com/) templates.
* `js/example.js` — JavaScript source which includes [Knockout.js](https://knockoutjs.com/) observables, data models, and event-handling functions.
* `example.css` — A simple stylesheet.

#### Build

Generate the JavaScript bundle (referenced by `index.html`) as follows:

```shell
npm install
gulp build-example-bundle
```
