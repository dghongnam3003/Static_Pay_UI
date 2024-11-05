import React from 'react';

interface PaymentMethodProps {
  onCurrencySelect: (currency: string) => void;
  selectedCurrency: string;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  onCurrencySelect,
  selectedCurrency,
}) => {
  const currencies = [
    { id: 'btc', name: 'BTC', icon: '₿' },
    { id: 'eth', name: 'ETH', icon: 'Ξ' },
    { id: 'usdc', name: 'USDT', icon: '$' },
    { id: 'icp', name: 'ICP', icon: '🔥' },
  ];

  return (
    <div className="space-y-4">
      {currencies.map((currency) => (
        <button
          key={currency.id}
          onClick={() => onCurrencySelect(currency.id)}
          className={`w-full p-4 border rounded-lg flex items-center space-x-4 hover:border-blue-500 transition-colors ${
            selectedCurrency === currency.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            {currency.icon}
          </div>
          <span className="font-medium">{currency.name}</span>
        </button>
      ))}
    </div>
  );
};