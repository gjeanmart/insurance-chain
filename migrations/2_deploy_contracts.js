var InsuranceHub = artifacts.require("./InsuranceHub.sol");
var FlightAssureProduct = artifacts.require("./Product/FlightAssureProduct.sol");

var products = [];

module.exports = function(deployer) {

    console.log("#########################");
    console.log("# LAUNCH MIGRATION (2_deploy_contract)");
    console.log("#########################");

    console.log("# Deploy FlightAssureProduct ...");
    deployer.deploy(FlightAssureProduct, "FlightAssure", "Flight Assure product").then(function() {
        console.log("# FlightAssureProduct deployed! (address="+FlightAssureProduct.address+")");
        return FlightAssureProduct.deployed();

    }).then(function(instance) {
        return instance.getDetails.call();
        
    }).then(function(result) {
        var name = web3.toAscii(result[0]);
        var desc = web3.toAscii(result[1]);
        console.log("# Product:" + name + "("+desc+")");
        products['FlightAssureProduct'] = {'name': name, 'desc': desc};
        return new Promise(function(resolve, reject) {
            resolve(products['FlightAssureProduct']);
        });
        
    }).then(function(result) {
        console.log("# Deploy InsuranceHub ...");
        return deployer.deploy(InsuranceHub);
        
    }).then(function() {
        console.log("# InsuranceHub deployed! (address="+InsuranceHub.address+")");  
        return InsuranceHub.deployed();
        
    }).then(function(instance) {
        return instance.registerProduct(FlightAssureProduct.address, products['FlightAssureProduct'].name, products['FlightAssureProduct'].desc);   

    }).then(function(result) { 
        console.log("# Product registered [Transaction hash="+result.tx+"]");
    });
};