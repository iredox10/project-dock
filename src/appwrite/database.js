import { databases, DATABASE_ID, COLLECTIONS } from './config';
import { Query } from 'appwrite';

/**
 * Database service using Appwrite
 */

// Projects service
export const projectsService = {
  // Get all projects with optional filters
  async getAllProjects(params = {}) {
    try {
      const queries = [];

      // Add filters if provided
      if (params.department) {
        queries.push(Query.equal('department', params.department));
      }

      if (params.level) {
        queries.push(Query.equal('level', params.level));
      }

      if (params.year) {
        queries.push(Query.equal('year', params.year));
      }

      if (params.search) {
        queries.push(Query.search('title', params.search));
      }

      if (params.limit) {
        queries.push(Query.limit(params.limit));
      }

      if (params.offset) {
        queries.push(Query.offset(params.offset));
      }

      // Default to sort by creation date descending
      queries.push(Query.orderDesc('$createdAt'));

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROJECTS,
        queries
      );

      return response;
    } catch (error) {
      console.error('Error getting projects:', error);
      throw new Error(error.message);
    }
  },

  // Get project by ID
  async getProjectById(projectId) {
    try {
      const document = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.PROJECTS,
        projectId
      );
      return document;
    } catch (error) {
      console.error('Error getting project:', error);
      throw new Error(error.message);
    }
  },

  // Create a new project
  async createProject(projectData) {
    try {
      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.PROJECTS,
        'unique()', // auto-generate ID
        {
          ...projectData,
          downloadCount: projectData.downloadCount || 0,
          isActive: projectData.isActive !== undefined ? projectData.isActive : true
        }
      );
      return document;
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error(error.message);
    }
  },

  // Update project
  async updateProject(projectId, projectData) {
    try {
      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.PROJECTS,
        projectId,
        projectData
      );
      return document;
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error(error.message);
    }
  },

  // Delete project
  async deleteProject(projectId) {
    try {
      const result = await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.PROJECTS,
        projectId
      );
      return result;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error(error.message);
    }
  },

  // Get projects by department
  async getProjectsByDepartment(department, params = {}) {
    try {
      const queries = [Query.equal('department', department)];

      if (params.level) {
        queries.push(Query.equal('level', params.level));
      }

      if (params.limit) {
        queries.push(Query.limit(params.limit));
      }

      if (params.offset) {
        queries.push(Query.offset(params.offset));
      }

      queries.push(Query.orderDesc('$createdAt'));

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROJECTS,
        queries
      );

      return response;
    } catch (error) {
      console.error('Error getting projects by department:', error);
      throw new Error(error.message);
    }
  },

  // Get projects by level
  async getProjectsByLevel(level, params = {}) {
    try {
      const queries = [Query.equal('level', level)];

      if (params.department) {
        queries.push(Query.equal('department', params.department));
      }

      if (params.limit) {
        queries.push(Query.limit(params.limit));
      }

      queries.push(Query.orderDesc('$createdAt'));

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROJECTS,
        queries
      );

      return response;
    } catch (error) {
      console.error('Error getting projects by level:', error);
      throw new Error(error.message);
    }
  },

  // Get unique departments from existing projects
  async getUniqueDepartments() {
    try {
      // Fetch projects to extract departments
      // Using a high limit to cover most projects
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROJECTS,
        [
          Query.limit(1000),
          Query.orderDesc('$createdAt')
        ]
      );

      const departments = [...new Set(response.documents.map(p => p.department).filter(Boolean))].sort();
      return departments;
    } catch (error) {
      console.error('Error getting unique departments:', error);
      return [];
    }
  }
};

