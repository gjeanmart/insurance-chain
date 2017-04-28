var InsuranceHub        = artifacts.require("./InsuranceHub.sol");
var FlightAssureProduct = artifacts.require("./Product/FlightAssureProduct.sol");
var PolicyC             = artifacts.require("./Policy/PolicyC.sol");
var InsToken            = artifacts.require("./token/InsToken.sol");

var policyAddress = "";
var productAddress = "";
var gasPrice;
var InsuranceHubAddress = "";
var InsTokenAddress = "";

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

function readEvent (log) {
    console.log(log);
}

function randomString(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

contract('InsuranceHub', function(accounts) {
    
    console.log("### ACCOUNTS ####");
    console.log(accounts);
    console.log("#################");
    
    
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

    it("test 02 - Get Gas price", function() {
       web3.eth.getGasPrice(function(err, result) {
            console.log("gasPrice (wei)="+result); 
            console.log("gasPrice (ether)="+Number(web3.fromWei(result, "ether"))); 
            gasPrice = result;// Number(web3.fromWei(result, "ether"));            
        });
    });
    
    it("test 01 - should have FlighAssure product deployed", function() {
        assert.equal(FlightAssureProduct.deployed() !== undefined, true, "FlightAssureProduct contract must be deployed");
    });
    
    it("test 02 - should have one policy (ACTIVE) created", function() {
        var FlightAssureProductAddress;
        var InsTokenAddress;
        
        return FlightAssureProduct.deployed().then(function(instance) {
            FlightAssureProductAddress= instance.address;
            console.log("FlightAssureProductAddress="+FlightAssureProductAddress); 
            return InsuranceHub.deployed();
            
        }).then(function(instance) {
            return instance.getHubInfo.call();
            
        }).then(function(result) { 
            InsTokenAddress = result;
            return InsToken.at(result);
            
        }).then(function(instance) { 
            return instance.approve(FlightAssureProductAddress, 1, {from: accounts[0]});
            
        }).then(function(result){   
            console.log("called approve");  

            return InsToken.at(InsTokenAddress);
            
        }).then(function(instance) { 
            return instance.allowance(accounts[0], FlightAssureProductAddress);
            
        }) .then(function(result){  
            console.log("called allowance");   
            return FlightAssureProduct.deployed();
            
        }).then(function(instance) {
            return instance.createProposal.estimateGas(accounts[0], accounts[0], ((new Date()).getTime()/1000), "2017-04-03", randomString(7), {from: accounts[0]});
            
        }).then(function(result){  
            console.log("called createProposal.estimateGas");  

            var gasEstimation = gasPrice * Number(result);
            
            console.log("gasEstimation (wei)="+gasEstimation); 
            console.log("gasEstimation (ether)="+Number(web3.fromWei(gasEstimation, "ether"))); 
            
            return FlightAssureProduct.deployed();
            
        }).then(function(instance) {
            return instance.createProposal(accounts[0], accounts[0], ((new Date()).getTime()/1000), "2017-04-03", randomString(7), {from: accounts[0]});
            
        }).then(function(result){  
            console.log("called createProposal");   
            return FlightAssureProduct.deployed();
            
        }).then(function(instance) {
            productAddress = instance.address;
            return sleep(15000);
            
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
                    departureDate   : trimNull(web3.toAscii(result[2][i])),
                    flightNo        : trimNull(web3.toAscii(result[3][i]))
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
    
    it("test 03 - should have one policy (ACCEPTED) created", function() {
        var FlightAssureProductAddress;
        var InsTokenAddress;
        
        return FlightAssureProduct.deployed().then(function(instance) {
            FlightAssureProductAddress= instance.address;
            console.log("FlightAssureProductAddress="+FlightAssureProductAddress); 
  
            return FlightAssureProduct.deployed();
            
        }).then(function(instance) {
            return instance.createProposal.estimateGas(accounts[1], accounts[1], ((new Date()).getTime()/1000), "2017-04-03", randomString(7), {from: accounts[1]});
            
        }).then(function(result){  
            console.log("called createProposal.estimateGas");  

            var gasEstimation = gasPrice * Number(result);
            
            console.log("gasEstimation (wei)="+gasEstimation); 
            console.log("gasEstimation (ether)="+Number(web3.fromWei(gasEstimation, "ether"))); 
            
            return FlightAssureProduct.deployed();
            
        }).then(function(instance) {
            return instance.createProposal(accounts[1], accounts[1], ((new Date()).getTime()/1000), "2017-04-03", randomString(7), {from: accounts[1]});
            
        }).then(function(result){  
            console.log("called createProposal");   
            return FlightAssureProduct.deployed();
            
        }).then(function(instance) {
            productAddress = instance.address;
            return sleep(15000);
            
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
                    departureDate   : trimNull(web3.toAscii(result[2][i])),
                    flightNo        : trimNull(web3.toAscii(result[3][i]))
                };
                policies.push(policy);
            }
            console.log(policies); 
            policyAddress = policies[1].address;
            assert.equal(policies[1].state, "2", "Policy '"+policyAddress+"' must have the ACCEPTED [2] state");
            
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

    it("test 04 - should have one policy (DECLINED) created", function() {
        var FlightAssureProductAddress;
        var InsTokenAddress;
        
        return FlightAssureProduct.deployed().then(function(instance) {
            FlightAssureProductAddress= instance.address;
            console.log("FlightAssureProductAddress="+FlightAssureProductAddress); 
  
            return FlightAssureProduct.deployed();
            
        }).then(function(instance) {
            return instance.createProposal.estimateGas(accounts[0], accounts[0], ((new Date()).getTime()/1000), "2017-04-03", randomString(7), {from: accounts[0]});
            
        }).then(function(result){  
            console.log("called createProposal.estimateGas");  

            var gasEstimation = gasPrice * Number(result);
            
            console.log("gasEstimation (wei)="+gasEstimation); 
            console.log("gasEstimation (ether)="+Number(web3.fromWei(gasEstimation, "ether"))); 
            
            return FlightAssureProduct.deployed();
            
        }).then(function(instance) {
            return instance.createProposal(accounts[0], accounts[0], ((new Date()).getTime()/1000), "2017-04-03", randomString(7), {from: accounts[0]});
            
        }).then(function(result){  
            console.log("called createProposal");   
            return FlightAssureProduct.deployed();
            
        }).then(function(instance) {
            productAddress = instance.address;
            return sleep(15000);
            
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
                    departureDate   : trimNull(web3.toAscii(result[2][i])),
                    flightNo        : trimNull(web3.toAscii(result[3][i]))
                };
                policies.push(policy);
            }
            console.log(policies); 
            policyAddress = policies[2].address;
            assert.equal(policies[2].state, "3", "Policy '"+policyAddress+"' must have the DECLINED [3] state");
            
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
 
});
