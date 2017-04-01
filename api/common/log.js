// common/log.js

'use strict';

var config      = require('config');
const winston   = require('winston');

var logger      = new (winston.Logger)({
    level           : config.get('logging.level'),
    transports      : [
        new (winston.transports.Console)()
    ]
});
module.exports = logger;