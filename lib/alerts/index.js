var AlertManager = require('./AlertManager');
var RestAlertManager = require('./RestAlertManager');
var SocketIOAlertManager = require('./SocketIOAlertManager');

module.exports = function() {
    'use strict';

    return {
        AlertManager: AlertManager,
		RestAlertManager: RestAlertManager,
		SocketIOAlertManager: SocketIOAlertManager
    };
}();