import React from 'react';
import { FiClock } from 'react-icons/fi'; // Make sure to install react-icons
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useState } from 'react';

interface OrderSummaryProps {
  selectedCurrency: string;
  formIsValid: boolean;
  amount: string; // Số tiền cần thanh toán
  userInfo: any; // Thông tin người dùng từ form
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedCurrency,
  formIsValid,
  amount,
  userInfo
}) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const orderDetails = {
    items: [
      { name: 'Product Name', price: 95.00, quantity: 1 },
      { name: 'Processing Fee', price: 5.00, quantity: 1 },
    ],
    shipping: 0.00,
    tax: 10.00,
    total: 110.00,
    // Mock exchange rates (in reality, these would come from an API)
    exchangeRates: {
      btc: 0.0023,
      eth: 0.042,
      usdc: 110.00,
      icp: 15.047,
    }
  };

  const getCryptoAmount = () => {
    if (!selectedCurrency) return null;
    
    const rate = orderDetails.exchangeRates[selectedCurrency as keyof typeof orderDetails.exchangeRates];
    const symbol = {
      btc: 'BTC',
      eth: 'ETH',
      usdc: 'USDC',
      icp: 'ICP',
    }[selectedCurrency];

    return `${rate} ${symbol}`;
  };

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');
    try {
      if (!('ethereum' in window)) {
        throw new Error('MetaMask is not installed');
      }
      // Get user's wallet address
      const accounts = await (window.ethereum as any).request({ 
        method: 'eth_requestAccounts' 
      });
      const userAddress = accounts[0];

      // Tạo transaction params
      const transactionParameters = {
        to: '0xE5f5e391BAcaf7fBCD67f569cb11e6F62A037918', // Địa chỉ ví nhận tiền
        from: userAddress, // Địa chỉ ví người dùng
        value: ethers.parseEther(amount).toString(), // Chuyển số tiền sang hex
      };

      // Gửi request hiển thị popup MetaMask
      const txHash = await (window.ethereum as any).request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      // Nếu transaction được confirm
      if (txHash) {
        // Gọi API backend của bạn
        // await api.pay({ transactionHash: txHash, ... });
        console.log('Transaction hash:', txHash);
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      if (error.code === 4001) {
        setError('Transaction rejected by user.');
      } else {
        setError(error.message || 'Payment failed');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Order Summary</h2>
      
      {/* Order Items */}
      <div className="space-y-4">
        {orderDetails.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-gray-800 font-medium">{item.name}</span>
              {item.quantity > 1 && (
                <span className="text-sm text-gray-500 block">
                  Quantity: {item.quantity}
                </span>
              )}
            </div>
            <span className="text-gray-800">{formatUSD(item.price)}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-4">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-600 mb-2">
          <span>Subtotal</span>
          <span>{formatUSD(orderDetails.items.reduce((acc, item) => acc + item.price, 0))}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-gray-600 mb-2">
          <span>Shipping</span>
          <span>{orderDetails.shipping === 0 ? 'Free' : formatUSD(orderDetails.shipping)}</span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-gray-600 mb-4">
          <span>Estimated Tax</span>
          <span>{formatUSD(orderDetails.tax)}</span>
        </div>

        {/* Total */}
        <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-4">
          <span>Total</span>
          <span>{formatUSD(orderDetails.total)}</span>
        </div>

        {/* Crypto Amount */}
        {selectedCurrency && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">
                  Amount in {selectedCurrency.toUpperCase()}
                </div>
                <div className="font-mono text-lg font-semibold mt-1">
                  {getCryptoAmount()}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FiClock className="mr-1" />
                <span>Rate valid for 15 minutes</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={!selectedCurrency || !formIsValid || isProcessing}
          className={`
            w-full py-4 rounded-lg font-medium
            ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
            text-white transition-colors
            disabled:bg-gray-400 disabled:cursor-not-allowed
          `}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              Processing...
              {/* Có thể thêm loading spinner */}
            </span>
          ) : !formIsValid ? (
            'Please Fill All Required Fields'
          ) : !selectedCurrency ? (
            'Select Payment Method'
          ) : (
            'Proceed to Payment'
          )}
        </button>

        {/* Additional Information */}
        <div className="mt-4 text-sm text-gray-500 text-center">
          <p>By completing this payment, you agree to our terms of service</p>
        </div>
      </div>
    </div>
  );
};