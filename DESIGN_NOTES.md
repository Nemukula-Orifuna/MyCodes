# Design notes

Every non-obvious decision made while building this artefact, why it was
made that way, and what it does not cover. Organised by component, with a
consolidated "known limitations" section at the end that explicitly covers
the four items the brief calls out: the view-function detection limitation,
the Ganache performance caveat, the off-chain store trust boundary, and the
array caps.

## Contract (`contracts/PharmaSupplyChain.sol`)

### Tracking unit and ID derivation

Each serialised pack is tracked individually. `unitId =
keccak256(abi.encodePacked(batchId, serialNumber))` — tight packing (not
ABI-encoding, which would zero-pad `serialNumber` to 32 bytes first) so the
same formula is cheap to reproduce off-chain in exactly one line, in both the
frontend (`client/src/lib/ids.js`) and every test/benchmark script that needs
to compute a unit's ID without asking the chain for it. `batchId` itself is
derived the same way from a human-typed "batch reference" string
(`keccak256(reference)`) purely as a data-entry convenience — the contract
never sees or stores the reference text itself, only the resulting
`bytes32`.

### Custody order and the two-step handover

Custody is enforced strictly Manufacturer → Distributor → Wholesaler →
Pharmacy via a `_nextRole()` lookup checked in `initiateTransfer`, so a
skipped or reversed step reverts with `InvalidReceiver` before any state
changes. Handover is two-step (`initiateTransfer` sets `pendingReceiver` and
status `InTransit`; `acceptTransfer` is a separate transaction from the
receiver) specifically so custody can never move without the receiver's own
on-chain acknowledgement — a holder cannot unilaterally make someone else the
custodian of a unit they never agreed to receive.

### Counterfeit detection: revert vs. flag-and-continue

This is the one piece of contract logic that is easy to get backwards. A
`revert` rolls back every event emitted during that call — including any
`SuspiciousActivity` event that would otherwise be the on-chain evidence that
an attack was attempted. So the four attack cases the brief specifies
(dispensing an already-dispensed unit, a transfer/dispense attempted by a
non-holder, any operation touching a recalled batch, an unknown unit ID
presented at dispense) are deliberately **not** reverts: the unit is set to
`Flagged` where there is state to flag, `SuspiciousActivity(unitId, actor,
reasonCode)` is emitted, and the function returns normally (`dispense`
returns `false`; `initiateTransfer`/`acceptTransfer` simply skip that unit
and continue with the rest of the batch array). Genuine caller/programmer
errors — wrong role calling an admin function, a skipped custody step, an
oversized array — still revert via custom errors, because those aren't
evidence of counterfeiting, just invalid calls that cost nothing to reject
outright.

One exception worth being explicit about: an **unknown unit ID presented at
dispense** has no existing `Unit` struct to set to `Flagged` — there is
nothing to flag. The event alone (`SuspiciousActivity(unitId, actor,
UnknownUnit)`) is the only evidence in that one case, which is why the NatSpec
comment on `dispense` calls it out separately.

### Array caps (registerBatch / initiateTransfer / acceptTransfer)

`MAX_BATCH_UNITS = 100` and `MAX_TRANSFER_BATCH = 50` are not arbitrary —
they come directly from gas measured on this contract (a 1/10/50/100-unit
sweep, reproduced in `benchmarks/caliper/results/` and originally measured
via `eth-gas-reporter` in the Truffle test suite):

- `registerBatch`'s marginal cost is ~117,500 gas/unit (a new `Unit` struct
  write plus a `CustodyRecord` push, per unit, in the loop). 100 units costs
  ~11.85M gas — 39.5% of Ganache's default 30,000,000 block gas limit,
  leaving room for other transactions in the same block.
- `initiateTransfer`'s marginal cost is ~65,200 gas/unit and
  `acceptTransfer`'s is ~68,000 gas/unit (each touches an *existing* `Unit`
  via a storage read-modify-write, plus a `CustodyRecord` push). 50 units
  costs ~3.3–3.4M gas — about 11% of the block limit.

