// Writes networks/ganache-<role>.json from the Truffle-compiled artifact,
// so the ABI and deployed address are always read from the real build
// output rather than hand-copied (and so they can't silently drift out of
// sync with whatever is actually deployed). Caliper's Ethereum connector
// requires a single `fromAddress` per network config, and PharmaSupplyChain
// enforces per-function roles via onlyRole/onlyActive modifiers, so each
// workload that needs a specific role gets its own network config file
// pointing at that role's account.
const fs = require("fs");
const path = require("path");
const accounts = require("./accounts");

const ARTIFACT_PATH = path.join(__dirname, "..", "..", "..", "build", "contracts", "PharmaSupplyChain.json");
const OUT_DIR = path.join(__dirname, "..", "networks");
const CHAIN_ID = 1337;

function main() {
  const artifact = JSON.parse(fs.readFileSync(ARTIFACT_PATH, "utf8"));
  const network = artifact.networks[String(CHAIN_ID)];
  if (!network || !network.address) {
    throw new Error(
      `No deployment found for chain ${CHAIN_ID} in ${ARTIFACT_PATH}. Run "npx truffle migrate --network development --reset" first.`
    );
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const role of ["manufacturer", "distributor", "pharmacy", "regulator"]) {
    const account = accounts[role];
    const config = {
      caliper: {
        blockchain: "ethereum",
      },
      ethereum: {
        url: "ws://127.0.0.1:8545",
        contractDeployerAddress: accounts.regulator.address,
        contractDeployerAddressPrivateKey: accounts.regulator.privateKey,
        fromAddress: account.address,
        fromAddressPrivateKey: account.privateKey,
        transactionConfirmationBlocks: 1,
        chainId: CHAIN_ID,
        contracts: {
          pharmaSupplyChain: {
            address: network.address,
            abi: artifact.abi,
            // Fixed gas limits (2x the figures measured in the Phase 2 Truffle
            // gas report) instead of estimateGas: true - Caliper's connector
            // calls .estimateGas() with no `from` address, so the simulation
            // runs as the node's first account (the Regulator here) rather
            // than the role the round actually sends from. Every one of
            // PharmaSupplyChain's write functions is role-gated, so that
            // simulation reverts on the role check before the real,
            // correctly-addressed send ever happens - a bug in the connector,
            // not in this contract (confirmed by reproducing the exact same
            // call directly with Web3, which succeeds once `from` is explicit).
            gas: {
              registerBatch: 500000,
              initiateTransfer: 200000,
              acceptTransfer: 200000,
              dispense: 200000,
              verify: 100000,
            },
          },
        },
      },
    };
    const outPath = path.join(OUT_DIR, `ganache-${role}.json`);
    fs.writeFileSync(outPath, JSON.stringify(config, null, 2));
    console.log(`Wrote ${outPath} (contract ${network.address}, from ${account.address})`);
  }
}

main();
