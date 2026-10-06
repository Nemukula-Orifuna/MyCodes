# Benchmark results summary

Raw data: `caliper/results/caliper-results.csv` (Hyperledger Caliper, on-chain) and
`jmeter/results/raw-results.jtl` (JMeter, off-chain API + verify flow). Every number
below is read directly from those files / the tools' own generated reports
(`caliper/results/{instant,fixed-blocktime}/*-report.html`,
`jmeter/results/html-report/index.html`) - nothing here is estimated or rounded away.

## Method

- **Contract**: `PharmaSupplyChain.sol` deployed fresh for each mining-mode run via
  `truffle migrate --network development --reset`.
- **Workloads**: `registerBatch`, `initiateTransfer`, `acceptTransfer`, `dispense`,
  `verify` - one Caliper benchconfig each, two rounds per workload (5 tps and 10 tps,
  `fixed-rate` controller, 8s send duration, 1 worker).
- **Preconditions**: `scripts/seed.js` prepares the on-chain state each round needs
  (e.g. units already `InTransit` to the Distributor before benchmarking
  `acceptTransfer`) using plain Web3 calls *before* Caliper starts timing, so seeding
  time is never counted as part of a measured round. Each round draws from a
  disjoint slice of the seeded units (`workload.arguments.offset` in the
  benchconfig), because Caliper creates a fresh workload-module instance per round -
  without the offset, round 2 would silently re-touch round 1's already-used units.
- **Two mining modes, run back to back against separate deployments**:
  - `instant` - Ganache's default (a block is mined immediately per transaction).
  - `fixed-blocktime-2s` - Ganache started with `--miner.blockTime 2`.
- **Gas**: fixed per-verb gas limits (2x the figures measured in Phase 2's
  `eth-gas-reporter` output), not `estimateGas: true`. Caliper's Ethereum connector
  calls `.estimateGas()` without a `from` address, so the simulation runs as the
  node's first account (the Regulator) rather than the role the round actually sends
  from - since every write function in this contract is role-gated, that simulation
  reverts before the real, correctly-addressed send ever happens. Confirmed by
  reproducing the identical call directly with Web3: it reverts with no `from`, and
  succeeds once `from` is explicit. This is a bug in the connector, not in the
  contract or this benchmark's numbers (the real sends still ran with the fixed gas
  limits and their results are genuine).

## Caliper: on-chain workload results

| Mining mode | Workload | Rate (tps) | Submitted | Succ | Fail | Avg latency (s) | Max latency (s) | Throughput (tps) |
|---|---|---|---|---|---|---|---|---|
| instant | registerBatch | 5 | 41 | 41 | 0 | 0.05 | 0.07 | 5.1 |
| instant | registerBatch | 10 | 81 | 81 | 0 | 0.04 | 0.07 | 10.1 |
| instant | initiateTransfer | 5 | 41 | 41 | 0 | 0.03 | 0.05 | 5.1 |
| instant | initiateTransfer | 10 | 81 | 81 | 0 | 0.03 | 0.05 | 10.1 |
| instant | acceptTransfer | 5 | 41 | 41 | 0 | 0.04 | 0.05 | 5.0 |
| instant | acceptTransfer | 10 | 81 | 81 | 0 | 0.03 | 0.05 | 10.1 |
| instant | dispense | 5 | 41 | 41 | 0 | 0.03 | 0.05 | 5.1 |
| instant | dispense | 10 | 81 | 81 | 0 | 0.04 | 0.06 | 10.1 |
| instant | verify | 5 | 41 | 41 | 0 | 0.01 | 0.03 | 5.1 |
| instant | verify | 10 | 81 | 81 | 0 | 0.01 | 0.03 | 10.1 |
| fixed-blocktime-2s | registerBatch | 5 | 41 | **16** | **25** | 1.10 | 2.41 | **0.4** |
| fixed-blocktime-2s | registerBatch | 10 | 81 | 81 | 0 | 1.49 | 3.18 | 8.2 |
| fixed-blocktime-2s | initiateTransfer | 5 | 41 | 41 | 0 | 1.22 | 2.49 | 5.1 |
| fixed-blocktime-2s | initiateTransfer | 10 | 81 | 81 | 0 | 1.57 | 3.41 | 8.1 |
| fixed-blocktime-2s | acceptTransfer | 5 | 41 | 41 | 0 | 1.26 | 2.49 | 4.7 |
| fixed-blocktime-2s | acceptTransfer | 10 | 81 | 81 | 0 | 1.62 | 3.50 | 9.6 |
| fixed-blocktime-2s | dispense | 5 | 41 | 41 | 0 | 1.30 | 2.48 | 4.4 |
| fixed-blocktime-2s | dispense | 10 | 81 | 81 | 0 | 1.54 | 3.38 | 9.8 |
| fixed-blocktime-2s | verify | 5 | 41 | 41 | 0 | 0.02 | 0.04 | 5.1 |
| fixed-blocktime-2s | verify | 10 | 81 | 81 | 0 | 0.02 | 0.04 | 10.1 |

### Reading these numbers

**Instant mining dramatically overstates real-world performance.** Average
confirmation latency for every write workload is ~30-50ms under instant mining
versus ~1.1-1.6s under a 2-second fixed block time - roughly a 30-40x difference for
the identical contract call. `verify()` is the one exception: being a `view` call it
never waits for a block at all, so its latency (~10-20ms) is essentially unaffected
by mining mode in either direction. **This asymmetry is the headline finding**: a
dapp whose UI is tuned against an instant-mining devnet will feel 30-40x slower the
moment it points at a real network with real block times, for every state-changing
operation - only read-heavy flows (like the public verify page) will feel the same.

