pragma solidity ^0.4.25;

contract owned {
    address owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyowner() {
        if (msg.sender == owner) {
            _;
        }
    }
}