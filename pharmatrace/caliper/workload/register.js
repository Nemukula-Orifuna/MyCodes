// caliper/workload/register.js
"use strict";
const { WorkloadModuleBase } = require("@hyperledger/caliper-core");

class RegisterWorkload extends WorkloadModuleBase {
  async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
    await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
    this.web3 = sutContext.web3;
    this.txIndex = 0;
    if (workerIndex === 0) {   // one-off role setup on Caliper's own deployment (deployer = admin)
      const k = (s) => this.web3.utils.keccak256(s);
      await this.sutAdapter.sendRequests({ contract: "pharmatrace", verb: "grantRole",
        args: [k("MANUFACTURER_ROLE"), sutContext.fromAddress], readOnly: false });
      await this.sutAdapter.sendRequests({ contract: "pharmatrace", verb: "grantRole",
        args: [k("DISTRIBUTOR_ROLE"), roundArguments.distributor], readOnly: false });
    }
  }
  async submitTransaction() {
    const serial = `CAL-W${this.workerIndex}-${this.txIndex++}`;
    const hash = this.web3.utils.soliditySha3({ type: "string", value: `caliper-record-${serial}` });
    return this.sutAdapter.sendRequests({ contract: "pharmatrace", verb: "registerProduct",
      args: [this.roundArguments.gtin, "CALBATCH", serial, this.roundArguments.expiry, hash], readOnly: false });
  }
}
module.exports.createWorkloadModule = () => new RegisterWorkload();
