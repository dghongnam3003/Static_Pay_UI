import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MetaMaskConnect = () => {
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const connectWallet = async () => {
    try {
      if (!(window as any).ethereum) {
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
      // Chỉ kết nối ví, không thực hiện thanh toán
      const accounts = await (window as any).ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const userAddress = accounts[0];
      setAccount(userAddress);

      // Sau khi kết nối thành công, chuyển đến trang payment confirmation
      navigate('/payment-confirmation');

    } catch (error: any) {
      setError(error.message || 'Error connecting to MetaMask');
      console.error(error);
    }
  };

  return (
    <button
      onClick={connectWallet}
      className="w-full p-6 border rounded-lg flex items-center justify-center space-x-4 hover:bg-gray-50"
    >
      <img src="/MetaMask_Fox.png" alt="MetaMask" className="w-8 h-8" />
      <span>Connect with MetaMask</span>
    </button>
  );
};

export default MetaMaskConnect;