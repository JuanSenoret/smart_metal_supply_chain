pragma solidity ^0.5.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'AutoManufacturerRole' to manage this role - add, remove, check
contract AutoManufacturerRole {
    using Roles for Roles.Role;

    // Define 2 events, one for Adding, and other for Removing
    event AutoManufacturerAdded(address indexed account);
    event AutoManufacturerRemoved(address indexed account);

    // Define a struct 'consumers' by inheriting from 'Roles' library, struct Role
    Roles.Role private autoManufacturers;

    // In the constructor make the address that deploys this contract the 1st consumer
    constructor() public {
        _addAutoManufacturer(msg.sender);
    }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyAutoManufacturer() {
        require(isAutoManufacturer(msg.sender), "The address doesn´t match with any auto manufacturer");
        _;
    }

    // Define a function 'isAutoManufacturer' to check this role
    function isAutoManufacturer(address account) public view returns (bool) {
        return autoManufacturers.has(account);
    }

    // Define a function 'addAutoManufacturer' that adds this role
    function addAutoManufacturer(address account) public onlyAutoManufacturer() {
        _addAutoManufacturer(account);
    }

    // Define a function 'renounceConsumer' to renounce this role
    function renounceAutoManufacturer() public {
        _removeAutoManufacturer(msg.sender);
    }

    // Define an internal function '_addConsumer' to add this role, called by 'addConsumer'
    function _addAutoManufacturer(address account) internal {
        autoManufacturers.add(account);
        emit AutoManufacturerAdded(account);
    }

    // Define an internal function '_removeConsumer' to remove this role, called by 'removeConsumer'
    function _removeAutoManufacturer(address account) internal {
        autoManufacturers.remove(account);
        emit AutoManufacturerRemoved(account);
    }
}