import { projectsService, usersService, ordersService, reviewsService } from '../appwrite/api';

// Export the Appwrite project service functions directly
export const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByDepartment,
  getProjectsByLevel
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

export default {
  projects: projectsService,
  users: usersService,
  orders: ordersService,
  reviews: reviewsService
};