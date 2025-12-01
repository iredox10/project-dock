import { projectsService, usersService, ordersService, reviewsService } from '../appwrite/api';

// Export the Appwrite project service functions directly
export const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByDepartment,
  getProjectsByLevel,
  getUniqueDepartments
} = projectsService;

export const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail
} = usersService;

export const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} = ordersService;

export const {
  getReviewsByProject,
  getReviewsByUser,
  createReview,
  updateReview,
  deleteReview
} = reviewsService;

// Payout Service
export const requestPayout = async (userId, amount, bankDetails) => {
  try {
    const { databases, DATABASE_ID, COLLECTIONS } = await import('../appwrite/config');
    const { ID } = await import('appwrite');
    
    // Create payout request
    const payout = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.PAYOUTS,
      ID.unique(),
      {
        userId,
        amount,
        bankDetails: JSON.stringify(bankDetails),
        status: 'pending'
      }
    );
    
    return payout;
  } catch (error) {
    console.error('Error requesting payout:', error);
    throw error;
  }
};

// Admin Payout Services
export const getAllPayouts = async (queries = []) => {
  try {
    const { databases, DATABASE_ID, COLLECTIONS } = await import('../appwrite/config');
    const { Query } = await import('appwrite');
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.PAYOUTS,
      [
        Query.orderDesc('$createdAt'),
        ...queries
      ]
    );
    return response;
  } catch (error) {
    console.error('Error fetching payouts:', error);
    throw error;
  }
};

export const updatePayoutStatus = async (payoutId, status, userId = null, amount = 0) => {
  try {
    const { databases, DATABASE_ID, COLLECTIONS } = await import('../appwrite/config');
    
    // Update payout status
    const payout = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.PAYOUTS,
      payoutId,
      { status }
    );
    
    // If approved/processed, we deduct the balance from the user's wallet
    // Note: In a real app, this should be a transaction or cloud function to ensure atomicity
    if (status === 'processed' && userId && amount > 0) {
      const user = await getUserById(userId);
      const currentBalance = user.walletBalance || 0;
      
      // Only deduct if not already deducted (this logic assumes we deduct on approval)
      // A better way is to deduct on request, but for this simple implementation:
      // We will deduct now.
      
      await updateUser(userId, {
        walletBalance: currentBalance - amount
      });
    }
    
    return payout;
  } catch (error) {
    console.error('Error updating payout status:', error);
    throw error;
  }
};

export default {
  projects: projectsService,
  users: usersService,
  orders: ordersService,
  reviews: reviewsService,
  requestPayout,
  getAllPayouts,
  updatePayoutStatus
};