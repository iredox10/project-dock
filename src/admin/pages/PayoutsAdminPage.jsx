import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiLoader, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import { getAllPayouts, updatePayoutStatus, getUserById } from '../../api/projectServices';

export const PayoutsAdminPage = () => {
  const [payouts, setPayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const response = await getAllPayouts();
      
      // Enrich payouts with user names
      const enrichedPayouts = await Promise.all(response.documents.map(async (payout) => {
        try {
          const user = await getUserById(payout.userId);
          return { ...payout, userName: user.name, userEmail: user.email };
        } catch (e) {
          return { ...payout, userName: 'Unknown User', userEmail: 'N/A' };
        }
      }));
      
      setPayouts(enrichedPayouts);
    } catch (err) {
      setError('Failed to fetch payouts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (payout, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this request as ${newStatus}?`)) return;
    
    setProcessingId(payout.$id);
    try {
      await updatePayoutStatus(payout.$id, newStatus, payout.userId, payout.amount);
      
      // Update local state
      setPayouts(payouts.map(p => 
        p.$id === payout.$id ? { ...p, status: newStatus } : p
      ));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-3xl text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Payout Requests</h1>
        <button 
          onClick={fetchPayouts}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <FiAlertCircle />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-900">User</th>
                <th className="px-6 py-4 font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-4 font-semibold text-gray-900">Bank Details</th>
                <th className="px-6 py-4 font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No payout requests found.
                  </td>
                </tr>
              ) : (
                payouts.map((payout) => {
                  let bankDetails = {};
                  try {
                    bankDetails = JSON.parse(payout.bankDetails);
                  } catch (e) {
                    bankDetails = { bankName: 'Error parsing details' };
                  }

                  return (
                    <tr key={payout.$id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{payout.userName}</div>
                        <div className="text-gray-500 text-xs">{payout.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        ₦{payout.amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="font-medium">{bankDetails.bankName}</div>
                        <div className="text-xs">{bankDetails.accountNumber}</div>
                        <div className="text-xs text-gray-500">{bankDetails.accountName}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(payout.$createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                          {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {payout.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleStatusUpdate(payout, 'processed')}
                              disabled={processingId === payout.$id}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                              title="Mark as Processed"
                            >
                              {processingId === payout.$id ? <FiLoader className="animate-spin" /> : <FiCheck />}
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(payout, 'rejected')}
                              disabled={processingId === payout.$id}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                              title="Reject Request"
                            >
                              {processingId === payout.$id ? <FiLoader className="animate-spin" /> : <FiX />}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
