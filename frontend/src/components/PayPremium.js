import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { uploadPaymentJson } from '../utils/ipfs';
import { ethers } from 'ethers';

export default function PayPremium({ buyerAddress }) {
  const { contract, signer } = useWeb3();
  const [amount, setAmount] = useState('');
  const [months, setMonths] = useState(1);

  const payPremium = async () => {
    if (!contract || !signer) return alert("Contract or signer not loaded");
    if (!amount || months <= 0) return alert("Invalid amount or months");

    try {
      // Get admin address
      const adminAddress = await contract.admin();

      // Transfer amount from current account to admin
      const value = ethers.parseEther(amount);
      const tx = await signer.sendTransaction({
        to: adminAddress,
        value: value
      });
      await tx.wait();
      console.log("Transfer successful:", tx.hash);

      // Record payment data
      const paymentData = {
        paymentID: Date.now().toString(),
        buyerAddress,
        amount,
        months,
        date: new Date().toISOString(),
        transactionHash: tx.hash
      };

      const cid = await uploadPaymentJson(paymentData);

      // Record in contract
      await contract.recordPremiumPayment(buyerAddress, cid);

      alert('✅ Premium payment recorded and transferred!');
      setAmount('');
      setMonths(1);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to process payment: ' + err.message);
    }
  };

  return (
    <div className="mt-4 bg-white shadow p-4 rounded">
      <h3 className="font-semibold mb-2">Pay Premium</h3>
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="border p-2 rounded w-full mb-2" />
      <input type="number" value={months} onChange={e => setMonths(Number(e.target.value))} min="1" placeholder="Months" className="border p-2 rounded w-full mb-2" />
      <button onClick={payPremium} className="bg-green-600 text-white px-3 py-2 rounded w-full">Record Payment</button>
    </div>
  );
}


