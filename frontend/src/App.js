import React, { useEffect, useState } from 'react';
import { useWeb3 } from './context/Web3Context';
import Navbar from './components/Navbar';
import BuyersList from './components/BuyersList';
import AddBuyer from './components/AddBuyer';

export default function App() {
  const { connectWallet, account, space, loginWithEmail, logout } = useWeb3();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    console.log("DEBUG: triggerRefresh called, incrementing refreshTrigger from", refreshTrigger, "to", refreshTrigger + 1);
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (!account) {
      connectWallet();
    }
  }, [account, connectWallet]);

  const handleAdminLogin = async () => {
    const email = prompt('Enter admin email to login with Storacha:');
    if (email) {
      await loginWithEmail(email);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        {!account && (
          <button
            onClick={connectWallet}
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          >
            Connect Wallet
          </button>
        )}

        {account && !space && (
          <button
            onClick={handleAdminLogin}
            className="bg-green-600 text-white px-4 py-2 rounded mb-4"
          >
            Login to Storacha
          </button>
        )}

        {account && space && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Welcome, admin: {account.slice(0,6)}...{account.slice(-4)}
              </h2>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            </div>
            <AddBuyer onBuyerAdded={triggerRefresh} />
            <BuyersList refreshTrigger={refreshTrigger} />
          </>
        )}
      </div>
    </div>
  );
}
