import * as dotenv from "dotenv";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import express from "express";
// import helmet from "helmet";
import path from "path";
import Database from "better-sqlite3";
import { parseBalanceMap } from "./parse-balance-map";
// import { ethers } from "hardhat";
import HDWalletProvider from "@truffle/hdwallet-provider";
import MerkleDistributor from "../../artifacts/contracts/MerkleDistributor.sol/MerkleDistributor.json";
// import Moralis from "moralis/node";
dotenv.config();

// const serverUrl = process.env.MORALIS_SERVER;
// const appId = process.env.MORALIS_APPID;
// const moralisSecret = process.env.MORALIS_SECRET;
// Moralis.start({ serverUrl, appId, moralisSecret});
// const web3 = new Moralis.Web3();
console.log("process.env.RINKEBY_KEY", process.env.RINKEBY_KEY);
const provider = new HDWalletProvider({
  mnemonic: {
    phrase: process.env.MNEMONIC || "",
  },
  // providerOrUrl:  "http://127.0.0.1:8545/" || "", // process.env.RINKEBY_HTTP
  providerOrUrl:
    "https://eth-rinkeby.alchemyapi.io/v2/zAqMRybs3vFvZrsMR_4j-1K2Xtr8-hm5" ||
    "", //
});
const web3 = new Web3(provider);
// const wssWeb3 = new Web3(
//   // new Web3.providers.WebsocketProvider("http://127.0.0.1:8545/" || "")
//   new Web3.providers.WebsocketProvider(process.env.RINKEBY_HTTP || "")
// );
dotenv.config();

const app = express();
const PORT = 8000;
// app.use(helmet());
app.use(express.json());

/**
 * INTERFACES
 */
interface IScore {
  address: string;
  score: number;
}

/**
 * CONSTANTS
 */
const EPOCH_START = 9593770;

const createTable =
  "CREATE TABLE IF NOT EXISTS scores('epoch' number, 'score' number, 'address' varchar);";

const db = new Database("skyfire.db", { verbose: console.log });
db.exec(createTable);

app.use("/public", express.static(path.join(__dirname, "game")));
// app.get("/", function(req:any, res:any)  {
//   res.sendFile(path.join(__dirname, "./game/index.html"));
// });

/**
 * Store the scoreboard for a particular user into the current epoch
 */
app.post("/public/user/scoreboard", async (req: any, res: any) => {
  console.log(req.body);
  const data: IScore = req.body as IScore;
  res.send("Request Received");

  await saveToDB(data.score, data.address);
  await generateMerkleRoot();
});

/**
 * For a particular user get the score board
 */
app.get("/public/user/history", (req: any, res: any) => {
  res.send("Got a request");
});

/**
 * Get scoreboard for all users
 */
app.get("/public/history", (req: any, res: any) => {
  res.send("Got a request");
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: The Server is running at http://localhost:${PORT}`);
});

async function saveToDB(score: number, address: string) {
  const epoch = await calculateEpoch();
  const updateStmt = db.prepare(
    "UPDATE scores SET score=? where epoch=? and address = ?"
  );
  const info = updateStmt.run(score, epoch, address);
  if (info.changes === 0) {
    const stmt = db.prepare("INSERT INTO scores VALUES (?, ?, ?)");
    stmt.run(epoch, score, address);
  }
}

async function calculateEpoch() {
  const currentBlock = await web3.eth.getBlockNumber();
  const currentEpoch = Math.round((currentBlock - EPOCH_START) / 100);
  console.log("currentEpoch--", currentEpoch);
  return currentEpoch;
}

async function getAllScores() {
  const stmt = db.prepare("SELECT score, address FROM scores WHERE epoch =?");
  const scores = await stmt.all(CURRENT_EPOCH);
  console.log(scores);
  return scores;
}

let CURRENT_EPOCH = 0;
async function generateMerkleRoot() {
  const jsonData: any = {};
  const scores = await getAllScores();
  // eslint-disable-next-line array-callback-return
  scores.map((obj) => {
    jsonData[obj.address] = obj.score;
  });
  console.log(jsonData);
  const merkleRootData = parseBalanceMap(jsonData);
  console.log(JSON.stringify(merkleRootData));
  console.log("CURRENT EPOCH", CURRENT_EPOCH);
  // 1. Store the data
  const abi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "token_",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "Claimed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "bytes32[]",
          name: "merkleProof",
          type: "bytes32[]",
        },
        {
          internalType: "uint256",
          name: "_epoch",
          type: "uint256",
        },
      ],
      name: "claim",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      name: "isClaimed",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "merkleRootInEpoch",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_merkleRoot",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "_epoch",
          type: "uint256",
        },
      ],
      name: "setMerkleRootPerEpoch",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "token",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const merkleDistributor = new web3.eth.Contract(
    abi as AbiItem[],
    process.env.MERKLE_DISTRIBUTOR
  );

  const latestEpoch = await calculateEpoch();

  if (latestEpoch > CURRENT_EPOCH) {
    await merkleDistributor.methods
      .setMerkleRootPerEpoch(merkleRootData.merkleRoot, CURRENT_EPOCH)
      .send(
        { from: "0xCd746dbAec699A3E0B42e411909e67Ad8BbCC315" },
        (error: any, result: any) => {
          console.log(error, result);
        }
      );
    CURRENT_EPOCH = latestEpoch;
  }
}

async function init() {
 CURRENT_EPOCH = await calculateEpoch();
}

// calculateEpoch();
// saveToDB(22, "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
// getAllScores();
init()
