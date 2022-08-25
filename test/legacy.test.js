const chai = require("chai"); //işlem doğrulama kısmı
const { ethers } = require("hardhat");
const chaiAsPromised = require("chai-as-promised")

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("Legacy", () => {
    let legacy;
    let wallets;

    before(async () => {
        wallets = await ethers.getSigners();
    })

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
        expect(child.dateOfBirthTimeStamp).equal(date);

        const parentChild = await parentLegacy.parentChild(addr);
        expect(parentChild).equal(true);
    });

    it("user role control", async () => {
        const firstName = "kubra";
        const lastName = "ocal";
        await legacy.connect(wallets[1]).addParent(firstName, lastName);
        const parent = await legacy.parentsMap(wallets[1].address);

        const role = await legacy.connect(wallets[1]).addressControl(wallets[1].address);
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
    })

    it("withdraw parent", async () => {
        const firstName = "cocuk";
        const lastName = "cocuk1";
        const addr = wallets[2].address;
        const date = 10;
        const parentLegacy = legacy.connect(wallets[1]);

        await parentLegacy.addParent("kubra", "ocal");
        const parent = await parentLegacy.parentsMap(wallets[1].address);

        await parentLegacy.addChild(addr, firstName, lastName, date, "12");

        await parentLegacy.storeETH(addr, { value: ethers.utils.parseEther("5.0").toString() });


        const oldBalance = await wallets[1].getBalance();
        const tx = await parentLegacy.parentWithdraw(addr, ethers.utils.parseEther("2.0").toString());
        const newBalance = await wallets[1].getBalance();
        //console.log({ oldBalance: ethers.utils.formatEther(oldBalance), newBalance: ethers.utils.formatEther(newBalance) });

        const child = await legacy.childrenMap(addr);
        expect(oldBalance.lt(newBalance)).equal(true);

    })

    it("child withdraw", async () => {
        const firstName = "cocuk";
        const lastName = "cocuk1";
        const addr = wallets[2].address;
        const date = 10;
        const parentLegacy = legacy.connect(wallets[1]);

        await parentLegacy.addParent("kubra", "ocal");
        const parent = await parentLegacy.parentsMap(wallets[1].address);

        await parentLegacy.addChild(addr, firstName, lastName, date, 12);
        const child = await legacy.childrenMap(addr);

        await parentLegacy.storeETH(addr, { value: ethers.utils.parseEther("5.0").toString() });


        const oldBalance = await wallets[2].getBalance();
        const tx = await legacy.connect(wallets[2]).childWithdraw(ethers.utils.parseEther("2.0").toString());
        const newBalance = await wallets[2].getBalance();
        console.log({ oldBalance: ethers.utils.formatEther(oldBalance), newBalance: ethers.utils.formatEther(newBalance) });

        expect(oldBalance.lt(newBalance)).equal(true);
    })

    it("getChild", async () => {

        const firstName = "cocuk";
        const lastName = "cocuk1";
        const addr = wallets[2].address;
        const date = 10;
        const parentLegacy = legacy.connect(wallets[1]);

        await parentLegacy.addParent("kubra", "ocal");
        const parent = await parentLegacy.parentsMap(wallets[1].address);

        await parentLegacy.addChild(addr, firstName, lastName, date, 12);
        const child = await legacy.childrenMap(addr);

        const getChild = await legacy.connect(wallets[2]).getChild();
        expect(getChild.firstName).equal(child.firstName);
        expect(getChild.lastName).equal(child.lastName);
    });



})