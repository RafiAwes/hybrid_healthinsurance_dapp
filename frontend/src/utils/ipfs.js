import { create } from "@storacha/client";

let clientPromise = null;
let currentSpace = null;

export async function getClient() {
  if (!clientPromise) {
    clientPromise = create();
  }
  return clientPromise;
}

/** Login & ensure specific space is active */
export async function loginAndUseSpace(email) {
  const client = await getClient();
  const account = await client.login(email);
  console.log("✅ Email verified & logged in!");

  await account.plan.wait();

  // Fetch all spaces
  const spaces = await client.spaces();

  // Use the first space if available, otherwise create a new one
  let space;
  if (spaces.length > 0) {
    space = spaces[0];
    console.log("✅ Using existing space:", space.did());
  } else {
    // Create a new space
    space = await client.createSpace("health-ins-dapp", { account });
    console.log("✅ Created new space:", space.did());
  }

  await client.setCurrentSpace(space.did());
  currentSpace = space;
  return { client, space };
}

/** Internal: ensure currentSpace is set */
async function ensureCurrentSpace() {
  if (!currentSpace) {
    const client = await getClient();
    const spaces = await client.spaces();
    if (spaces.length === 0) throw new Error("❌ No spaces found. Please login first.");
    const space = spaces[0]; // Use the first available space
    currentSpace = space;
    await client.setCurrentSpace(space.did());
  }
}

/** Upload buyer JSON → returns CID */
export async function uploadBuyerJson(buyer) {
  await ensureCurrentSpace();
  const client = await getClient();

  const blob = new Blob([JSON.stringify(buyer)], { type: "application/json" });
  const file = new File([blob], `buyers/${buyer.nid || "buyer"}.json`);
  const cid = await client.uploadFile(file);
  console.log("✅ Uploaded buyer JSON. CID:", cid);
  return cid.toString ? cid.toString() : String(cid);
}

/** Upload claim JSON → CID */
export async function uploadClaimJson(claim) {
  await ensureCurrentSpace();
  const client = await getClient();

  const blob = new Blob([JSON.stringify(claim)], { type: "application/json" });
  const file = new File([blob], `claims/${claim.claimID || "claim"}.json`);
  const cid = await client.uploadFile(file);
  console.log("✅ Uploaded claim JSON. CID:", cid);
  return cid.toString ? cid.toString() : String(cid);
}

/** Upload premium payment JSON → CID */
export async function uploadPaymentJson(payment) {
  await ensureCurrentSpace();
  const client = await getClient();

  const blob = new Blob([JSON.stringify(payment)], { type: "application/json" });
  const file = new File([blob], `payments/${payment.paymentID || "payment"}.json`);
  const cid = await client.uploadFile(file);
  console.log("✅ Uploaded payment JSON. CID:", cid);
  return cid.toString ? cid.toString() : String(cid);
}

export async function fetchJsonFromCid(cid) {
  const url = `https://${cid}.ipfs.w3s.link/`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch CID ${cid}: ${res.statusText}`);
  }

  return await res.json();
}