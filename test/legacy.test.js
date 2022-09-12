const chai = require("chai"); //işlem doğrulama kısmı
const { ethers } = require("hardhat");
const chaiAsPromised = require("chai-as-promised");
const { Contract } = require("ethers");

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("LegacyContract", () => {
  let legacy;
  let wallets;

  before(async () => {
    wallets = await ethers.getSigners();
  });

  beforeEach(async () => {
    const factory = await ethers.getContractFactory("Legacy");
    legacy = await factory.deploy();
  });

  it("addParent", async () => {
    const firstName = "kubra";
    const lastName = "ocal";
    const addr = wallets[1].address;

    await legacy.connect(wallets[1]).addParent(firstName, lastName);
    const parent = await legacy.parentsMap(addr);

    expect(parent.firstName).equal(firstName);
    expect(parent.lastName).equal(lastName);
    expect(parent.addresses).equal(addr);
  });

  it("addParent should check user is added", async () => {
    const firstName = "kubra";
    const lastName = "ocal";
    const legacy_add1 = legacy.connect(wallets[1]);

    await legacy_add1.addParent(firstName, lastName);
    const promise = legacy_add1.addParent(firstName, lastName);

    await expect(promise).eventually.rejectedWith("Kullanici Kayitli");
  });

  it("addChild", async () => {
    const legacyParent = legacy.connect(wallets[1]);

    const firstName = "Jack";
    const lastName = "Sparrow";

    await legacyParent.addParent(firstName, lastName);

    const _address = wallets[2].address;
    const _firstName = "Burak";
    const _lastName = "Daglar";
    const _accesDateStamp = 225646566;

    await legacyParent.addChild(
      _address,
      _firstName,
      _lastName,
      _accesDateStamp
    );

    const parent = await legacyParent.getParent();
    const childAddress = parent.childrensAddress[0];
    const child = await legacy.childrenMap(childAddress);

    expect(child.firstName).equal(_firstName);
    expect(child.lastName).equal(_lastName);
    expect(child.addresses).equal(_address);
    expect(child.balance).equal(0);
    expect(child.accessDateTimeStamp).equal(_accesDateStamp);
  });

  it("addChild should check user is added", async () => {
    const legacyParent = legacy.connect(wallets[1]);

    const firstName = "Jack";
    const lastName = "Sparrow";

    await legacyParent.addParent(firstName, lastName);

    const _address = wallets[2].address;
    const _firstName = "Burak";
    const _lastName = "Daglar";
    const _accesDateStamp = 225646566;

    await legacyParent.addChild(
      _address,
      _firstName,
      _lastName,
      _accesDateStamp
    );

    const promise = legacyParent.addChild(
      _address,
      _firstName,
      _lastName,
      _accesDateStamp
    );

    await expect(promise).eventually.rejectedWith("Kullanici Kayitli");
  });

  it("getChildsFromParent", async () => {
    const legacyParent = legacy.connect(wallets[1]);

    const firstName = "Jack";
    const lastName = "Sparrow";

    await legacyParent.addParent(firstName, lastName);

    let _address = wallets[2].address;
    let _firstName = "Burak";
    let _lastName = "Daglar";
    let _accesDateStamp = 225646566;

    await legacyParent.addChild(
      _address,
      _firstName,
      _lastName,
      _accesDateStamp
    );

    _address = wallets[3].address;
    _firstName = "Darth";
    _lastName = "Vader";
    _accesDateStamp = 225646566;

    await legacyParent.addChild(
      _address,
      _firstName,
      _lastName,
      _accesDateStamp
    );

    const parent = await legacyParent.getParent();
    const len1 = parent.childrensAddress.length;
    const childsArray = await legacyParent.getChildsFromParent();
    const len2 = childsArray.length;

    expect(len1).equal(len2);
    let index;
    for (let i = 0; i < len1; i++) {
      childAddress = parent.childrensAddress[i];
      let child = await legacy.childrenMap(childAddress);
      expect(childsArray[i].addresses).equal(childAddress);
      expect(childsArray[i].firstName).equal(child.firstName);
      expect(childsArray[i].lastName).equal(child.lastName);
      expect(childsArray[i].balance).equal(child.balance);
      expect(childsArray[i].accessDateTimeStamp).equal(
        child.accessDateTimeStamp
      );
    }
  });

  it("getChild", async () => {
    const parentLegacy = legacy.connect(wallets[1]);

    const firstName = "child";
    const lastName = "parent";
    const addr = wallets[2].address;
    const date = 10;

    await parentLegacy.addParent("parent", "parent");
    const parent = await parentLegacy.parentsMap(wallets[1].address);

    await parentLegacy.addChild(addr, firstName, lastName, date, 12);
    const child = await legacy.childrenMap(addr);

    const a = legacy.connect(wallets[2]).getChild();
    expect(a).eventually.rejectedWith(child);
  });

  it("parentChild", async () => {
    const legacyParent = legacy.connect(wallets[1]);

    const firstName = "Parent";
    const lastName = "Parent";
    await legacyParent.addParent(firstName, lastName);

    let _address = wallets[2].address;
    let _firstName = "Child";
    let _lastName = "Parent";
    let _accesDateStamp = 225646566;

    await legacyParent.addChild(
      _address,
      _firstName,
      _lastName,
      _accesDateStamp
    );

    let expectedcheck = true;
    const _check = legacyParent.parentChild(_address);

    expect(_check).equal(expectedcheck);
  });

  it("parent child control", async () => {
    const firstName = "cocuk";
    const lastName = "cocuk1";
    const addr = wallets[2].address;
    const date = 110719;
    const parentLegacy = legacy.connect(wallets[1]);

    await parentLegacy.addParent("kubra", "ocal");
    const parent = await parentLegacy.parentsMap(wallets[1].address);
    //console.log("parent: ", parent);

    await parentLegacy.addChild(addr, firstName, lastName, date, "11111");
    const child = await legacy.childrenMap(addr);
    //console.log("child: ", child);

    expect(child.addresses).equal(addr);
    expect(child.firstName).equal(firstName);
    expect(child.lastName).equal(lastName);

    const parentChild = await parentLegacy.parentChild(addr);
    expect(parentChild).equal(true);
  });

  it("user role control", async () => {
    const firstName = "kubra";
    const lastName = "ocal";
    await legacy.connect(wallets[1]).addParent(firstName, lastName);
    const parent = await legacy.parentsMap(wallets[1].address);

    const role = await legacy
      .connect(wallets[1])
      .addressControl(wallets[1].address);
    //console.log("role: ", role);
    expect(role).equal(2);
  });

  it("store eth", async () => {
    const firstName = "cocuk";
    const lastName = "cocuk1";
    const addr = wallets[2].address;
    const date = 10;
    const parentLegacy = legacy.connect(wallets[1]);

    await parentLegacy.addParent("kubra", "ocal");
    const parent = await parentLegacy.parentsMap(wallets[1].address);

    await parentLegacy.addChild(addr, firstName, lastName, date, "12");

    await parentLegacy.storeETH(addr, { value: 15 });
    const child = await legacy.childrenMap(addr);
    expect(child.balance.toNumber()).equal(15);
  });

  it("withdraw parent", async () => {
    const firstName = "cocuk";
    const lastName = "cocuk1";
    const addr = wallets[2].address;
    const date = 10;
    const parentLegacy = legacy.connect(wallets[1]);

    await parentLegacy.addParent("kubra", "ocal");
    const parent = await parentLegacy.parentsMap(wallets[1].address);

    await parentLegacy.addChild(addr, firstName, lastName, date, "12");

    await parentLegacy.storeETH(addr, {
      value: ethers.utils.parseEther("5.0").toString(),
    });

    const oldBalance = await wallets[1].getBalance();
    const tx = await parentLegacy.parentWithdraw(
      addr,
      ethers.utils.parseEther("2.0").toString()
    );
    const newBalance = await wallets[1].getBalance();
    //console.log({ oldBalance: ethers.utils.formatEther(oldBalance), newBalance: ethers.utils.formatEther(newBalance) });

    const child = await legacy.childrenMap(addr);
    expect(oldBalance.lt(newBalance)).equal(true);
  });

  it("child withdraw", async () => {
    const firstName = "cocuk";
    const lastName = "cocuk1";
    const addr = wallets[2].address;
    const date = 10;
    const parentLegacy = legacy.connect(wallets[1]);

    await parentLegacy.addParent("kubra", "ocal");
    const parent = await parentLegacy.parentsMap(wallets[1].address);

    await parentLegacy.addChild(addr, firstName, lastName, date);
    const child = await legacy.childrenMap(addr);

    await parentLegacy.storeETH(addr, {
      value: ethers.utils.parseEther("5.0").toString(),
    });

    const oldBalance = await wallets[2].getBalance();
    const tx = await legacy
      .connect(wallets[2])
      .childWithdraw(ethers.utils.parseEther("2.0").toString());
    const newBalance = await wallets[2].getBalance();
    console.log({
      oldBalance: ethers.utils.formatEther(oldBalance),
      newBalance: ethers.utils.formatEther(newBalance),
    });

    expect(oldBalance.lt(newBalance)).equal(true);
  });

  it("child remove", async () => {
    const legacyParent = legacy.connect(wallets[1]);

    const firstName = "Jack";
    const lastName = "Sparrow";

    await legacyParent.addParent(firstName, lastName);

    const _address = wallets[2].address;
    const _firstName = "Burak";
    const _lastName = "Daglar";
    const _accesDateStamp = 225646566;

    await legacyParent.addChild(
      _address,
      _firstName,
      _lastName,
      _accesDateStamp
    );

    const parent = await legacyParent.getParent();
    const childAddress = parent.childrensAddress[0];
    const child = await legacy.childrenMap(childAddress);

    await legacy.removeChild(_address);

    const childRemove = await legacy.childrenMap(childAddress);

    expect(childRemove.addresses).not.equal(child.addresses);

  });
});
