import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Checkout from './components/Checkout';
import { ConnectWallet } from './components/ConnectWallet';
import { PaymentConfirmation } from './components/PaymentConfirmation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Checkout />} />
        <Route path="/connect-wallet" element={<ConnectWallet />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;