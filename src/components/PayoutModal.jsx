import React, { useState } from 'react';
import { FiX, FiLoader, FiCheck } from 'react-icons/fi';
import { requestPayout } from '../api/projectServices';

export const PayoutModal = ({ isOpen, onClose, walletBalance, userId, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const withdrawAmount = parseFloat(amount);
    
    if (withdrawAmount < 1000) {
      setError('Minimum withdrawal amount is ₦1,000');
      return;
    }
    
    if (withdrawAmount > walletBalance) {
      setError('Insufficient funds');
      return;
    }

    setIsLoading(true);

    try {
      await requestPayout(userId, withdrawAmount, {
        bankName,
        accountNumber,
        accountName
      });
      
      setSuccess(true);
      if (onSuccess) onSuccess();
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setAmount('');
        setBankName('');
        setAccountNumber('');
        setAccountName('');
      }, 2000);
      
    } catch (err) {
      setError('Failed to process request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Request Payout</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="text-2xl" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="text-3xl text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Request Submitted!</h4>
            <p className="text-gray-500">Your payout request has been received and will be processed shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-500 mb-1">Available Balance</p>
              <p className="text-2xl font-bold text-indigo-600">₦{walletBalance?.toLocaleString()}</p>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Withdraw</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">₦</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum withdrawal: ₦1,000</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. GTBank"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0123456789"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? <FiLoader className="animate-spin" /> : 'Request Payout'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