// Users service
export const usersService = {
  // Get all users
  async getAllUsers(params = {}) {
    try {
      const queries = [];

      if (params.limit) {
        queries.push(Query.limit(params.limit));
      }

      if (params.offset) {
        queries.push(Query.offset(params.offset));
      }

      queries.push(Query.orderDesc('$createdAt'));

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        queries
      );

      return response;
    } catch (error) {
      console.error('Error getting users:', error);
      throw new Error(error.message);
    }
  },

  // Get user by ID
  async getUserById(userId) {
    console.log('Attempting to get user with ID:', userId, 'from database:', DATABASE_ID, 'collection:', COLLECTIONS.USERS);
    try {
      const document = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        userId
      );
      console.log('Successfully retrieved user document:', document);
      return document;
    } catch (error) {
      console.log('Error occurred when fetching user:', error);
      // If document not found, return null instead of throwing
      if (error.code === 404 || error.message?.includes('not be found')) {
        console.log('User document not found in database');
        return null;
      }
      console.error('Error getting user:', error);
      throw new Error(error.message);
    }
  },

  // Create/update user
  async createUser(userData) {
    try {
      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        userData.$id, // Use the Appwrite user ID
        {
          ...userData
        }
      );
      return document;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error(error.message);
    }
  },

  // Update user
  async updateUser(userId, userData) {
    try {
      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        userId,
        userData
      );
      return document;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error(error.message);
    }
  },

  // Delete user
  async deleteUser(userId) {
    try {
      const result = await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        userId
      );
      return result;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error(error.message);
    }
  },

  // Get user by email
  async getUserByEmail(email) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('email', email)]
      );

      if (response.documents.length > 0) {
        return response.documents[0];
      }
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw new Error(error.message);
    }
  }
};

// Orders service
export const ordersService = {
  // Get all orders
  async getAllOrders(params = {}) {
    try {
      const queries = [];

      if (params.userId) {
        queries.push(Query.equal('userId', params.userId));
      }

      if (params.status) {
        queries.push(Query.equal('status', params.status));
      }

      if (params.projectId) {
        queries.push(Query.equal('projectId', params.projectId));
      }

      if (params.limit) {
        queries.push(Query.limit(params.limit));
      }

      queries.push(Query.orderDesc('$createdAt'));

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        queries
      );

      return response;
    } catch (error) {
      console.error('Error getting orders:', error);
      throw new Error(error.message);
    }
  },

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const document = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        orderId
      );
      return document;
    } catch (error) {
      console.error('Error getting order:', error);
      throw new Error(error.message);
    }
  },

  // Create order
  async createOrder(orderData) {
    try {
      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        'unique()',
        {
          ...orderData,
          status: orderData.status || 'pending',
          quantity: orderData.quantity || 1
        }
      );
      return document;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error(error.message);
    }
  },

  // Update order status
  async updateOrder(orderId, orderData) {
    try {
      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        orderId,
        orderData
      );
      return document;
    } catch (error) {
      console.error('Error updating order:', error);
      throw new Error(error.message);
    }
  },

  // Delete order
  async deleteOrder(orderId) {
    try {
      const result = await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        orderId
      );
      return result;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw new Error(error.message);
    }
  }
};

// Reviews service
export const reviewsService = {
  // Get all reviews for a project
  async getReviewsByProject(projectId, params = {}) {
    try {
      const queries = [Query.equal('projectId', projectId)];

      if (params.limit) {
        queries.push(Query.limit(params.limit));
      }

      queries.push(Query.orderDesc('$createdAt'));

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.REVIEWS,
        queries
      );

      return response;
    } catch (error) {
      console.error('Error getting reviews:', error);
      throw new Error(error.message);
    }
  },

  // Get reviews by user
  async getReviewsByUser(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.REVIEWS,
        [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
      );

      return response;
    } catch (error) {
      console.error('Error getting user reviews:', error);
      throw new Error(error.message);
    }
  },

  // Create review
  async createReview(reviewData) {
    try {
      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.REVIEWS,
        'unique()',
        {
          ...reviewData
        }
      );
      return document;
    } catch (error) {
      console.error('Error creating review:', error);
      throw new Error(error.message);
    }
  },

  // Update review
  async updateReview(reviewId, reviewData) {
    try {
      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.REVIEWS,
        reviewId,
        reviewData
      );
      return document;
    } catch (error) {
      console.error('Error updating review:', error);
      throw new Error(error.message);
    }
  },

  // Delete review
  async deleteReview(reviewId) {
    try {
      const result = await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.REVIEWS,
        reviewId
      );
      return result;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw new Error(error.message);
    }
  }
};

export default {
  projectsService,
  usersService,
  ordersService,
  reviewsService
};