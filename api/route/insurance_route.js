// route/insurance_route.js

'use strict';


// Import
const config    = require('config');
var rp          = require('request-promise');
var logger      = require('../common/log.js');
var bodyParser  = require('body-parser');
var ethereum    = require('../common/ethereum.js');
var contract    = require('../common/contract.js');

module.exports = function(app, stripe, transporter) {
    
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

    app.get('/api/v1/admin/flightAssure', (req, res) => {
        
        logger.debug("/api/v1/admin/flightAssure/details called");
        
        var flightAssureProductAddress, details, policies;
        
        contract.insuranceHub.getProductsList().then(function(result) {
            logger.debug("contract.insuranceHub.getProductsList() =>", result);
            flightAssureProductAddress = result[0].address;
           
            return contract.FlightAssureProduct.getProductDetails(flightAssureProductAddress);
           
        }).then(function(result) {
            logger.debug("contract.FlightAssureProduct.getProductDetails =>", result); 
            details = result;
            
            return contract.FlightAssureProduct.getPoliciesList(flightAssureProductAddress);
           
        }).then(function(result) {
            logger.debug("contract.FlightAssureProduct.getProductDetails =>", result); 
            policies = result;
            
            res.json({
                details : details,
                policies: policies
            });
           
        }).catch(function(error) {
            logger.debug("error=", error);
            res.status(500).json(error);
        });
    });
    
    app.get('/api/v1/policy/:policyAddress', (req, res) => {
        
        logger.debug("/api/v1/policy/:policy_address called");
        
        var policyAddress = req.params.policyAddress;
        
        contract.Policy.getPolicyDetails(policyAddress).then(function(result) {
           logger.debug("contract.Policy.getPolicyDetails() =>", result);

           res.json({
               details: result
           });
           
        }).catch(function(error) {
            logger.debug("error=", error);
            res.status(500).json(error);
        });
    });
    
    app.get('/api/v1/policy/', (req, res) => {
        
        logger.debug("/api/v1/policy/ called");
        var flightAssureProductAddress, details, policies;
        
        contract.insuranceHub.getProductsList().then(function(result) {
            logger.debug("contract.insuranceHub.getProductsList() =>", result);
            flightAssureProductAddress = result[0].address;
           
            return contract.FlightAssureProduct.getMyPolicies(flightAssureProductAddress);
           
        }).then(function(result) {
            logger.debug("contract.FlightAssureProduct.getMyPolicies =>", result); 

            policies = result;
            
            res.json({
                policies: policies
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
        var transaction = null;
        
        
        var premium = 1;
        var currency = "gbp";
        
        
        var flight = req.body.flight;
        logger.debug("flight=", flight);
        
        var payment = req.body.payment;
        logger.debug("payment=", payment);
        
        var owner = req.body.owner;
        logger.debug("owner=", owner);
        
        // Check flight information
        rp({
            method  : "GET",
            uri     : "http://localhost:8080/api/v1/flight/" + flight.departureDate + "/" + flight.flightNo,
            
        }).then(function(result) {
            logger.debug("http://localhost:8080/api/v1/flight/" + flight.departureDate + "/" + flight.flightNo + " = ", result);

            // Process payment
            return stripe.charges.create({
              amount        : premium * 100,
              currency      : currency,
              source        : payment.token,
            });
            
        }).then(function(charge) {
            logger.debug("charge=", charge);

            return contract.insuranceHub.getHubInfo();
            
        }).then(function(result) {
            logger.debug("contract.insuranceHub.getHubInfo() =>", result);
            insTokenAddress = result;
           
            return contract.insToken.buy(premium, insTokenAddress);
            
        }).then(function(result) {
            logger.debug("contract.insToken.buy()=", result);
            
            return contract.insuranceHub.getProductsList();
   
        }).then(function(result) {
            logger.debug("contract.insuranceHub.getProductsList()=", result);
            flightAssureProductAddress = result[0].address;
            
           return contract.insToken.approve(flightAssureProductAddress, premium, insTokenAddress);
            
        }).then(function(result) {
           logger.debug("contract.insToken.approve() =>", result);

           return contract.insToken.allowance(ethereum.address, flightAssureProductAddress, insTokenAddress);
            
        }).then(function(result) {
            logger.debug("contract.insToken.allowance() =>", result);

            return contract.FlightAssureProduct.createProposal(ethereum.address, ethereum.address,((new Date()).getTime()/1000), flight.departureDate, flight.flightNo, flightAssureProductAddress);
            
        }).then(function(result) {
            logger.debug("contract.FlightAssureProduct.createProposal =>", result);
            transaction = result;
           
            return contract.FlightAssureProduct.getPoliciesList(flightAssureProductAddress);
           
        }).then(function(result) {
           logger.debug("contract.FlightAssureProduct.getPoliciesList =>", result); 

           
            // setup email data with unicode symbols
            let mailOptions = {
                from    : config.get("email.confirmation.from"),
                to      : owner.email, 
                subject : config.get("email.confirmation.subject"), 
                text    : 'Your policy is now active. Transaction no = ' + transaction.transactionID + " - Policy ID = " + result[result.length-1].address, 
                html    : 'Your policy is now active. Transaction no = ' + transaction.transactionID  + " - Policy ID = " + result[result.length-1].address
            };

            res.send({
                transaction : transaction.transactionID,
                policy      : result[result.length-1].address
            });
            
            return transporter.sendMail(mailOptions);
            
        }).then(function(info) {
            logger.debug("Message sent:", info);
            
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
        
    });
};