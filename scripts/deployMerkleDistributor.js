// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, hre } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [deployer] = await ethers.getSigners();
  const MerkleDistributor = await ethers.getContractFactory("MerkleDistributor");
  const merkleDistributor = await MerkleDistributor.deploy();

  await merkleDistributor.deployed();

  console.log("Deployed to:", merkleDistributor.address);

  return {
    'merkleDistributor': merkleDistributor.address
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
    //await verify(deployedData.merkleDistributor, );
    process.exit(0)
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
