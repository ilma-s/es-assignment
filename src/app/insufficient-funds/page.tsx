'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function InsufficientFundsPage() {
  const searchParams = useSearchParams();
  const txId = searchParams.get('tx');
  const amount = searchParams.get('amt');
  const balance = searchParams.get('bal');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Insufficient Funds</h1>
        <div className="space-y-2 mb-6">
          <p className="text-gray-600">
            Transaction ID: <span className="font-mono">{txId}</span>
          </p>
          <p className="text-gray-600">
            Required Amount: <span className="font-bold text-red-600">${parseFloat(amount || '0').toFixed(2)}</span>
          </p>
          <p className="text-gray-600">
            Available Balance: <span className="font-bold">${parseFloat(balance || '0').toFixed(2)}</span>
          </p>
        </div>
        
        <div className="space-y-3">
          <Link 
            href="/balance"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Check Balance
          </Link>
          <Link 
            href="/"
            className="block w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
} 