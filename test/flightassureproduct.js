var FlightAssureProduct     = artifacts.require("./Product/FlightAssureProduct.sol");
var PolicyC                 = artifacts.require("./Policy/PolicyC.sol");

var policyAddress = "";
var productAddress = "";

contract('FlightAssureProduct', function(accounts) {
    console.log("### ACCOUNTS ####");
    console.log(accounts);
    console.log("#################");
    
    
    it("should have FlighAssure product deployed", function() {
        assert.equal(FlightAssureProduct.deployed() !== undefined, true, "FlightAssureProduct contract must be deployed");
    });
    
    it("should have one policy (PROPOSAL) created", function() {
        
        return FlightAssureProduct.deployed().then(function(instance) {
            return instance.createProposal(accounts[0], accounts[0], 10, 200000, ((new Date()).getTime()/1000));
        }).then(function(result){          
            return FlightAssureProduct.deployed();
        }).then(function(instance) {
            productAddress = instance.address;
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
            assert.equal(policies[0].state, "1", "Policy '"+policies[0].address+"' must have the PROPOSAL [1] state");
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
