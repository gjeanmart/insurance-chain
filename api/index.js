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
    // Content Type
    res.header("Content-Type",'application/json');
    
    // CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    // Cache
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    
    next();
});
require('./route/hello_route.js')(app);
require('./route/flight_route.js')(app);



// Runtime
logger.info('Starting server ...');
server.listen(config.get('server.port'), function() {
    logger.info('Server is running!', { port: config.get('server.port') });
});