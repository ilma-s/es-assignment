'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CancelledPage() {
  const searchParams = useSearchParams();
  const txId = searchParams.get('tx');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-4">
          Transaction ID: <span className="font-mono">{txId}</span>
        </p>
        
        <Link 
          href="/"
          className="inline-block bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
} 