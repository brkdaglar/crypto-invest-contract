const { assert } = require("chai");
const { Contract } = require("ethers");
const { ethers } = require("hardhat");

describe("AdminInitialized", function () {
  let Legacy, legacy;
  beforeEach(async function () {
    Legacy = await ethers.getContractFactory("Legacy");
    legacy = await Legacy.deploy();
  });

  // Uncorrect Test must be fixed
  it("Admin succesfully initialized", async function () {
    const adminAddress = legacy.getAdmin();
    const [user1, user2] = await ethers.getSigners();
    const expectedAddress = user1.address;
    assert.equal(adminAddress.toString(), expectedAddress.toString());
  });
});
