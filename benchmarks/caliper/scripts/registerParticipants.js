// Registers the Manufacturer/Distributor/Wholesaler/Pharmacy accounts used
// by every benchmark workload, idempotently (skips any already registered -
// safe to run again after a mid-session Ganache restart). Run this once
// per fresh contract deployment, before any workload or scripts/seed.js.
const fs = require("fs");
const path = require("path");
const Web3 = require("web3");
const accounts = require("./accounts");

const ARTIFACT_PATH = path.join(__dirname, "..", "..", "..", "build", "contracts", "PharmaSupplyChain.json");
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const ROLE = { NONE: 0, REGULATOR: 1, MANUFACTURER: 2, DISTRIBUTOR: 3, WHOLESALER: 4, PHARMACY: 5 };

async function main() {
  const artifact = JSON.parse(fs.readFileSync(ARTIFACT_PATH, "utf8"));
  const network = artifact.networks["1337"];
  if (!network) throw new Error("Contract not deployed on chain 1337 - run truffle migrate first.");

  const web3 = new Web3(RPC_URL);
  const contract = new web3.eth.Contract(artifact.abi, network.address);

  const regulator = web3.eth.accounts.privateKeyToAccount(accounts.regulator.privateKey);
  web3.eth.accounts.wallet.add(regulator);

  async function ensureRegistered(role, label) {
    const address = accounts[label].address;
    const p = await contract.methods.participants(address).call();
    if (Number(p.role) === ROLE.NONE) {
      console.log(`Registering ${label} (${address}) as role ${role}...`);
      await contract.methods
        .registerParticipant(address, role, "0x" + "00".repeat(32))
        .send({ from: regulator.address, gas: 200000 });
    } else {
      console.log(`${label} (${address}) already registered (role ${p.role}).`);
    }
  }

  await ensureRegistered(ROLE.MANUFACTURER, "manufacturer");
  await ensureRegistered(ROLE.DISTRIBUTOR, "distributor");
  await ensureRegistered(ROLE.WHOLESALER, "wholesaler");
  await ensureRegistered(ROLE.PHARMACY, "pharmacy");
  console.log("All roles registered.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
