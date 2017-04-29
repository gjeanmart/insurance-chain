// common/contract.js

'use strict';

// Import
const logger                = require('../common/log.js');
const utils                 = require('../common/utils.js');
const config                = require('config');
const InsuranceHub          = require("../../build/contracts/InsuranceHub.json");
const InsToken              = require("../../build/contracts/InsToken.json");
const FlightAssureProduct   = require("../../build/contracts/FlightAssureProduct.json");

const Web3                  = require('web3');
const TestRPC               = require("ethereumjs-testrpc");
var ethereum                = require('../common/ethereum.js');

// Setup Web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.get('ethereum.node')));

var contract    = {
    
    'insuranceHub' : {
        'getHubInfo': function() {
            logger.debug("insuranceHub.getHubInfo() START");
            
            var address = config.get("ethereum.contract");
            
            return new Promise(function(resolve, reject) {
                var insuranceHubInstance = web3.eth.contract(InsuranceHub.abi).at(address);

                insuranceHubInstance.getHubInfo.call(function(error, result) {
                    if(error) {
                        logger.debug("insuranceHub.getHubInfo() ERROR", error);
                        reject(error);
                    } else {
                        logger.debug("insuranceHub.getHubInfo() END", result);
                        resolve(result);
                    }
                });
            });
        }, 
        'getProductsList': function() {
            logger.debug("insuranceHub.getProductsList() START");
            
            var address = config.get("ethereum.contract");
            
            return new Promise(function(resolve, reject) {
                var insuranceHubInstance = web3.eth.contract(InsuranceHub.abi).at(address);

                insuranceHubInstance.getProductsList.call(function(error, result) {
                    if(error) {
                        logger.debug("insuranceHub.getProductsList() ERROR", error);
                        reject(error);
                    } else {
                        logger.debug("insuranceHub.getProductsList() END", result);
                        
                        var products = [];
                        for(var i = 0; i < result[0].length; i++) {
                            var product = {
                                address     : result[0][i],
                                name        : utils.trim(web3.toAscii(result[1][i])),
                                description : utils.trim(web3.toAscii(result[2][i])),
                                enabled     : result[3][i],
                                date        : new Date(Number(result[4]) * 1000)
                            };
                            products.push(product);
                        } 
                        resolve(products);
                    }
                });
            });
        }
    },

    
    'insToken': {
        'buy': function(noTokens, insTokenAddress) {
            logger.debug("insToken.buy(noTokens="+noTokens+") START");

            return new Promise(function(resolve, reject) {

                var insTokenInstance = web3.eth.contract(InsToken.abi).at(insTokenAddress);
                
                insTokenInstance.buy({from: ethereum.address, value: web3.toWei(noTokens, "ether")}, function(error, result) {
                    if(error) {
                        logger.error("buyTokens(noTokens="+noTokens+") END error="+error);
                        
                        reject(error);
                    } else {
                        logger.debug("buyTokens(noTokens="+noTokens+") END transaction="+result);
                        //resolve(result);
                        
                        ethereum.getTransactionReceipt(result, ethereum.gasPrice).then(function(receipt) {
                            logger.debug("receipt=", receipt);
                            resolve(receipt);
                        });
                        
                    }
                });
            });
        },
        
        'balanceOf': function(address, insTokenAddress) {
            logger.debug("insToken.balanceOf(address="+address+") START");

            return new Promise(function(resolve, reject) {

                var insTokenInstance = web3.eth.contract(InsToken.abi).at(insTokenAddress);
                
                insTokenInstance.balanceOf.call(address, function(error, result) {
                    if(error) {
                        logger.error("balanceOf(address="+address+") END error="+error);
                        
                        reject(error);
                    } else {
                        logger.debug("balanceOf(address="+address+") END result="+result);
                        resolve(result);
                    }
                });
            });
        }, 
        
        'approve': function(spender, val, insTokenAddress) {
            logger.debug("insToken.approve(spender="+spender+", val="+val+") START");

            return new Promise(function(resolve, reject) {

                var insTokenInstance = web3.eth.contract(InsToken.abi).at(insTokenAddress);
                
                insTokenInstance.approve(spender, val, {from: ethereum.address}, function(error, result) {
                    if(error) {
                        logger.error("insToken.approve(spender="+spender+", val="+val+") END error="+error);
                        
                        reject(error);
                    } else {
                        logger.debug("insToken.approve(spender="+spender+", val="+val+") END transaction="+result);
                        //resolve(result);
                        
                        ethereum.getTransactionReceipt(result, ethereum.gasPrice).then(function(receipt) {
                            logger.debug("receipt=", receipt);
                            resolve(receipt);
                        });
                        
                    }
                });
            });
        }, 
        'allowance': function(owner, spender, insTokenAddress) {
            logger.debug("insToken.allowance(owner="+owner+", spender="+spender+") START");

            return new Promise(function(resolve, reject) {

                var insTokenInstance = web3.eth.contract(InsToken.abi).at(insTokenAddress);
                
                insTokenInstance.allowance.call(owner, spender, function(error, result) {
                    if(error) {
                        logger.error("insToken.allowance(owner="+owner+", spender="+spender+") END error="+error);
                        
                        reject(error);
                    } else {
                        logger.debug("insToken.allowance(owner="+owner+", spender="+spender+") END", result);
                        resolve(result);
                    }
                });
            });
        }
    },
    
    'FlightAssureProduct': {
        'createProposal': function(assured, beneficiary, startDate, departingDate, flightNo, FlightAssureProductAddress) {
            logger.debug("FlightAssureProduct.createProposal(assured="+assured+", beneficiary="+beneficiary+", startDate="+startDate+", departingDate="+departingDate+", flightNo="+flightNo+") START");

            return new Promise(function(resolve, reject) {

                var FlightAssureProductInstance = web3.eth.contract(FlightAssureProduct.abi).at(FlightAssureProductAddress);
                /*
                FlightAssureProductInstance.createProposal.estimateGas(assured, beneficiary, startDate, departingDate, flightNo, {from: ethereum.address }, function(error, result) {
                    if(error) {
                        logger.error("FlightAssureProduct.createProposal(assured="+assured+", beneficiary="+beneficiary+", startDate="+startDate+", departingDate="+departingDate+", flightNo="+flightNo+") END error="+error);
                        
                        reject(error);
                    } else {
                        
                        var gasEstimation = ethereum.gasPriceWei * Number(result);
                            resolve(gasEstimation);

                    }
                });
                */
                /*
                */
                FlightAssureProductInstance.createProposal(assured, beneficiary, startDate, departingDate, flightNo, {from: ethereum.address, gas: 4000000}, function(error, result) {
                    if(error) {
                        logger.error("FlightAssureProduct.createProposal(assured="+assured+", beneficiary="+beneficiary+", startDate="+startDate+", departingDate="+departingDate+", flightNo="+flightNo+") END error="+error);
                        
                        reject(error);
                    } else {
                        logger.debug("FlightAssureProduct.createProposal(assured="+assured+", beneficiary="+beneficiary+", startDate="+startDate+", departingDate="+departingDate+", flightNo="+flightNo+") END transaction=", result);
                        
                        ethereum.getTransactionReceipt(result, ethereum.gasPrice).then(function(receipt) {
                            logger.debug("receipt=", receipt);
                            resolve(receipt);
                        });
                        
                    }
                });
            });
        },
        
        'getPoliciesList': function(FlightAssureProductAddress) {
            logger.debug("FlightAssureProduct.getPoliciesList() START");

            return new Promise(function(resolve, reject) {
                
               var FlightAssureProductInstance = web3.eth.contract(FlightAssureProduct.abi).at(FlightAssureProductAddress);
                
                FlightAssureProductInstance.getPoliciesList.call(function(error, result) {
                    if(error) {
                        logger.debug("FlightAssureProduct.getPoliciesList() ERROR", error);
                        reject(error);
                    } else {
                        logger.debug("FlightAssureProduct.getPoliciesList() END", result);
                        
                        var policies = [];
                        for(var i = 0; i < result[0].length; i++) {
                            var policy = {
                                address         : result[0][i],
                                state           : result[1][i].toString(),
                                departureDate   : utils.trim(web3.toAscii(result[2][i])),
                                flightNo        : utils.trim(web3.toAscii(result[3][i]))
                            };
                            policies.push(policy);
                        } 
                        resolve(policies);
                    }
                });
            });
        }
    }    
};
module.exports = contract;
