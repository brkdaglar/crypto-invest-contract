// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Legacy {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    struct Child {
        address addresses;
        string firstName;
        string lastName;
        uint256 balance;
        uint256 accessDateTimeStamp;
    }

    struct Parent {
        address addresses;
        string firstName;
        string lastName;
        address[] childrensAddress;
    }

    enum Roles {
        admin,
        child,
        parent,
        unregistered
    }

    mapping(address => Parent) public parentsMap;
    mapping(address => Child) public childrenMap;

    uint256 balanceAccessAge = 18;
    address[] parentAddress;
    address[] childAddress;

    modifier userCheck(address _address) {
        require(
            Roles.unregistered == addressControl(_address),
            "Kullanici Kayitli"
        );
        _;
    }

    modifier controlParentChild(address _address) {
        require(parentChild(_address), "cocuk bu parentin degil");
        _;
    }

    function parentChild(address _address) public view returns (bool) {
        Parent storage parent = parentsMap[msg.sender];
        for (uint256 i = 0; i <= parent.childrensAddress.length; i++) {
            if (parent.childrensAddress[i] == _address) return true;
        }
        return false;
    }

    event AddParent(string _firstName, string _lastName);

    function addParent(string memory _firstName, string memory _lastName)
        public
        userCheck(msg.sender)
    {
        emit AddParent(_firstName, _lastName);
        Parent storage parent = parentsMap[msg.sender];
        parent.addresses = msg.sender;
        parent.firstName = _firstName;
        parent.lastName = _lastName;
        parentAddress.push(parent.addresses);
    }

    function addChild(
        address _address,
        string memory _firstName,
        string memory _lastName,
        uint256 _accessDateTimeStamp
    ) public userCheck(_address) {
        Child storage child = childrenMap[_address];
        child.addresses = _address;
        child.firstName = _firstName;
        child.lastName = _lastName;
        child.accessDateTimeStamp = _accessDateTimeStamp;
        child.balance = 0;

        Parent storage parent = parentsMap[msg.sender];
        parent.childrensAddress.push(_address);
        childAddress.push(_address);
    }

    function addressControl(address _address) public view returns (Roles) {
        if (_address == owner) return Roles.admin;

        Parent storage parent = parentsMap[_address];
        if (parent.addresses == _address) return Roles.parent;

        Child storage child = childrenMap[_address];
        if (child.addresses == _address) return Roles.child;

        return Roles.unregistered;
    }

    function getParent() public view returns (Parent memory) {
        return parentsMap[msg.sender];
    }

    function getChild() public view returns (Child memory) {
        return childrenMap[msg.sender];
    }

    function getChildsFromParent() public view returns (Child[] memory) {
        uint256 len = parentsMap[msg.sender].childrensAddress.length;
        Child[] memory childsFromParent = new Child[](len);
        for (uint8 i = 0; i < len; i++) {
            childsFromParent[i] = childrenMap[
                parentsMap[msg.sender].childrensAddress[i]
            ];
        }
        return childsFromParent;
    }

    function storeETH(address _address)
        public
        payable
        controlParentChild(_address)
    {
        require(msg.value > 0, "Gonderilecek deger 0'dan buyuk olmali");
        Child storage child = childrenMap[_address];
        child.balance += msg.value;
    }

    function parentWithdraw(address payable _address, uint256 amount)
        public
        controlParentChild(_address)
    {
        Child storage child = childrenMap[_address];
        require(child.balance >= amount, "Hesap bakiyesi yetersiz");
        child.balance -= amount;
        payable(msg.sender).transfer(amount);
        //amount burada wei cinsinden
    }

    function childWithdraw(uint256 date) public payable {
        Child storage child = childrenMap[msg.sender];
        require(
            child.accessDateTimeStamp <= date,
            "Tarih gelmedigi icin cekilemez"
        );
        require(child.balance != 0, "Hesabinizda para bulunmamaktadir");
        payable(msg.sender).transfer(child.balance);
        child.balance = 0;
    }

    function getAllParent() public view returns (Parent[] memory) {
        uint256 len = parentAddress.length;
        Parent[] memory allParent = new Parent[](len);
        for (uint8 i = 0; i < len; i++) {
            allParent[i] = parentsMap[parentAddress[i]];
        }
        return allParent;
    }

    function getAllChild() public view returns (Child[] memory) {
        uint256 len = childAddress.length;
        Child[] memory allChild = new Child[](len);
        for (uint8 i = 0; i < len; i++) {
            allChild[i] = childrenMap[childAddress[i]];
        }
        return allChild;
    }

    function getChildsFromParentWithAddress(address _adres)
        public
        view
        returns (Child[] memory)
    {
        uint256 len = parentsMap[_adres].childrensAddress.length;
        Child[] memory childsFromParent = new Child[](len);
        for (uint8 i = 0; i < len; i++) {
            childsFromParent[i] = childrenMap[
                parentsMap[_adres].childrensAddress[i]
            ];
        }
        return childsFromParent;
    }

    function removeChild(address _adres) public {
        uint256 adres = uint256(uint160(_adres));
        for(uint256 i=0;i<parentsMap[msg.sender].childrensAddress.length;i++){
            if(parentsMap[msg.sender].childrensAddress[i]==_adres){
                delete parentsMap[msg.sender].childrensAddress[adres];
            }
        }
        for(uint256 i=0;i<childAddress.length;i++){
            if(childAddress[i]==_adres){
                delete childAddress[i];
            }
        }
        delete childrenMap[_adres];
    }//
}
