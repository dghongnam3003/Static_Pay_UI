import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MetaMaskConnect = () => {
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const connectWallet = async () => {
    try {
      const { ethereum } = window as Window & { ethereum?: any };

      if (!ethereum) {
        const width = 375;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        
        window.open(
          'https://metamask.io/download/',
          'MetaMask',
          `width=${width},height=${height},left=${left},top=${top}`
        );
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      navigate('/payment-confirmation');
    } catch (error) {
      setError('Lỗi khi kết nối với MetaMask');
      console.error(error);
    }
  };

  return (
    <div>
      <button
        onClick={connectWallet}
        className="w-full p-6 border rounded-lg flex items-center justify-center space-x-4 hover:bg-gray-50 text-lg"
      >
        <img src="/MetaMask_Fox.png" alt="MetaMask" className="w-8 h-8" />
        <span>Connect with MetaMask</span>
      </button>
      {error && (
        <div className="mt-4 text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default MetaMaskConnect;