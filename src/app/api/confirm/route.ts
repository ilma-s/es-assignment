import { NextResponse } from 'next/server';
import { Transaction } from '../types';

// Initialize mockDb if it doesn't exist
if (!global.mockDb) {
  global.mockDb = {
    transactions: new Map(),
    balances: new Map(),
  };
}

// Mock user data
const mockUser = {
  email: 'user@example.com',
  initialBalance: 100.00,
  token: 'secure_user_123', // Mock user token
};

// Mock function to verify the challenge response
function verifySignature(challenge: string, response: string): boolean {
  // In a real implementation, this would use proper cryptographic verification
  return response === `signed_${challenge}`;
}

// Get current balance
function getCurrentBalance(userEmail: string): number {
  return global.mockDb.balances.get(userEmail) ?? mockUser.initialBalance;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tx_id, challenge, response, user_token, amount } = body as {
      tx_id: string;
      challenge: string;
      response: string;
      user_token: string;
      amount: number;
    };

    // Validate required fields
    if (!tx_id || !challenge || !response || !user_token || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate user token (mock authentication)
    if (user_token !== mockUser.token) {
      return NextResponse.json(
        { error: 'Invalid user token' },
        { status: 401 }
      );
    }

    // Check if sufficient balance
    const currentBalance = getCurrentBalance(mockUser.email);
    if (currentBalance < amount) {
      // Create transaction with REJECTED status
      const transaction: Transaction = {
        amount,
        challenge,
        status: 'cancelled',
        timestamp: new Date().toISOString(),
      };
      global.mockDb.transactions.set(tx_id, transaction);

      return NextResponse.json(
        { 
          error: 'Insufficient funds',
          balance: currentBalance,
          required: amount,
          tx_id,
          status: 'cancelled',
        },
        { status: 400 }
      );
    }

    // Verify the signature
    if (!verifySignature(challenge, response)) {
      // Create transaction with REJECTED status due to invalid signature
      const transaction: Transaction = {
        amount,
        challenge,
        status: 'cancelled',
        timestamp: new Date().toISOString(),
      };
      global.mockDb.transactions.set(tx_id, transaction);

      return NextResponse.json(
        { 
          error: 'Invalid signature',
          tx_id,
          status: 'cancelled',
        },
        { status: 401 }
      );
    }

    // Create or update transaction with APPROVED status
    const transaction: Transaction = {
      amount,
      challenge,
      status: 'confirmed',
      timestamp: new Date().toISOString(),
    };

    // Update transaction status
    global.mockDb.transactions.set(tx_id, transaction);

    // Update user balance
    global.mockDb.balances.set(mockUser.email, currentBalance - amount);

    return NextResponse.json({
      success: true,
      transaction: {
        tx_id,
        status: transaction.status,
        amount: transaction.amount,
        timestamp: transaction.timestamp,
      },
      balance: currentBalance - amount,
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 