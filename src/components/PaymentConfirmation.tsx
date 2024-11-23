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
      const isConnected = await window.ic.plug.requestConnect();
      if (!isConnected) {
        throw new Error('Failed to connect to Plug wallet.');
      }

      // Create agent and get the ledger canister
      const agent = await window.ic.plug.getAgent();
      const ledgerCanister = await window.ic.plug.createActor({
        canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai' // ICP Ledger canister ID
      });

      // Execute transfer using the ledger canister
      const result = await ledgerCanister.transfer({
        to: 'mdwwn-niaaa-aaaab-qabta-cai',
        amount: { e8s: BigInt(amount * 1e8) },
        fee: { e8s: BigInt(10000) },
        memo: BigInt(0),
        from_subaccount: [],
        created_at_time: []
      });

      if (result.Ok) {
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