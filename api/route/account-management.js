// route/account-management.js

'use strict';


// Import
var logger = require('../common/log.js');
const config    = require('config');

var sys = require('sys')
var exec = require('child_process').exec;

const Web3                  = require('web3');

// Setup Web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.get('ethereum.node')));

module.exports = function(app) {
    
    app.post('/api/v1/account/', (req, res) => {
        logger.debug("POST /api/v1/account/ ...", req.params);
        
        var child = exec("geth --password C:/tmp/password.txt --datadir C:/tmp/eth/test/ account new", function (error, stdout, stderr) {
            if (error !== null) {

                logger.error('exec error: ', error);
                
            } else {
                var address= stdout.substring(stdout.lastIndexOf("{")+1,stdout.lastIndexOf("}"));
                
                logger.debug("Address="+address);
                
                web3.personal.unlockAccount(address, "password", 1000);
  
            }
        });
        
        res.send();
        
    });
};