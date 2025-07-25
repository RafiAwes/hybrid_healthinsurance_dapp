import PayPremium from './PayPremium';

export default function BuyerInfo({ buyer }) {
  return (
    <div className="bg-white shadow p-5 rounded">
      <h2 className="text-lg font-semibold mb-3">Buyer Info</h2>
      <p><b>Name:</b> {buyer.name}</p>
      <p><b>NID:</b> {buyer.nid}</p>
      <p><b>Wallet:</b> {buyer.address}</p>
      <div className="mt-4">
        <PayPremium buyerAddress={buyer.address} />
      </div>
    </div>
  );
}
