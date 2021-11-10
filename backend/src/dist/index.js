"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var dotenv = require("dotenv");
var web3_1 = require("web3");
var cors_1 = require("cors");
var express_1 = require("express");
// import helmet from "helmet";
var path_1 = require("path");
var better_sqlite3_1 = require("better-sqlite3");
var parse_balance_map_1 = require("./parse-balance-map");
// import { ethers } from "hardhat";
var hdwallet_provider_1 = require("@truffle/hdwallet-provider");
// import MerkleDistributor from "../../artifacts/contracts/MerkleDistributor.sol/MerkleDistributor.json";
// import Moralis from "moralis/node";
dotenv.config();
// const serverUrl = process.env.MORALIS_SERVER;
// const appId = process.env.MORALIS_APPID;
// const moralisSecret = process.env.MORALIS_SECRET;
// Moralis.start({ serverUrl, appId, moralisSecret});
// const web3 = new Moralis.Web3();
console.log("process.env.RINKEBY_KEY", process.env.RINKEBY_KEY);
var provider = new hdwallet_provider_1["default"]({
    mnemonic: {
        phrase: process.env.MNEMONIC || ""
    },
    // providerOrUrl:  "http://127.0.0.1:8545/" || "", // process.env.RINKEBY_HTTP
    providerOrUrl: "https://eth-rinkeby.alchemyapi.io/v2/zAqMRybs3vFvZrsMR_4j-1K2Xtr8-hm5" ||
        ""
});
var web3 = new web3_1["default"](provider);
// const wssWeb3 = new Web3(
//   // new Web3.providers.WebsocketProvider("http://127.0.0.1:8545/" || "")
//   new Web3.providers.WebsocketProvider(process.env.RINKEBY_HTTP || "")
// );
dotenv.config();
var app = express_1["default"]();
var PORT = 80;
// app.use(helmet());
app.use(express_1["default"].json());
/**
 * CONSTANTS & Globals
 */
var EPOCH_START = 9593770;
var currentEpoch = 0;
var createTable = "CREATE TABLE IF NOT EXISTS scores('epoch' number, 'score' number, 'address' varchar, 'epoch_index' number, 'claims' varchar);";
var db = new better_sqlite3_1["default"]("skyfire.db", { verbose: console.log });
db.exec(createTable);
app.use("/public", express_1["default"].static(path_1["default"].join(__dirname, "game")));
// app.get("/", function(req:any, res:any)  {
//   res.sendFile(path.join(__dirname, "./game/index.html"));
// });
/**
 * Store the scoreboard for a particular user into the current epoch
 */
