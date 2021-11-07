# Unicode - Hackathon

Skyfire DAO delivers games for distribution events for eg. Liquidity Mining events.
You can utilize our contracts and game for your LM event. Skyfire DAO tokens are rewarded to all partner LM events.
For partnerships, just create a github issue and we will get in touch.

<p align="center">
  <img src="CoverImage.png"/>
</p>

## Innovation
Playing a game allows for a better UX for the end user to participate in the Defi ecosystem and game incentives makes it interesting for a wider variety of audience to participate in Liquidity Mining events. 

We extended the Uniswap's Merkle Distributor contract so that a single contract can be used for multiple epochs or snapshots.

## Sybil Mitigation
We intend to have checks across snapshots so that the leader board distribution does not always favor particular addresses.
Additionaly, every partnership gained via buying skyfire DAO tokens allows the partner to create multiple levels and unique challenges to prevent bot farm attacks. 

## Use Cases

Bob has a DAO and he wants get more people to participate in his community so he runs a Liquidity Mining event using Uniswap's stake contracts. 

In order to increase participation, he buys skyfire DAO tokens and integrates the game as an option for his users by connecting the stake contract to the merkle distributor. 

# How we made it?

We utilize Gamemaker Studio  and Uniswap's Merkle Distribution to distribute tokens for different snapshots as per the rewards in the LM program. All game sprites and graphics were created during the hackathon itself. The Uniswap Merkle distribution contract was also integrated and modified. 

## Deployment details
### Site
http://3.84.149.133/public/index.html

### Contract
https://rinkeby.etherscan.io/address/0x47455f503Ee95A2E1E800b4fE5199604499f3316#writeContract

## How to run
``` 
npm install
(create ur own .env file)
npm start run
```

TODOS
1. Check whether metamask is connected before game begins
1. Take a LP token as payment for game to start


# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/sample-script.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).
