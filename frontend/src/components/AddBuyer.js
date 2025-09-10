import { useState } from 'react';
import { isAddress } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import { uploadBuyerJson } from '../utils/ipfs';

export default function AddBuyer({ onBuyerAdded }) {
  const { contract, account, isAdmin } = useWeb3();
  const [name, setName] = useState('');
  const [nid, setNid] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const addBuyer = async () => {
    if (!contract) return alert("⚠ Contract not loaded");
    if (!isAdmin) return alert("❌ Only admin can add buyers");
    if (!name || !nid || !walletAddress) return alert("Please fill all fields");

    // Validate Ethereum address
    if (!isAddress(walletAddress)) {
      return alert("❌ Invalid Ethereum address format");
    }

    try {
      const buyerData = { name, nid, walletAddress };
      const cidObj = await uploadBuyerJson(buyerData);

      // Extract CID string depending on return type
      let cid;
      if (typeof cidObj === 'string') {
        cid = cidObj;
      } else if (cidObj && typeof cidObj === 'object') {
        // Try different methods to get CID string
        cid = cidObj.toString ? cidObj.toString() :
              cidObj['/'] || cidObj.cid || cidObj.path ||
              JSON.stringify(cidObj);
      } else {
        cid = String(cidObj);
      }

      if (!cid) throw new Error("Invalid CID returned from upload");

      console.log("Adding buyer with address:", walletAddress, "and CID:", cid);
      const tx = await contract.addBuyer(walletAddress, cid);
      console.log("Adding buyer with transaction:", tx);
      const receipt = await tx.wait();
      console.log("Buyer added successfully with receipt:", receipt);
      
      // Try to fetch the buyer we just added
      try {
        const buyer = await contract.buyers(walletAddress);
        console.log("Added buyer data:", buyer);
      } catch (err) {
        console.error("Could not fetch added buyer:", err);
      }
      
      // Try to fetch the buyerAddresses array length
      try {
        // Try to get the length of the array by calling the getter function
        // The getter function for an array in Solidity takes an index parameter
        // Let's try to get the first element
        const firstBuyer = await contract.buyerAddresses(0);
        console.log("First buyer in array:", firstBuyer);
      } catch (err) {
        console.log("Could not fetch buyerAddresses array:", err);
      }
      
      // Try to call getAllBuyers after adding a buyer
      try {
        const allBuyers = await contract.getAllBuyers();
        console.log("All buyers after adding one:", allBuyers);
      } catch (err) {
        console.log("Could not fetch all buyers:", err);
      }

      alert('✅ Buyer added!');
      setName('');
      setNid('');
      setWalletAddress('');
      
      // Trigger refresh of buyers list
      if (onBuyerAdded) {
        console.log("DEBUG: Calling onBuyerAdded callback to refresh buyers list");
        onBuyerAdded();
      }
    } catch (err) {
      console.error(err);
      alert('❌ Failed to add buyer: ' + err.message);
    }
  };

  return (
    <div className="bg-white shadow p-5 rounded mb-6">
      <h2 className="text-lg font-semibold mb-3">Add Buyer</h2>
      {!isAdmin && <p className="text-red-500 mb-3">⚠ Only admin can add buyers</p>}
      <input
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        placeholder="Wallet address"
        className="border p-2 rounded w-full mb-3"
      />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="border p-2 rounded w-full mb-3"
      />
      <input
        value={nid}
        onChange={(e) => setNid(e.target.value)}
        placeholder="NID"
        className="border p-2 rounded w-full mb-3"
      />
      <button
        onClick={addBuyer}
        disabled={!isAdmin}
        className="bg-blue-600 text-white px-3 py-2 rounded w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Add Buyer
      </button>
    </div>
  );
}
