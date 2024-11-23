import React from 'react';
import { FiClock } from 'react-icons/fi'; // Make sure to install react-icons
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';

interface OrderSummaryProps {
  selectedCurrency: string;
  formIsValid: boolean;
  amount: string; // Số tiền cần thanh toán
  userInfo: any; // Thông tin người dùng từ form
  bill: {
    id: string;
    status: string;
    requested_info: any[];
    updated_at: number;
    payment_link: string;
    merchant_id: string;
    pricing_type: string;
    name: string;
    local_price: {
      currency: string;
      amount: string;
    };
    description: string;
    created_at: number;
  };
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedCurrency,
  formIsValid,
  amount,
  userInfo,
  bill,
}) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const orderDetails = {
    name: bill.name,
    items: [
      // { name: 'Product Name', price: bill.name, quantity: 1 },
      { name: 'Product Price' , price: parseFloat(bill.local_price.amount), quantity: 1 },
      { name: 'Processing Fee', price: 0.00, quantity: 1 },
    ],
    shipping: 0.00,
    tax: 0.00,
    total: parseFloat(bill.local_price.amount),
    // Mock exchange rates (in reality, these would come from an API)
    exchangeRates: {
      btc: 0.0000980 * parseFloat(bill.local_price.amount),
      eth: 0.002985 * parseFloat(bill.local_price.amount),
      usdt: 11.029 * parseFloat(bill.local_price.amount),
      icp: parseFloat(bill.local_price.amount),
    }
  };

  const getCryptoAmount = () => {
    if (!selectedCurrency) return null;
    
    const rate = orderDetails.exchangeRates[selectedCurrency as keyof typeof orderDetails.exchangeRates];
    const symbol = {
      btc: 'BTC',
      eth: 'ETH',
      usdt: 'USDT',
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

  const handleProceedToPayment = () => {
    // Lưu thông tin thanh toán vào localStorage hoặc state management
    const paymentInfo = {
      amount: bill.local_price.amount,
      currency: selectedCurrency,
      userInfo
    };
    localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
    
    // Chuyển hướng đến trang kết nối ví Plug Wallet
    navigate('/connect-wallet');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Bill Information</h2>

      {/* Hiển thị thông tin bill
      <div className="space-y-2">
        <p><strong>Mã Bill:</strong> {bill.id}</p>
        <p><strong>Trạng thái:</strong> {bill.status}</p>
        <p><strong>Sản phẩm:</strong> {bill.name}</p>
        <p><strong>Mô tả:</strong> {bill.description}</p>
        <p><strong>Giá:</strong> {bill.local_price.amount} {bill.local_price.currency}</p>
        <p><strong>Link Thanh Toán:</strong> <a href={bill.payment_link} target="_blank" rel="noopener noreferrer">{bill.payment_link}</a></p>
      </div> */}

      <div className="space-y-2">
        <p><strong>Product Name:</strong> {bill.name}</p>
      </div>

      {/* Order Items */}
      <div className="space-y-4">
        {}
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
            <span className="text-gray-800">{item.price} {bill.local_price.currency}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-4">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-600 mb-2">
          <span>Subtotal</span>
          <span>{orderDetails.items.reduce((acc, item) => acc + item.price, 0)} {bill.local_price.currency}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-gray-600 mb-2">
          <span>Shipping</span>
          <span>{orderDetails.shipping === 0 ? 'Free' : formatUSD(orderDetails.shipping)}</span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-gray-600 mb-4">
          <span>Estimated Tax</span>
          <span>{orderDetails.tax} {bill.local_price.currency}</span>
        </div>

        {/* Total */}
        <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-4">
          <span>Total</span>
          <span>{bill.local_price.amount} {bill.local_price.currency}</span>
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
          onClick={handleProceedToPayment}
          disabled={!selectedCurrency || !formIsValid}
          className={`
            w-full py-4 rounded-lg font-medium
            bg-blue-600 hover:bg-blue-700
            text-white transition-colors
            disabled:bg-gray-400 disabled:cursor-not-allowed
          `}
        >
          {!formIsValid 
            ? 'Please Fill All Required Fields'
            : !selectedCurrency 
              ? 'Select Payment Method'
              : 'Proceed to Payment'
          }
        </button>

        {/* Additional Information */}
        <div className="mt-4 text-sm text-gray-500 text-center">
          <p>By completing this payment, you agree to our terms of service</p>
        </div>
      </div>
    </div>
  );
};