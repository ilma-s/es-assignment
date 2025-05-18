import { NextResponse } from 'next/server';
import { Transaction } from '../../types';

// Initialize mockDb if it doesn't exist
if (!global.mockDb) {
  global.mockDb = {
    transactions: new Map(),
    balances: new Map(),
  };
}

export async function GET(
  request: Request,
  { params }: { params: { txId: string } }
) {
  try {
    const txId = params.txId;
    const transaction = global.mockDb.transactions.get(txId);

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Return only the necessary information for ESP32
    return NextResponse.json({
      tx_id: txId,
      status: transaction.status,
      amount: transaction.amount,
      challenge: transaction.challenge,
      timestamp: transaction.timestamp,
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 