Both caps are documented with these exact figures directly as comments in
the contract, not just here, so the rationale travels with the code.

### View-function detection limitation (`verify()`)

`verify()` is a `view` function, so by definition it cannot write to
storage — it cannot itself flag a counterfeit, record that a check happened,
or emit an event. If a patient scans an unopened pack and `verify()` returns
`Dispensed` or `Flagged`, that pack is almost certainly a clone (the genuine
unit was already dispensed elsewhere, or the chain already caught an anomaly
on it), but the contract has no way to *act* on a mere lookup — only
`dispense()`/`initiateTransfer()`/`acceptTransfer()` can detect and record a
new anomaly, because only they are state-changing transactions. This means:

- The frontend, not the contract, is responsible for presenting `Dispensed`
  and `Flagged` `verify()` results as counterfeit warnings
  (`client/src/lib/verdict.js`'s priority ordering puts `Flagged` and
  `Already dispensed` above `Recalled`/`Expired`/`Genuine` for exactly this
  reason).
- A patient looking up a genuinely cloned pack that simply hasn't been
  scanned by anyone else yet will see `Genuine` — `verify()` can only report
  what the chain has already recorded, not detect a clone on first sight.
  Only a second presentation of the same ID (a real dispense attempt, or
  another `initiateTransfer`/`acceptTransfer`) produces the on-chain evidence
  that flips the verdict.

This is a fundamental limitation of the "verify without a role, without a
transaction, without gas" requirement, not an implementation gap — any
design that lets the public check authenticity for free, without submitting
a transaction, has the same ceiling.

### Why custom errors, not `require(..., "string")`

Custom errors are cheaper (no string data in the revert payload) and are
what the test suite and frontend decode to distinguish *which* precondition
failed. The one real cost: Ganache v7 does not decode custom errors into
readable reason strings over JSON-RPC — both the Truffle test suite
(`test/helpers.js`) and the frontend's benchmark scripts compute the
4-byte selector (`keccak256("ErrorName()").slice(0,10)`) themselves and
match on that, documented inline at each point this matters.

## Off-chain service (`offchain/`)

### Trust boundary — never the source of truth

The off-chain service's job is to store human-readable records (participant
profiles, batch product details, prescription references) and hand back,
alongside each one, the same `keccak256` hash that was anchored on-chain
when that record was created. It is explicitly **never** asked to assert
that a record is authentic — the caller (the frontend, a test, a benchmark
script) is always the one that recomputes the hash from the returned JSON
and compares it to what the chain says. If someone tampers with the
SQLite database directly, every GET still returns 200 with the tampered
JSON; only the hash comparison on the *caller's* side would catch it,
visible on the public verify page as "Hash mismatch — off-chain record does
not match the chain". The service has no code path that could make it
assert trust it can't back up, because it never talks to the chain at all —
it holds no RPC client, no contract ABI, nothing. That absence is
deliberate, not an oversight.

### Canonicalisation rule

Documented in full in `shared/CANONICALIZATION.md`: sort object keys
recursively (arrays keep their given order), `JSON.stringify` the result
with no whitespace, hash the UTF-8 bytes with Keccak-256 (`js-sha3`'s
`keccak256`, confirmed byte-for-byte identical to `web3-utils.keccak256` on
the same string — this matters because Keccak-256 and the NIST-standardised
SHA3-256 produce different digests for the same input, and it's an easy
mistake to use the wrong one). The implementation lives once in
`shared/canonicalHash.js` (CommonJS, used directly by `offchain/`) and is
hand-mirrored once more in `client/src/lib/canonicalHash.js` (ES modules,
since bundling a relative `require()` across the Vite project boundary is
reliable at build time but not in `vite dev`, whose dev server restricts
serving files outside its own project root). The duplication is not just
asserted to be correct — `shared/test-vectors.json` holds real computed
`{input, canonicalJson, hash}` triples that *both* `offchain/test/` and
`client/src/lib/canonicalHash.test.js` assert against, so any drift between
the two copies fails both test suites rather than silently diverging.

