import Image from "next/image";

export default function HomePage() {
  const sampleUrl = 'http://localhost:3000/pay?tx=TX1001&ch=abc123&amt=9.99';

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Payment Confirmation System</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">How It Works</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Scan the QR code from your ESP32 device</li>
                <li>Review the transaction details</li>
                <li>Confirm or cancel the payment</li>
                <li>View the transaction result</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Sample QR Code URL</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <code className="text-sm font-mono break-all">{sampleUrl}</code>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                This URL contains the transaction ID, challenge, and amount parameters needed for testing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">URL Parameters</h2>
              <ul className="space-y-2 text-gray-600">
                <li><code className="text-sm font-mono">tx</code> - Transaction ID</li>
                <li><code className="text-sm font-mono">ch</code> - Cryptographic challenge</li>
                <li><code className="text-sm font-mono">amt</code> - Payment amount</li>
              </ul>
            </section>

            <section className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Testing the System</h2>
              <p className="text-blue-600">
                Click the sample URL above or create your own with different parameters to test the payment flow.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
