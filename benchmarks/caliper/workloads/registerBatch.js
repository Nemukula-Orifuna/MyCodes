"use strict";
const { WorkloadModuleBase } = require("@hyperledger/caliper-core");
const Web3Utils = require("web3-utils");

class RegisterBatchWorkload extends WorkloadModuleBase {
  constructor() {
    super();
    this.txCounter = 0;
  }

  async submitTransaction() {
    this.txCounter += 1;
    const label = `caliper-registerBatch-${this.workerIndex}-${this.roundIndex}-${this.txCounter}-${Date.now()}`;
    const batchId = Web3Utils.keccak256(label);
    const now = Math.floor(Date.now() / 1000);

    const request = {
      contract: "pharmaSupplyChain",
      verb: "registerBatch",
      args: [batchId, "0x" + "11".repeat(32), now - 1000, now + 100000000, [1]],
      readOnly: false,
    };
    await this.sutAdapter.sendRequests(request);
  }
}

function createWorkloadModule() {
  return new RegisterBatchWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
