var _ = require('lodash');

var assert = require('./../common/lang/assert');
var AlertManager = require('./AlertManager');

module.exports = function() {
	'use strict';

	var SocketIOAlertManager = AlertManager.extend({
		init: function() {

		}
	});

	return SocketIOAlertManager;
}();