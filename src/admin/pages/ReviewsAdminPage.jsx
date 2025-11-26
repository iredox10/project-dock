import React, { useState, useEffect, useCallback } from 'react';
import { Modal, useModal } from '../../components/Modal';
import { FiCheck, FiTrash, FiLoader, FiMessageSquare } from 'react-icons/fi';
import { databases, DATABASE_ID, COLLECTIONS } from '../../appwrite/config';
import { Query } from 'appwrite';

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

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">Moderate user reviews and feedback.</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'pending' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'approved' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Approved
          </button>
        </div>

        {/* Mobile view for reviews */}
        <div className="md:hidden">
          {isLoading ?
            <div className="flex justify-center items-center py-12">
              <FiLoader className="animate-spin text-2xl text-gray-400" />
            </div>
            : (
              <div className="divide-y divide-gray-100">
                {reviews.map(review => (
                  <div key={review.id} className="p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">{review.userName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Rating: <span className="text-yellow-500 font-bold">{'★'.repeat(review.rating)}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-2 italic">"{review.comment}"</p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {filter === 'pending' && (
                          <button
                            onClick={() => handleApprove(review)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                            title="Approve"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(review)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <FiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No {filter} reviews found.
                  </div>
                )}
              </div>
            )
          }
        </div>

        {/* Desktop view for reviews */}
        <div className="hidden md:block overflow-x-auto">
          {isLoading ?
            <div className="flex justify-center items-center py-20">
              <FiLoader className="animate-spin text-3xl text-gray-300" />
            </div>
            : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Comment</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reviews.map(review => (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{review.userName}</td>
                      <td className="p-4 text-sm text-gray-600 max-w-md truncate" title={review.comment}>{review.comment}</td>
                      <td className="p-4 text-sm text-yellow-500 font-bold">{'★'.repeat(review.rating)}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {filter === 'pending' && (
                            <button onClick={() => handleApprove(review)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Approve">
                              <FiCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => handleDelete(review)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                            <FiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {reviews.length === 0 && (
                    <tr>
                      <td colspan="4" className="p-8 text-center text-gray-500 text-sm">
                        No {filter} reviews found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    </div>
  );
};