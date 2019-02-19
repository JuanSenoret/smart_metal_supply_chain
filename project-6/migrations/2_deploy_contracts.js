// migrating the appropriate contracts
const SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer, network, accounts) {

  console.log('Network selected to deploy: ' + network);
    if (network == "rinkeby") {
        deployer.deploy(SupplyChain,{from: accounts[0]});
    } else if (network == "development") {
        deployer.deploy(SupplyChain,{from: accounts[0]});
    }
};
