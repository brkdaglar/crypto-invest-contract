// imports
const { ethers, run, network } = require("hardhat");

// async main
async function main() {
  const LegacyContract = await ethers.getContractFactory("Legacy");
  console.log("Deploying contract...");
  const legacy = await LegacyContract.deploy();
  await legacy.deployed();
  console.log("Deployed");
  console.log(`Deployed contract to: ${legacy.address}`);
  const [user1, user2] = await ethers.getSigners();
  console.log(user1, user2);
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
