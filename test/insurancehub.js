var InsuranceHub = artifacts.require("./InsuranceHub.sol");
contract('InsuranceHub', function( ) {
    it("should have at least one product registered", function() {
        return InsuranceHub.deployed().then(function(instance) {
            return instance.nbProducts.call();
        }).then(function(result){
            var nbProducts = result.toNumber();
            console.log("nbProducts="+nbProducts);
            assert.isAtLeast(nbProducts, 1, "at least 1 product expected");
        });
    });
});
