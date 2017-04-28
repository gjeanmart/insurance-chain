// route/insurance_route.js

'use strict';


// Import
var rp          = require('request-promise');
var logger      = require('../common/log.js');
var bodyParser  = require('body-parser');
var ethereum    = require('../common/ethereum.js');
var contract    = require('../common/contract.js');

module.exports = function(app, stripe) {
var a = null;
    
    app.post('/api/v1/admin/buy', (req, res) => {
        
        logger.debug("admin/buy called");
        
        var noTokens = req.body.noTokens;
        logger.debug("noTokens=", noTokens);
        
        contract.insToken.buy(noTokens).then(function(result) {
           logger.debug("result", result); 
           res.json({tx: result});
        }).catch(function(error) {
            logger.debug("error=", error);
            res.status(500).json(error);
        });;
    });


    /**
     *
     */
    app.post('/api/v1/proposal', (req, res) => {
        logger.debug("proposal called");
        
        var flight = req.body.flight;
        logger.debug("flight=", flight);
        
        // Process payment 
        var payment = req.body.payment;
        logger.debug("payment=", payment);
        
        // Check flight information
        rp({
            method  : "GET",
            uri     : "http://localhost:8080/api/v1/flight/" + flight.departureDate + "/" + flight.flightNo,
        }).then(function(result) {
            logger.debug("result=", result);
/*
            // Process payment
            return stripe.charges.create({
              amount        : 100,
              currency      : "gbp",
              description   : "",
              source        : payment.token,
            });
            
        }).then(function(charge) {
            logger.debug("charge=", charge);
*/
            logger.debug("ethereum=", ethereum);
            return ethereum.getAddresses();
   
        }).then(function(address) {
            logger.debug("address=", address);
            a = address[0];
            return ethereum.getBalance(address[0]);
            
        }).then(function(balance) {
            logger.debug("balance=", balance);

            res.send({
                address: a,
                balance: balance
            });
            
        }).catch(function(error) {
            logger.debug("error=", error);
            
            if(error.type === "StripeInvalidRequestError") {
                res.status(500);
                res.send({
                    code: "PAYMENT",
                    message: error.message
                });
                
            } else if(error.type === "FlightAPI") {
                res.status(500);
                res.send({
                    code: "FLIGHT_API",
                    message: error.message
                });
                
            } else {
                res.status(500);
                res.send({
                    code: "UNKNOW",
                    message: "Unknow error. Please contact your administrator"
                }); 
            }
        });
        
  

        // Create policy
        
        
        // Send notification
    });
};