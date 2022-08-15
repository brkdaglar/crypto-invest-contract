// imports
const { ethers, run, network } = require("hardhat");

// async main
async function main() {
  const LegacyContract = await ethers.getContractFactory("LegacyContract");
  console.log("Deploying contract...");
  const legacy = await LegacyContract.deploy();
  await legacy.deployed();
  console.log("Deployed");
  console.log(`Deployed contract to: ${legacy.address}`);
  //console.log(network.config);
  /* if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    await legacy.deployTransaction.wait(6);
    await verify(legacy.address, []);
  }*/

  // interact smart contract
  /*const currentValue = await legacy.testValueGet();
  console.log(`Value is ${currentValue}`);

  const transactionResponse = await legacy.testValueSet(5);
  await transactionResponse.wait(1);
  const newValue = await legacy.testValueGet();
  console.log(`New Value is ${newValue}`);*/
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
