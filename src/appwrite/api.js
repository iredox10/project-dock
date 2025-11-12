/**
 * Main API service using Appwrite
 * This file combines all Appwrite services to replace the Firebase-based API
 */

import authService from './auth';
import { projectsService, usersService, ordersService, reviewsService } from './database';
import storageService from './storage';
import { extractProjectFromFile, batchExtractProjects } from './aiExtractionService';
import { getStandardizedDepartment } from './departmentService';

/**
 * Export all services for easy access
 */

// Authentication service
export {
  authService
};

// Database services
export {
  projectsService,
  usersService,
  ordersService,
  reviewsService
};

// Storage service
export {
  storageService as fileStorageService,
  storageService
};

// AI extraction services
export {
  extractProjectFromFile,
  batchExtractProjects
};

// Department service
export {
  getStandardizedDepartment
};

// Combined API service object
export const appwriteAPI = {
  auth: authService,
  db: {
    projects: projectsService,
    users: usersService,
    orders: ordersService,
    reviews: reviewsService
  },
  storage: storageService,
  ai: {
    extractProjectFromFile,
    batchExtractProjects
  },
  utils: {
    getStandardizedDepartment
  }
};

export default appwriteAPI;