import { Web3Storage } from 'web3.storage';
const client = new Web3Storage({ token: 'YOUR_WEB3STORAGE_TOKEN' });

export async function uploadBuyerJson(buyer) {
  const blob = new Blob([JSON.stringify(buyer)], { type: 'application/json' });
  const file = new File([blob], 'buyer.json');
  return await client.put([file]);
}

export async function getBuyerJson(cid) {
  const res = await client.get(cid);
  const files = await res.files();
  return JSON.parse(await files[0].text());
}
