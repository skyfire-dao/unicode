// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, hre } = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [deployer] = await ethers.getSigners();
  const SkyfireDAOToken = await ethers.getContractFactory("SkyfireDAOToken");
  const skyfireDAOToken = await SkyfireDAOToken.deploy();

  await skyfireDAOToken.deployed();

  console.log("Deployed to:", skyfireDAOToken.address);

  return {
    'skyfireDAOToken': skyfireDAOToken.address
  }
}

async function verify(contractAddress,...args) {
  console.log("verifying", contractAddress, ...args);
  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: [
      ...args
    ],
  });
}

function delay(ms) { 
  return new Promise( resolve => setTimeout(resolve, ms) );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then( async (deployedData) => {
    await delay(80000);
    //await verify(deployedData.skyfireDAOToken, );
    process.exit(0)
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
