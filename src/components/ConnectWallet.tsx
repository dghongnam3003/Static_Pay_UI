import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ConnectWallet = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleConnectWallet = async () => {
    try {
      // Check if Plug wallet is installed
      if (!window.ic?.plug) {
        throw new Error('Plug wallet is not installed. Please install it first.');
      }

      // Request connection to Plug wallet
      const connected = await window.ic.plug.requestConnect();

      if (connected) {
        // If connection is successful, navigate to payment confirmation
        navigate('/payment-confirmation');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to connect to Plug wallet');
      console.error('Connection error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-8">Connect Your Wallet</h1>
            <button
              onClick={handleConnectWallet}
              className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Connect to Plug Wallet
            </button>
            {error && (
              <div className="mt-4 text-red-600 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};