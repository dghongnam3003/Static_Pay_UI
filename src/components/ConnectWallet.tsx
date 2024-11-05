import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetaMaskConnect from './MetaMaskConnect';

export const ConnectWallet = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-8 text-center">Connect Your Wallet</h1>
          <MetaMaskConnect />
        </div>
      </div>
    </div>
  );
}; 