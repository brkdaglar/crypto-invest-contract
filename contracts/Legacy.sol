// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.10;

contract LegacyContract {
    struct Children {
        address adres;
        string firstName;
        string lastName;
        uint256 balance;
        uint256 age;
        // dateOfBirth
    }

    struct Parent {
        address adres;
        string fistName;
        string lastName;
        mapping(address => Children) childrens;
        address[] childrensAddress;
        uint256 childrenSize;
    }

    struct Admin {
        address adres;
    }

    uint256 balanceAccessAge = 18;

    Admin public owner;

    mapping(address => Parent) public parents;

    address[] parentAddress;

    mapping(address => Children) public childs;

    address[] childAddress;

    constructor() {
        owner.adres = msg.sender;
    }
}
