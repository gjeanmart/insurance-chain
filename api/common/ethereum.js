// common/ethereum.js

'use strict';

// Import
var logger      = require('../common/log.js');
var config      = require('config');
const Web3 = require('web3');
const web3 = new Web3();

// ************************************************************
// Setup Web3
web3.setProvider(new web3.providers.HttpProvider(config.get('ethereum.node')));
 
var ethereum    = {
  
    mainAddress: null,
    
    setMainAddress: function(mainAddress) {
        ethereum.mainAddress = mainAddress;
    },
  
    /**
     * getAddresses
     */
    getAddresses: function() {
        logger.debug("getAddresses() START");
        
        return new Promise(function(resolve, reject) {
            web3.eth.getAccounts(function(err, accs) {
                if (err != null) {
                    logger.error("getAddresses() END There was an error fetching your accounts : " + err);
                    reject("There was an error fetching your accounts : " + err);
                }

                if (accs.length == 0) {
                    logger.error("getAddresses() END Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                    reject("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                }
                
                logger.debug("getAddresses() END number of accounts fetched = " + accs.length);

                resolve(accs);
                
            }, function(error) {
                logger.error("getAddresses() END error="+error);
                reject(error);
            });
        });
    },
    
    getBalance: function (address) {
        logger.debug("getBalance(address="+address+") START");
        
        return new Promise(function(resolve, reject) {

            web3.eth.getBalance(address, 'latest', function(err, result) {
                if (err != null) {
                    logger.error("getBalance(address="+address+") END There was an error sending a transaction : " + err);
                    reject("There was an error fetching sending your transaction : " + err);
                }
                        
                var balance = Number(web3.fromWei(result, "ether"));
                
                logger.debug("getBalance(address="+address+") END balance(ether)="+balance);
                
                resolve(balance);
            });
        });
    },
    
    sendTransaction: function (address, receiver, amount) {
        logger.debug("sendTransaction(address="+address+", receiver="+receiver+", amount="+amount+") START");
        
        return new Promise(function(resolve, reject) {
            
            web3.eth.sendTransaction({from: address, to: receiver, value: web3.toWei(amount, "ether")}, function(error) {                   
                logger.error("sendTransaction(address="+address+", receiver="+receiver+", amount="+amount+") END error=" + error);
                
                reject(error);
                
            }, function(err, tx) {
                if (err != null) {
                    logger.error("sendTransaction(address="+address+", receiver="+receiver+", amount="+amount+") END There was an error fetching sending your transaction : " + err);
                    
                    reject("There was an error fetching sending your transaction : " + err);
                }
                        
                logger.debug("sendTransaction(address="+address+", receiver="+receiver+", amount="+amount+") END transaction=" + tx);
                
                resolve(tx);
            });
            
        });
    },
    
    getNetwork: function () {
        logger.debug("getNetwork()", "START");
        
        return new Promise(function(resolve, reject) {
            
            web3.version.getNetwork(function(err, result) {
                if (err != null) {
                    logger.error("getNetwork() END There was an error getting the network : " + err);
                    
                    reject("There was an error fetching getting the network : " + err);
                }
                
                var networkInfo = {
                    'id'            : result
                    //'api'             : web3.version.api,
                    //'ethereum'        : web3.version.ethereum,
                    //'node'            : web3.version.node,
                    //'isConnected'     : web3.isConnected()
                };

                logger.debug("getNetwork() END result=" + result);
                
                resolve(networkInfo);
                
            }, function(error) {
                logger.error("getNetwork() END error : " + error);
                
                reject(error);
            });
            
        });
        
    },
    
    getGasPrice: function () {
        logger.debug("getGasPrice() START");
        
        return new Promise(function(resolve, reject) {
            
           web3.eth.getGasPrice(function(err, result) {
                if (err != null) {
                    logger.error("getGasPrice() END There was an error getting the gas price : " + err);
                    
                    reject("There was an error fetching getting the gas price : " + err);
                }
                
                var gasPrice =  Number(web3.fromWei(result, "ether"));

                logger.debug("getGasPrice() END gasPrice=" + gasPrice);
                
                resolve(gasPrice);
                
            });
            
        });
        
    },
    
    getBlockNumber: function () {
        logger.debug("getBlockNumber() START");
        
        return new Promise(function(resolve, reject) {
            
           web3.eth.getBlockNumber(function(err, result) {
                if (err != null) {
                    logger.error("getBlockNumber() END There was an error getting the blockNumber : " + err);
                    
                    reject("There was an error fetching getting the gas price : " + err);
                }
                
                var blockNumber =  Number(result, "ether");

                logger.debug("getBlockNumber() END blockNumber=" + blockNumber);
                
                resolve(blockNumber);
                
            });
            
        });
        
    },
    
    getTransactionReceipt: function (tx, gasPrice) {
        logger.debug("getTransactionReceipt(tx="+tx+", gasPrice="+gasPrice+") START");
        
        return new Promise(function(resolve, reject)     {
            
           web3.eth.getTransactionReceipt(tx, function(err, result) {
                if (err != null) {
                    logger.error("getTransactionReceipt(tx="+tx+", gasPrice="+gasPrice+") END There was an error getting the transaction receipt : " + err);
                    
                    reject("There was an error fetching getting the transaction receipt : " + err);
                }
                
                
        
                var receipt = {
                    'transactionID'	: result.transactionHash,
                    'blockNo'		: result.blockNumber,
                    'gasUsed'		: Number(result.gasUsed) * Number(gasPrice)
                };
                
                logger.debug("getTransactionReceipt(tx="+tx+", gasPrice="+gasPrice+") END transactionHash=" + receipt.transactionHash);
                
                resolve(receipt);
                
            });
            
        });
        
    },
    
    /**
     * Checks if the given string is an address
     *
     * @method isAddress
     * @param {String} address the given HEX adress
     * @return {Boolean}
     * @source http://ethereum.stackexchange.com/questions/1374/how-can-i-check-if-an-ethereum-address-is-valid
    */
    validateAddress: function(address) {
        logger.debug("validateAddress(address="+address+") START");

        if (!/^(0x)?[0-9a-f]{40}$/i.test(address.toLowerCase())) {
            // check if it has the basic requirements of an address
            return false;
        } else {
            return true;
        }
    } 
};
module.exports = ethereum;
