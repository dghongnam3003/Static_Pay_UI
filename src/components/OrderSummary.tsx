import React, { useEffect, useState } from 'react';
import { FiClock } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/backend/service.did.js';
import { ChargeService } from '../interfaces/ChargeService.js';

interface Charge {
  id: string;
  status: { Pending: null };
  merchant_id: string; // Nếu principal được xử lý dưới dạng string
  pricing_type: string;
  payments: string[]; // Điều chỉnh kiểu này nếu cần
  metadata: null | any; // Điều chỉnh kiểu này nếu cần
  name: string;
  local_price: {
    currency: string;
    amount: string;
  };
  description: string;
  created_at: bigint;
  payment_block_height: null | bigint;
  release_block_height: null | bigint;
}

export interface ChargeResponse {
  Ok?: Charge;
  Err?: string;
}

interface OrderSummaryProps {
  selectedCurrency: string;
  formIsValid: boolean;
  amount: string;
  userInfo: any;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedCurrency,
  formIsValid,
  amount,
  userInfo,
}) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [chargeData, setChargeData] = useState<Charge | null>(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    const fetchChargeData = async () => {
      try {
        const canisterId = 'oqjvn-fqaaa-aaaab-qab5q-cai'; // ID canister của bạn
        const chargeId = queryParams.get('chargeId'); // Lấy charge ID từ localStorage

        if (!chargeId) {
          throw new Error('Charge ID not found.');
        }

        // Kiểm tra xem Plug Wallet đã được cài đặt chưa
        // if (!window.ic?.plug) {
        //   throw new Error('Plug wallet is not installed.');
        // }

        // // Yêu cầu kết nối Plug Wallet
        // const connected = await window.ic.plug.requestConnect({
        //   whitelist: [canisterId],
        //   host: 'https://ic0.app'
        // });

        // if (!connected) {
        //   throw new Error('Failed to connect to Plug wallet.');
        // }

      const agent = new HttpAgent({ host: 'https://ic0.app' });

      // Nếu đang ở môi trường phát triển, bỏ qua kiểm tra chứng chỉ
      if (process.env.NODE_ENV === 'development') {
        await agent.fetchRootKey();
      }

        // Tạo actor sử dụng Plug Wallet
        const actor = await Actor.createActor<ChargeService>( idlFactory, {
          agent,
          canisterId,
        });

        // Gọi hàm get_charge với chargeId
        const result: ChargeResponse = await actor.get_charge(chargeId);

        if (result.Ok) {
          setChargeData(result.Ok);
        } else {
          throw new Error(result.Err || 'Failed to get charge data.');
        }
      } catch (error: any) {
        setError(error.message);
        console.error('Error fetching charge data:', error);
      }
    };

    fetchChargeData();
  }, [location.search]);

  const orderDetails = chargeData ? {
    name: chargeData.name,
    items: [
      { name: 'Product Price', price: parseFloat(chargeData.local_price.amount), quantity: 1 },
      { name: 'Processing Fee', price: 0.00, quantity: 1 },
    ],
    shipping: 0.00,
    tax: 0.00,
    total: parseFloat(chargeData.local_price.amount),
    exchangeRates: {
      btc: 0.0000980 * parseFloat(chargeData.local_price.amount),
      eth: 0.002985 * parseFloat(chargeData.local_price.amount),
      usdt: 11.029 * parseFloat(chargeData.local_price.amount),
      icp: parseFloat(chargeData.local_price.amount),
    }
  } : null;

  const getCryptoAmount = () => {
    if (!selectedCurrency) return null;
    
    const rate = orderDetails?.exchangeRates[selectedCurrency as keyof typeof orderDetails.exchangeRates];
    if (!rate) return 'N/A';
    return `${rate} ${selectedCurrency.toUpperCase()}`;
  };

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleProceedToPayment = () => {
    // Lưu thông tin thanh toán vào localStorage hoặc state management
    const paymentInfo = {
      amount: chargeData?.local_price.amount,
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
      
      {chargeData ? (
        <>
          <div className="space-y-2">
            <p><strong>Product Name:</strong> {chargeData.name}</p>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            {orderDetails?.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-gray-800 font-medium">{item.name}</span>
                  {item.quantity > 1 && (
                    <span className="text-sm text-gray-500 block">
                      Quantity: {item.quantity}
                    </span>
                  )}
                </div>
                <span className="text-gray-800">
                  {item.price} {chargeData.local_price.currency}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 pt-4">
            {/* Subtotal */}
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>{orderDetails?.items.reduce((acc, item) => acc + item.price, 0)} {chargeData.local_price.currency}</span>
            </div>

            {/* Shipping */}
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Shipping</span>
              <span>{orderDetails?.shipping === 0 ? 'Free' : formatUSD(orderDetails?.shipping ?? 0)}</span>
            </div>

            {/* Tax */}
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Estimated Tax</span>
              <span>{orderDetails?.tax} {chargeData.local_price.currency}</span>
            </div>

            {/* Total */}
            <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-4">
              <span>Total</span>
              <span>{chargeData.local_price.amount} {chargeData.local_price.currency}</span>
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
                </div>
              </div>
            )}
          </div>

          {/* Rate Valid */}
          <div className="flex items-center text-sm text-gray-500">
            <FiClock className="mr-1" />
            <span>Rate valid for 15 minutes</span>
          </div>

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
        </>
      ) : (
        <div>Loading charge data...</div>
      )}

      {error && (
        <div className="text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};