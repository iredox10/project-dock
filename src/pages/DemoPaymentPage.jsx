import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const DemoPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const [paymentStatus, setPaymentStatus] = useState('processing'); // 'processing', 'success', 'failed'

  const reference = searchParams.get('reference');
  const amount = searchParams.get('amount');

  useEffect(() => {
    // Simulate payment processing
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentStatus('success');
          
          // Redirect to verification page
          setTimeout(() => {
            const projectId = sessionStorage.getItem('payment_projectId');
            navigate(`/payment/verify?reference=${reference}&orderNo=DEMO_ORDER_${Date.now()}&projectId=${projectId}`);
          }, 1500);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [reference, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center px-4 pt-20">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">🎭 Demo Payment Gateway</h1>
          <p className="text-indigo-100">Simulated OPay Payment</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {paymentStatus === 'processing' && (
            <div className="text-center">
              <FaSpinner className="animate-spin text-6xl text-indigo-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment...</h2>
              <div className="bg-gray-100 rounded-xl p-6 mb-6">
                <div className="text-sm text-gray-600 mb-2">Transaction Reference</div>
                <div className="font-mono text-sm text-gray-900 mb-4">{reference}</div>
                <div className="text-sm text-gray-600 mb-2">Amount</div>
                <div className="text-3xl font-bold text-indigo-600">₦{Number(amount).toLocaleString()}</div>
              </div>
              <p className="text-gray-600 mb-4">
                Auto-completing in <span className="text-2xl font-bold text-indigo-600">{countdown}</span> seconds...
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                <p className="font-semibold mb-1">⚠️ Demo Mode Active</p>
                <p>This is a simulated payment. No real money is being processed.</p>
              </div>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center">
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-4">Redirecting to verification...</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-t border-blue-200 p-6">
          <h3 className="font-bold text-blue-900 mb-2">About Demo Mode</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• No actual payment is processed</li>
            <li>• All payments auto-approve after 3 seconds</li>
            <li>• Orders are created in your database</li>
            <li>• Perfect for testing the complete flow</li>
          </ul>
          <div className="mt-4 text-xs text-blue-700">
            To enable real payments, configure OPay credentials in your .env file and set VITE_OPAY_DEMO_MODE=false
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPaymentPage;
