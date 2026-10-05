const PharmaTrace = artifacts.require("PharmaTrace");
const H = require("./helpers");
const { canonicalise } = require("../shared/hashing");

const ZERO = "0x0000000000000000000000000000000000000000";

contract("PharmaTrace - functional requirements", (accounts) => {
  const [admin, manufacturer, distributor, wholesaler, pharmacy, inspector, pharmacy2, outsider] = accounts;
  let pt;

  beforeEach(async () => {
    pt = await PharmaTrace.new({ from: admin });              // fresh deployment per test (isolation)
    await pt.grantRole(await pt.MANUFACTURER_ROLE(), manufacturer, { from: admin });
    await pt.grantRole(await pt.DISTRIBUTOR_ROLE(), distributor, { from: admin });
    await pt.grantRole(await pt.WHOLESALER_ROLE(), wholesaler, { from: admin });
    await pt.grantRole(await pt.PHARMACY_ROLE(), pharmacy, { from: admin });
    await pt.grantRole(await pt.PHARMACY_ROLE(), pharmacy2, { from: admin });
    await pt.grantRole(await pt.INSPECTOR_ROLE(), inspector, { from: admin });
  });

  async function moveToPharmacy(rec) {
    await pt.transferCustody(rec.gtin, rec.serial, distributor, { from: manufacturer });
    await pt.transferCustody(rec.gtin, rec.serial, wholesaler, { from: distributor });
    await pt.transferCustody(rec.gtin, rec.serial, pharmacy, { from: wholesaler });
  }

  it("off-chain hashing matches on-chain hashing (soliditySha3 == keccak256(bytes))", async () => {
    const rec = H.makeRecord("SN-HASH");
    assert.equal(await pt.hashRecord(canonicalise(rec)), H.recordHash(web3, rec));
    const offKey = web3.utils.keccak256(web3.eth.abi.encodeParameters(["string", "string"], [rec.gtin, rec.serial]));
    assert.equal(await pt.productKeyOf(rec.gtin, rec.serial), offKey);
  });

  it("S1: genuine product completes the journey and verifies as Authentic at the pharmacy", async () => {
    const rec = H.makeRecord("SN-0001");
    const tx = await H.register(pt, rec, manufacturer);
    assert.equal(tx.logs[0].event, "ProductRegistered");
    await moveToPharmacy(rec);

    const v = await pt.verifyProduct(rec.gtin, rec.serial, H.recordHash(web3, rec));
    assert.equal(v.status.toString(), String(H.Status.Authentic));
    assert.equal(v.stage.toString(), String(H.Stage.Pharmacy));
    assert.equal(v.currentHolder, pharmacy);
    assert.equal(v.history.length, 4);
    const expected = [[H.Stage.Manufacturer, ZERO, manufacturer],
                      [H.Stage.Distributor, manufacturer, distributor],
                      [H.Stage.Wholesaler, distributor, wholesaler],
                      [H.Stage.Pharmacy, wholesaler, pharmacy]];
    v.history.forEach((h, i) => {
      assert.equal(h.stage.toString(), String(expected[i][0]));
      assert.equal(h.from, expected[i][1]);
      assert.equal(h.to, expected[i][2]);
      assert(Number(h.timestamp) > 0, "timestamp recorded");
    });

    const d = await pt.dispense(rec.gtin, rec.serial, { from: pharmacy });
    assert.equal(d.logs[0].event, "ProductDispensed");
  });

  it("S2: never-registered identifier returns NotRegistered with empty history", async () => {
    const rec = H.makeRecord("SN-FAKE");
    const v = await pt.verifyProduct(rec.gtin, rec.serial, H.recordHash(web3, rec));
    assert.equal(v.status.toString(), String(H.Status.NotRegistered));
    assert.equal(v.history.length, 0);
    const scan = await pt.recordScan(rec.gtin, rec.serial, H.recordHash(web3, rec), { from: pharmacy });
    assert.equal(scan.logs[0].event, "ProductScanned");                 // counterfeit attempt is logged
    assert.equal(scan.logs[0].args.status.toString(), String(H.Status.NotRegistered));
  });

  it("S3a: unauthorised account cannot register", async () => {
    await H.expectRevert(H.register(pt, H.makeRecord("SN-0002"), outsider), "is missing role");
    await H.expectRevert(H.register(pt, H.makeRecord("SN-0003"), distributor), "is missing role");
  });

  it("S3b: only the current holder may transfer; outsiders cannot dispense or scan", async () => {
    const rec = H.makeRecord("SN-0004");
    await H.register(pt, rec, manufacturer);
    await H.expectRevert(pt.transferCustody(rec.gtin, rec.serial, distributor, { from: outsider }),
                         "Caller is not current holder");
    await pt.transferCustody(rec.gtin, rec.serial, distributor, { from: manufacturer });
    await H.expectRevert(pt.transferCustody(rec.gtin, rec.serial, wholesaler, { from: manufacturer }),
                         "Caller is not current holder");
    await H.expectRevert(pt.dispense(rec.gtin, rec.serial, { from: outsider }), "is missing role");
    await H.expectRevert(pt.recordScan(rec.gtin, rec.serial, H.recordHash(web3, rec), { from: outsider }),
                         "Caller is not an authorised actor");
  });

  it("S3c: only the admin can grant roles", async () => {
    await H.expectRevert(pt.grantRole(await pt.MANUFACTURER_ROLE(), outsider, { from: manufacturer }),
                         "is missing role");
  });

  it("S4: duplicate identifier (GTIN + serial) is rejected", async () => {
    const rec = H.makeRecord("SN-0005");
    await H.register(pt, rec, manufacturer);
    await H.expectRevert(H.register(pt, { ...rec, batchNo: "OTHER" }, manufacturer), "Duplicate identifier");
  });

  it("S5: transfers that skip a stage are rejected", async () => {
    const rec = H.makeRecord("SN-0006");
    await H.register(pt, rec, manufacturer);
    await H.expectRevert(pt.transferCustody(rec.gtin, rec.serial, wholesaler, { from: manufacturer }),
                         "Recipient lacks role for next stage");
    await H.expectRevert(pt.transferCustody(rec.gtin, rec.serial, pharmacy, { from: manufacturer }),
                         "Recipient lacks role for next stage");
    await pt.transferCustody(rec.gtin, rec.serial, distributor, { from: manufacturer });
    await H.expectRevert(pt.transferCustody(rec.gtin, rec.serial, pharmacy, { from: distributor }),
                         "Recipient lacks role for next stage");
  });

  it("S6: altered off-chain record no longer matches the on-chain hash", async () => {
    const rec = H.makeRecord("SN-0007");
    await H.register(pt, rec, manufacturer);
    const tampered = { ...rec, expiry: "2035-12-31" };          // attacker extends shelf life off-chain
    const v = await pt.verifyProduct(rec.gtin, rec.serial, H.recordHash(web3, tampered));
    assert.equal(v.status.toString(), String(H.Status.HashMismatch));
    const ok = await pt.verifyProduct(rec.gtin, rec.serial, H.recordHash(web3, rec));
    assert.equal(ok.status.toString(), String(H.Status.Authentic));
  });

  it("S7: second scan after dispensing is flagged as a suspected clone", async () => {
    const rec = H.makeRecord("SN-0008");
    const h = H.recordHash(web3, rec);
    await H.register(pt, rec, manufacturer);
    await moveToPharmacy(rec);
    await pt.dispense(rec.gtin, rec.serial, { from: pharmacy });

    let v = await pt.verifyProduct(rec.gtin, rec.serial, h);
    assert.equal(v.status.toString(), String(H.Status.AlreadyDispensed));

    const scan = await pt.recordScan(rec.gtin, rec.serial, h, { from: pharmacy2 });
    assert(scan.logs.some((l) => l.event === "CloneSuspected"), "CloneSuspected emitted");
    v = await pt.verifyProduct(rec.gtin, rec.serial, h);
    assert.equal(v.status.toString(), String(H.Status.Flagged));
    await H.expectRevert(pt.dispense(rec.gtin, rec.serial, { from: pharmacy }), "Product flagged");
  });

  it("S7b: scan by a different pharmacy before dispensing is also flagged", async () => {
    const rec = H.makeRecord("SN-0009");
    await H.register(pt, rec, manufacturer);
    await moveToPharmacy(rec);
    const scan = await pt.recordScan(rec.gtin, rec.serial, H.recordHash(web3, rec), { from: pharmacy2 });
    assert(scan.logs.some((l) => l.event === "CloneSuspected"));
  });

  it("S8: expired product is reported, flagged on scan and cannot be dispensed", async () => {
    const now = await H.latestTimestamp();
    const rec = H.makeRecord("SN-0010", H.unixToIsoDate(now + 24 * 3600)); // expires end of tomorrow (UTC)
    const h = H.recordHash(web3, rec);
    await H.register(pt, rec, manufacturer);
    await moveToPharmacy(rec);
    await H.increaseTime(3 * 24 * 3600);                                      // jump past expiry

    const v = await pt.verifyProduct(rec.gtin, rec.serial, h);
    assert.equal(v.status.toString(), String(H.Status.Expired));
    const scan = await pt.recordScan(rec.gtin, rec.serial, h, { from: pharmacy });
    assert(scan.logs.some((l) => l.event === "ExpiredProductFlagged"));
    await H.expectRevert(pt.dispense(rec.gtin, rec.serial, { from: pharmacy }), "Product expired");
  });

  it("rejects registration of an already-expired product and malformed GTINs", async () => {
    await H.expectRevert(H.register(pt, H.makeRecord("SN-0011", "2020-01-01"), manufacturer), "Already expired");
    await H.expectRevert(H.register(pt, H.makeRecord("SN-0012", "2030-12-31", { gtin: "12345" }), manufacturer),
                         "GTIN must be 14 digits");
  });

  it("emits an event for every state change (audit trail)", async () => {
    const rec = H.makeRecord("SN-0013");
    const events = [];
    const collect = (tx) => tx.logs.forEach((l) => events.push(l.event));
    collect(await H.register(pt, rec, manufacturer));
    collect(await pt.transferCustody(rec.gtin, rec.serial, distributor, { from: manufacturer }));
    collect(await pt.transferCustody(rec.gtin, rec.serial, wholesaler, { from: distributor }));
    collect(await pt.transferCustody(rec.gtin, rec.serial, pharmacy, { from: wholesaler }));
    collect(await pt.dispense(rec.gtin, rec.serial, { from: pharmacy }));
    collect(await pt.flagProduct(rec.gtin, rec.serial, "Inspection hold", { from: inspector }));
    assert.deepEqual(events, ["ProductRegistered", "CustodyTransferred", "CustodyTransferred",
                              "CustodyTransferred", "ProductDispensed", "ProductFlagged"]);
  });
});
