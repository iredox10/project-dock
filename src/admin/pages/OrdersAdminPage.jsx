import React, { useState, useEffect, useCallback } from 'react';
import { Modal, useModal } from '../../components/Modal';
import { FiCheckCircle, FiLoader, FiSearch } from 'react-icons/fi';
import { databases, DATABASE_ID, COLLECTIONS } from '../../appwrite/config';
import { Query } from 'appwrite';

export const OrdersAdminPage = () => {
  const { modal, showModal, closeModal } = useModal();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(null); // Store the ID of the order being updated

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        [Query.orderDesc('$createdAt')]
      );
      const fetchedOrders = response.documents.map(d => ({ id: d.$id, ...d }));
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders: ", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleConfirmPayment = async (order) => {
    if (order.status === 'completed') return;

    setIsUpdating(order.id);

    try {
      // 1. Update the order's status to 'completed'
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        order.id,
        { status: 'completed' }
      );

      // 2. Update the user's document to add the projectId to their purchasedProjects array
      // First, get the user document
      const userResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('uid', order.userId)]
      );

      if (userResponse.documents && userResponse.documents.length > 0) {
        const userDoc = userResponse.documents[0];
        const purchasedProjects = userDoc.purchasedProjects || [];
        if (!purchasedProjects.includes(order.projectId)) {
          // Update the user's purchased projects list
          await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            userDoc.$id,
            {
              purchasedProjects: [...purchasedProjects, order.projectId]
            }
          );
        }
      } else {
        throw new Error(`User with ID ${order.userId} not found.`);
      }

      // Update local state to reflect the change
      setOrders(prevOrders => prevOrders.map(o => o.id === order.id ? { ...o, status: 'completed' } : o));

    } catch (error) {
      console.error("Error confirming payment: ", error);
      showModal("Error", "Failed to confirm payment. Please check the console for errors.", "error");
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="w-full">
      <Modal {...modal} onClose={closeModal} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and verify payment orders.</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Mobile view for orders */}
        <div className="md:hidden">
          {isLoading ?
            <div className="flex justify-center items-center py-12">
              <FiLoader className="animate-spin text-2xl text-gray-400" />
            </div>
            : (
              <div className="divide-y divide-gray-100">
                {orders.map(order => (
                  <div key={order.id} className="p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{order.projectTitle}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">User: {order.userEmail}</p>
                        <p className="text-sm font-medium text-gray-900 mt-2">₦{order.amount?.toLocaleString()}</p>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${order.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        {order.status !== 'completed' ? (
                          <button
                            onClick={() => handleConfirmPayment(order)}
                            disabled={isUpdating === order.id}
                            className="flex items-center justify-center gap-2 bg-gray-900 text-white font-medium px-3 py-1.5 rounded-md hover:bg-black transition disabled:bg-gray-400 text-xs shadow-sm"
                          >
                            {isUpdating === order.id ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                            <span>Confirm</span>
                          </button>
                        ) : (
                          <span className="text-green-600 font-medium text-xs flex items-center gap-1">
                            <FiCheckCircle className="w-3 h-3" /> Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>

        {/* Desktop view for orders */}
        <div className="hidden md:block overflow-x-auto">
          {isLoading ?
            <div className="flex justify-center items-center py-20">
              <FiLoader className="animate-spin text-3xl text-gray-300" />
            </div>
            : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Title</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Email</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount (NGN)</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{order.projectTitle}</td>
                      <td className="p-4 text-sm text-gray-600">{order.userEmail}</td>
                      <td className="p-4 text-sm font-medium text-gray-900">₦{order.amount?.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {order.status !== 'completed' ? (
                          <button
                            onClick={() => handleConfirmPayment(order)}
                            disabled={isUpdating === order.id}
                            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-medium px-4 py-2 rounded-md hover:bg-black transition disabled:bg-gray-400 text-sm shadow-sm"
                          >
                            {isUpdating === order.id ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                            <span>Confirm Payment</span>
                          </button>
                        ) : (
                          <span className="text-green-600 font-medium text-sm flex items-center justify-end gap-1">
                            <FiCheckCircle className="w-4 h-4" /> Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    </div>
  );
};