module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
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
