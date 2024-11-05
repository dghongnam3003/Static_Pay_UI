import React from 'react';
import { FiClock } from 'react-icons/fi'; // Make sure to install react-icons
import { useNavigate } from 'react-router-dom';

interface OrderSummaryProps {
  selectedCurrency: string;
  formIsValid: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ selectedCurrency, formIsValid }) => {
  const navigate = useNavigate();

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

  const handlePayment = () => {
    navigate('/connect-wallet');
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
          type="button"
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium 
                   hover:bg-blue-700 transition-colors mt-6 disabled:bg-gray-400 
                   disabled:cursor-not-allowed"
          disabled={!selectedCurrency || !formIsValid}
          onClick={handlePayment}
        >
          {!formIsValid 
            ? 'Please Fill All Required Fields'
            : selectedCurrency 
              ? 'Complete Payment' 
              : 'Select Payment Method'
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