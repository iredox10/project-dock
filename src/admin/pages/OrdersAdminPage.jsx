import React, { useState, useEffect, useCallback } from 'react';
import { Modal, useModal } from '../../components/Modal';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
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

      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">Manage Orders</h1>
      <div className="bg-white p-4 rounded-xl shadow-lg">
        {/* Mobile view for orders */}
        <div className="md:hidden">
          {isLoading ? 
            <div className="flex justify-center items-center py-10">
              <FaSpinner className="animate-spin text-3xl text-indigo-600" />
            </div> 
            : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{order.projectTitle}</h3>
                        <p className="text-sm text-gray-600 mt-1">User: {order.userEmail}</p>
                        <p className="text-sm text-gray-600 mt-1">Amount: ₦{order.amount?.toLocaleString()}</p>
                        <div className="mt-2">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="ml-2">
                        {order.status !== 'completed' ? (
                          <button
                            onClick={() => handleConfirmPayment(order)}
                            disabled={isUpdating === order.id}
                            className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold px-3 py-2 rounded-lg hover:bg-green-600 transition disabled:bg-gray-400 text-sm"
                          >
                            {isUpdating === order.id ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                            <span>Confirm</span>
                          </button>
                        ) : (
                          <span className="text-green-600 font-semibold text-sm">Completed</span>
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
              <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div> 
            : (
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 font-semibold">Project Title</th>
                    <th className="p-3 font-semibold">User Email</th>
                    <th className="p-3 font-semibold">Amount (NGN)</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{order.projectTitle}</td>
                      <td className="p-3 text-gray-600">{order.userEmail}</td>
                      <td className="p-3 text-gray-600">₦{order.amount?.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {order.status !== 'completed' ? (
                          <button
                            onClick={() => handleConfirmPayment(order)}
                            disabled={isUpdating === order.id}
                            className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-600 transition disabled:bg-gray-400"
                          >
                            {isUpdating === order.id ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                            <span>Confirm Payment</span>
                          </button>
                        ) : (
                          <span className="text-green-600 font-semibold">Completed</span>
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