import React, { useState, useEffect, useCallback } from 'react';
import { Modal, useModal } from '../../components/Modal';
import { FaCheck, FaTrash, FaSpinner } from 'react-icons/fa';
import { databases, DATABASE_ID, COLLECTIONS } from '../../appwrite/config';
import { Query } from 'appwrite';

// Note: For this query to work, you will need to create a collection group index in Firestore.
// The error message in your browser console will provide a direct link to create it.
// The index will be on the 'reviews' collection group, for the field 'isApproved'.

export const ReviewsAdminPage = () => {
    const { modal, showModal, closeModal } = useModal();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // 'pending' or 'approved'

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      // In Appwrite, we would normally store reviews in the same collection as projects
      // or have a separate reviews collection with projectId references
      // For this example, assuming there's a reviews collection with isApproved field
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.REVIEWS,
        [
          Query.equal('isApproved', filter === 'pending' ? false : true),
          Query.orderDesc('createdAt')
        ]
      );
      
      const fetchedReviews = response.documents.map(d => ({
        id: d.$id,
        projectId: d.projectId, // Assumes projectId is stored as a field in the review
        ...d
      }));
      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Error fetching reviews: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleApprove = async (review) => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.REVIEWS,
        review.id,
        { isApproved: true }
      );
      setReviews(prev => prev.filter(r => r.id !== review.id));
    } catch (error) { console.error("Error approving review: ", error); }
  };

  const handleDelete = async (review) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await databases.deleteDocument(
          DATABASE_ID,
          COLLECTIONS.REVIEWS,
          review.id
        );
        setReviews(prev => prev.filter(r => r.id !== review.id));
      } catch (error) { console.error("Error deleting review: ", error); }
    }
  };

  return (
    <div className="w-full">
      <Modal {...modal} onClose={closeModal} />

      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">Manage Reviews</h1>
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <div className="mb-4 border-b pb-4 flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('pending')} 
            className={`px-4 py-2 rounded-lg font-semibold ${filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('approved')} 
            className={`px-4 py-2 rounded-lg font-semibold ${filter === 'approved' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Approved
          </button>
        </div>

        {/* Mobile view for reviews */}
        <div className="md:hidden">
          {isLoading ? 
            <div className="flex justify-center items-center py-10">
              <FaSpinner className="animate-spin text-3xl text-indigo-600" />
            </div> 
            : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{review.userName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Rating: <span className="text-yellow-500 font-bold">{'★'.repeat(review.rating)}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                      </div>
                      <div className="flex flex-col gap-2 ml-2">
                        {filter === 'pending' && (
                          <button 
                            onClick={() => handleApprove(review)} 
                            className="text-green-500 hover:text-green-700 text-sm flex items-center" 
                            title="Approve"
                          >
                            <FaCheck className="mr-1" /> Approve
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(review)} 
                          className="text-red-500 hover:text-red-700 text-sm flex items-center" 
                          title="Delete"
                        >
                          <FaTrash className="mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>

        {/* Desktop view for reviews */}
        <div className="hidden md:block overflow-x-auto">
          {isLoading ? 
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div> 
            : (
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 font-semibold">User</th>
                    <th className="p-3 font-semibold">Comment</th>
                    <th className="p-3 font-semibold">Rating</th>
                    <th className="p-3 font-semibold text-center">Actions</th>
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
            )
          }
        </div>
      </div>
    </div>
  );
};