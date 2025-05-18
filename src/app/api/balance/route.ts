import { NextResponse } from 'next/server';
import { Transaction } from '../types';

// Mock user data - in a real app, this would be in a database
const mockUser = {
  email: 'user@example.com',
  initialBalance: 100.00, // Starting with $100
};

// Initialize mockDb if it doesn't exist
if (!global.mockDb) {
  global.mockDb = {
    transactions: new Map(),
    balances: new Map(),
  };
}

interface TransactionResponse {
  id: string;
  amount: number;
  status: string;
  timestamp: string;
}

// Get transactions from the mock database
function getTransactions(userEmail: string): TransactionResponse[] {
  const transactions = Array.from(global.mockDb.transactions.entries())
    .map(([id, tx]: [string, Transaction]): TransactionResponse => ({
      id,
      amount: tx.amount,
      status: tx.status,
      timestamp: tx.timestamp,
    }));

  return transactions.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// Calculate current balance based on transactions
function calculateBalance(userEmail: string): number {
  const balance = global.mockDb.balances.get(userEmail) ?? mockUser.initialBalance;
  return balance;
}

export async function GET() {
  try {
    const userEmail = mockUser.email;
    const balance = calculateBalance(userEmail);
    const transactions = getTransactions(userEmail);

    return NextResponse.json({
      balance,
      transactions,
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add a check balance endpoint that just returns the number
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount } = body as { amount: number };
    const userEmail = mockUser.email;
    const currentBalance = calculateBalance(userEmail);

    return NextResponse.json({
      sufficient: currentBalance >= amount,
      balance: currentBalance,
    });
  } catch (error) {
    console.error('Error checking balance:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 