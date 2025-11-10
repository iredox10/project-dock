
import React, { useState, useEffect, useCallback } from 'react';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { db } from '../../firebase/config';
import { collection, query, getDocs, doc, writeBatch, orderBy } from 'firebase/firestore';

export const OrdersAdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(null); // Store the ID of the order being updated

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('orderDate', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedOrders = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
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

    // Use a batched write to perform multiple operations atomically
    const batch = writeBatch(db);

    try {
      // 1. Update the order's status to 'completed'
      const orderRef = doc(db, 'orders', order.id);
      batch.update(orderRef, { status: 'completed' });

      // 2. Update the user's document to add the projectId to their purchasedProjects array
      const userRef = doc(db, 'users', order.userId);
      // To add to an array, we need to get the user's current data first.
      // Note: For a more robust system, a Cloud Function is recommended for this to avoid race conditions.
      // This client-side approach is good for a simple admin panel.
      const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', order.userId)));
      if (!userDoc.empty) {
        const userDocId = userDoc.docs[0].id;
        const userData = userDoc.docs[0].data();
        const purchasedProjects = userData.purchasedProjects || [];
        if (!purchasedProjects.includes(order.projectId)) {
          batch.update(doc(db, 'users', userDocId), {
            purchasedProjects: [...purchasedProjects, order.projectId]
          });
        }
      } else {
        throw new Error(`User with ID ${order.userId} not found.`);
      }

      // Commit the batch
      await batch.commit();

      // Update local state to reflect the change
      setOrders(prevOrders => prevOrders.map(o => o.id === order.id ? { ...o, status: 'completed' } : o));

    } catch (error) {
      console.error("Error confirming payment: ", error);
      alert("Failed to confirm payment. Please check the console for errors.");
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Manage Orders</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20"><FaSpinner className="animate-spin text-4xl text-indigo-600" /></div>
          ) : (
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
                    <td className="p-3 text-gray-600">{order.amount?.toLocaleString()}</td>
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
          )}
        </div>
      </div>
    </div>
  );
};
