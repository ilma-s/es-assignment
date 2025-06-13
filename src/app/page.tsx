import { redirect } from "next/navigation";
import { Transaction } from "./api/types";

// Server component that creates a random transaction and immediately
// redirects the user to the /pay screen where they can confirm or reject it.
export default function Home() {
  // Generate random data
  const amount = +(Math.random() * 90 + 10).toFixed(2); // $10 - $100
  const txId = `TX${crypto.randomUUID()}`;
  const challenge = Math.random().toString(36).substring(2, 10);

  // Ensure mockDb exists (same pattern as in API routes)
  if (!global.mockDb) {
    global.mockDb = {
      transactions: new Map(),
      balances: new Map(),
    };
  }

  // Create pending transaction so that the ESP32 (or status endpoint)
  // can see it immediately.
  const transaction: Transaction = {
    amount,
    challenge,
    status: "pending",
    timestamp: new Date().toISOString(),
  };
  global.mockDb.transactions.set(txId, transaction);

  redirect(`/pay?tx=${txId}&ch=${challenge}&amt=${amount}`);
}
