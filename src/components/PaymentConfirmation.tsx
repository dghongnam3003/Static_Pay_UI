import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HttpAgent, Actor } from '@dfinity/agent';
// Import IDL của canister
// import { idlFactory } from '../canister/idl'; // Thay đổi ��ường dẫn nếu cần

export const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Retrieve payment information from localStorage
      const paymentInfo = JSON.parse(localStorage.getItem('paymentInfo') || '{}');
      const amount = Number(paymentInfo.amount);

      // Check if Plug wallet is installed
      if (!window.ic || !window.ic.plug) {
        throw new Error('Plug wallet is not installed. Please install it to proceed.');
      }

      // Request connection to Plug wallet if not already connected
      const isConnected = await window.ic.plug.isConnected();
      if (!isConnected) {
        await window.ic.plug.requestConnect();
      }

      // Request transfer using Plug wallet
      const transferResult = await window.ic.plug.requestTransfer({
        to: 'wxani-naaaa-aaaab-qadgq-cai', // Replace with the recipient's principal ID
        amount: amount * 1e8, // Amount in e8s (1 ICP = 1e8 e8s)
      });

      if (transferResult?.transactionId) {
        // Payment successful
        localStorage.removeItem('paymentInfo');
        navigate('/success'); // Navigate to the success page
      } else {
        setError('Payment failed.');
      }
    } catch (error: any) {
      setError(error.message || 'Payment failed.');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Connect PLug Wallet and continue!</h2>
            <p className="text-gray-600 mb-8">
              You can proceed with the payment.
            </p>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>
            {error && (
              <div className="mt-4 text-red-600">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};