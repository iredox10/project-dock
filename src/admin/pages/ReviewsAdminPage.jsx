
import React, { useState, useEffect, useCallback } from 'react';
import { FaCheck, FaTrash, FaSpinner } from 'react-icons/fa';
import { db } from '../../firebase/config';
import { collectionGroup, query, where, getDocs, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';

// Note: For this query to work, you will need to create a collection group index in Firestore.
// The error message in your browser console will provide a direct link to create it.
// The index will be on the 'reviews' collection group, for the field 'isApproved'.

export const ReviewsAdminPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // 'pending' or 'approved'

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const reviewsRef = collectionGroup(db, 'reviews');
      const q = query(reviewsRef, where('isApproved', '==', filter === 'pending' ? false : true), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedReviews = querySnapshot.docs.map(d => ({
        id: d.id,
        projectId: d.ref.parent.parent.id, // Get the project ID from the reference path
        ...d.data()
      }));
      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Error fetching reviews: ", error);
      // This is likely an index error. Check the console for a link to create the index.
      if (error.code === 'failed-precondition') {
        alert("Firestore requires an index for this query. Please check the browser console for a link to create it.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleApprove = async (review) => {
    try {
      const reviewRef = doc(db, 'projects', review.projectId, 'reviews', review.id);
      await updateDoc(reviewRef, { isApproved: true });
      setReviews(prev => prev.filter(r => r.id !== review.id));
    } catch (error) { console.error("Error approving review: ", error); }
  };

  const handleDelete = async (review) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        const reviewRef = doc(db, 'projects', review.projectId, 'reviews', review.id);
        await deleteDoc(reviewRef);
        setReviews(prev => prev.filter(r => r.id !== review.id));
      } catch (error) { console.error("Error deleting review: ", error); }
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Manage Reviews</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="mb-4 border-b pb-4">
          <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg font-semibold mr-2 ${filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Pending</button>
          <button onClick={() => setFilter('approved')} className={`px-4 py-2 rounded-lg font-semibold ${filter === 'approved' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Approved</button>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? <div className="flex justify-center items-center py-20"><FaSpinner className="animate-spin text-4xl text-indigo-600" /></div> : (
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 font-semibold">User</th><th className="p-3 font-semibold">Comment</th><th className="p-3 font-semibold">Rating</th><th className="p-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(review => (
                  <tr key={review.id} className="border-b">
                    <td className="p-3 font-medium">{review.userName}</td>
                    <td className="p-3 text-gray-600 w-1/2">{review.comment}</td>
                    <td className="p-3 text-yellow-500 font-bold">{'★'.repeat(review.rating)}</td>
                    <td className="p-3 text-center space-x-4">
                      {filter === 'pending' && <button onClick={() => handleApprove(review)} className="text-green-500 hover:text-green-700" title="Approve"><FaCheck /></button>}
                      <button onClick={() => handleDelete(review)} className="text-red-500 hover:text-red-700" title="Delete"><FaTrash /></button>
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
