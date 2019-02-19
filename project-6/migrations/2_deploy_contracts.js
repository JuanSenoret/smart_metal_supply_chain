// migrating the appropriate contracts
//const AluminumProducerRole = artifacts.require("./AluminumProducerRole.sol");
//const DistributorRole = artifacts.require("./DistributorRole.sol");
//const AutoManufacturerRole = artifacts.require("./AutoManufacturerRole.sol");
//const Ownable = artifacts.require("./Ownable.sol");
//const Roles = artifacts.require("./Roles.sol");
const SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer, network, accounts) {

  console.log('Network selected to deploy: ' + network);
    if (network == "rinkeby") {
        deployer.deploy(SupplyChain,{from: accounts[0]});
    } else if (network == "development") {
        deployer.deploy(SupplyChain,{from: accounts[0]});
    }
};
