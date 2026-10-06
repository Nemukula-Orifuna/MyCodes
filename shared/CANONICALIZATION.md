# Canonical JSON hashing rule

This is the exact rule the off-chain service and the frontend both follow to
hash an off-chain record (a participant profile, a batch's product details,
or a prescription reference record) into the `bytes32` value anchored
on-chain. If either side deviates from this rule, the hash they compute will
not match what is on-chain, and the data will look tampered with even when it
is not — so this document is the single source of truth, and
`test-vectors.json` in this directory is what both sides' test suites assert
against to catch drift.

## The rule

1. **Canonicalize the value** before serializing:
   - If the value is a plain object, sort its keys lexicographically
     (ordinary JavaScript string `<` comparison, i.e. UTF-16 code unit
     order), recursively canonicalizing each value.
   - If the value is an array, keep its original element order, recursively
     canonicalizing each element. Arrays are never sorted.
   - Numbers, strings, booleans, and `null` are left as-is.
   - `undefined` values and functions must not appear in the input; passing
     them is a programming error, not something the canonicalizer silently
     drops.
2. **Serialize** the canonicalized value with `JSON.stringify(value)` -
   no indentation, no extra whitespace. This is deterministic given a
   canonicalized value because key order is already fixed by step 1.
3. **Hash** the UTF-8 bytes of that JSON string with Keccak-256 (the
   original Keccak padding used by Solidity's `keccak256`, **not** the
   NIST-standardized SHA3-256 - they produce different digests for the same
   input). The `keccak256` export of the `js-sha3` npm package is Keccak,
   not SHA3, and is what both sides use.
4. The result is a 32-byte digest, represented as a lowercase
   `0x`-prefixed 64-hex-character string - this is the value passed as the
   `bytes32` hash argument on-chain (`dataHash`, `profileHash`, or the
   prescription hash passed to `dispense`).

## Known limitation

Floating-point numbers are serialized however `JSON.stringify` formats a JS
`number` (e.g. `1e21` switches to exponential notation). Off-chain records in
this system therefore only ever use integers (dates as Unix timestamps,
quantities as whole numbers) specifically to stay inside the range where this
is a non-issue - this is a scope decision, not a general-purpose canonical
JSON implementation (compare RFC 8785 for the general case).
