//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


contract Whitelist {

    // Max number of whitelisted addresses allowed
    uint8 public maxWhitelistedAddresses;

    // Create a mapping of whitelistedAddresses
    // if an address is whitelisted, we would set it to true, it is false my default for all other addresses.
    mapping(address => bool) public whitelistedAddresses;

    // numAddressesWhitelisted would be used to keep track of how many addresses have been whitelisted
    uint8 private numAddressesWhitelisted;

    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses =  _maxWhitelistedAddresses;
    }

    /**
        addAddressToWhitelist - This function adds the address of the sender to the 
        whitelist
     */
    function addAddressToWhitelist() public {
        // check if the numAddressesWhitelisted < maxWhitelistedAddresses, if not then throw an error.
        require(numAddressesWhitelisted < maxWhitelistedAddresses, "More addresses cant be added, limit reached");
        // Add the address which called the function to the whitelistedAddress array
        whitelistedAddresses[msg.sender] = true;
        // Increase the number of whitelisted addresses
        numAddressesWhitelisted += 1;
    }

    /**
        removeAddressFromWhitelist - This function removes an address from the whitelist if the address was in the list.
    */

    function removeAddressFromWhitelist() public {
        // Check if the whitelist is empty, if true then throw an error
        require(numAddressesWhitelisted > 0, "Whitelist is empty, address cant be removed");
        // Check if the address sending the transaction is in the whitelist, if not then throw an error
        require(whitelistedAddresses[msg.sender], "Sender is not in the whitelist");
        whitelistedAddresses[msg.sender] = false;
        numAddressesWhitelisted -= 1;
    }

}