### Prescription privacy guard

"Patient identity is never stored anywhere" is a hard requirement, not just
an on-chain one — so `offchain/src/prescriptionPrivacyGuard.js` rejects any
`POST /api/prescriptions` payload containing a field name matching a
denylist (`patient`, `name`, `surname`, `idnumber`, `dob`, `contact`,
`email`, `address`, …), checked recursively through nested objects and
arrays. This is defense-in-depth at the one API boundary where patient data
could plausibly be entered by mistake; `/api/participants` and
`/api/batches` don't get the same guard because organisation names and
product details aren't patient data.

### Why `better-sqlite3`, why `node:test`

`better-sqlite3` gives a synchronous API, which keeps the route handlers
simple (no callback/promise plumbing around what is, for this service, a
tiny embedded database) and avoids the native-build friction some
alternatives have. `node:test` (Node 18's built-in test runner) was chosen
over pulling in Jest or Mocha for a service this small — no extra
dependency, and `node --test test/` is all that's needed.

### Dev-only CORS

`offchain/src/app.js` reflects the request's `Origin` header back as
`Access-Control-Allow-Origin` rather than hardcoding one. This surfaced only
when actually driving the real frontend in a real browser against the real
API in this session — unit/integration tests that call the Express app
in-process never exercise CORS at all, so the gap was invisible until a
genuine end-to-end run. It's appropriate for a local development service
(the frontend dev server and this API run on different localhost ports,
never across a real trust boundary); it is explicitly **not** the right
CORS policy for a deployed service, which should allowlist specific origins.

## Frontend (`client/`)

### Vite, not Create React App

The brief says "ReactJS + Web3.js" without mandating a build tool. Create
React App was the conventional pairing with Truffle+Web3.js tutorials
historically, but CRA itself is effectively unmaintained now (deprecated by
the React team). Vite is actively maintained, faster, and works cleanly on
Node 18. The one friction this caused: Vite's dev server restricts serving
files outside its project root, which is why the compiled contract artifact
is copied into `client/src/contracts/` by a small script
(`client/scripts/syncContractArtifact.mjs`) rather than imported directly
from `build/contracts/` — see "Canonicalisation rule" above for the same
constraint biting the shared hashing module.

### Public verify page needs no wallet

"The public or patient verifies without a role" is implemented literally:
`client/src/lib/web3.js`'s `createReadOnlyClient()` opens its own
`Web3.providers.HttpProvider` directly against the configured RPC URL,
entirely independent of whether MetaMask is installed or connected. The
role dashboards use a separate wallet-bound client
(`createWalletClient()`/`Web3Context`) that does require a connected
account, since those need to send real transactions.

### `verify()`'s return tuple was extended

The original `verify()` signature didn't expose a unit's `batchId` or the
batch's `dataHash` — both are needed for the frontend's required "off-chain
data integrity check" (recompute the batch's hash from its off-chain record
and compare to what's on-chain). Rather than add a second contract call, the
tuple gained two fields (`batchId`, `batchDataHash`) appended at the end.
This is additive and non-breaking: every existing Truffle test accesses the
return value by named property (`verify.exists`, `verify.recalled`, …), so
all 22 tests still passed unchanged after the change — confirmed by
re-running the full suite, not assumed.

### Form accessibility

Every form field across the dashboards originally had its `<label>` as a
plain sibling of its `<input>`, with no `htmlFor`/`id` association — found
not by manual review but by Playwright's `getByLabel()` failing to locate
fields that were visibly correct on screen. That's a real accessibility bug
(a screen reader has the same problem a testing library does: no
programmatic link between label and control), not just a test-tooling
inconvenience, so the fix was a shared `Field` component
(`client/src/components/Field.jsx`) that wraps the label around its control,
used everywhere instead of ad hoc `<div className="field">` markup.

### Testing without MetaMask

No MetaMask browser extension is installable in this project's development
environment (headless, no `DISPLAY`). The full custody chain — all five
roles, a genuine dispense, and the cloned-pack attack scenario — was
nonetheless driven end-to-end in real Chromium via Playwright, by replacing
`window.ethereum` with a minimal, correct EIP-1193 provider that proxies
every RPC call straight to a real, live local Ganache instance (Ganache
signs for its own unlocked deterministic accounts, so this exercises real
transactions against the real deployed contract — it is not a mock of
contract behaviour, only a stand-in for the wallet's UI chrome and its
`eth_requestAccounts` prompt). `client/WALKTHROUGH.md` states exactly which
parts of the manual test script were verified this way versus which still
need a human with the real extension (network-switch prompts, the explicit
"Reject" button, expiry/recall, which need state this session's scripted
run didn't construct).

## Toolchain and environment

### Node 18 LTS, and where that pin gets tested

Truffle and Ganache are both unmaintained (Consensys sunset Truffle Suite in
2023) and break on current Node — this project is pinned to Node 18.20.8
throughout (`.nvmrc`, every `package.json`'s `engines` field) specifically
because of that. The one place this pin was nearly broken: Hyperledger
Caliper's *latest* CLI release requires Node ≥22. Rather than split the
project across two Node versions, Caliper is pinned to `0.6.0` — the newest
release whose `engines` field still allows Node ≥18.19.0 — keeping the
whole project on one Node version.

### solc fetched from npm, not Truffle's default download

Truffle's default compiler-resolution strategy downloads the requested solc
version from `binaries.soliditylang.org` the first time it's needed. Some
network policies block that host specifically (while still allowing
`registry.npmjs.org`). Rather than depend on that specific host being
reachable, `solc@0.8.19` is an explicit npm devDependency and
`truffle-config.js` points `compilers.solc.version` at that local
`soljson.js` binary's path directly — Truffle's "local file" compiler
strategy, which never makes a network request at all. This makes the exact
compiler build reproducible from `package-lock.json` regardless of network
policy.

### Why the development network is pinned to chain/network ID 1337

Truffle's migration artifacts (`build/contracts/*.json`) record each
deployment's address under `networks[<network id>]`. With `network_id: "*"`
(Truffle's wildcard default) and Ganache's network ID defaulting to a
timestamp-derived value that changes on every restart, every Ganache restart
orphans the previous deployment record. Pinning both
(`truffle-config.js`'s `network_id: 1337` and Ganache's
`--chain.chainId 1337 --chain.networkId 1337`) makes the deployed address
land at a stable, predictable key every time, which the frontend
(`client/src/lib/web3.js`) and every benchmark script rely on to find the
contract without being told its address out of band.

## Benchmarking (`benchmarks/`)

### The Ganache performance caveat

This is the headline finding from Phase 5, not a footnote: **instant mining
dramatically overstates real-world performance.** Every write workload's
average confirmation latency went from ~30–50ms under Ganache's default
instant mining to ~1.1–1.6s under a 2-second fixed block time — a 30–40×
difference for the identical contract call, because confirmation now has to
wait for an actual block interval rather than a block being mined the
instant a transaction lands. `verify()` is the one exception, since a `view`
call never waits for a block in either mode (~10–20ms regardless). Full
numbers, methodology, and the per-workload breakdown are in
`benchmarks/RESULTS.md`; anyone citing a devnet benchmark's throughput
figure as representative of production performance on a real network with
real block times is overstating it by roughly this factor.

### Two real bugs the benchmarking process caught

Both are described in full in `benchmarks/RESULTS.md` because they're
evidence, not just footnotes:

1. Hyperledger Caliper's Ethereum connector calls `.estimateGas()` with no
   `from` address, so gas estimation silently simulates as the node's
   *first* account rather than the role the round actually sends from.
   Every write function in this contract is role-gated, so that simulation
   reverted before the real, correctly-addressed transaction ever got sent.
   Confirmed by reproducing the identical call directly with Web3 (fails
   with no `from`, succeeds with an explicit one) before concluding it was
   the connector's bug and not the contract's. Worked around with fixed,
   per-verb gas limits instead of `estimateGas: true`.
2. The first JMeter run reported 800/2800 (28.6%) failures, all 404s. The
   cause was a JMeter scoping mistake: a Groovy pre-processor generating
   random test IDs was placed as a thread-group-level sibling of the HTTP
   samplers rather than nested inside the first one, so it re-ran before
   *every* sampler instead of once per loop iteration — a GET request would
   look up an address the immediately-preceding POST had never actually
   used. Fixed by nesting the pre-processor inside the first sampler's own
   scope; re-run came back at 0 failures.

Neither result was "cleaned up" by re-running until it looked better without
understanding why — both are documented with their root cause in
`benchmarks/RESULTS.md`, including the one anomaly (a `registerBatch`
round where only 16/41 transactions confirmed within Web3.js's polling
window) that was investigated, found not to recur, and left in the dataset
exactly as observed.

## Known limitations

- **View-function detection** (`verify()`): cannot itself record anything —
  see "View-function detection limitation" above. The frontend carries the
  responsibility of treating `Dispensed`/`Flagged` as counterfeit warnings.
- **Ganache performance caveat**: instant-mining figures (used by default in
  local development and in half of this project's own benchmark runs)
  overstate real-network throughput/latency by roughly 30–40× for write
  operations — see "The Ganache performance caveat" above.
- **Off-chain store trust boundary**: the off-chain service never asserts
  authenticity, only serves data for the caller to hash-check itself — see
  "Trust boundary" above. A compromised off-chain database is detectable
  (hash mismatch) but not prevented by this service.
- **Array caps**: `MAX_BATCH_UNITS = 100`, `MAX_TRANSFER_BATCH = 50`, sized
  from measured gas against Ganache's 30M default block gas limit — see
  "Array caps" above. A batch or transfer larger than the cap must be split
  into multiple calls by the caller; the contract does not do this
  automatically.
- **Benchmark rate sweep is narrow by necessity**: two send rates (5/10 tps)
  at 8s each per workload/mining-mode combination, not a wider sweep — kept
  deliberately small so the fixed-block-time runs (which are
  correspondingly slower in wall-clock time) complete in a reasonable
  session length. The methodology generalises to more/higher rates; the
  reported numbers are from exactly the rates stated, nothing is
  extrapolated.
- **Caliper benchmarks use a single worker process**: concurrency within a
  workload comes from send rate, not from parallel Caliper workers — this
  measures the chain/contract's throughput ceiling at a given rate, not
  Caliper's own horizontal scaling.
- **QR scanning's camera path is untested in this session**: the scanner
  component's permission-denied and no-camera error states were written
  from reading the `html5-qrcode` API, not observed against a real camera
  (this development environment has none). QR *generation* and the typed-ID
  verify path were both exercised live.
- **Frontend bundle is not code-split**: `web3` and related dependencies
  produce a ~1.9MB JS bundle; Vite's build flags this. Acceptable for a
  research artefact evaluated locally; a production deployment would want
  `build.rollupOptions.output.manualChunks` or dynamic `import()`.
- **Toolchain itself is fixed, not best-practice**: Truffle and Ganache are
  unmaintained (see "Node 18 LTS" above). This is a constraint from the
  brief, not a current recommendation — a new project today would likely
  use Hardhat or Foundry. Documented here so it reads as a deliberate,
  acknowledged constraint rather than an oversight.
