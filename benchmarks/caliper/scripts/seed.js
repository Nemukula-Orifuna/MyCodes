// Prepares on-chain preconditions for a Caliper workload round, using plain
// Web3 (not Caliper) so that seeding time is never counted as part of a
// measured round. PharmaSupplyChain's role checks mean the chain has to
// already be in the right state before Caliper starts timing: initiateTransfer
// needs Manufactured units held by the Manufacturer, acceptTransfer needs
// units already InTransit to the Distributor, and dispense needs units
// Received by the Pharmacy at the end of the full custody chain.
//
// Usage: node scripts/seed.js <stage> <count>
//   stage: initiateTransfer | acceptTransfer | dispense
//   count: number of units to prepare (chunked under MAX_BATCH_UNITS/MAX_TRANSFER_BATCH)
const fs = require("fs");
const path = require("path");
const Web3 = require("web3");
const accounts = require("./accounts");

const ARTIFACT_PATH = path.join(__dirname, "..", "..", "..", "build", "contracts", "PharmaSupplyChain.json");
const RESULTS_DIR = path.join(__dirname, "..", "results");
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const MAX_BATCH_UNITS = 100;
const MAX_TRANSFER_BATCH = 50;

async function main() {
  const [, , stage, countArg] = process.argv;
  const count = Number(countArg);
  if (!["initiateTransfer", "acceptTransfer", "dispense"].includes(stage) || !count || count < 1) {
    console.error("Usage: node scripts/seed.js <initiateTransfer|acceptTransfer|dispense> <count>");
    process.exit(1);
  }

  const artifact = JSON.parse(fs.readFileSync(ARTIFACT_PATH, "utf8"));
  const network = artifact.networks["1337"];
  if (!network) throw new Error("Contract not deployed on chain 1337 - run truffle migrate first.");

  const web3 = new Web3(RPC_URL);
  const contract = new web3.eth.Contract(artifact.abi, network.address);

  function withAccount(role) {
    const acct = web3.eth.accounts.privateKeyToAccount(accounts[role].privateKey);
    web3.eth.accounts.wallet.add(acct);
    return acct.address;
  }
  const manufacturer = withAccount("manufacturer");
  const distributor = withAccount("distributor");
  const wholesaler = withAccount("wholesaler");
  const pharmacy = withAccount("pharmacy");

  // Participant registration is handled by registerParticipants.js, which
  // must be run before this script (not required() here, since it's a
  // standalone script that calls process.exit() itself).

  function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  }

  // 1. Register enough fresh batches (as Manufacturer) to produce `count` units.
  const batchLabel = `seed-${stage}-${Date.now()}`;
  const unitIds = [];
  let remaining = count;
  let batchIndex = 0;
  while (remaining > 0) {
    const n = Math.min(MAX_BATCH_UNITS, remaining);
    const batchId = web3.utils.keccak256(`${batchLabel}-${batchIndex}`);
    const serials = Array.from({ length: n }, (_, i) => i + 1);
    await contract.methods
      .registerBatch(batchId, "0x" + "11".repeat(32), Math.floor(Date.now() / 1000) - 1000, Math.floor(Date.now() / 1000) + 100000000, serials)
      .send({ from: manufacturer, gas: 15000000 });
    for (const s of serials) {
      unitIds.push(web3.utils.soliditySha3({ type: "bytes32", value: batchId }, { type: "uint256", value: s }));
    }
    remaining -= n;
    batchIndex += 1;
  }
  console.log(`Registered ${unitIds.length} units for stage "${stage}".`);

  if (stage === "initiateTransfer") {
    // Leave units Manufactured, held by the Manufacturer - exactly what
    // the initiateTransfer workload needs to move.
  } else if (stage === "acceptTransfer") {
    // Move units to InTransit, pending acceptance by the Distributor.
    for (const batch of chunk(unitIds, MAX_TRANSFER_BATCH)) {
      await contract.methods.initiateTransfer(batch, distributor).send({ from: manufacturer, gas: 8000000 });
    }
  } else if (stage === "dispense") {
    // Carry units all the way to Received, held by the Pharmacy.
    for (const batch of chunk(unitIds, MAX_TRANSFER_BATCH)) {
      await contract.methods.initiateTransfer(batch, distributor).send({ from: manufacturer, gas: 8000000 });
    }
    for (const batch of chunk(unitIds, MAX_TRANSFER_BATCH)) {
      await contract.methods.acceptTransfer(batch).send({ from: distributor, gas: 8000000 });
    }
    for (const batch of chunk(unitIds, MAX_TRANSFER_BATCH)) {
      await contract.methods.initiateTransfer(batch, wholesaler).send({ from: distributor, gas: 8000000 });
    }
    for (const batch of chunk(unitIds, MAX_TRANSFER_BATCH)) {
      await contract.methods.acceptTransfer(batch).send({ from: wholesaler, gas: 8000000 });
    }
    for (const batch of chunk(unitIds, MAX_TRANSFER_BATCH)) {
      await contract.methods.initiateTransfer(batch, pharmacy).send({ from: wholesaler, gas: 8000000 });
    }
    for (const batch of chunk(unitIds, MAX_TRANSFER_BATCH)) {
      await contract.methods.acceptTransfer(batch).send({ from: pharmacy, gas: 8000000 });
    }
  }

  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  const outPath = path.join(RESULTS_DIR, `seed-${stage}.json`);
  fs.writeFileSync(outPath, JSON.stringify({ stage, unitIds }, null, 2));
  console.log(`Wrote ${outPath} with ${unitIds.length} unit IDs.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
