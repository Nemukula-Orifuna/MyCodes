"use strict";
const fs = require("fs");
const path = require("path");
const { WorkloadModuleBase } = require("@hyperledger/caliper-core");
const Web3Utils = require("web3-utils");

const SEED_PATH = path.join(__dirname, "..", "results", "seed-acceptTransfer.json");
// Content is irrelevant for a gas/latency benchmark - every call needs *a*
// valid bytes32 checkpoint hash, not a specific one.
const PLACEHOLDER_RECORD_HASH = Web3Utils.keccak256("caliper-acceptTransfer-checkpoint");

class AcceptTransferWorkload extends WorkloadModuleBase {
  constructor() {
    super();
    this.index = 0;
  }

  async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
    await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
    const seed = JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
    // Caliper constructs a fresh workload module instance per round (this.index
    // always starts at 0), so each round needs a disjoint slice of the seeded
    // units - "roundArguments.offset" (set per round in the benchconfig YAML)
    // is what keeps round 2 from re-touching units round 1 already accepted.
    const roundOffset = (this.roundArguments && this.roundArguments.offset) || 0;
    const available = seed.unitIds.slice(roundOffset);
    const perWorker = Math.floor(available.length / this.totalWorkers);
    const start = this.workerIndex * perWorker;
    this.unitIds = available.slice(start, start + perWorker);
  }

  async submitTransaction() {
    if (this.index >= this.unitIds.length) {
      throw new Error(
        `acceptTransfer workload ran out of pre-seeded units (worker ${this.workerIndex} had ${this.unitIds.length}). ` +
          'Increase the seed count in scripts/seed.js for this round.'
      );
    }
    const unitId = this.unitIds[this.index];
    this.index += 1;

    const request = {
      contract: "pharmaSupplyChain",
      verb: "acceptTransfer",
      args: [[unitId], [PLACEHOLDER_RECORD_HASH]],
      readOnly: false,
    };
    await this.sutAdapter.sendRequests(request);
  }
}

function createWorkloadModule() {
  return new AcceptTransferWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
