var InsuranceHub = artifacts.require("./InsuranceHub.sol");
var FlightAssureProduct = artifacts.require("./Product/FlightAssureProduct.sol");

var products = [];
var insTokenFactoryAddress;

var FLIGHT_ASSURE_PREMIUM = 1;

module.exports = function(deployer) {

    console.log("#########################");
    console.log("# LAUNCH MIGRATION (2_deploy_contract)");
    console.log("#########################");

    console.log("# Deploy InsuranceHub ...");
    deployer.deploy(InsuranceHub).then(function() {
        console.log("# InsuranceHub deployed! (address="+InsuranceHub.address+")");
        return InsuranceHub.deployed();
        
    }).then(function(instance) {
        return instance.getHubInfo.call();  
        
    }).then(function(result) { 
        insTokenFactoryAddress = result;
        console.log("# insTokenFactoryAddress = " + insTokenFactoryAddress);
        
        return deployer.deploy(FlightAssureProduct, "FlightAssure", "Flight Assure product", insTokenFactoryAddress, FLIGHT_ASSURE_PREMIUM);
        
    }).then(function() {
        console.log("# FlightAssureProduct deployed! (address="+FlightAssureProduct.address+")");
        return FlightAssureProduct.deployed();

    }).then(function(instance) {
        return instance.getProductDetails.call();
        
    }).then(function(result) {
        var name = result[0];
        var desc = result[1];
        var premiumUnit = result[4].toNumber();
        console.log("# Product:" + name + "(desc="+desc+", premium unit="+premiumUnit+")");
        products['FlightAssureProduct'] = {'name': name, 'desc': desc};

        return InsuranceHub.deployed();
        
    }).then(function(instance) {
        return instance.registerProduct(FlightAssureProduct.address, products['FlightAssureProduct'].name, products['FlightAssureProduct'].desc);   

    }).then(function(result) { 
        console.log("# Product registered [Transaction hash="+result.tx+"]");
    })
    
};