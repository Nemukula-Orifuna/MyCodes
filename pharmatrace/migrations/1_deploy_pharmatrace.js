const PharmaTrace = artifacts.require("PharmaTrace");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(PharmaTrace, { from: accounts[0] });
  const pt = await PharmaTrace.deployed();

  if (network === "development") {
    // Seed demo actors (account plan in README). In the UI the admin can grant more roles.
    const [, m, d, w, p, i, p2] = accounts;
    await pt.grantRole(await pt.MANUFACTURER_ROLE(), m);
    await pt.grantRole(await pt.DISTRIBUTOR_ROLE(), d);
    await pt.grantRole(await pt.WHOLESALER_ROLE(), w);
    await pt.grantRole(await pt.PHARMACY_ROLE(), p);
    await pt.grantRole(await pt.PHARMACY_ROLE(), p2);
    await pt.grantRole(await pt.INSPECTOR_ROLE(), i);
    console.log("PharmaTrace at", pt.address);
  }
};
