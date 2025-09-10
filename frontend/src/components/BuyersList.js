import { useEffect, useState, useCallback } from "react";
import { useWeb3 } from "../context/Web3Context";
import { fetchJsonFromCid } from "../utils/ipfs";
import PayPremium from "./PayPremium";

export default function BuyersList({ refreshTrigger }) {
  const { contract, space } = useWeb3();
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuyerForPayment, setSelectedBuyerForPayment] = useState(null);

  useEffect(() => {
    console.log("DEBUG: BuyersList refreshTrigger changed to", refreshTrigger);
  }, [refreshTrigger]);

  const loadBuyers = useCallback(async () => {
    console.log("DEBUG: BuyersList loadBuyers called");
    if (!contract) return;

    setLoading(true);
    try {
      const buyerAddresses = await contract.getAllBuyers();
      const enriched = [];

      for (const address of buyerAddresses) {
        const cid = await contract.getBuyerCID(address);
        let data = null;
        try {
          if (cid && cid !== "0x" && cid.length > 0) {
            if (space) {
              console.log("Fetching CID:", cid, "for address:", address);
              data = await fetchJsonFromCid(cid);
              console.log("Fetched data:", data);
            } else {
              console.log("No IPFS space set, skipping fetch for address:", address);
            }
          } else {
            console.log("No CID for address:", address);
          }
        } catch (err) {
          console.error(
            `❌ Failed to fetch or parse buyer json data for CID: ${cid}, address: ${address}`,
            err
          );
        }
        enriched.push({
          address: address,
          cid: cid,
          data,
        });
      }

      setBuyers(enriched);
    } catch (err) {
      console.error("❌ Failed to load buyers:", err);
    } finally {
      setLoading(false);
    }
  }, [contract, space]);

  useEffect(() => {
    loadBuyers();
  }, [loadBuyers, refreshTrigger]);

  if (loading) {
    return <p className="text-gray-500">Loading buyers...</p>;
  }

  return (
    <div className="mt-6 p-4 border rounded bg-white shadow">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">All Buyers</h2>
        <button
          onClick={loadBuyers}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {buyers.length === 0 ? (
        <p className="text-gray-500">No buyers found.</p>
      ) : (
        <ul className="space-y-3">
          {buyers.map((b, idx) => (
            <li
              key={idx}
              className="p-3 border rounded shadow-sm bg-gray-50 hover:bg-gray-100"
            >
              <p>
                <span className="font-medium">Address:</span> {b.address}
              </p>
              {b.cid && (
                <p>
                  <span className="font-medium">CID:</span>{" "}
                  <a
                  href={`https://${b.cid}.ipfs.w3s.link/`}
                  // href={`https://ipfs.io/ipfs/${b.cid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {b.cid}
                  </a>
                </p>
              )}
              {b.data ? (
                <div className="mt-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {b.data.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">NID:</span>{" "}
                    {b.data.nid || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Age:</span>{" "}
                    {b.data.age || "N/A"}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 text-sm mt-2">
                  {space ? "❌ Could not load buyer JSON" : "Please login to IPFS to load buyer data"}
                </p>
              )}
              <div className="mt-2">
                <button
                  onClick={() => setSelectedBuyerForPayment(b.address)}
                  className="bg-green-600 text-white px-2 py-1 rounded text-sm mr-2"
                >
                  Pay Premium
                </button>
                {selectedBuyerForPayment === b.address && (
                  <button
                    onClick={() => setSelectedBuyerForPayment(null)}
                    className="bg-gray-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
              {selectedBuyerForPayment === b.address && (
                <PayPremium buyerAddress={b.address} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
