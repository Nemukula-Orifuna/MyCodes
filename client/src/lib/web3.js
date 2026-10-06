import Web3 from "web3";
import artifact from "../contracts/PharmaSupplyChain.json";
import { EXPECTED_CHAIN_ID } from "./constants";

const READ_ONLY_RPC_URL = import.meta.env.VITE_RPC_URL || "http://127.0.0.1:8545";

export class ContractNotDeployedError extends Error {
  constructor(chainId) {
    super(`PharmaSupplyChain is not deployed on chain ${chainId}. Run "truffle migrate --network development".`);
    this.name = "ContractNotDeployedError";
  }
}

function contractFromWeb3(web3, chainId) {
  const network = artifact.networks[String(chainId)];
  if (!network || !network.address) {
    throw new ContractNotDeployedError(chainId);
  }
  return new web3.eth.Contract(artifact.abi, network.address);
}

/// The public verify page talks to the chain read-only, without requiring
/// MetaMask - "the public or patient verifies without a role" per spec.
export function createReadOnlyClient() {
  const web3 = new Web3(new Web3.providers.HttpProvider(READ_ONLY_RPC_URL));
  const contract = contractFromWeb3(web3, EXPECTED_CHAIN_ID);
  return { web3, contract };
}

/// Builds a web3 instance + contract bound to the connected MetaMask
/// provider, for the role dashboards (which need to send transactions).
export async function createWalletClient(ethereumProvider) {
  const web3 = new Web3(ethereumProvider);
  const chainId = await web3.eth.getChainId();
  const contract = contractFromWeb3(web3, chainId);
  return { web3, contract, chainId };
}

export { EXPECTED_CHAIN_ID };
