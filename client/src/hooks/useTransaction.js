import { useCallback, useState } from "react";

/// Wraps a contract write (a `.send({ from })` call) with explicit
/// pending/success/error state, and turns a MetaMask user-rejected-request
/// error (EIP-1193 code 4001) into a distinct, friendly message rather than
/// a raw RPC error string - the spec requires rejected transactions to be
/// handled explicitly, not just surfaced as a generic failure.
export function useTransaction() {
  const [status, setStatus] = useState("idle"); // idle | pending | success | error
  const [error, setError] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const run = useCallback(async (sendPromiseFactory) => {
    setStatus("pending");
    setError(null);
    setReceipt(null);
    try {
      const result = await sendPromiseFactory();
      setReceipt(result);
      setStatus("success");
      return result;
    } catch (err) {
      const rejected = err && (err.code === 4001 || /user denied|user rejected/i.test(err.message || ""));
      setError(rejected ? "Transaction rejected in wallet." : describeContractError(err));
      setStatus("error");
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setReceipt(null);
  }, []);

  return { status, error, receipt, run, reset, isPending: status === "pending" };
}

/// Web3.js surfaces a Solidity custom-error revert as a raw selector
/// (Ganache does not decode it - see offchain/test/helpers.js for the same
/// issue on the contract test side), so this at least strips the noisy
/// JSON-RPC wrapper text down to the one useful line for display.
function describeContractError(err) {
  if (!err) return "Unknown error";
  const message = err.message || String(err);
  const firstLine = message.split("\n")[0];
  return firstLine.replace(/^Returned error:\s*/i, "");
}
