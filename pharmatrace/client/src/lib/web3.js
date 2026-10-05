import { Web3 } from "web3";
import artifact from "../contracts/PharmaTrace.json"; // written by `npm run migrate` (truffle-config.js)

const RPC = import.meta.env.VITE_RPC_URL ?? "http://127.0.0.1:8545";
const CHAIN_HEX = "0x539"; // 1337

export const STATUS = ["Not registered", "Authentic", "Hash mismatch (record altered)",
                       "Expired", "Already dispensed (possible clone)", "Flagged (suspected counterfeit)"];
export const STAGE = ["Manufacturer", "Distributor", "Wholesaler", "Pharmacy", "Dispensed"];

export async function connect(mode = "direct") {
  let web3;
  if (mode === "metamask") {
    if (!window.ethereum) throw new Error("MetaMask not installed");
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_HEX }] });
    } catch (e) {
      if (e.code !== 4902) throw e; // 4902 = chain not added yet
      await window.ethereum.request({ method: "wallet_addEthereumChain", params: [{
        chainId: CHAIN_HEX, chainName: "Ganache (local 1337)", rpcUrls: [RPC],
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 } }] });
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
  } else {
    web3 = new Web3(RPC);
  }
  const netId = String(await web3.eth.net.getId());          // BigInt -> "1337"
  const deployed = artifact.networks?.[netId];
  if (!deployed) throw new Error(`Not deployed on network ${netId}: run "npm run migrate" and restart Vite`);
  const contract = new web3.eth.Contract(artifact.abi, deployed.address);
  const accounts = await web3.eth.getAccounts();
  const roleNames = ["MANUFACTURER_ROLE", "DISTRIBUTOR_ROLE", "WHOLESALER_ROLE", "PHARMACY_ROLE", "INSPECTOR_ROLE"];
  const roles = { ADMIN: "0x" + "00".repeat(32) };
  for (const r of roleNames) roles[r] = await contract.methods[r]().call();
  return { web3, contract, accounts, roles, address: deployed.address };
}

export async function rolesOf(ctx, account) {
  const out = [];
  for (const [name, id] of Object.entries(ctx.roles))
    if (await ctx.contract.methods.hasRole(id, account).call()) out.push(name);
  return out;
}

// Ganache's default gas for eth_sendTransaction without a gas field is 90,000, which is less than
// transferCustody needs (~94k). Estimate per call and add a 25% margin instead of relying on defaults.
export async function send(method, from) {
  const gas = await method.estimateGas({ from });
  return method.send({ from, gas: String((BigInt(gas) * 125n) / 100n) });
}

export const sameAddress = (a, b) => !!a && !!b && a.toLowerCase() === b.toLowerCase();

export function revertReason(err) {
  return err?.cause?.message || err?.innerError?.message || err?.data?.message || err?.message || String(err);
}
