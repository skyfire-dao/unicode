import * as dotenv from "dotenv";
import Web3 from "web3";
import express from "express";
// import helmet from "helmet";
import path from "path";
import Database from "better-sqlite3";
import { parseBalanceMap } from "./parse-balance-map";
// import { ethers } from "hardhat";

// import Moralis from "moralis/node";
dotenv.config();

// const serverUrl = process.env.MORALIS_SERVER;
// const appId = process.env.MORALIS_APPID;
// const moralisSecret = process.env.MORALIS_SECRET;
// Moralis.start({ serverUrl, appId, moralisSecret});
// const web3 = new Moralis.Web3();
console.log("process.env.RINKEBY_KEY", process.env.RINKEBY_KEY);
const web3 = new Web3(
  new Web3.providers.WebsocketProvider(process.env.RINKEBY_KEY || "")
);

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
const CURRENT_EPOCH = 0;
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
  const currentEpoch = Math.round((currentBlock % EPOCH_START) / 100);
  console.log(currentEpoch);
  return currentEpoch;
}

async function getAllScores() {
  const stmt = db.prepare("SELECT score, address FROM scores");
  const scores = await stmt.all();
  console.log(scores);
  return scores;
}

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
  // 1. Store the data


  // Assume that the hardhat code has the correct address in mnemonic
  // const MerkleDistributor = await ethers.getContractFactory(
  //   "MerkleDistributor"
  // );
  // const merkleDistributor = await MerkleDistributor.attach(
  //   process.env.MERKLE_DISTRIBUTOR
  // );
  // merkleDistributor.setMerkleRootPerEpoch(
  //   merkleRootData.merkleRoot,
  //   CURRENT_EPOCH
  // );
}

// calculateEpoch();
// saveToDB(28, "0x44A65321C633803F6BDe1614F69Dc3141B89b5f8");
// getAllScores();
// generateMerkleRoot();
