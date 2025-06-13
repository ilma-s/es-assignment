import { NextResponse } from 'next/server';
import { Transaction } from '../types';

if (!global.mockDb) {
  global.mockDb = {
    transactions: new Map(),
    balances: new Map(),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tx_id, challenge, amount } = body as {
      tx_id: string;
      challenge?: string;
      amount?: number;
    };

    if (!tx_id) {
      return NextResponse.json({ error: 'tx_id required' }, { status: 400 });
    }

    // Update or create transaction with cancelled status
    const transaction: Transaction = {
      amount: amount ?? 0,
      challenge: challenge ?? '',
      status: 'cancelled',
      timestamp: new Date().toISOString(),
    };

    global.mockDb.transactions.set(tx_id, transaction);

    return NextResponse.json({ success: true, tx_id, status: 'cancelled' });
  } catch (error) {
    console.error('Error cancelling tx:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 