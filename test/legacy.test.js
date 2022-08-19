const  chai = require("chai"); //işlem doğrulama kısmı
const { ethers } = require("hardhat");
const chaiAsPromised = require("chai-as-promised")

const expect=chai.expect;
chai.use(chaiAsPromised);

describe("LegacyContract",()=>{
    let legacy;
    let wallets;

    before(async () => {
        wallets = await ethers.getSigners();
    })

    beforeEach(async ()=>{
        const factory = await ethers.getContractFactory("LegacyContract");
        legacy = await factory.deploy();

    });


    it("addParent",async ()=>{
        const firstName="kubra";
        const lastName="ocal";
        const addr = wallets[1].address;

        await legacy.connect(wallets[1]).addParent(firstName,lastName);
        const parent = await legacy.parentsMap(addr);

        expect(parent.firstName).equal(firstName);
        expect(parent.lastName).equal(lastName);
        expect(parent.addresses).equal(addr);
    });

    it("addParent should check user is added",async ()=>{
        const firstName="kubra";
        const lastName="ocal";
        const legacy_add1 = legacy.connect(wallets[1]);

        await legacy_add1.addParent(firstName,lastName);
        const promise = legacy_add1.addParent(firstName,lastName);

        await expect(promise).eventually.rejectedWith("Kullanici Kayitli");
    });
})