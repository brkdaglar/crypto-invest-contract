const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("LegacyAccess", function () {
  let Legacy, legacy;
  beforeEach(async function () {
    Legacy = await ethers.getContractFactory("LegacyContract");
    legacy = await Legacy.deploy();
  });
  it("Balance acccess age must be 18", async function () {
    const balanceAccessAge = await legacy.getBalanceAccessAge();
    const expectedBalanceAccessValue = "1";
    assert.equal(balanceAccessAge.toString(), expectedBalanceAccessValue);
  });
});
