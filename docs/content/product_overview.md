## Purpose

**This SDK connects your applications to the Barchart Alerting Service.** 

Here's how it works:

* You _define_ an alert with one or more conditions, for example:
	* Apple common stock trades over $500.00 per share
	* Apple common stock achieves a new 30-day high
	* A news article, mentioning Apple common stock, is released
* You _choose_ the notification mechanism(s):
	* Receive notifications via webhook (and you handle the last mile)
	* Receive notifications via email
	* Receive notifications via SMS messages
	* Receive notifications via push to your mobile applications
* You _start_ the alert:
	* Barchart's Alerting Service will continuously monitor your conditions
	* Once your conditions are met, notifications are dispatched
* The _Barchart Alerting Service_ continuously monitors alert conditions.
* The _Barchart Alerting Service_ dispatches notifications when alert conditions are met.

## Sample Notifications

| SMS  | Email |
| -------- | --------|
| ![SMS Screen Capture Image](images/sms.jpg) | ![Email Screen Capture Image](images/email.jpg)  |

## Data Feed Catalog

Barchart offers an exhaustive array of real-time **market data** feeds from exchanges around the world — consult our [website](https://www.barchart.com/solutions/data/market) for specifics. Furthermore, Barchart offers supplemental/derived data feeds like news articles, technical analysis, and opinions. The Barchart Alerting Service can monitor any of these feeds.

Refer to [Appendix: Data Feed Glossary](/content/appendices/data_feed_glossary) for a complete listing of feed attributes which can be monitored. Here are some examples:

* Price Data
	* Trades and Quotes
	* New Highs and Lows
	* Prior Day Prices and Gaps
* Technical Analysis Data
	* Support and Resistance
	* Moving averages
	* Stochastic indicators
* News Feeds
	* Associated Press
	* Comtex News Network
	* PR Newswire
* Commodity Cash Bid Data
	* Grain Basis Prices
	* Grain Cash Prices

## Supported Environments

This SDK provides a convenient way to interact with the Barchart Alerting Service. We recommend using it in JavaScript environments.

#### Web Browsers

This SDK can be distributed as part of your browser-based applications. The source code is written in [ES2018](https://en.wikipedia.org/wiki/ECMAScript#9th_Edition_%E2%80%93_ECMAScript_2018). Consequently, transpilation is recommended before distribution.

#### Node.js

This SDK is compatible with Node.js.

#### Direct Access

The Barchart Alerting Service implements a REST interface over HTTPS, allowing you to bypass this SDK entirely. Refer to the [API Reference](/content/api_reference), which contains [OpenAPI](https://www.openapis.org/) specification, for more information.

#### Other Platforms

If you require an SDK for another platform, please contact us — solutions@barchart.com or (866) 333-7587.

## User Privacy

**Privacy is important to Barchart.** 

We don't want to collect or transmit any personally identifiable information. Avoid sending sensitive information to Barchart, as follows:

* Use meaningless identifiers for your users — as long as they are unique.
* Use cryptographic tokens which allow Barchart to verify user identity. Passwords are not necessary.
* Contact information can be withheld, if your systems handle the "last mile" of user notification.