import { NextResponse } from 'next/server';
import { Transaction } from '../../types';

// Ensure mockDb exists
if (!global.mockDb) {
  global.mockDb = {
    transactions: new Map(),
    balances: new Map(),
  };
}

export async function GET() {
  try {
    // Find latest pending transaction
    const pendingTxs: Array<[string, Transaction]> = Array.from(global.mockDb.transactions.entries()).filter(
      ([, tx]) => tx.status === 'pending'
    );

    if (pendingTxs.length === 0) {
      // No pending payments – 204 No Content
      return new NextResponse(null, { status: 204 });
    }

    // Sort by timestamp descending
    pendingTxs.sort((a, b) => new Date(b[1].timestamp).getTime() - new Date(a[1].timestamp).getTime());

    const [id, tx] = pendingTxs[0];

    return NextResponse.json({
      id,
      status: tx.status,
    });
  } catch (error) {
    console.error('Error fetching latest payment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 