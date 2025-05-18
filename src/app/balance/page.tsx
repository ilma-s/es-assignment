'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Transaction {
  id: string;
  amount: number;
  status: string;
  timestamp: string;
}

interface BalanceData {
  balance: number;
  transactions: Transaction[];
}

export default function BalancePage() {
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/balance');
      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }
      const data = await response.json();
      setBalanceData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Account Balance</h1>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Return Home
            </Link>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg mb-8">
            <p className="text-sm text-green-600 mb-1">Available Balance</p>
            <p className="text-4xl font-bold text-green-700">
              ${balanceData?.balance.toFixed(2)}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
            {balanceData?.transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {balanceData?.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-mono text-sm text-gray-600">{tx.id}</p>
                      <p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${tx.status === 'confirmed' ? 'text-red-600' : 'text-gray-600'}`}>
                        {tx.status === 'confirmed' ? '-' : ''} ${tx.amount.toFixed(2)}
                      </p>
                      <p className={`text-xs ${
                        tx.status === 'confirmed' ? 'text-green-600' : 
                        tx.status === 'cancelled' ? 'text-red-600' : 
                        'text-yellow-600'
                      }`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 