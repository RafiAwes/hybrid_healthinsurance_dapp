import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import HealthInsurance from "../abi/HealthInsurance.json";
import { loginAndUseSpace } from "../utils/ipfs";

const Web3Context = createContext({
  provider: null,
  signer: null,
  account: null,
  contract: null,
  space: null,
  loginWithEmail: async () => {},
  connectWallet: async () => {},
  logout: async () => {},
});

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [space, setSpace] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(browserProvider);

        const accounts = await browserProvider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        const signer = await browserProvider.getSigner();
        setSigner(signer);

        const network = await browserProvider.getNetwork();
        console.log("Connected to network:", network);

        // Load contract
        const contractAddress = HealthInsurance.address;
        console.log("Loading contract at address:", contractAddress);
        const contractInstance = new ethers.Contract(
          contractAddress,
          HealthInsurance.abi,
          signer
        );
        setContract(contractInstance);

        // Check if current account is admin
        try {
          const adminAddress = await contractInstance.admin();
          setIsAdmin(adminAddress.toLowerCase() === accounts[0].toLowerCase());
        } catch (error) {
          console.error("Failed to check admin status:", error);
          setIsAdmin(false);
        }
      } else {
        console.error("MetaMask is not installed");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const logout = async () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setContract(null);
    setSpace(null);
    setIsAdmin(false);
  };

  useEffect(() => {
    connectWallet();
  }, []);

  /** Email login for Storacha space */
  const loginWithEmail = async (email) => {
    try {
      const { space } = await loginAndUseSpace(email);
      setSpace(space);
      console.log("✅ Using Storacha Space:", space.did());
      console.log("✅ Space state updated");
    } catch (err) {
      console.error("❌ Storacha login failed:", err);
    }
  };

  return (
    <Web3Context.Provider value={{ provider, signer, account, contract, space, isAdmin, loginWithEmail, connectWallet, logout }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
