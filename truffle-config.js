module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      // Pinned (not "*") so the deployed address Truffle writes into
      // build/contracts/*.json under networks["1337"] stays valid across
      // Ganache restarts - the frontend reads that address directly. Start
      // Ganache with `--chain.chainId 1337` to match (see package.json).
      network_id: 1337
    }
  },
  mocha: {
    reporter: "eth-gas-reporter",
    reporterOptions: {
      excludeContracts: ["Migrations"],
      currency: "ZAR",
      showTimeSpent: true
    }
  },
  compilers: {
    solc: {
      // Pinned to the locally installed solc npm package (0.8.19) rather than
      // a version string, because Truffle's remote-download strategy fetches
      // from binaries.soliditylang.org, which this environment's network
      // policy blocks. Using the local solc-js binary avoids that dependency.
      version: "./node_modules/solc/soljson.js",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
