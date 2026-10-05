// truffle-config.js
module.exports = {
  // Write artifacts straight into the React app so the client always has the latest ABI + address.
  contracts_build_directory: "./client/src/contracts",
  networks: {
    development: { host: "127.0.0.1", port: 8545, network_id: "1337" },
  },
  mocha: {
    timeout: 120000,
    reporter: process.env.GAS_REPORT ? "eth-gas-reporter" : "spec",
    reporterOptions: {
      currency: "ZAR",        // only shown if you supply a coinmarketcap key; otherwise gas units only
      gasPrice: 20,           // gwei, fixed so the reporter does not call a price API (runs offline)
      noColors: true,
      outputFile: "gas-report.txt",
      showTimeSpent: true,
      excludeContracts: ["Migrations"],
    },
  },
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: { enabled: true, runs: 200 },
        evmVersion: "paris", // conservative target; avoids post-Shanghai opcodes (PUSH0) on Ganache 7
      },
    },
  },
};