app.post("/public/user/scoreboard", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.body);
                data = req.body;
                res.send("Request Received");
                if (!(web3.utils.isAddress(data.address) && data.score > 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, saveToDB(parseInt(web3.utils.toWei(data.score.toString())), data.address)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
/**
 * For a particular user get the score board
 */
app.get("/public/user/claim", cors_1["default"]({
    maxAge: 84600
}), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, claims;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = (_a = req.query) === null || _a === void 0 ? void 0 : _a.userAddress;
                if (!user) return [3 /*break*/, 2];
                return [4 /*yield*/, getMyLatestClaim(user)];
            case 1:
                claims = _b.sent();
                res.send(JSON.stringify(claims));
                return [3 /*break*/, 3];
            case 2:
                res.send("No user found");
                _b.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Get scoreboard for all users
 */
app.get("/public/history", function (req, res) {
    res.send("Got a request");
});
app.listen(PORT, function () {
    console.log("\u26A1\uFE0F[server]: The Server is running at http://localhost:" + PORT);
});
function saveToDB(score, address) {
    return __awaiter(this, void 0, void 0, function () {
        var epoch, updateStmt, info, stmt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, calculateEpoch()];
                case 1:
                    epoch = _a.sent();
                    updateStmt = db.prepare("UPDATE scores SET score=? where epoch=? and address = ?");
                    info = updateStmt.run(score, epoch, address);
                    if (info.changes === 0) {
                        stmt = db.prepare("INSERT INTO scores (epoch, score, address) VALUES (?, ?, ?)");
                        stmt.run(epoch, score, address);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function calculateEpoch() {
    return __awaiter(this, void 0, void 0, function () {
        var currentBlock, numBlocks, currentEpoch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, web3.eth.getBlockNumber()];
                case 1:
                    currentBlock = _a.sent();
                    numBlocks = parseInt(process.env.BLOCK || "30");
                    currentEpoch = Math.round((currentBlock - EPOCH_START) / numBlocks);
                    console.log("currentEpoch--", currentEpoch);
                    return [2 /*return*/, currentEpoch];
            }
        });
    });
}
function getAllScores(_epoch) {
    return __awaiter(this, void 0, void 0, function () {
        var stmt, scores;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stmt = db.prepare("SELECT score, address FROM scores WHERE epoch = ?");
                    return [4 /*yield*/, stmt.all(_epoch)];
                case 1:
                    scores = _a.sent();
                    console.log(scores);
                    return [2 /*return*/, scores];
            }
        });
    });
}
// TODO: We need to store the claimed already information here so that the latest unclaimed can be sent
function getMyLatestClaim(address) {
    return __awaiter(this, void 0, void 0, function () {
        var stmt, claims, newClaims;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stmt = db.prepare("SELECT address, score, claims, epoch_index, epoch FROM scores WHERE address = ? ORDER BY epoch DESC LIMIT 1");
                    return [4 /*yield*/, stmt.all(address.toLowerCase())];
                case 1:
                    claims = _a.sent();
                    console.log("claims", claims);
                    newClaims = [];
                    newClaims.push(claims[0].claims.split(","));
                    claims[0].claims = newClaims;
                    console.log("Modified Claims -- ", claims);
                    // }
                    return [2 /*return*/, claims];
            }
        });
    });
}
// the merkle root has to be created for an epoch that is complete eg. T-1
function generateMerkleRoot() {
    return __awaiter(this, void 0, void 0, function () {
        var jsonData, abi, merkleDistributor, latestEpoch, msg, scores, merkleRootData, updateStmt, _i, _a, _b, key, value, info, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    jsonData = {};
                    abi = [
                        {
                            inputs: [
                                {
                                    internalType: "address",
                                    name: "token_",
                                    type: "address"
                                },
                            ],
                            stateMutability: "nonpayable",
                            type: "constructor"
                        },
                        {
                            anonymous: false,
                            inputs: [
                                {
                                    indexed: false,
                                    internalType: "uint256",
                                    name: "epoch",
                                    type: "uint256"
                                },
                                {
                                    indexed: false,
                                    internalType: "uint256",
                                    name: "index",
                                    type: "uint256"
                                },
                                {
                                    indexed: false,
                                    internalType: "address",
                                    name: "account",
                                    type: "address"
                                },
                                {
                                    indexed: false,
                                    internalType: "uint256",
                                    name: "amount",
                                    type: "uint256"
                                },
                            ],
                            name: "Claimed",
                            type: "event"
                        },
                        {
                            anonymous: false,
                            inputs: [
                                {
                                    indexed: true,
                                    internalType: "address",
                                    name: "previousOwner",
                                    type: "address"
                                },
                                {
                                    indexed: true,
                                    internalType: "address",
                                    name: "newOwner",
                                    type: "address"
                                },
                            ],
                            name: "OwnershipTransferred",
                            type: "event"
                        },
                        {
                            inputs: [
                                {
                                    internalType: "uint256",
                                    name: "index",
                                    type: "uint256"
                                },
                                {
                                    internalType: "address",
                                    name: "account",
                                    type: "address"
                                },
                                {
                                    internalType: "uint256",
                                    name: "amount",
                                    type: "uint256"
                                },
                                {
                                    internalType: "bytes32[]",
                                    name: "merkleProof",
                                    type: "bytes32[]"
                                },
                                {
                                    internalType: "uint256",
                                    name: "_epoch",
                                    type: "uint256"
                                },
                            ],
                            name: "claim",
                            outputs: [],
                            stateMutability: "nonpayable",
                            type: "function"
                        },
                        {
                            inputs: [
                                {
                                    internalType: "uint256",
                                    name: "index",
                                    type: "uint256"
                                },
                                {
                                    internalType: "uint256",
                                    name: "_epoch",
                                    type: "uint256"
                                },
                            ],
                            name: "isClaimed",
                            outputs: [
                                {
                                    internalType: "bool",
                                    name: "",
                                    type: "bool"
                                },
                            ],
                            stateMutability: "view",
                            type: "function"
                        },
                        {
                            inputs: [
                                {
                                    internalType: "uint256",
                                    name: "",
                                    type: "uint256"
                                },
                            ],
                            name: "merkleRootInEpoch",
                            outputs: [
                                {
                                    internalType: "bytes32",
                                    name: "",
                                    type: "bytes32"
                                },
                            ],
                            stateMutability: "view",
                            type: "function"
                        },
                        {
                            inputs: [],
                            name: "owner",
                            outputs: [
                                {
                                    internalType: "address",
                                    name: "",
                                    type: "address"
                                },
                            ],
                            stateMutability: "view",
                            type: "function"
                        },
                        {
                            inputs: [],
                            name: "renounceOwnership",
                            outputs: [],
                            stateMutability: "nonpayable",
                            type: "function"
                        },
                        {
                            inputs: [
                                {
                                    internalType: "bytes32",
                                    name: "_merkleRoot",
                                    type: "bytes32"
                                },
                                {
                                    internalType: "uint256",
                                    name: "_epoch",
                                    type: "uint256"
                                },
                            ],
                            name: "setMerkleRootPerEpoch",
                            outputs: [],
                            stateMutability: "nonpayable",
                            type: "function"
                        },
                        {
                            inputs: [],
                            name: "token",
                            outputs: [
                                {
                                    internalType: "address",
                                    name: "",
                                    type: "address"
                                },
                            ],
                            stateMutability: "view",
                            type: "function"
                        },
                        {
                            inputs: [
                                {
                                    internalType: "address",
                                    name: "newOwner",
                                    type: "address"
                                },
                            ],
                            name: "transferOwnership",
                            outputs: [],
                            stateMutability: "nonpayable",
                            type: "function"
                        },
                    ];
                    merkleDistributor = new web3.eth.Contract(abi, process.env.MERKLE_DISTRIBUTOR);
                    return [4 /*yield*/, calculateEpoch()];
                case 1:
                    latestEpoch = _c.sent();
                    msg = "Attempting merkleroot generation current epoch && Latest epoch -";
                    console.log(msg, currentEpoch, latestEpoch);
                    if (!(latestEpoch > currentEpoch)) return [3 /*break*/, 8];
                    return [4 /*yield*/, getAllScores(currentEpoch)];
                case 2:
                    scores = _c.sent();
                    if (!(scores.length > 0)) return [3 /*break*/, 7];
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    // eslint-disable-next-line array-callback-return
                    scores.map(function (obj) {
                        jsonData[obj.address] = obj.score;
                    });
                    console.log("Scores Obj --", jsonData);
                    merkleRootData = parse_balance_map_1.parseBalanceMap(jsonData);
                    console.log(JSON.stringify(merkleRootData));
                    updateStmt = db.prepare("UPDATE scores SET claims = ?, epoch_index = ? where epoch = ? and address = ?");
                    for (_i = 0, _a = Object.entries(merkleRootData.claims); _i < _a.length; _i++) {
                        _b = _a[_i], key = _b[0], value = _b[1];
                        console.log(key + ": " + value.proof);
                        info = updateStmt.run(value.proof.toString(), value.index, currentEpoch, key.toLowerCase());
                        if (info.changes === 0) {
                            console.error("FAILED TO UPDATE MERKLE DATA", key, merkleRootData.claims);
                        }
                    }
                    return [4 /*yield*/, merkleDistributor.methods
                            .setMerkleRootPerEpoch(merkleRootData.merkleRoot, currentEpoch)
                            .send({ from: "0xCd746dbAec699A3E0B42e411909e67Ad8BbCC315" }, function (error, result) {
                            console.log(error, result);
                        })];
                case 4:
                    _c.sent();
                    currentEpoch = latestEpoch;
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _c.sent();
                    console.error(error_1);
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 8];
                case 7:
                    // no scores
                    currentEpoch = latestEpoch;
                    _c.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, calculateEpoch()];
                case 1:
                    currentEpoch = _a.sent();
                    // await saveToDB(22, "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
                    // await testUpdate()
                    // await getMyLatestClaim("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")
                    setInterval(function () { return generateMerkleRoot(); }, 2 * 60 * 1000); // Every 5 minutes check if epoch is over
                    return [2 /*return*/];
            }
        });
    });
}
init();
