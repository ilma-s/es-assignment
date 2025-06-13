import { NextResponse } from 'next/server';

// Ensure mockDb exists (same pattern reused)
if (!global.mockDb) {
  global.mockDb = {
    transactions: new Map(),
    balances: new Map(),
  };
}

// Clear everything with a POST request (or GET for convenience during dev)
export async function POST() {
  global.mockDb.transactions.clear();
  global.mockDb.balances.clear();
  return NextResponse.json({ success: true, message: 'Database cleared' });
}

export const GET = POST; // allow GET /api/reset during development 