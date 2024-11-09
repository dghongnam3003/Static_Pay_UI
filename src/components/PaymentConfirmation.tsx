import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as ethers from 'ethers';

export const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Lấy thông tin thanh toán từ localStorage
      const paymentInfo = JSON.parse(localStorage.getItem('paymentInfo') || '{}');
      // Check if ethereum object exists
      if (!(window as any).ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }
      
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts' 
      });
      const userAddress = accounts[0];

      // Tạo transaction
      const transactionParameters = {
        to: '0xE5f5e391BAcaf7fBCD67f569cb11e6F62A037918',
        from: userAddress,
        value: ethers.parseEther(paymentInfo.amount).toString(),
      };

      // Gửi transaction
      const txHash = await (window as any).ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      if (txHash) {
        localStorage.removeItem('paymentInfo');
        // Có thể chuyển đến trang success hoặc hiển thị thông báo
        console.log('Payment successful!', txHash);
      }

    } catch (error: any) {
      setError(error.message || 'Payment failed');
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
            <div className="mb-4 text-green-500">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Ví MetaMask đã được kết nối!</h2>
            <p className="text-gray-600 mb-8">
              Bạn có thể tiếp tục quá trình thanh toán
            </p>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isProcessing ? 'Đang xử lý...' : 'Tiến hành thanh toán'}
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