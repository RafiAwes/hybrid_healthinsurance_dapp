import { useEffect, useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

export default function ClaimsList({ buyerAddress }) {
  const { contract } = useWeb3();
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!contract) return;
      try {
        // Suppose contract keeps array: claimsByBuyer(address) → string[] (list of claim CIDs)
        const cids = await contract.getClaimsByBuyer(buyerAddress);
        setClaims(cids);
      } catch (err) {
        console.error("Failed to fetch claims:", err);
      }
    };
    load();
  }, [contract, buyerAddress]);

  return (
    <div className="mt-4 bg-white shadow p-4 rounded">
      <h3 className="font-semibold mb-2">Claims List</h3>
      {claims.length === 0 ? (
        <p className="text-gray-500">No claims found.</p>
      ) : (
        claims.map((cid, i) => (
          <a
            key={i}
            href={`https://ipfs.io/ipfs/${cid}`}
            target="_blank"
            rel="noreferrer"
            className="block text-blue-600 underline truncate mb-1"
          >
            {cid}
          </a>
        ))
      )}
    </div>
  );
}
