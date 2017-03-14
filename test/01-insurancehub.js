var InsuranceHub        = artifacts.require("./InsuranceHub.sol");
var InsToken            = artifacts.require("./token/InsToken.sol");

var InsuranceHubAddress = "";
var InsTokenAddress = "";

contract('InsuranceHub', function(accounts) {

    it("should have at least one product registered", function() {
        return InsuranceHub.deployed().then(function(instance) {
            return instance.nbProducts.call();
        }).then(function(result){
            var nbProducts = result.toNumber();
            console.log("nbProducts="+nbProducts);
            assert.isAtLeast(nbProducts, 1, "at least 1 product expected");
        });
    });
    
    it("should have FlightAssure product deployed", function() {
        return InsuranceHub.deployed().then(function(instance) {
            return instance.getProductsList();
        }).then(function(result){          
            var products = [];
            for(var i = 0; i < result[0].length; i++) {
                var product = {
                    address     : result[0][i],
                    name        : web3.toAscii(result[1][i]),
                    description : web3.toAscii(result[2][i]),
                    active      : result[3][i],
                    dateCreated : new Date(result[4][i].toNumber() * 1000)
                };
                products.push(product);
            }
            
            console.log(products);
            assert.equal(products[0].name.replace(/\u0000/g, ''), "FlightAssure", "First product must be FlightAssure");
        });
    });
    
    it("minter should have 100 tokens", function() {
        return InsuranceHub.deployed().then(function(instance) {
            InsuranceHubAddress = instance.address;
            return instance.getHubInfo.call();
        }).then(function(result){ 
            InsTokenAddress = result;
            return InsToken.at(result);
        }).then(function(instance){ 
            return instance.balanceOf(InsuranceHubAddress);
        }).then(function(result){ 
            console.log("called balanceOf("+InsuranceHubAddress+")="+result.toNumber());
            assert.equal(result.toNumber(), 100, "Initial token must be 100");
        });
    });
    
    it(accounts[0]+" should have 5 tokens", function() {
        return InsuranceHub.deployed().then(function(instance) {
            return instance.getHubInfo.call();
        }).then(function(result) { 
            InsTokenAddress = result;
            return InsToken.at(result);
        }).then(function(instance) { 
            return instance.buy({from: accounts[0], value: web3.toWei(5, "ether")});
        }).then(function(result){ 
            return InsToken.at(InsTokenAddress);
            
        }).then(function(instance){ 
            return instance.balanceOf.call(accounts[0]);
        }).then(function(result){ 
            console.log("called balanceOf("+accounts[0]+")="+result.toNumber());
            assert.equal(result.toNumber(), 5, "Account 0 must be have 5 token");
            return InsToken.at(InsTokenAddress);
            
        }).then(function(instance){ 
            return instance.balanceOf(InsuranceHubAddress);
        }).then(function(result){ 
            console.log("called balanceOf("+InsuranceHubAddress+")="+result.toNumber());
            assert.equal(result.toNumber(), 95, "Minter must have 95");  
            
            return InsToken.at(InsTokenAddress);
        }).then(function(instance){ 
            return instance.balanceOf.call(accounts[1]);
        }).then(function(result){ 
            console.log("called balanceOf("+accounts[1]+")="+result.toNumber());
            assert.equal(result.toNumber(), 0, "Account 1 must have 0 token");
        });
    });
    
    it(accounts[1]+" should have 4 token", function() {
        return InsuranceHub.deployed().then(function(instance) {
            return instance.getHubInfo.call();
        }).then(function(result) { 
            InsTokenAddress = result;
            return InsToken.at(result);
        }).then(function(instance) { 
            return instance.transfer(accounts[1], 1, {from: accounts[0]});
        }).then(function(result){ 
            return InsToken.at(InsTokenAddress);
        }).then(function(instance){ 
            return instance.balanceOf.call(accounts[1]);
        }).then(function(result){ 
            console.log("called balanceOf("+accounts[1]+")="+result.toNumber());
            assert.equal(result.toNumber(), 1, "Account 1 must have 1 token");
        }).then(function(result){ 
            return InsToken.at(InsTokenAddress);
        }).then(function(instance){ 
            return instance.balanceOf.call(accounts[0]);
        }).then(function(result){ 
            console.log("called balanceOf("+accounts[0]+")="+result.toNumber());
            assert.equal(result.toNumber(), 4, "Account 0 must have 4 token");
            return InsToken.at(InsTokenAddress);
        }).then(function(instance){ 
            return instance.balanceOf(InsuranceHubAddress);
        }).then(function(result){ 
            console.log("called balanceOf("+InsuranceHubAddress+")="+result.toNumber());
            assert.equal(result.toNumber(), 95, "Minter must have 95");
        });
    });
});
