'use strict';

// Constant
const winston = require('winston');


// Import
var config  = require('config');
var app     = require('express')();
var server  = require('http').createServer(app);


// Logging
var logger = require('./common/log.js');


// API
app.use(function (req, res, next) {
  res.header("Content-Type",'application/json');
  next();
});
require('./route/hello_route.js')(app);
require('./route/flight_route.js')(app);



// Runtime
logger.info('Starting server ...');
server.listen(config.get('server.port'), function() {
    logger.info('Server is running!', { port: config.get('server.port') });
});