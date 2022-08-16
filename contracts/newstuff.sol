// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract LegacyContract {

    address public owner;
    

    constructor(){
       owner =msg.sender;
    }

    struct Child {
        address addresses;
        string firstName;
        string lastName;
        uint256 balance;
        uint256 age;
        // dateOfBirth
    }

    struct Parent {
        address addresses;
        string firstName;
        string lastName;
        address[] childrensAddress;
        uint256 childrenSize;
    }

    enum Roles{
        parent,
        child,
        admin,
        unregistered
    }

    mapping(address => Parent) public parentsMap;
    mapping(address => Child) public childrenMap;

    uint256 balanceAccessAge = 18;
    address[] parentAddress;
    address[] childAddress;

    modifier shouldUnregister(){
        require(Roles.unregistered == addressControl(msg.sender), "zaten kayitli");
        _;
    }

    function addParent(string memory _firstName, string memory _lastName) public shouldUnregister{
        Parent storage parent = parentsMap[msg.sender]; 
        parent.addresses = msg.sender;
        parent.firstName = _firstName;
        parent.lastName = _lastName;
    }

    function addChild(address _address, string memory _firstName, string memory _lastName) public shouldUnregister{
        Child storage child = childrenMap[_address]; 
        child.addresses=_address;
        child.firstName=_firstName;
        child.lastName=_lastName;

        Parent storage parent = parentsMap[msg.sender];
        parent.childrensAddress.push(_address);
    }

    function addressControl(address _address) public view returns(Roles){
        if(_address == owner) return Roles.admin;

        Parent storage parent = parentsMap[_address];
        if(parent.addresses == _address) return Roles.parent;

        Child storage child = childrenMap[_address]; 
        if(child.addresses == _address) return Roles.child;

        return Roles.unregistered;
    } 
}
