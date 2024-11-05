import React from 'react';
import { useNavigate } from 'react-router-dom';

export const PaymentConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mb-4 text-green-500">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Ví MetaMask đã được kết nối!</h2>
            <p className="text-gray-600 mb-8">
              Bạn có thể tiếp tục quá trình thanh toán
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Tiếp tục thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 