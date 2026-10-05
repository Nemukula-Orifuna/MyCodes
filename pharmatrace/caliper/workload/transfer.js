// caliper/workload/transfer.js - transfers the packs registered in round 0 (same worker, same serial sequence)
"use strict";
const { WorkloadModuleBase } = require("@hyperledger/caliper-core");

class TransferWorkload extends WorkloadModuleBase {
  async initializeWorkloadModule(...args) { await super.initializeWorkloadModule(...args); this.txIndex = 0; }
  async submitTransaction() {
    const serial = `CAL-W${this.workerIndex}-${this.txIndex++}`;
    return this.sutAdapter.sendRequests({ contract: "pharmatrace", verb: "transferCustody",
      args: [this.roundArguments.gtin, serial, this.roundArguments.distributor], readOnly: false });
  }
}
module.exports.createWorkloadModule = () => new TransferWorkload();
