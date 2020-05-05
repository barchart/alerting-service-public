## Purpose

**This SDK enables your JavaScript applications to setup alert notifications based on [Barchart's](https://www.barchart.com/solutions/) streaming data sources.**

Here's how it works:

* You choose notification mechanism(s):
	* Receive notifications via email
	* Receive notifications via SMS messages
	* Receive notifications to your web service, via HTTP POST
	* Receive push notifications to your mobile applications (coming soon)
* You define an alert:
	* Add at least one conditional provision, for example:
		* Apple common stock trades over $500.00 per share
		* Apple common stock achieves a new 30 high
		* A news article, mentioning Apple common stock, was just published
		* Thousands more possibilities
* Start your alert:
	* While active, Barchart's Alert Service will continuously monitor your alert's conditions
	* Once your alert's conditions have been met, you will be notified.

## Streaming Data Catalog

Any data which is available within the Barchart ecosystem can be used to build alert conditions.

Barchart offers an exhaustive array of market data for multiple asset classes from exchanges around the world. Consult our website for more information:

* [Barchart Market Data](https://www.barchart.com/solutions/data/market)

Here are some examples:

* Market Data (real-time or delayed)
	* Trades, Quotes, and Volume
	* New Highs and Lows
	* Prior Day Prices and Gaps
	* More...
* Technical Analysis Data
	* Support and Resistance
	* Moving averages
	* Stochastic indicators
	* More...
* News Feeds
	* Associated Press
	* Comtex News Network
	* PR Newwire
	* More...
* Commodity Cash Bid Data
	* Grain Basis Prices
	* Grain Cash Prices
	* More...

## Supported Environments

This SDK provides a convenient way to interact with the Barchart Alert Service. We recommend using the SDK in JavaScript environments; however it's not necessary -- as described in the [Other](#other) section (below).

#### Web Browsers

This SDK can be distributed as part of your browser-based applications. The source code is written in ES6. Consequently, transpilation (with appropriate polyfills) is recommended before distribution.

#### Node.js

Node.js is fully-supported.

#### Other

The Barchart Alert Service implements an HTTP interface. You may choose to interact with the HTTP interface directly. An [OpenAPI](https://www.openapis.org/) specification of the HTTP interface can be found in the [API Reference](/content/api) section.



