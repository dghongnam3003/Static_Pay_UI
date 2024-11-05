import React, { useState } from 'react';
import { PaymentMethod } from './PaymentMethod';
import { OrderSummary } from './OrderSummary';
import { UserInfoForm } from './UserInfoForm';

const Checkout = () => {
  const [formData, setFormData] = useState({
    isValid: false
  });
  const [selectedCurrency, setSelectedCurrency] = useState('');

  const handleFormChange = (data: any) => {
    setFormData(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left side - User Info and Payment Methods */}
            <div className="p-6 space-y-8">
              {/* User Information Form */}
              <div className="mb-8">
                <UserInfoForm onFormChange={handleFormChange} />
              </div>
              
              {/* Payment Method Selection */}
              <div className="border-t pt-8">
                <h2 className="text-2xl font-bold mb-6">Select payment method</h2>
                <PaymentMethod 
                  onCurrencySelect={setSelectedCurrency}
                  selectedCurrency={selectedCurrency}
                />
              </div>
            </div>
            
            {/* Right side - Order Summary */}
            <div className="p-6 bg-gray-50 lg:border-l">
              <OrderSummary 
                selectedCurrency={selectedCurrency}
                formIsValid={formData.isValid}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;