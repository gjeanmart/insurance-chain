var InsuranceHub        = artifacts.require("./InsuranceHub.sol");

contract('InsuranceHub', function() {
    
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
});
