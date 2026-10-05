# PharmaTrace

Blockchain-based authentication for preventing counterfeit pharmaceuticals.
Truffle 5.11.5 + Ganache 7.9.2 + Solidity 0.8.19 + OpenZeppelin 4.9.6 + React 18 (Vite) + Web3.js 4.

Implementation of the *Development Guide: Blockchain-Based Authentication for Preventing
Counterfeit Pharmaceuticals*. The toolchain is deliberately frozen: Truffle and Ganache were sunset by
Consensys in 2023, so versions are pinned with `--save-exact` and `package-lock.json` is committed.

## Layout

```
contracts/PharmaTrace.sol            AccessControl roles, GS1 ids, custody history, verify/scan/flag
migrations/1_deploy_pharmatrace.js   deploys + seeds demo roles on "development"
test/                                functional (S1–S8 + hash consistency + audit) and gas tests
shared/hashing.js                    canonicalise + recordHash (CommonJS; client/src/lib/hashing.js mirrors it)
offchain-store/                      Express + JSON-file store for human-readable records (port 4000)
client/                              Vite + React 18 + Web3 4 UI (port 5173)
caliper/                             Hyperledger Caliper 0.6.0 benchmarks (register, transfer, verify)
jmeter/                              JMeter eth_call load test for verifyProduct
security/                            Slither / Mythril configs
```

## Setup (Windows 10/11, Node 20 LTS)

Node 20 is the only LTS line supported by Truffle 5.11, Ganache 7 and Caliper 0.6 together. Node 22/24
are outside Truffle's tested range. nvm-windows does not read `.nvmrc`, so run `nvm use 20` in every new terminal.

```powershell
nvm install 20; nvm use 20
npm install                           # root: truffle, ganache, OZ 4.9.6, eth-gas-reporter, web3 4
cd offchain-store; npm install; cd ..
cd client; npm install; cd ..
```

## Run

| Terminal | Command | Notes |
|---|---|---|
| 1 | `npm run chain` | Ganache, deterministic accounts, chain/network ID 1337, state kept in `.ganache-db` |
| 2 | `npm run migrate` | compiles, deploys, writes `client/src/contracts/PharmaTrace.json` |
| 3 | `cd offchain-store; npm start` | `npm run start:tamper` enables the tamper demo endpoint |
| 4 | `cd client; npm run dev` | open http://localhost:5173 |

Account plan (deterministic Ganache): 0 = admin/regulator, 1 = manufacturer, 2 = distributor,
3 = wholesaler, 4 = pharmacy, 5 = inspector, 6 = second pharmacy (clone test), 7 = outsider.
These keys are public. Never use them on a real network.

After `npm run chain:fresh` always re-run `npm run migrate` and restart Vite. If you use MetaMask, also
clear its activity and nonce data for the network.

## Tests

```powershell
npm test          # needs Ganache running (npm run chain)
npm run test:gas  # same tests with eth-gas-reporter -> gas-report.txt
```

Each test deploys a fresh contract in `beforeEach`. Coverage: hash consistency (off-chain `soliditySha3`
== on-chain `keccak256(bytes)`, and `productKeyOf` == `keccak256(abi.encode(gtin, serial))`), S1 genuine
journey, S2 unregistered, S3a/b/c access control, S4 duplicates, S5 stage skipping, S6 altered off-chain
record, S7/S7b clone detection, S8 expiry, input validation and the event audit trail.

Measured gas (optimizer on, 200 runs): deploy ≈ 2.54M, registerProduct ≈ 200–220k,
transferCustody ≈ 94k, dispense ≈ 86k, recordScan ≈ 41–52k, grantRole ≈ 51.5k.

## Evaluation

**Caliper 0.6.0** (the last version with the Ethereum connector, WebSocket only):

```powershell
cd caliper; npm install; npm run bind
npm run contract     # converts the Truffle artifact into {name, abi, bytecode, gas}
npm run bench        # -> report.html
```

Caliper deploys its own contract instance. Keep `workers.number: 1`, because the transfer round reuses
the serials from the register round. If `caliper bind` fails on Windows, run Caliper in WSL2 with Node 20.

**JMeter 5.6** (concurrent `eth_call` to `verifyProduct`):

```powershell
node jmeter/make-calldata.js 0xCaliperContractAddress 500
cd jmeter; jmeter -n -t verify-ethcall.jmx -Jcontract=0xCaliperContractAddress -Jthreads=50 -Jloops=20 -l results.jtl -e -o report
```

The plan asserts that each response has a result **and** that it is not the empty `"0x"` that Ganache
returns for a wrong contract address.

**Slither / Mythril**

```powershell
py -m pip install slither-analyzer solc-select; solc-select install 0.8.19; solc-select use 0.8.19
slither contracts/PharmaTrace.sol --solc-remaps "@openzeppelin/=node_modules/@openzeppelin/" --exclude-dependencies
docker run --rm -v ${PWD}:/src mythril/myth analyze /src/contracts/PharmaTrace.sol --solv 0.8.19 --solc-json /src/security/mythril-remap.json --execution-timeout 600
```

Ganache results (automine or `npm run chain:interval`) are **indicative only**. A single-process
simulator has no peer-to-peer propagation and no consensus, so compare functions and load levels
within one machine. Don't compare them with public-network figures.

## Differences from the guide

The guide's code blocks are clipped at the right margin, so the truncated lines were reconstructed.
Beyond that reconstruction, these changes were made:

- **Gas for client transactions.** With Web3 4 and no `gas` field, Ganache applies its default limit of
  90,000. `transferCustody` needs about 94k, so the guide's TransferPanel would revert out of gas in
  direct-Ganache mode. Every client transaction now goes through `send()` in `client/src/lib/web3.js`,
  which estimates the gas and adds a 25% margin.
- **Role loading race.** The UI showed "none (unauthorised)" until roles loaded. After an account switch
  it also briefly showed the previous account's panels. Roles now reset to a loading state on every change.
- `test:gas` uses `cross-env` instead of `set VAR=1&&`, so it works on Windows, macOS and Linux.
- `qrcode.react` 4.x deprecates `includeMargin`, so the client uses `marginSize`.
- AdminPanel also has a Revoke button. RoleBar is its own component.
- The off-chain store accepts `PORT` and `STORE_DB` environment variables, and a second JMeter assertion was added.

## Known limitations (state these in Chapters 3/5)

- **Unsupported runtime.** Node 20 reached end-of-life on 30 April 2026, and Truffle, Ganache and Web3 1.x
  are unmaintained. Hardhat/Foundry with viem/ethers are the maintained path.
- **Clone detection has a gap.** A clone is caught only when **both** scans go through `recordScan`.
  `verifyProduct` is a free view call and records nothing, and a pack sold outside the authorised chain
  is never scanned.
- **One admin key.** The admin is a single externally owned account; production would use a multisig.
- **Roles can be combined.** The contract does not stop one account from holding two supply-chain roles.
  An account with two roles could skip a stage by transferring to itself, so this is enforced only by
  admin procedure.
- **No GTIN check digit.** The contract checks for 14 digits but not the GS1 mod-10 check digit. The demo
  GTIN `06009000000017` has an **invalid** check digit (the correct one would be `06009000000014`). The
  QR payload is a parenthesised GS1 element string, not a GS1 DataMatrix.
- **Model, not compliance.** The data model follows SAHPRA's traceability guideline (AI 01/17/10/21);
  the prototype does not claim compliance with it.
