// jmeter/make-calldata.js   usage: node jmeter/make-calldata.js 0xContractAddress [count]
// Builds selector + ABI-encoded args for verifyProduct, for packs registered by the Caliper register round.
const fs = require("fs"); const path = require("path");
const { Web3 } = require("web3");
const art = require("../client/src/contracts/PharmaTrace.json");
const [, , contract, n = "500"] = process.argv;
if (!contract) { console.error("usage: node jmeter/make-calldata.js 0xContractAddress [count]"); process.exit(1); }
const web3 = new Web3();
const abiItem = art.abi.find((x) => x.name === "verifyProduct");
const rows = ["SERIAL,CALLDATA"];
for (let i = 0; i < Number(n); i++) {
  const serial = `CAL-W0-${i}`;   // packs created by the Caliper register round (worker 0)
  const hash = web3.utils.soliditySha3({ type: "string", value: `caliper-record-${serial}` });
  rows.push(`${serial},${web3.eth.abi.encodeFunctionCall(abiItem, ["06009000000017", serial, hash])}`);
}
fs.writeFileSync(path.join(__dirname, "calldata.csv"), rows.join("\n"));
console.log(`calldata.csv written for ${contract} (pass -Jcontract=${contract} to JMeter)`);