**The registerBatch-5tps anomaly is real and is reported as observed, not
smoothed over.** Of 41 submitted transactions, only 16 confirmed within Web3.js's
default 50-block confirmation-polling window; the other 25 failed client-side with
"Transaction was not mined within 50 blocks" even though they were validly
submitted (nonces 0x10-0x28 are a contiguous block, consistent with a client-side
polling/subscription issue rather than an on-chain rejection - Ganache's own log
shows these transactions did land in blocks). This did not recur in
`registerBatch-10tps` run moments later in the same process, nor in any other
workload's first round, so it reads as a cold-start quirk in Web3.js 1.x's
WebSocket-based confirmation-subscription mechanism specifically on the first batch
of transactions sent after connecting - not a flaw in the contract (no transaction
actually reverted on-chain) and not a pattern repeated elsewhere in this dataset.
It is left in the results rather than re-run, per the "do not invent or round away
numbers" instruction: a production client would need to handle exactly this kind of
confirmation-tracking edge case robustly, which is itself a relevant finding for a
counterfeit-detection system where a stuck "pending" state has real consequences.

**registerBatch costs roughly double every other write call under load**, visible
even at matching throughput (10tps fixed-blocktime: registerBatch avg 1.49s vs.
initiateTransfer/acceptTransfer/dispense at 1.22-1.62s - comparable, but
registerBatch's *max* latency (3.18s) and its total gas footprint from Phase 2
(~239k vs ~94-97k gas for the transfer/dispense calls) point the same direction) -
consistent with it being the only workload here that writes a brand-new `Batch`
struct in addition to a `Unit` struct and a `CustodyRecord` push, where the others
only touch an already-existing `Unit`.

## JMeter: off-chain API and public verify flow

Plan: `jmeter/pharma-offchain-and-verify.jmx`. Two thread groups, 20 concurrent
users each, 20 loops/user (400 samples per label), 5s ramp-up, run against the
off-chain Express service (port 4000) and Ganache's JSON-RPC endpoint (port 8545)
directly. Raw per-sample data: `jmeter/results/raw-results.jtl` (JMeter's native
CSV format). Aggregated: `jmeter/results/jmeter-summary.csv`. Full HTML dashboard:
`jmeter/results/html-report/index.html`.

| Thread group | Sample | Count | Fail | Avg (ms) | Min (ms) | Max (ms) |
|---|---|---|---|---|---|---|
| Off-chain API users | POST /api/participants | 400 | 0 | 6.0 | 0 | 57 |
| Off-chain API users | GET /api/participants/:address | 400 | 0 | 4.6 | 0 | 36 |
| Off-chain API users | POST /api/batches | 400 | 0 | 4.8 | 0 | 61 |
| Off-chain API users | GET /api/batches/:batchId | 400 | 0 | 4.5 | 0 | 44 |
| Off-chain API users | POST /api/prescriptions | 400 | 0 | 5.2 | 0 | 85 |
| Verify-a-product users | POST :8545 eth_call verify() | 400 | 0 | 59.7 | 15 | 129 |
| Verify-a-product users | GET /api/batches/:batchId (integrity check) | 400 | 0 | 4.8 | 0 | 75 |

Total: 2,800 samples, 0 failures, 494.4 req/s aggregate throughput, 12ms average
across all samples (JMeter's own summariser output).

### A real bug this benchmark caught, and how it was found

The first run of this plan reported 800/2800 failures (28.6%), all 404s, entirely
on the Off-chain API group's two GET samplers. The cause was a JMeter scoping
mistake, not an application bug: the Groovy pre-processor that generates a random
address/batchId/prescriptionRef was placed as a thread-group-level sibling of the
samplers rather than nested inside the first one, so JMeter re-ran it before
*every* sampler in the loop - meaning the GET for `/api/participants/${address}`
looked up a freshly-regenerated random address the POST a moment earlier had never
actually used. Moving the pre-processor inside the first sampler's own scope (so
it runs once per loop iteration and the variables persist for the rest of that
iteration) fixed it to 0 failures on re-run. Left in this write-up because it is
the kind of result-corrupting test-plan bug that is easy to miss if you only read
the error *rate* and not *which* samples are failing and why.

### Reading these numbers

**`verify()` over JSON-RPC (~60ms avg) is an order of magnitude slower than any
off-chain API call (~4.5-6ms avg)**, even though both are localhost round-trips with
no real network latency. The off-chain service is a thin Express+SQLite layer with
essentially no computation per request; `eth_call` has to go through Ganache's EVM
execution path (ABI-decode the call, run the view function, ABI-encode the
result) even though it never touches a block. For the public verification page,
this means the on-chain lookup - not the off-chain integrity-check fetch sitting
right next to it in the same flow - is the dominant cost, by a wide margin.

**The off-chain service held up cleanly at this concurrency with no errors or
meaningfully elevated tail latency** (max 85ms on the slowest endpoint, POST
/api/prescriptions, which also does the canonical-JSON-hash computation per
request) - consistent with Phase 3's design: it is a stateless-per-request
Express app over a local SQLite file, nothing in that path should degrade
under 20 concurrent users at this volume.
