import { useEffect, useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import PayPremium from './PayPremium';
import AddClaim from './AddClaim';
import ClaimsList from './ClaimsList';
import PremiumPaymentsList from './PremiumPaymentsList';
import { getClient } from '../utils/ipfs';

export default function BuyerInfo({ address }) {
  const { contract } = useWeb3();
  const [cid, setCid] = useState('');
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!contract || !address) return;
      setLoading(true);
      try {
        // 1. Get CID from contract
        const buyer = await contract.buyers(address);
        setCid(buyer.cid);

        if(buyer.cid && buyer.cid.length > 0) {
          const client = await getClient();
          const file = await client.cat(buyer.cid);
          const json = JSON.parse(await new Response(file).text());
          setDetails(json);
        }
      } catch (err) {
        console.error("❌ Failed to fetch buyer:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [contract, address]);

  return (
    <div className="mt-4 p-3 border rounded">
      <h3 className="font-semibold mb-2">Buyer Details</h3>

      <p><span className="font-medium">Address:</span> {address}</p>

      {cid ? (
        <p>
          <span className="font-medium">CID:</span>{" "}
          <a
            href={`https://ipfs.io/ipfs/${cid}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            {cid}
          </a>
        </p>
      ) : (
        <p className="text-gray-500">No CID found.</p>
      )}

      {loading && <p className="text-gray-500">Loading buyer details...</p>}

      {details && (
        <div className="mt-3 bg-gray-50 p-3 rounded text-sm">
          <h4 className="font-semibold mb-2">Profile Info</h4>
          {Object.entries(details).map(([key, value]) => (
            <p key={key}>
              <span className="font-medium">{key}:</span> {String(value)}
            </p>
          ))}
        </div>
      )}

      {/* Existing features */}
      <PayPremium buyerAddress={address} />
      <AddClaim buyerAddress={address} />
      <ClaimsList buyerAddress={address} />
      <PremiumPaymentsList buyerAddress={address} />
    </div>
  );
}