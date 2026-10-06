"use strict";
const fs = require("fs");
const path = require("path");
const { WorkloadModuleBase } = require("@hyperledger/caliper-core");

// verify() is a pure view call - it never mutates state, so it's safe to
// repeatedly look up the same small set of already-seeded units rather
// than needing a fresh one per call like the write workloads.
const SEED_PATH = path.join(__dirname, "..", "results", "seed-dispense.json");

class VerifyWorkload extends WorkloadModuleBase {
  constructor() {
    super();
    this.index = 0;
  }

  async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
    await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
    const seed = JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
    this.unitIds = seed.unitIds.slice(0, 10);
  }

  async submitTransaction() {
    const unitId = this.unitIds[this.index % this.unitIds.length];
    this.index += 1;

    const request = {
      contract: "pharmaSupplyChain",
      verb: "verify",
      args: [unitId],
      readOnly: true,
    };
    await this.sutAdapter.sendRequests(request);
  }
}

function createWorkloadModule() {
  return new VerifyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
