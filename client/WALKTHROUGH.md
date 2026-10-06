# Manual walkthrough script

A checklist for exercising every role and every public-verification verdict
by hand, with real MetaMask against the local Ganache network. Each step
names what to do and the exact result to expect.

**What's already been verified for you, live, in this session** (not just
claimed): the entire custody chain from registration through to a genuine
dispense, plus the "cloned pack / already dispensed" attack scenario, were
driven end-to-end in a real Chromium browser against the real deployed
contract, real Ganache, and the real off-chain service - see
`DESIGN_NOTES.md` for exactly how (a minimal injected EIP-1193 provider
backed by live Ganache, since no MetaMask extension is installable in this
headless environment) and the `Flagged`/`Genuine`/`Not found` verdicts it
produced. The steps below marked **(verified live)** reproduce exactly what
was run. Steps marked **(needs real MetaMask)** exercise paths only a human
with the actual extension can drive - account switching via the MetaMask UI,
network-switch prompts, and the explicit "reject transaction" button - and
have not been executed in this session.

## Setup

1. `nvm use 18` (or ensure Node 18.x is active).
2. From the repo root: `npm install`, then in `offchain/`: `npm install`,
   then in `client/`: `npm install`.
3. Terminal A: `npm run ganache` (repo root) - starts Ganache on port 8545,
   chain ID 1337, with the same deterministic accounts every time.
4. Terminal B: `npx truffle migrate --network development --reset` (repo
   root) - deploys the contract.
5. Terminal C: `cd offchain && npm start` - off-chain API on port 4000.
6. Terminal D: `cd client && npm run dev` - opens the app on
   `http://localhost:5173`.
7. Import at least 6 of Ganache's deterministic private keys (printed in
   Terminal A's startup banner) into MetaMask, and add a custom network
   pointing at `http://127.0.0.1:8545` with chain ID `1337`.

## Role-by-role

### Regulator (account #0 - the deployer) - **(verified live)**

1. Connect MetaMask with account #0. Dashboard shows the Regulator view.
2. Register accounts #1-#5 as Manufacturer, Distributor, Wholesaler,
   Pharmacy, and a second Pharmacy respectively, with an organisation name
   and licence number each. Expect each to appear in "Participants seen
   on-chain" within a few seconds of the transaction confirming.
3. **(needs real MetaMask)** Suspend one of them, then try to use that
   account for an action (e.g. initiateTransfer) in another tab - expect a
   revert surfaced as a readable error, not a silent failure.
4. Reinstate it - expect the action to work again afterwards.

### Manufacturer (account #1) - **(verified live)**

1. Switch MetaMask to account #1. Dashboard shows the Manufacturer view.
2. Register a batch (e.g. "BATCH-2026-001", 2 units, any product details,
   manufacture/expiry dates). Expect a QR code per unit to render, and both
   units to appear under "Units you hold" with status `Manufactured`.
3. Select both units, enter account #2's address, click "Send selected".
   Expect them to disappear from "Units you hold" (now `InTransit`).

### Distributor (account #2) - **(verified live)**

1. Switch to account #2. Expect both units under "Incoming transfers to
   accept".
2. Accept them. Expect them to move to "Units you hold" with status
   `Received`.
3. Send them on to account #3 (Wholesaler).

### Wholesaler (account #3) - **(verified live)**

1. Switch to account #3, accept the incoming units.
2. Send one unit to account #4 (Pharmacy) and the other to account #5
   (second Pharmacy) - this sets up the attack scenario below.

### Pharmacy (account #4) - **(verified live)**

1. Switch to account #4, accept the incoming unit.
2. Enter its unit ID, a prescription reference, and the items prescribed.
   Click Dispense. Expect "Dispensed successfully."

### Pharmacy - cloned pack attack (account #5) - **(verified live)**

1. Switch to account #5, accept its own incoming unit (a different, genuine
   unit).
2. In the Dispense form, enter the **first** unit's ID (the one account #4
   already dispensed) instead of account #5's own unit, with any
   prescription reference. Click Dispense.
3. Expect: no "Dispensed successfully" message. Instead, a warning banner:
   "Suspicious activity detected and flagged on-chain... Reason code: 2"
   (`AlreadyDispensed`). The transaction succeeds (it is not reverted) -
   only the dispense itself is refused.

## Public verification page (no wallet needed)

Go to `/verify` without connecting any wallet.

1. **Genuine (needs real MetaMask setup, but the verdict itself was
   verified live for an undispensed held unit)**: enter a unit ID that has
   been through custody transfers but not yet dispensed, recalled, or
   flagged. Expect a green "Genuine" badge, full custody timeline, and
   "Hash match - off-chain record is untampered" under off-chain data
   integrity.
2. **Already dispensed** - **(needs real MetaMask)**: enter the account #4
   unit's ID after step "Pharmacy" above. Expect "Already dispensed -
   counterfeit warning".
3. **Flagged** - **(verified live)**: enter the first unit's ID after the
   cloned-pack attack above. Expect "Flagged as suspicious - counterfeit
   warning".
4. **Not found** - **(verified live)**: enter any well-formed but unused
   64-hex-character ID (e.g. `0x` + `ab` repeated 32 times). Expect "Not
   found on-chain".
5. **Recalled** - **(needs real MetaMask)**: as the Regulator, recall the
   batch a still-undispensed unit belongs to (enter its batch reference),
   then look that unit up. Expect "Recalled - do not use".
6. **Expired** - **(needs real MetaMask)**: register a batch as Manufacturer
   with an expiry date in the past (the date picker allows this; the
   contract only requires `expiryDate > manufactureDate`, not that the
   expiry be in the future), then look up one of its units before it is
   dispensed/recalled/flagged. Expect "Expired".
7. Scan a QR code instead of typing an ID: click "Scan QR code", point a
   camera (or another browser tab showing one of the Manufacturer's
   generated QR images) at it, and confirm the same result as typing the ID
   manually. **(needs a camera - not exercised in this session, which has
   no camera device; the scanner's permission-denied and no-camera error
   states were read from the code, not observed live.)**

## Explicit error states - **(needs real MetaMask)**

1. **No wallet**: open the app in a browser with no MetaMask extension (or
   disable it). Expect "No wallet found" with the hint that `/verify` still
   works.
2. **Wrong network**: connect MetaMask to Ethereum Mainnet or any chain
   other than ID 1337. Expect "Wrong network" naming both the current and
   expected chain IDs.
3. **Rejected transaction**: start any write action (e.g. registering a
   participant) and click "Reject" in the MetaMask popup instead of
   confirming. Expect "Transaction rejected in wallet." rather than a raw
   RPC error dump.
4. **Pending state**: while a transaction is awaiting confirmation, expect
   the triggering button to show a specific in-progress label ("Sending...",
   "Registering...", "Dispensing...", etc.) and be disabled, not just a
   generic spinner with no context.
