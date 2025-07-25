import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';

export default function PayPremium({ buyerAddress }) {
  const { contract } = useWeb3();
  const [amount, setAmount] = useState('');

  const pay = async () => {
    if (!contract) return alert("⚠ Contract not loaded");
    if (!buyerAddress) return alert("❗ Buyer address missing");
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      return alert("❗ Enter valid amount in ETH");
    }

    try {
      const value = ethers.parseEther(amount);
      await contract.payPremium(buyerAddress, { value });
      alert(`✅ Paid ${amount} ETH for ${buyerAddress}`);
      setAmount('');
    } catch (err) {
      console.error(err);
      alert("❌ Payment failed");
    }
  };

  return (
    <div className="bg-gray-50 shadow p-4 rounded">
      <h3 className="text-md font-semibold mb-2">Pay Premium</h3>
      <input
        type="number"
        placeholder="Amount in ETH"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />
      <button
        onClick={pay}
        className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 w-full"
      >
        Pay Premium
      </button>
    </div>
  );
}
