# PharmaTrace — Blockchain-Based Authentication for Preventing Counterfeit Pharmaceuticals

A Design Science Research artefact built for a Computer Science dissertation
(South African context). Tracks custody of serialised pharmaceutical packs from
manufacture to dispensing on a Solidity smart contract, keeps every
human-readable record off-chain (POPIA), and gives a patient a way to verify a
pack's authenticity without a wallet.

See `DESIGN_NOTES.md` for every design decision, its rationale, and known
limitations — including the four the brief specifically asks for: the
view-function detection limitation, the Ganache performance caveat, the
off-chain store trust boundary, and the array caps.

## Project layout

```
contracts/        PharmaSupplyChain.sol
migrations/        Truffle deployment scripts
test/               Truffle (Solidity) test suite
offchain/           Express + SQLite service (participant profiles, batch
                     details, prescription references, each with a
                     keccak256 hash anchored on-chain)
client/             React + Vite + Web3.js frontend
shared/             Canonical-JSON hashing rule + its test vectors, the
                     single source of truth both offchain/ and client/
                     implement identically
benchmarks/caliper/ Hyperledger Caliper on-chain workload benchmarks
benchmarks/jmeter/  JMeter off-chain API + verify-flow load test
```

## Prerequisites

- **Node.js 18 LTS** (`.nvmrc` pins this — `nvm use` or `nvm install`).
  Truffle and Ganache are unmaintained and do not reliably work on newer
  Node; this project was built and tested on Node 18.20.8 specifically.
  (Hyperledger Caliper CLI's *latest* release needs Node ≥22, so this
  project pins Caliper to `0.6.0`, the newest release that still supports
  Node 18 — see `DESIGN_NOTES.md`.)
- **Java** (for JMeter). Any recent JDK; this was built against OpenJDK 21.
- **JMeter 5.6.3** on your `PATH` as `jmeter`. The Debian/Ubuntu `apt`
  package is JMeter 2.13 from 2015 — download the real thing instead:
  ```bash
  curl -LO https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.6.3.tgz
  tar xzf apache-jmeter-5.6.3.tgz
  export PATH="$PWD/apache-jmeter-5.6.3/bin:$PATH"
  ```

## Setup

Each of the four JS subprojects (root/contracts, `offchain/`, `client/`,
`benchmarks/caliper/`) has its own `package.json` and is installed
separately:

```bash
nvm use                        # Node 18
npm install                    # root: Truffle, Ganache, solc, eth-gas-reporter
(cd offchain && npm install)
(cd client && npm install)
(cd benchmarks/caliper && npm install)
```

`solc` is pinned as an npm devDependency and `truffle-config.js` points at
its local binary directly, rather than letting Truffle download a compiler
version from `binaries.soliditylang.org` at compile time — some network
policies block that host; this sidesteps it entirely and makes the compiler
version reproducible from `package-lock.json` either way.

## Run the full stack locally

Four long-running processes, each in its own terminal:

```bash
# 1. Local chain — port 8545, deterministic accounts, chain ID 1337
npm run ganache

# 2. Deploy the contract (re-run after any contract change or Ganache restart)
npx truffle migrate --network development --reset

# 3. Off-chain service — port 4000
cd offchain && npm start

# 4. Frontend — http://localhost:5173 (also copies the compiled ABI/address
#    into client/src/contracts/ before starting, via sync-contract)
cd client && npm run dev
```

Import a few of Ganache's printed deterministic private keys into MetaMask
and add a custom network for `http://127.0.0.1:8545`, chain ID `1337`, to
act as a participant. The public verification page (`/verify`) needs no
wallet at all — it talks to the chain read-only.

See `client/WALKTHROUGH.md` for a role-by-role, verdict-by-verdict manual
test script, including which parts were already driven end-to-end in this
repository's own development (with a minimal injected EIP-1193 provider
standing in for MetaMask, since no browser extension is installable in a
headless environment) versus which still need a human with real MetaMask.

## Test

```bash
# Contract (22 tests) — needs Ganache running (step 1 above) and the
# contract deployed on chain 1337 (step 2)
npx truffle test --network development

# Off-chain service (24 tests, no chain needed)
cd offchain && npm test

# Frontend unit tests (31 tests, no chain or servers needed)
cd client && npm test
```

Gas usage is reported automatically by `truffle test` via
`eth-gas-reporter` (configured in `truffle-config.js`); the array caps in
`PharmaSupplyChain.sol` (`MAX_BATCH_UNITS`, `MAX_TRANSFER_BATCH`) are sized
directly from those measured figures — see `DESIGN_NOTES.md`.

## Benchmark

Full methodology, raw numbers, and the two real bugs this process caught
(a Caliper gas-estimation quirk and a JMeter variable-scoping bug) are in
`benchmarks/RESULTS.md`. Short version:

```bash
cd benchmarks/caliper
npm run bind                      # installs the Ethereum SDK Caliper binds to
npm run configs                   # (re)generate networks/*.json from the
                                   # currently deployed contract
npm run register-participants     # idempotent — registers the Manufacturer/
                                   # Distributor/Wholesaler/Pharmacy accounts

npm run run:registerBatch         # no seeding needed
npm run run:initiateTransfer      # seeds its own preconditions first
npm run run:acceptTransfer
npm run run:dispense
npm run run:verify
```

Each `run:*` script writes an HTML report under `results/<workload>-report.html`
in the current working directory — pass `--caliper-report-path
results/<mining-mode>/<workload>-report.html` (as the committed results do)
to keep instant-mining and fixed-block-time runs separate. To benchmark
under a fixed block time instead of instant mining, restart Ganache with
`--miner.blockTime 2` (or any interval) before re-running the steps above
against a fresh deployment.

```bash
cd benchmarks/jmeter
# with the off-chain service (port 4000) and Ganache (port 8545) running:
jmeter -n -t pharma-offchain-and-verify.jmx \
  -l results/raw-results.jtl -e -o results/html-report
```

The `.jmx` file's `JMETER_BATCH_ID`/`JMETER_UNIT_ID`/`JMETER_VERIFY_CALLDATA`
user-defined variables point at one specific pre-existing unit — regenerate
them for a fresh deployment the same way `benchmarks/caliper/scripts/seed.js`
does (register a batch as the Manufacturer, compute the unit's ID, ABI-encode
a `verify(unitId)` call).

## Privacy (POPIA)

The chain stores only identifiers, addresses, enums, timestamps, and
`keccak256` hashes — enforced by `offchain/src/prescriptionPrivacyGuard.js`
rejecting any prescription payload containing a patient-identifying field
name, and tested directly in `contracts/PharmaSupplyChain.sol`'s test suite
(`privacy (POPIA)` describe block) and in `offchain/test/`. Patient identity
is never stored anywhere in this system — dispensing records only a hash of
the prescription reference.
