import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Web3 from "web3";
import { createWalletClient, EXPECTED_CHAIN_ID } from "../lib/web3";
import { ROLE } from "../lib/constants";

const Web3Context = createContext(null);

const hasMetaMask = typeof window !== "undefined" && Boolean(window.ethereum);

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [participantLoading, setParticipantLoading] = useState(false);

  const isWrongNetwork = chainId !== null && chainId !== EXPECTED_CHAIN_ID;

  const refreshParticipant = useCallback(async (contractInstance, address) => {
    if (!contractInstance || !address) {
      setParticipant(null);
      return;
    }
    setParticipantLoading(true);
    try {
      const result = await contractInstance.methods.participants(address).call();
      setParticipant({
        role: Number(result.role),
        active: result.active,
        profileHash: result.profileHash,
      });
    } catch (err) {
      setParticipant(null);
    } finally {
      setParticipantLoading(false);
    }
  }, []);

  const setupFromProvider = useCallback(
    async (provider) => {
      setConnecting(true);
      setConnectError(null);
      try {
        const accounts = await provider.request({ method: "eth_requestAccounts" });
        const selectedAccount = accounts[0] || null;
        setAccount(selectedAccount);

        const { web3: web3Instance, chainId: currentChainId } = await buildClientTolerantly(provider);
        setChainId(currentChainId);
        setWeb3(web3Instance);

        if (currentChainId === EXPECTED_CHAIN_ID) {
          const { contract: contractInstance } = await createWalletClient(provider);
          setContract(contractInstance);
          await refreshParticipant(contractInstance, selectedAccount);
        } else {
          setContract(null);
          setParticipant(null);
        }
      } catch (err) {
        setConnectError(err.message || "Failed to connect wallet");
      } finally {
        setConnecting(false);
      }
    },
    [refreshParticipant]
  );

  const connect = useCallback(() => {
    if (!hasMetaMask) {
      setConnectError("MetaMask (or another EIP-1193 wallet) was not detected in this browser.");
      return;
    }
    setupFromProvider(window.ethereum);
  }, [setupFromProvider]);

  useEffect(() => {
    if (!hasMetaMask) return undefined;
    const provider = window.ethereum;

    function handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        setAccount(null);
        setContract(null);
        setParticipant(null);
      } else {
        setAccount(accounts[0]);
        if (contract) refreshParticipant(contract, accounts[0]);
      }
    }

    function handleChainChanged() {
      // Per EIP-1193 guidance, the simplest correct reaction to a chain
      // change is to recompute everything from a fresh connection attempt
      // rather than try to patch partial state.
      if (account) setupFromProvider(provider);
    }

    provider.on("accountsChanged", handleAccountsChanged);
    provider.on("chainChanged", handleChainChanged);
    return () => {
      provider.removeListener("accountsChanged", handleAccountsChanged);
      provider.removeListener("chainChanged", handleChainChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, contract]);

  const value = useMemo(
    () => ({
      hasMetaMask,
      account,
      chainId,
      expectedChainId: EXPECTED_CHAIN_ID,
      isWrongNetwork,
      web3,
      contract,
      connecting,
      connectError,
      connect,
      participant,
      participantLoading,
      role: participant ? participant.role : ROLE.NONE,
      isRegisteredAndActive: Boolean(participant && participant.active && participant.role !== ROLE.NONE),
      refreshParticipant: () => refreshParticipant(contract, account),
    }),
    [account, chainId, isWrongNetwork, web3, contract, connecting, connectError, connect, participant, participantLoading, refreshParticipant]
  );

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

async function buildClientTolerantly(provider) {
  // Mirrors createWalletClient's web3+chainId construction, but without
  // requiring the contract to be deployed on the current chain - used so
  // the UI can detect "wrong network" and say so, instead of throwing
  // before it can even read chainId.
  const web3 = new Web3(provider);
  const chainId = await web3.eth.getChainId();
  return { web3, chainId };
}

export function useWeb3() {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error("useWeb3 must be used within a Web3Provider");
  return ctx;
}
