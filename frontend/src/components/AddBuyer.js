import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { uploadBuyerJson } from '../utils/ipfs';

export default function AddBuyer() {
  const { contract } = useWeb3();
  const [buyer, setBuyer] = useState({ address: '', name: '', nid: '' });

  const add = async () => {
    if (!contract) return alert("Contract not ready");
    const json = { ...buyer, premiums: [], claims: [] };
    const cid = await uploadBuyerJson(json);
    await contract.addBuyer(buyer.address, buyer.name, buyer.nid, cid);
    alert("✅ Buyer added! CID: " + cid);
  };

  return (
    <div className="bg-white shadow p-5 rounded">
      <h3 className="text-lg font-semibold mb-3">Add Buyer</h3>
      <input
        className="border p-2 rounded w-full mb-2"
        placeholder="Wallet Address"
        onChange={e => setBuyer({ ...buyer, address: e.target.value })}
      />
      <input
        className="border p-2 rounded w-full mb-2"
        placeholder="Name"
        onChange={e => setBuyer({ ...buyer, name: e.target.value })}
      />
      <input
        className="border p-2 rounded w-full mb-3"
        placeholder="NID"
        onChange={e => setBuyer({ ...buyer, nid: e.target.value })}
      />
      <button
        onClick={add}
        className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 w-full"
      >
        Add Buyer
      </button>
    </div>
  );
}
