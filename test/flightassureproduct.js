var FlightAssureProduct     = artifacts.require("./Product/FlightAssureProduct.sol");
var PolicyC                 = artifacts.require("./Policy/PolicyC.sol");

var policyAddress = "";
var productAddress = "";

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function trimNull(a) {
  var c = a.indexOf('\0');
  if (c>-1) {
    return a.substr(0, c);
  }
  return a;
}

contract('FlightAssureProduct', function(accounts) {
    console.log("### ACCOUNTS ####");
    console.log(accounts);
    console.log("#################");
    
    
    it("should have FlighAssure product deployed", function() {
        assert.equal(FlightAssureProduct.deployed() !== undefined, true, "FlightAssureProduct contract must be deployed");
    });
    
    it("should have one policy (ACTIVE) created", function() {
        
        return FlightAssureProduct.deployed().then(function(instance) {
            return instance.createProposal(accounts[0], accounts[0], 10, ((new Date()).getTime()/1000), 2017, 02, 25, "EZY", 8681);
            
        }).then(function(result){   
            return FlightAssureProduct.deployed();
            
        }).then(function(instance) {
            productAddress = instance.address;
            return sleep(10000);
            
        }).then(function(){ 
            return FlightAssureProduct.deployed(); 
            
        }).then(function(instance){ 
            return instance.getPoliciesList();     

        }).then(function(result) {
            var policies = [];
            for(var i = 0; i < result[0].length; i++) {
                var policy = {
                    address         : result[0][i],
                    state           : result[1][i].toString(),
                    //departingYear   : result[2][i],
                    //departingMonth  : result[3][i],
                    //departingDay    : result[4][i],
                    carrier         : trimNull(web3.toAscii(result[2][i])),
                    flightNo        : result[3][i].toNumber(),
                    ref             : trimNull(web3.toAscii(result[4][i]))
                };
                policies.push(policy);
            }
            console.log(policies); 
            policyAddress = policies[0].address;
            assert.equal(policies[0].state, "4", "Policy '"+policyAddress+"' must have the ACTIVE [4] state");
            
            return FlightAssureProduct.deployed(); 
            
        }).then(function(instance) {
            return instance.getProductDetails();
            
        }).then(function(result){ 
            var product = {
                    name            : result[0],
                    description     : result[1],
                    totalPremium    : result[2].toNumber(),
                    nbPolicies      : result[3].toNumber()
            };        
            console.log(product);
        });
    });
    
    it("should not be a valid proposal", function() {
        
        return FlightAssureProduct.deployed().then(function(instance) {
            return instance.createProposal(accounts[0], accounts[0], 10, ((new Date()).getTime()/1000), 2017, 02, 25, "XXX", 1212);
            
        }).then(function(result){   
            return FlightAssureProduct.deployed();
            
        }).then(function(instance) {
            productAddress = instance.address;
            return sleep(10000);
            
        }).then(function(){ 
            return FlightAssureProduct.deployed(); 
            
        }).then(function(instance){ 
            return instance.getPoliciesList();     

        }).then(function(result) {
            var policies = [];
            for(var i = 0; i < result[0].length; i++) {
                var policy = {
                    address         : result[0][i],
                    state           : result[1][i].toString(),
                    //departingYear   : result[2][i],
                    //departingMonth  : result[3][i],
                    //departingDay    : result[4][i],
                    carrier         : trimNull(web3.toAscii(result[2][i])),
                    flightNo        : result[3][i].toNumber(),
                    ref             : trimNull(web3.toAscii(result[4][i]))
                };
                policies.push(policy);
            }
            console.log(policies); 
            policyAddress = policies[1].address;
            assert.equal(policies[1].state, "3", "Policy '"+policyAddress+"' must have the DECLINED [3] state");
            
            return FlightAssureProduct.deployed(); 
            
        }).then(function(instance) {
            return instance.getProductDetails();
            
        }).then(function(result){ 
            var product = {
                    name            : result[0],
                    description     : result[1],
                    totalPremium    : result[2].toNumber(),
                    nbPolicies      : result[3].toNumber()
            };        
            console.log(product);
        });
    });
    
    /*
    it("should have one policy issued", function() {       
        console.log("policyAddress="+policyAddress);
        return PolicyC.at(policyAddress).then(function(instance) {
            return instance.getPolicyDetails();
        }).then(function(result) {
            var policy = {
                assured     : result[0],
                beneficiary : result[1],
                payer       : result[2],
                owner       : result[3],
                premium     : result[4].toNumber(),
                sumAssured  : result[5].toNumber(),
                state       : result[6].toString(),
                owner       : result[7],
                product     : result[8],
                startDate   : new Date(result[9].toNumber() * 1000)
            };
            return FlightAssureProduct.deployed();
        }).then(function(instance) {
            return instance.issueProposal(policyAddress);
        }).then(function(result) {
            return PolicyC.at(policyAddress);
        }).then(function(instance) {
            return instance.getPolicyDetails();
        }).then(function(result){          
            var policy = {
                assured     : result[0],
                beneficiary : result[1],
                payer       : result[2],
                owner       : result[3],
                premium     : result[4].toNumber(),
                sumAssured  : result[5].toNumber(),
                state       : result[6].toString(),
                owner       : result[7],
                product     : result[8],
                startDate   : new Date(result[9].toNumber() * 1000)
            };
            
            assert.equal(policy.state, "2", "Policy '"+policyAddress+"' must have the ACTIVE [2] state");
            
            return new Promise(function(resolve, reject) {
                resolve('OK');
            });
            
        }).then(function(){          
            return FlightAssureProduct.deployed();
        }).then(function(instance) {
            return instance.getPoliciesList();
        }).then(function(result){          
            var policies = [];
            for(var i = 0; i < result[0].length; i++) {
                var policy = {
                    address     : result[0][i],
                    state       : result[1][i].toString()
                };
                policies.push(policy);
            }
            
            policyAddress = policies[0].address;
            assert.equal(policies[0].state, "2", "Policy '"+policies[0].address+"' must have the ACTIVE[2] state");
        });  
    });
    
    it("should have one payment in the policy", function(){
        console.log("policyAddress="+policyAddress);
        return PolicyC.at(policyAddress).then(function(instance) {
            return instance.getPolicyDetails();
        }).then(function(result) {
            var policy = {
                assured     : result[0],
                beneficiary : result[1],
                payer       : result[2],
                owner       : result[3],
                premium     : result[4].toNumber(),
                sumAssured  : result[5].toNumber(),
                state       : result[6].toString(),
                owner       : result[7],
                product     : result[8],
                startDate   : new Date(result[9].toNumber() * 1000)
            };
            return PolicyC.at(policyAddress);
        }).then(function(instance) {
            return instance.payPremium(10, {from: accounts[0]});
        }).then(function(result) {
            return PolicyC.at(policyAddress);
        }).then(function(instance) {
            return instance.getPolicyDetails();
        }).then(function(result){          
            var policy = {
                assured     : result[0],
                beneficiary : result[1],
                payer       : result[2],
                owner       : result[3],
                premium     : result[4].toNumber(),
                sumAssured  : result[5].toNumber(),
                state       : result[6].toString(),
                owner       : result[7],
                product     : result[8],
                startDate   : new Date(result[9].toNumber() * 1000)
            };
            
            assert.equal(policy.premium, 10, "Policy '"+policyAddress+"' must have a premium equal to 10");
            
            return new Promise(function(resolve, reject) {
                resolve('OK');
            });
            
        }).then(function(){          
            return FlightAssureProduct.deployed();
        }).then(function(instance) {
            return instance.getDetails();
        }).then(function(result){          

            var productDetails = {
                name        : web3.toAscii(result[0]),
                desc        : web3.toAscii(result[1]),
                totalPremium: result[2].toNumber()
            };
            assert.equal(productDetails.totalPremium, 10, "Product FlightAssureProduct must have a total premium equals to 10");
        }); 
    });
    
    */
});
