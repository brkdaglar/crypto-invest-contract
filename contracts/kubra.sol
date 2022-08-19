// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract kubra {

    address public owner;

    constructor(){
       owner = msg.sender;
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
        address[] childrenAddresses;
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

    modifier userCheck(address _address){
        require(Roles.unregistered == addressControl(_address), "Kullanici Kayitli");
        _;
    }

    function addParent(string memory _firstName,string memory _lastName) public userCheck(msg.sender){
        Parent storage parent = parentsMap[msg.sender]; 
        parent.addresses=msg.sender;
        parent.firstName=_firstName;
        parent.lastName=_lastName;
    }

    /*function addChild(address _address,string memory _firstName,string memory _lastName) public userCheck(_address){
        Child storage child = childrenMap[_address]; 
        child.addresses=_address;
        child.firstName=_firstName;
        child.lastName=_lastName;

        Parent storage parent = parentsMap[msg.sender];
        parent.childrenAddresses.push(_address);
    }*/

    function addressControl(address _address) public view returns(Roles){
        if(_address == owner) return Roles.admin;

        Parent storage parent = parentsMap[_address];
        if(parent.addresses == _address) return Roles.parent;

        Child storage child = childrenMap[_address]; 
        if(child.addresses == _address) return Roles.child;

        return Roles.unregistered;
    } 

    function storeETH(address _address) payable public controlParentChild(_address){   
        require(msg.value > 0, "Gonderilecek deger 0'dan buyuk olmali");
        Child storage child = childrenMap[_address];  
        child.balance+=msg.value;
    } 

    /*function getBalance(address _address) public view returns(uint256){
        Child storage child = childrenMap[_address];  
        return child.balance;
    }*/

    modifier controlParentChild(address _address){
        require(parentChild(_address), "cocuk bu parentin degil");
        _;
    }

    //withdraw
    function parentWithdraw(address payable _address, uint256 amount) public controlParentChild(_address){
        Child storage child = childrenMap[_address]; 
        require(child.balance >= amount,"Hesap bakiyesi yetersiz");
        child.balance -= amount; 
        payable(msg.sender).transfer(amount);
        //amount burada wei cinsinden
    }

    function parentChild(address _address) private view returns(bool){
        Parent storage parent = parentsMap[msg.sender];
        for(uint256 i=0; i <= parent.childrenAddresses.length ;i++){
            if(parent.childrenAddresses[i] == _address) return true;
        }
        return false;
    } 


    /*function childWithdraw(address payable _address,uint256 date) public {
        Child storage child = childrenMap[_address]; 
        require(child.dateOfBirth >= date,"cekemezsiniz");
        payable(msg.sender).transfer(child.balance);
    }*/
    
    /*function childWithdraw(uint256 date) payable public {
        Child storage child = childrenMap[msg.sender]; 
        require(child.dateOfBirth >= date,"cekemezsiniz");
        payable(msg.sender).transfer(child.balance);
    }*/

    
    
    

}
