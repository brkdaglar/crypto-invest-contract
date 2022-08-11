// imports
const { ethers, run, network } = require("hardhat");

// async main
async function main() {
  const LegacyContract = await ethers.getContractFactory("LegacyContract");
  console.log("Deploying contract...");
  const legacy = await LegacyContract.deploy("Burak");
  await legacy.deployed();
  console.log("Deployed");
  console.log(`Deployed contract to: ${legacy.address}`);
  console.log(network.config);
}
// verify
async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArgument: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verfied");
    } else {
      console.log(e);
    }
  }
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
