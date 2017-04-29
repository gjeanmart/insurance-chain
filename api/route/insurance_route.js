// route/insurance_route.js

'use strict';


// Import
var rp          = require('request-promise');
var logger      = require('../common/log.js');
var bodyParser  = require('body-parser');
var ethereum    = require('../common/ethereum.js');
var contract    = require('../common/contract.js');

module.exports = function(app, stripe) {
    
    app.get('/api/v1/admin/token', (req, res) => {
        
        logger.debug("admin/token called");
        
        var insTokenAddress = null;
        var balance = null;
        
        contract.insuranceHub.getHubInfo().then(function(result) {
           logger.debug("contract.insuranceHub.getHubInfo() =>", result);
           insTokenAddress = result;
           
           return contract.insToken.balanceOf(ethereum.address, insTokenAddress);
           
        }).then(function(result) {
           logger.debug("contract.insToken.balanceOf(address="+ethereum.address+", insTokenAddress="+insTokenAddress+") =>", result); 
           balance = Number(result);
           
           res.json({
               balance: result
           });
           
        }).catch(function(error) {
            logger.debug("error=", error);
            res.status(500).json(error);
        });
    });
    
    app.get('/api/v1/admin/policies', (req, res) => {
        
        logger.debug("admin/policies called");
        
        var flightAssureProductAddress = null;
        var balance = null;
        
        contract.insuranceHub.getProductsList().then(function(result) {
           logger.debug("contract.insuranceHub.getProductsList() =>", result);
           flightAssureProductAddress = result[0].address;
           
           return contract.FlightAssureProduct.getPoliciesList(flightAssureProductAddress);
           
        }).then(function(result) {
           logger.debug("contract.FlightAssureProduct.getPoliciesList =>", result); 

           res.json({
               polcies: result
           });
           
        }).catch(function(error) {
            logger.debug("error=", error);
            res.status(500).json(error);
        });
    });
    
    app.post('/api/v1/admin/token', (req, res) => {
        
        logger.debug("admin/token called");
        
        var insTokenAddress = null;
        var transaction = null;
        var balance = null;
        
        var noTokens = req.body.noTokens;
        logger.debug("noTokens=", noTokens);
        
        contract.insuranceHub.getHubInfo().then(function(result) {
           logger.debug("contract.insuranceHub.getHubInfo() =>", result);
           insTokenAddress = result;
           
           return contract.insToken.buy(noTokens, insTokenAddress);

        }).then(function(result) {
           logger.debug("contract.insToken.buy(noTokens="+noTokens+", insTokenAddress="+insTokenAddress+") =>", result); 
           transaction = result;
           
           return contract.insToken.balanceOf(ethereum.address, insTokenAddress);
           
        }).then(function(result) {
           logger.debug("contract.insToken.balanceOf(address="+ethereum.address+", insTokenAddress="+insTokenAddress+") =>", result); 
           balance = Number(result);
           
           res.json({
               address: ethereum.address,
               transaction: transaction,
               balance: result
           });
           
        }).catch(function(error) {
            logger.debug("error=", error);
            res.status(500).json(error);
        });
    });


    /**
     *
     */
    app.post('/api/v1/proposal', (req, res) => {
        logger.debug("proposal called");
        
        var insTokenAddress = null;
        var flightAssureProductAddress = null;
        
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
            logger.debug("http://localhost:8080/api/v1/flight/" + flight.departureDate + "/" + flight.flightNo + "=", result);
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
            return contract.insuranceHub.getProductsList();
   
        }).then(function(result) {
            logger.debug("contract.insuranceHub.getProductsList()=", result);
            flightAssureProductAddress = result[0].address;
            
            return contract.insuranceHub.getHubInfo();
            
        }).then(function(result) {
            
           logger.debug("contract.insuranceHub.getHubInfo() =>", result);
           insTokenAddress = result;
           
           return contract.insToken.approve(flightAssureProductAddress, 1, insTokenAddress);
            
            
        }).then(function(result) {
           logger.debug("contract.insToken.approve() =>", result);

           return contract.insToken.allowance(ethereum.address, flightAssureProductAddress, insTokenAddress);
            
        }).then(function(result) {
           logger.debug("contract.insToken.allowance() =>", result);

           return contract.FlightAssureProduct.createProposal(ethereum.address, ethereum.address,((new Date()).getTime()/1000), flight.departureDate, flight.flightNo, flightAssureProductAddress);
            
        }).then(function(result) {
           logger.debug("contract.FlightAssureProduct.createProposal =>", result);

            res.send({
                result: result
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