import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import contractData from '../abi/HealthInsurance.json';

const Web3Context = createContext();
export const useWeb3 = () => useContext(Web3Context);

export function Web3Provider({ children }) {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [hasMetaMask, setHasMetaMask] = useState(true);


  const loadContract = useCallback(async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const c = new ethers.Contract(contractData.address, contractData.abi, signer);
    setContract(c);
  }, []);

  const load = useCallback(async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        await loadContract();
      }
    } catch (err) {
      console.error(err);
    }
  }, [loadContract]);

  useEffect(() => {
    if (!window.ethereum) {
      setHasMetaMask(false);
      return;
    }

    load();

    // optional: react to account change
    window.ethereum.on('accountsChanged', (acc) => {
      setAccount(acc[0] || null);
    });
  }, [load]);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return setHasMetaMask(false);
      const reqAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(reqAccounts[0]);
      await loadContract();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Web3Context.Provider value={{ contract, account, connectWallet, hasMetaMask }}>
      {children}
    </Web3Context.Provider>
  );
}
