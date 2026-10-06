"use strict";
const fs = require("fs");
const path = require("path");
const { WorkloadModuleBase } = require("@hyperledger/caliper-core");
const accounts = require("../scripts/accounts");

const SEED_PATH = path.join(__dirname, "..", "results", "seed-initiateTransfer.json");

class InitiateTransferWorkload extends WorkloadModuleBase {
  constructor() {
    super();
    this.index = 0;
  }

  async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
    await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
    const seed = JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
    // Caliper constructs a fresh workload module instance per round, so a
    // plain in-memory counter resets every round - "roundArguments.offset"
    // (set per round in the benchconfig YAML) gives each round a disjoint
    // slice of the pre-seeded units instead of re-touching round 1's.
    const roundOffset = (this.roundArguments && this.roundArguments.offset) || 0;
    const available = seed.unitIds.slice(roundOffset);
    const perWorker = Math.floor(available.length / this.totalWorkers);
    const start = this.workerIndex * perWorker;
    this.unitIds = available.slice(start, start + perWorker);
  }

  async submitTransaction() {
    if (this.index >= this.unitIds.length) {
      throw new Error(
        `initiateTransfer workload ran out of pre-seeded units (worker ${this.workerIndex} had ${this.unitIds.length}). ` +
          'Increase the seed count in scripts/seed.js for this round.'
      );
    }
    const unitId = this.unitIds[this.index];
    this.index += 1;

    const request = {
      contract: "pharmaSupplyChain",
      verb: "initiateTransfer",
      args: [[unitId], accounts.distributor.address],
      readOnly: false,
    };
    await this.sutAdapter.sendRequests(request);
  }
}

function createWorkloadModule() {
  return new InitiateTransferWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
