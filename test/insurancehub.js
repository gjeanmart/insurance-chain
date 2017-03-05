var InsuranceHub        = artifacts.require("./InsuranceHub.sol");
var InsToken            = artifacts.require("./token/InsToken.sol");

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
            
            //console.log(products);
            //TODO trim() //assert.equal(products[0].name, "FlightAssure", "First product must be FlightAssure");
        });
    });
    
    it("minter should have 100 tokens", function() {
        return InsuranceHub.deployed().then(function(instance) {
            return instance.tokenAddress.call();
        }).then(function(result){   
            console.log("call tokenAddress");
            console.log(result);
            return InsToken.at(result);
        }).then(function(instance){ 
            return instance.balanceOf.call();
        }).then(function(result){ 
            console.log("call balanceOf");
            console.log(result);
        });
    });
    var tokenAddress;
    it("should have 2 tokens", function() {
        return InsuranceHub.deployed().then(function(instance) {
            return instance.tokenAddress.call();
        }).then(function(result) { 
            console.log("call tokenAddress");
            console.log(result);
            tokenAddress = result;
            return InsToken.at(result);
        }).then(function(instance) { 
            return instance.buy({from: accounts[0], value: web3.toWei(2, "ether")});
        }).then(function(result){ 
            console.log("call buy");
            console.log(result);
            
            return InsToken.at(tokenAddress);
        }).then(function(instance){ 
            return instance.balanceOf.call(accounts[0]);
        }).then(function(instance){ 
            console.log("call balanceOf");
            console.log(result);
        });
    });
});
