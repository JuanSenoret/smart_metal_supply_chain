pragma solidity ^0.5.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'AluminumProducerRole' to manage this role - add, remove, check
contract AluminumProducerRole {
    using Roles for Roles.Role;

    // Define 2 events, one for Adding, and other for Removing
    event AluminumProducerAdded(address indexed account);
    event AluminumProducerRemoved(address indexed account);

    // Define a struct 'aluminumProducers' by inheriting from 'Roles' library, struct Role
    Roles.Role private aluminumProducers;

    // In the constructor make the address that deploys this contract the 1st aluminium producer
    constructor() public {
        _addAluminumProducer(msg.sender);
    }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyAluminumProducer() {
        require(isAluminumProducer(msg.sender), "The address doesn´t match with any aluminum producer");
        _;
    }

    // Define a function 'isAluminiumProducer' to check this role
    function isAluminumProducer(address account) public view returns (bool) {
        return aluminumProducers.has(account);
    }

    // Define a function 'addAluminiumProducer' that adds this role
    function addAluminumProducer(address account) public onlyAluminumProducer() {
        _addAluminumProducer(account);
    }

    // Define a function 'renounceAluminumProducer' to renounce this role
    function renounceAluminumProducer() public {
        _removeAluminumProducer(msg.sender);
    }

    // Define an internal function '_addAluminumProducer' to add this role, called by 'addFarmer'
    function _addAluminumProducer(address account) internal {
        aluminumProducers.add(account);
        emit AluminumProducerAdded(account);
    }

    // Define an internal function '_removeAluminumProducer' to remove this role, called by 'removeFarmer'
    function _removeAluminumProducer(address account) internal {
        aluminumProducers.remove(account);
        emit AluminumProducerRemoved(account);
    }
}