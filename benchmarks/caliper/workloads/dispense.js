"use strict";
const fs = require("fs");
const path = require("path");
const { WorkloadModuleBase } = require("@hyperledger/caliper-core");
const Web3Utils = require("web3-utils");

const SEED_PATH = path.join(__dirname, "..", "results", "seed-dispense.json");

class DispenseWorkload extends WorkloadModuleBase {
  constructor() {
    super();
    this.index = 0;
  }

  async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
    await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
    const seed = JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
    // See acceptTransfer.js: a fresh module instance per round means a
    // per-round offset (not a persisted in-memory index) is what prevents
    // round 2 from re-dispensing round 1's already-dispensed units - which
    // would silently reroute those calls into the SuspiciousActivity path
    // instead of measuring the genuine dispense happy path.
    const roundOffset = (this.roundArguments && this.roundArguments.offset) || 0;
    const available = seed.unitIds.slice(roundOffset);
    const perWorker = Math.floor(available.length / this.totalWorkers);
    const start = this.workerIndex * perWorker;
    this.unitIds = available.slice(start, start + perWorker);
  }

  async submitTransaction() {
    if (this.index >= this.unitIds.length) {
      throw new Error(
        `dispense workload ran out of pre-seeded units (worker ${this.workerIndex} had ${this.unitIds.length}). ` +
          'Increase the seed count in scripts/seed.js for this round.'
      );
    }
    const unitId = this.unitIds[this.index];
    this.index += 1;
    const prescriptionHash = Web3Utils.keccak256(`caliper-dispense-${this.workerIndex}-${this.index}-${Date.now()}`);

    const request = {
      contract: "pharmaSupplyChain",
      verb: "dispense",
      args: [unitId, prescriptionHash],
      readOnly: false,
    };
    await this.sutAdapter.sendRequests(request);
  }
}

function createWorkloadModule() {
  return new DispenseWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
