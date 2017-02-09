var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  console.log("#########################");
  console.log("# LAUNCH MIGRATION (1_initial_migration)");
  console.log("#########################");
    
  console.log("# Deploy Migrations ...");
  deployer.deploy(Migrations);
  

};
