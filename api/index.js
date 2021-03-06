'use strict';

// Constant
const winston       = require('winston');

// Import
const config        = require('config');
var app             = require('express')();
var server          = require('http').createServer(app);
var bodyParser      = require('body-parser');
const Web3          = require('web3');
const TestRPC       = require("ethereumjs-testrpc");
const ethereum      = require('./common/ethereum.js');
const nodemailer    = require('nodemailer');

// ************************************************************
// Logging
var logger      = require('./common/log.js');

// ************************************************************
// Payment Stripe
var stripe      = require('stripe')(config.get('payment.stripe.secret_key'));


// ************************************************************
// Setup Web3
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.get('ethereum.node')));

ethereum.getAddresses().then(function(addresses) {
    logger.debug("addresses=", addresses);
    
    ethereum.address        = addresses[0];  
    web3.eth.defaultAccount = addresses[0];
    
    ethereum.getBalance(addresses[0]).then(function(balance) { 
        logger.debug("balance=", balance);
    });
    ethereum.getGasPrice().then(function(gasPrice) { 
        logger.debug("gasPrice=", gasPrice);
    });
}) ;

// ************************************************************
// Email
let transporter = nodemailer.createTransport({
    host    : config.get('email.smtp-host'),
    port    : config.get('email.smtp-port'),
    secure  : config.get('email.smtp-secure')
});


// ************************************************************
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

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
})); 
  
require('./route/account-management.js')(app);
require('./route/flight_route.js')(app);
require('./route/insurance_route.js')(app, stripe, transporter);


// Runtime
logger.info('Starting server ...');
server.listen(config.get('server.port'), function() {
    logger.info('Server is running!', { port: config.get('server.port') });
});