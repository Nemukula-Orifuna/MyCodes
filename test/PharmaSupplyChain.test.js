const PharmaSupplyChain = artifacts.require("PharmaSupplyChain");
const { expectCustomError, expectAnyRevert, unitId, bytes32From, ZERO_BYTES32 } = require("./helpers");

const Role = { None: 0, Regulator: 1, Manufacturer: 2, Distributor: 3, Wholesaler: 4, Pharmacy: 5 };
const UnitStatus = { None: 0, Manufactured: 1, InTransit: 2, Received: 3, Dispensed: 4, Flagged: 5 };
const SuspiciousReason = { NotHolder: 0, RecalledBatch: 1, AlreadyDispensed: 2, UnknownUnit: 3 };

contract("PharmaSupplyChain", (accounts) => {
  const [
    regulator,
    manufacturer,
    distributor,
    wholesaler,
    pharmacy,
    pharmacy2,
    outsider,
    suspendedDistributor,
  ] = accounts;

  let instance;

  // Registers the standard five-role chain used by most tests.
  async function registerStandardChain() {
    instance = await PharmaSupplyChain.new({ from: regulator });
    await instance.registerParticipant(manufacturer, Role.Manufacturer, bytes32From("mfr-licence"), { from: regulator });
    await instance.registerParticipant(distributor, Role.Distributor, bytes32From("dist-licence"), { from: regulator });
    await instance.registerParticipant(wholesaler, Role.Wholesaler, bytes32From("whsl-licence"), { from: regulator });
    await instance.registerParticipant(pharmacy, Role.Pharmacy, bytes32From("pharm-licence"), { from: regulator });
    await instance.registerParticipant(pharmacy2, Role.Pharmacy, bytes32From("pharm2-licence"), { from: regulator });
    return instance;
  }

  const futureDate = () => Math.floor(Date.now() / 1000) + 3600;
  const pastExpiry = () => Math.floor(Date.now() / 1000) + 7200;

  // ---------------------------------------------------------------------
  // Happy path
  // ---------------------------------------------------------------------
  describe("happy path through all five roles", () => {
    it("carries one unit from manufacture to dispensing with correct history", async () => {
      await registerStandardChain();

      const batchId = bytes32From("batch-001");
      const serial = 1;
      const id = unitId(batchId, serial);
      const manufactureDate = futureDate() - 3600;
      const expiryDate = pastExpiry() + 365 * 24 * 3600;

      const regTx = await instance.registerBatch(batchId, bytes32From("product-data"), manufactureDate, expiryDate, [serial], {
        from: manufacturer,
      });
      assert.equal(regTx.logs.find((l) => l.event === "BatchRegistered").args.manufacturer, manufacturer);

      let verify = await instance.verify(id);
      assert.equal(verify.exists, true);
      assert.equal(verify.status.toString(), UnitStatus.Manufactured.toString());
      assert.equal(verify.currentHolderRole.toString(), Role.Manufacturer.toString());

      await instance.initiateTransfer([id], distributor, { from: manufacturer });
      await instance.acceptTransfer([id], { from: distributor });
      verify = await instance.verify(id);
      assert.equal(verify.status.toString(), UnitStatus.Received.toString());
      assert.equal(verify.currentHolderRole.toString(), Role.Distributor.toString());

      await instance.initiateTransfer([id], wholesaler, { from: distributor });
      await instance.acceptTransfer([id], { from: wholesaler });
      verify = await instance.verify(id);
      assert.equal(verify.currentHolderRole.toString(), Role.Wholesaler.toString());

      await instance.initiateTransfer([id], pharmacy, { from: wholesaler });
      await instance.acceptTransfer([id], { from: pharmacy });
      verify = await instance.verify(id);
      assert.equal(verify.currentHolderRole.toString(), Role.Pharmacy.toString());
      assert.equal(verify.status.toString(), UnitStatus.Received.toString());

      const dispenseTx = await instance.dispense(id, bytes32From("prescription-ref"), { from: pharmacy });
      const dispensedEvent = dispenseTx.logs.find((l) => l.event === "Dispensed");
      assert.isDefined(dispensedEvent);
      assert.equal(dispensedEvent.args.pharmacy, pharmacy);

      verify = await instance.verify(id);
      assert.equal(verify.status.toString(), UnitStatus.Dispensed.toString());

      const history = await instance.getHistory(id);
      // 1 Manufactured + 3x(InTransit, Received) + 1 Dispensed = 8 records.
      assert.equal(history.length, 8);
      assert.equal(history[0].status.toString(), UnitStatus.Manufactured.toString());
      assert.equal(history[1].status.toString(), UnitStatus.InTransit.toString());
      assert.equal(history[2].status.toString(), UnitStatus.Received.toString());
      assert.equal(history[7].status.toString(), UnitStatus.Dispensed.toString());
      assert.equal(history[7].to, "0x0000000000000000000000000000000000000000");
      assert.equal(history[0].from, "0x0000000000000000000000000000000000000000");
      assert.equal(history[0].to, manufacturer);
    });
  });

  // ---------------------------------------------------------------------
  // Role enforcement
  // ---------------------------------------------------------------------
  describe("role enforcement", () => {
    beforeEach(registerStandardChain);

    it("rejects registerBatch from an unregistered actor", async () => {
      await expectCustomError(
        instance.registerBatch(bytes32From("b"), bytes32From("d"), futureDate(), futureDate() + 1000, [1], { from: outsider }),
        "Unauthorized"
      );
    });

    it("rejects actions from a suspended participant", async () => {
      // Register and use the participant while active, suspend them only
      // after the transfer is already pending, then confirm the suspended
      // receiver can no longer accept it.
      await instance.registerParticipant(suspendedDistributor, Role.Distributor, bytes32From("susp"), { from: regulator });

      const batchId = bytes32From("batch-susp");
      await instance.registerBatch(batchId, bytes32From("d"), futureDate(), futureDate() + 10000, [1], { from: manufacturer });
      const id = unitId(batchId, 1);
      await instance.initiateTransfer([id], suspendedDistributor, { from: manufacturer });

      await instance.suspendParticipant(suspendedDistributor, { from: regulator });

      await expectCustomError(instance.acceptTransfer([id], { from: suspendedDistributor }), "Unauthorized");
    });

    it("rejects a transfer to the wrong next role", async () => {
      const batchId = bytes32From("batch-wrongrole");
      await instance.registerBatch(batchId, bytes32From("d"), futureDate(), futureDate() + 10000, [1], { from: manufacturer });
      const id = unitId(batchId, 1);

      // Manufacturer must hand off to Distributor, not Wholesaler.
      await expectCustomError(instance.initiateTransfer([id], wholesaler, { from: manufacturer }), "InvalidReceiver");
    });

    it("rejects a skipped step (Manufacturer straight to Pharmacy)", async () => {
      const batchId = bytes32From("batch-skip");
      await instance.registerBatch(batchId, bytes32From("d"), futureDate(), futureDate() + 10000, [1], { from: manufacturer });
      const id = unitId(batchId, 1);

      await expectCustomError(instance.initiateTransfer([id], pharmacy, { from: manufacturer }), "InvalidReceiver");
    });

    it("rejects dispense from a non-Pharmacy role", async () => {
      const batchId = bytes32From("batch-notpharm");
      await instance.registerBatch(batchId, bytes32From("d"), futureDate(), futureDate() + 10000, [1], { from: manufacturer });
      const id = unitId(batchId, 1);

      await expectCustomError(instance.dispense(id, bytes32From("rx"), { from: distributor }), "Unauthorized");
    });
  });

  // ---------------------------------------------------------------------
  // Two-step transfer
  // ---------------------------------------------------------------------
  describe("two-step transfer", () => {
    beforeEach(registerStandardChain);

    it("does not move custody until accepted", async () => {
      const batchId = bytes32From("batch-2step");
      await instance.registerBatch(batchId, bytes32From("d"), futureDate(), futureDate() + 10000, [1], { from: manufacturer });
      const id = unitId(batchId, 1);

      await instance.initiateTransfer([id], distributor, { from: manufacturer });
      let verify = await instance.verify(id);
      assert.equal(verify.currentHolderRole.toString(), Role.Manufacturer.toString());
      assert.equal(verify.status.toString(), UnitStatus.InTransit.toString());

      await instance.acceptTransfer([id], { from: distributor });
      verify = await instance.verify(id);
      assert.equal(verify.currentHolderRole.toString(), Role.Distributor.toString());
      assert.equal(verify.status.toString(), UnitStatus.Received.toString());
    });

    it("fails when accepted by a non-receiver", async () => {
      const batchId = bytes32From("batch-wrongacceptor");
      await instance.registerBatch(batchId, bytes32From("d"), futureDate(), futureDate() + 10000, [1], { from: manufacturer });
      const id = unitId(batchId, 1);

      await instance.initiateTransfer([id], distributor, { from: manufacturer });
      await expectCustomError(instance.acceptTransfer([id], { from: wholesaler }), "NotPendingReceiver");
    });
  });

  // ---------------------------------------------------------------------
  // Attack scenarios (must emit SuspiciousActivity + Flagged, not revert)
  // ---------------------------------------------------------------------
  describe("attack scenarios", () => {
    beforeEach(registerStandardChain);

    async function carryToPharmacy(batchId, serial, targetPharmacy) {
      await instance.registerBatch(batchId, bytes32From("d"), futureDate(), futureDate() + 10000, [serial], { from: manufacturer });
      const id = unitId(batchId, serial);
      await instance.initiateTransfer([id], distributor, { from: manufacturer });
      await instance.acceptTransfer([id], { from: distributor });
      await instance.initiateTransfer([id], wholesaler, { from: distributor });
      await instance.acceptTransfer([id], { from: wholesaler });
      await instance.initiateTransfer([id], targetPharmacy, { from: wholesaler });
      await instance.acceptTransfer([id], { from: targetPharmacy });
      return id;
    }

    it("flags a cloned unit dispensed twice at different pharmacies", async () => {
      const batchId = bytes32From("batch-clone");
      const id = await carryToPharmacy(batchId, 1, pharmacy);

      const firstTx = await instance.dispense(id, bytes32From("rx-1"), { from: pharmacy });
      assert.isTrue(firstTx.logs.some((l) => l.event === "Dispensed"));

      // Second pharmacy never legitimately held this unit on-chain, but a
      // cloned physical pack carries the same unitId.
      const secondTx = await instance.dispense(id, bytes32From("rx-2"), { from: pharmacy2 });
      const suspicious = secondTx.logs.find((l) => l.event === "SuspiciousActivity");
      assert.isDefined(suspicious, "expected SuspiciousActivity event");
      assert.equal(suspicious.args.reasonCode.toString(), SuspiciousReason.AlreadyDispensed.toString());
      assert.isFalse(secondTx.logs.some((l) => l.event === "Dispensed"));

      const verify = await instance.verify(id);
      assert.equal(verify.status.toString(), UnitStatus.Flagged.toString());
    });

    it("flags a transfer attempted by a non-holder", async () => {
      const batchId = bytes32From("batch-nonholder-transfer");
      await instance.registerBatch(batchId, bytes32From("d"), futureDate(), futureDate() + 10000, [1], { from: manufacturer });
      const id = unitId(batchId, 1);

      // distributor never received this unit, but tries to move it onward anyway.
      const tx = await instance.initiateTransfer([id], wholesaler, { from: distributor });

      const suspicious = tx.logs.find((l) => l.event === "SuspiciousActivity");
      assert.isDefined(suspicious);
      assert.equal(suspicious.args.reasonCode.toString(), SuspiciousReason.NotHolder.toString());

      const verify = await instance.verify(id);
      assert.equal(verify.status.toString(), UnitStatus.Flagged.toString());
    });

    it("flags dispense attempted by a non-holder pharmacy", async () => {
      const batchId = bytes32From("batch-nonholder-dispense");
      await instance.registerBatch(batchId, bytes32From("d"), futureDate(), futureDate() + 10000, [1, 2], { from: manufacturer });
      const idHeldByPharmacy1 = unitId(batchId, 1);

      await instance.initiateTransfer([idHeldByPharmacy1], distributor, { from: manufacturer });
      await instance.acceptTransfer([idHeldByPharmacy1], { from: distributor });
      await instance.initiateTransfer([idHeldByPharmacy1], wholesaler, { from: distributor });
      await instance.acceptTransfer([idHeldByPharmacy1], { from: wholesaler });
      await instance.initiateTransfer([idHeldByPharmacy1], pharmacy, { from: wholesaler });
      await instance.acceptTransfer([idHeldByPharmacy1], { from: pharmacy });

      // pharmacy2 never held this unit, but tries to dispense it.
      const tx = await instance.dispense(idHeldByPharmacy1, bytes32From("rx"), { from: pharmacy2 });
      const suspicious = tx.logs.find((l) => l.event === "SuspiciousActivity");
      assert.isDefined(suspicious);
      assert.equal(suspicious.args.reasonCode.toString(), SuspiciousReason.NotHolder.toString());

      const verify = await instance.verify(idHeldByPharmacy1);
      assert.equal(verify.status.toString(), UnitStatus.Flagged.toString());
    });

    it("flags dispensing from a recalled batch", async () => {
      const batchId = bytes32From("batch-recalled-dispense");
      const id = await carryToPharmacy(batchId, 1, pharmacy);

      await instance.recallBatch(batchId, { from: regulator });

      const tx = await instance.dispense(id, bytes32From("rx"), { from: pharmacy });
      const suspicious = tx.logs.find((l) => l.event === "SuspiciousActivity");
      assert.isDefined(suspicious);
      assert.equal(suspicious.args.reasonCode.toString(), SuspiciousReason.RecalledBatch.toString());
      assert.isFalse(tx.logs.some((l) => l.event === "Dispensed"));

      const verify = await instance.verify(id);
      assert.equal(verify.status.toString(), UnitStatus.Flagged.toString());
      assert.equal(verify.recalled, true);
    });

    it("flags transfer initiated from a recalled batch", async () => {
      const batchId = bytes32From("batch-recalled-transfer");
      await instance.registerBatch(batchId, bytes32From("d"), futureDate(), futureDate() + 10000, [1], { from: manufacturer });
      const id = unitId(batchId, 1);

      await instance.recallBatch(batchId, { from: regulator });

      const tx = await instance.initiateTransfer([id], distributor, { from: manufacturer });
      const suspicious = tx.logs.find((l) => l.event === "SuspiciousActivity");
      assert.isDefined(suspicious);
      assert.equal(suspicious.args.reasonCode.toString(), SuspiciousReason.RecalledBatch.toString());

      const verify = await instance.verify(id);
      assert.equal(verify.status.toString(), UnitStatus.Flagged.toString());
    });

    it("flags an unknown unit ID presented at dispense", async () => {
      const bogusId = unitId(bytes32From("no-such-batch"), 999);
      const tx = await instance.dispense(bogusId, bytes32From("rx"), { from: pharmacy });
      const suspicious = tx.logs.find((l) => l.event === "SuspiciousActivity");
      assert.isDefined(suspicious);
      assert.equal(suspicious.args.reasonCode.toString(), SuspiciousReason.UnknownUnit.toString());
      assert.isFalse(tx.logs.some((l) => l.event === "Dispensed"));

      const verify = await instance.verify(bogusId);
      assert.equal(verify.exists, false);
    });
  });

  // ---------------------------------------------------------------------
  // Expiry and recall surfaced by verify()
  // ---------------------------------------------------------------------
  describe("expiry and recall", () => {
    beforeEach(registerStandardChain);

    it("surfaces batch expiry via verify", async () => {
      const batchId = bytes32From("batch-expiry");
      const manufactureDate = Math.floor(Date.now() / 1000);
      const expiryDate = manufactureDate + 100;
      await instance.registerBatch(batchId, bytes32From("d"), manufactureDate, expiryDate, [1], { from: manufacturer });
      const id = unitId(batchId, 1);

      const verify = await instance.verify(id);
      assert.equal(verify.batchExpiry.toString(), expiryDate.toString());
    });

    it("surfaces recall via verify", async () => {
      const batchId = bytes32From("batch-recallflag");
      await instance.registerBatch(batchId, bytes32From("d"), futureDate(), futureDate() + 10000, [1], { from: manufacturer });
      const id = unitId(batchId, 1);

      let verify = await instance.verify(id);
      assert.equal(verify.recalled, false);

      await instance.recallBatch(batchId, { from: regulator });
      verify = await instance.verify(id);
      assert.equal(verify.recalled, true);
    });
  });

  // ---------------------------------------------------------------------
  // Privacy: no human-readable data on chain
  // ---------------------------------------------------------------------
  describe("privacy (POPIA)", () => {
    beforeEach(registerStandardChain);

    it("stores and emits only identifiers, addresses, enums, timestamps and hashes - no strings", async () => {
      const batchId = bytes32From("batch-privacy");
      const dataHash = bytes32From("off-chain-product-json-hash");
      await instance.registerBatch(batchId, dataHash, futureDate(), futureDate() + 10000, [1], { from: manufacturer });
      const id = unitId(batchId, 1);

      await instance.initiateTransfer([id], distributor, { from: manufacturer });
      await instance.acceptTransfer([id], { from: distributor });
      await instance.initiateTransfer([id], wholesaler, { from: distributor });
      await instance.acceptTransfer([id], { from: wholesaler });
      await instance.initiateTransfer([id], pharmacy, { from: wholesaler });
      await instance.acceptTransfer([id], { from: pharmacy });
      const dispenseTx = await instance.dispense(id, bytes32From("prescription-ref"), { from: pharmacy });

      const batch = await instance.batches(batchId);
      const unit = await instance.units(id);
      const participant = await instance.participants(manufacturer);

      const allStorageValues = [
        batch.manufacturer,
        batch.dataHash,
        batch.manufactureDate,
        batch.expiryDate,
        batch.unitCount,
        batch.recalled,
        unit.batchId,
        unit.currentHolder,
        unit.pendingReceiver,
        unit.status,
        participant.role,
        participant.active,
        participant.profileHash,
      ];

      for (const value of allStorageValues) {
        const asString = value.toString();
        // Every field must be a hex string (address/bytes32), a plain
        // integer (enum/uint), or a boolean - never free-form text.
        const isHex = /^0x[0-9a-fA-F]*$/.test(asString);
        const isInteger = /^[0-9]+$/.test(asString);
        const isBool = asString === "true" || asString === "false";
        assert.isTrue(isHex || isInteger || isBool, `Non-hash/identifier value found on-chain: ${asString}`);
      }

      const dataHashFieldIsAsciiReadable = Buffer.from(dataHash.slice(2), "hex")
        .toString("utf8")
        .replace(/\0/g, "")
        .trim();
      assert.isTrue(dataHashFieldIsAsciiReadable.length > 0, "sanity check: dataHash input itself encodes a short label");
      // The point of the test is the *stored/emitted* representation is a
      // raw bytes32, never decoded/stored as a string field on-chain.
      assert.equal(typeof batch.dataHash, "string");
      assert.isTrue(batch.dataHash.startsWith("0x"));
      assert.equal(batch.dataHash.length, 66);

      const dispensedEvent = dispenseTx.logs.find((l) => l.event === "Dispensed");
      assert.equal(typeof dispensedEvent.args.prescriptionHash, "string");
      assert.isTrue(dispensedEvent.args.prescriptionHash.startsWith("0x"));
      assert.equal(dispensedEvent.args.prescriptionHash.length, 66);
    });
  });

  // ---------------------------------------------------------------------
  // Array caps
  // ---------------------------------------------------------------------
  describe("array caps", () => {
    beforeEach(registerStandardChain);

    it("rejects registerBatch beyond MAX_BATCH_UNITS", async () => {
      const max = (await instance.MAX_BATCH_UNITS()).toNumber();
      const tooMany = Array.from({ length: max + 1 }, (_, i) => i + 1);
      await expectCustomError(
        instance.registerBatch(bytes32From("batch-toomany"), bytes32From("d"), futureDate(), futureDate() + 10000, tooMany, {
          from: manufacturer,
        }),
        "InvalidArrayLength"
      );
    });

    it("rejects initiateTransfer beyond MAX_TRANSFER_BATCH", async () => {
      const max = (await instance.MAX_TRANSFER_BATCH()).toNumber();
      const serials = Array.from({ length: max + 1 }, (_, i) => i + 1);
      const batchId = bytes32From("batch-bigtransfer");
      await instance.registerBatch(batchId, bytes32From("d"), futureDate(), futureDate() + 10000, serials, { from: manufacturer });
      const ids = serials.map((s) => unitId(batchId, s));

      await expectCustomError(instance.initiateTransfer(ids, distributor, { from: manufacturer }), "InvalidArrayLength");
    });
  });

  // ---------------------------------------------------------------------
  // Regulator-only admin
  // ---------------------------------------------------------------------
  describe("regulator administration", () => {
    beforeEach(registerStandardChain);

    it("rejects non-regulator attempts to register a participant", async () => {
      await expectCustomError(
        instance.registerParticipant(outsider, Role.Distributor, ZERO_BYTES32, { from: manufacturer }),
        "Unauthorized"
      );
    });

    it("rejects non-regulator attempts to recall a batch", async () => {
      const batchId = bytes32From("batch-badrecall");
      await instance.registerBatch(batchId, bytes32From("d"), futureDate(), futureDate() + 10000, [1], { from: manufacturer });
      await expectCustomError(instance.recallBatch(batchId, { from: manufacturer }), "Unauthorized");
    });

    it("reinstates a suspended participant", async () => {
      await instance.registerParticipant(suspendedDistributor, Role.Distributor, bytes32From("x"), { from: regulator });
      await instance.suspendParticipant(suspendedDistributor, { from: regulator });
      await instance.reinstateParticipant(suspendedDistributor, { from: regulator });

      const batchId = bytes32From("batch-reinstated");
      await instance.registerBatch(batchId, bytes32From("d"), futureDate(), futureDate() + 10000, [1], { from: manufacturer });
      const id = unitId(batchId, 1);
      await instance.initiateTransfer([id], suspendedDistributor, { from: manufacturer });
      await instance.acceptTransfer([id], { from: suspendedDistributor });

      const verify = await instance.verify(id);
      assert.equal(verify.currentHolderRole.toString(), Role.Distributor.toString());
    });
  });
});
