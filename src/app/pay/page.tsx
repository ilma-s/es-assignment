'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Mock user token - in a real app, this would come from authentication
const USER_TOKEN = 'secure_user_123';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingBalance, setIsCheckingBalance] = useState(true);

  const txId = searchParams.get('tx');
  const challenge = searchParams.get('ch');
  const amount = searchParams.get('amt');

  useEffect(() => {
    checkBalance();
  }, [amount]);

  const checkBalance = async () => {
    if (!amount) return;
    
    try {
      const response = await fetch('/api/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();
      
      if (!data.sufficient) {
        router.push(`/insufficient-funds?tx=${txId}&amt=${amount}&bal=${data.balance}`);
        return;
      }
    } catch (err) {
      setError('Failed to check balance');
    } finally {
      setIsCheckingBalance(false);
    }
  };

  if (!txId || !challenge || !amount) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Invalid Payment Link</h2>
            <p>Missing required parameters. Please scan a valid QR code.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isCheckingBalance) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-800">Checking balance...</p>
        </div>
      </div>
    );
  }

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_id: txId,
          challenge,
          response: `signed_${challenge}`, // Mock signature for now
          user_token: USER_TOKEN,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.error === 'Insufficient funds') {
          router.push(`/insufficient-funds?tx=${txId}&amt=${amount}&bal=${data.balance}`);
          return;
        }
        throw new Error(data.error || 'Payment confirmation failed');
      }

      const data = await response.json();
      router.push(`/success?tx=${txId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!txId) return;
    setIsLoading(true);
    try {
      await fetch('/api/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_id: txId,
          challenge,
          amount: parseFloat(amount ?? '0'),
        }),
      });
    } catch (e) {
      console.error('Cancel error', e);
    } finally {
      setIsLoading(false);
      router.push(`/cancelled?tx=${txId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Payment Confirmation</h1>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-800 font-medium">Transaction ID:</span>
            <span className="font-mono text-gray-900">{txId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-800 font-medium">Amount:</span>
            <span className="text-xl font-bold text-gray-900">${parseFloat(amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-800 font-medium">Challenge:</span>
            <span className="font-mono text-sm text-gray-900">{challenge}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
} 