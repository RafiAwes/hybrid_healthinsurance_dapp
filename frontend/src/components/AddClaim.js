import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { uploadClaimJson } from '../utils/ipfs';

export default function AddClaim({ buyerAddress }) {
  const { contract } = useWeb3();
  const [claimID, setClaimID] = useState('');
  const [name, setName] = useState('');
  const [nid, setNid] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const addClaim = async () => {
    if (!contract) return alert("Contract not loaded");
    if (!claimID || !name || !nid || !amount || !transactionId) {
      return alert("Please fill all fields");
    }

    try {
      const claimData = {
        claimID,
        buyerAddress,
        name,
        nid,
        amount,
        transactionId,
        status: "Pending",
        date: new Date().toISOString()
      };
      const cid = await uploadClaimJson(claimData);

      // Adjusted function name and parameter order:
      await contract.recordClaim(buyerAddress, cid);

      alert('✅ Claim submitted!');
      setClaimID('');
      setName('');
      setNid('');
      setAmount('');
      setTransactionId('');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to submit claim');
    }
  };

  return (
    <div className="mt-4 bg-white shadow p-4 rounded">
      <h3 className="font-semibold mb-2">Submit Claim for Buyer</h3>
      <input value={claimID} onChange={e => setClaimID(e.target.value)} placeholder="Claim ID" className="border p-2 rounded w-full mb-2" />
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Patient Name" className="border p-2 rounded w-full mb-2" />
      <input value={nid} onChange={e => setNid(e.target.value)} placeholder="Patient NID" className="border p-2 rounded w-full mb-2" />
      <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="border p-2 rounded w-full mb-2" />
      <input value={transactionId} onChange={e => setTransactionId(e.target.value)} placeholder="Transaction ID" className="border p-2 rounded w-full mb-2" />
      <button onClick={addClaim} className="bg-purple-600 text-white px-3 py-2 rounded w-full">Submit Claim</button>
    </div>
  );
}
