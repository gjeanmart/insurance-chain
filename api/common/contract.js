// common/contract.js

'use strict';

// Import
const logger        = require('../common/log.js');
const config        = require('config');
const InsuranceHub  = require("../../build/contracts/InsuranceHub.json");
const InsToken      = require("../../build/contracts/InsToken.json");

const Web3          = require('web3');
const TestRPC       = require("ethereumjs-testrpc");
var ethereum        = require('../common/ethereum.js');

// Setup Web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.get('ethereum.node')));

var contract    = {
    
    'insuranceHub' : {
        'getHubInfo': function() {
            logger.debug("insuranceHub.getHubInfo() START");
            
            return new Promise(function(resolve, reject) {
                var insuranceHubInstance = web3.eth.contract(InsuranceHub.abi).at(InsuranceHub.networks['1'].address);

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
        }
    },
    
    'insToken': {
        'buy': function(noTokens) {
            logger.debug("insToken.buy(noTokens="+noTokens+") START");

            return new Promise(function(resolve, reject) {

                contract.insuranceHub.getHubInfo()
                .then(function(result) {
                    logger.debug("buyTokens(noTokens="+noTokens+") DEBUG getHubInfo()", result);
                    
                    var insTokenInstance = web3.eth.contract(InsToken.abi).at(result);
                    
                    insTokenInstance.buy({from: ethereum.address, value: web3.toWei(noTokens, "ether")}, function(error, result) {
                        if(error) {
                            logger.error("buyTokens(noTokens="+noTokens+") END error="+error);
                            
                            reject(error);
                        } else {
                            logger.debug("buyTokens(noTokens="+noTokens+") END transaction="+result);
                            resolve(result);
                            /*
                            ethereum.getTransactionReceipt(result, 0).then(function(receipt) {
                                logger.debug("receipt=", receipt);
                                resolve(receipt);
                            });
                            */
                        }
                    });
                })
            });
        }
    }
};
module.exports = contract;
