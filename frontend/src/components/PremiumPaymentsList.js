import { useEffect, useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

export default function PremiumPaymentsList({ buyerAddress }) {
  const { contract } = useWeb3();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!contract) return;
      try {
        // Suppose contract keeps array: premiumsByBuyer(address) → string[] (list of payment CIDs)
        const cids = await contract.getPremiumsByBuyer(buyerAddress);
        setPayments(cids);
      } catch (err) {
        console.error("Failed to fetch premium payments:", err);
      }
    };
    load();
  }, [contract, buyerAddress]);

  return (
    <div className="mt-4 bg-white shadow p-4 rounded">
      <h3 className="font-semibold mb-2">Premium Payments List</h3>
      {payments.length === 0 ? (
        <p className="text-gray-500">No payments found.</p>
      ) : (
        payments.map((cid, i) => (
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
