const  chai = require("chai"); //işlem doğrulama kısmı
const { ethers } = require("hardhat");
const chaiAsPromised = require("chai-as-promised");
const { arrayify } = require("ethers/lib/utils");

const expect=chai.expect;
chai.use(chaiAsPromised);

describe("kubra",()=>{
    let legacy;
    let wallets;


    before(async () => {
        wallets = await ethers.getSigners(); //burası kullanıcı bilgilerinin bir kere alındığı yer
    })

    beforeEach(async ()=>{
        const factory = await ethers.getContractFactory("kubra");//burası dosyanın her seferinde deploy edildiği yer
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

    it("addChild",async ()=>{
        const firstName="cocuk";
        const lastName="cocuk1";
        const addr = wallets[2].address;

        await legacy.connect(wallets[2]).addChild(addr,firstName,lastName);
        const child = await legacy.childrenMap(addr);

        expect(child.addresses).equal(addr);
        expect(child.firstName).equal(firstName);
        expect(child.lastName).equal(lastName);

        const parent = await legacy.parentsMap(wallets[1].address);
        await expect(parent.childrenAddresses).toEqual(addr);
    });

    /*it("Smart Contract Store ETH function test",async ()=>{
        
        const parentAddress = wallets[1].address;

        await legacy.connect(wallets[1]).storeETH(parentAddress, {value:"100000000000"});
        const parent = await legacy.parentsMap(parentAddress);

        expect(parent.firstName).equal(firstName);
        expect(parent.lastName).equal(lastName);
        expect(parent.addresses).equal(addr);
    });*/
})