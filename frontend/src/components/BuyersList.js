import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import BuyerInfo from './BuyerInfo';

export default function BuyersList() {
  const { contract } = useWeb3();
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!contract) return;
      try {
        const buyerAddresses = await contract.getAllBuyers(); 
        const buyersData = [];
        for (const address of buyerAddresses) {
          const buyer = await contract.buyers(address);
          buyersData.push({ ...buyer, address });
        }
        setBuyers(buyersData);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [contract]);

  return (
    <div className="bg-white shadow p-5 rounded">
      <h2 className="text-lg font-semibold mb-3">All Buyers</h2>
      <ul className="space-y-2">
        {buyers.map((b, idx) => (
          <li key={idx}>
            <button
              onClick={() => setSelectedBuyer(b)}
              className="w-full text-left bg-gray-100 hover:bg-gray-200 p-2 rounded"
            >
              {b.name} ({b.address.slice(0,6)}...{b.address.slice(-4)})
            </button>
          </li>
        ))}
      </ul>

      {selectedBuyer && (
        <div className="mt-4">
          <BuyerInfo buyer={selectedBuyer} />
        </div>
      )}
    </div>
  );
}
