// caliper/workload/verify.js - optional read round through Caliper (readOnly = eth_call, no gas)
"use strict";
const { WorkloadModuleBase } = require("@hyperledger/caliper-core");

class VerifyWorkload extends WorkloadModuleBase {
  async initializeWorkloadModule(w, t, r, args, adapter, ctx) {
    await super.initializeWorkloadModule(w, t, r, args, adapter, ctx); this.web3 = ctx.web3; this.i = 0;
  }
  async submitTransaction() {
    const serial = `CAL-W${this.workerIndex}-${this.i++ % this.roundArguments.registered}`;
    const hash = this.web3.utils.soliditySha3({ type: "string", value: `caliper-record-${serial}` });
    return this.sutAdapter.sendRequests({ contract: "pharmatrace", verb: "verifyProduct",
      args: [this.roundArguments.gtin, serial, hash], readOnly: true });
  }
}
module.exports.createWorkloadModule = () => new VerifyWorkload();
