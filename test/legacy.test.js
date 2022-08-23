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
    const _birthDateStamp = 149484998;

    await legacyParent.addChild(
      _address,
      _firstName,
      _lastName,
      _birthDateStamp,
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
    expect(child.dateOfBirthTimeStamp).equal(_birthDateStamp);
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
    const _birthDateStamp = 149484998;

    await legacyParent.addChild(
      _address,
      _firstName,
      _lastName,
      _birthDateStamp,
      _accesDateStamp
    );

    const promise = legacyParent.addChild(
      _address,
      _firstName,
      _lastName,
      _birthDateStamp,
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
    let _birthDateStamp = 149484998;

    await legacyParent.addChild(
      _address,
      _firstName,
      _lastName,
      _birthDateStamp,
      _accesDateStamp
    );

    _address = wallets[3].address;
    _firstName = "Darth";
    _lastName = "Vader";
    _accesDateStamp = 225646566;
    _birthDateStamp = 149484998;

    await legacyParent.addChild(
      _address,
      _firstName,
      _lastName,
      _birthDateStamp,
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
      expect(childsArray[i].dateOfBirthTimeStamp).equal(
        child.dateOfBirthTimeStamp
      );
      expect(childsArray[i].accessDateTimeStamp).equal(
        child.accessDateTimeStamp
      );
    }
  });
});
