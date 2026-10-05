const PharmaTrace = artifacts.require("PharmaTrace");
const H = require("./helpers");

contract("PharmaTrace - gas per function", (accounts) => {
  const [admin, m, d, w, p] = accounts;
  it("records gasUsed for each state-changing function", async () => {
    const rows = [];
    const g = (fn, tx) => rows.push({ function: fn, gasUsed: Number(tx.receipt.gasUsed) });

    const pt = await PharmaTrace.new({ from: admin });
    const deployReceipt = await web3.eth.getTransactionReceipt(pt.transactionHash);
    rows.push({ function: "deploy", gasUsed: Number(deployReceipt.gasUsed) });

    g("grantRole", await pt.grantRole(await pt.MANUFACTURER_ROLE(), m));
    await pt.grantRole(await pt.DISTRIBUTOR_ROLE(), d);
    await pt.grantRole(await pt.WHOLESALER_ROLE(), w);
    await pt.grantRole(await pt.PHARMACY_ROLE(), p);

    for (let i = 0; i < 5; i++) {                                // repeat to report mean/min/max
      const rec = H.makeRecord(`GAS-${i}`);
      g("registerProduct", await H.register(pt, rec, m));
      g("transferCustody(M->D)", await pt.transferCustody(rec.gtin, rec.serial, d, { from: m }));
      g("transferCustody(D->W)", await pt.transferCustody(rec.gtin, rec.serial, w, { from: d }));
      g("transferCustody(W->P)", await pt.transferCustody(rec.gtin, rec.serial, p, { from: w }));
      g("recordScan", await pt.recordScan(rec.gtin, rec.serial, H.recordHash(web3, rec), { from: p }));
      g("dispense", await pt.dispense(rec.gtin, rec.serial, { from: p }));
    }
    const summary = {};
    rows.forEach(({ function: f, gasUsed }) => (summary[f] = summary[f] || []).push(gasUsed));
    console.table(Object.entries(summary).map(([f, v]) =>
      ({ function: f, n: v.length, mean: Math.round(v.reduce((a, b) => a + b, 0) / v.length),
         min: Math.min(...v), max: Math.max(...v) })));
  });
});
