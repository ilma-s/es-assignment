import { NextResponse } from 'next/server';
import { Transaction } from '../../../types';

if (!global.mockDb) {
  global.mockDb = {
    transactions: new Map(),
    balances: new Map(),
  };
}

function mapStatus(txStatus: Transaction['status']): 'pending' | 'approved' | 'rejected' | 'insufficient' {
  switch (txStatus) {
    case 'confirmed':
      return 'approved';
    case 'cancelled':
      return 'rejected';
    case 'insufficient':
      return 'insufficient';
    default:
      return 'pending';
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const tx = global.mockDb.transactions.get(id);

    if (!tx) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const mappedStatus = mapStatus(tx.status);

    const responseBody: Record<string, any> = {
      id,
      status: mappedStatus,
    };

    if (mappedStatus === 'approved') {
      const userEmail = 'user@example.com';
      const balance = global.mockDb.balances.get(userEmail) ?? 0;
      responseBody.newBalance = balance;
    }

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error('Error fetching payment status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 