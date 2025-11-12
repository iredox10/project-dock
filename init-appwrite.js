/**
 * Appwrite initialization script for Node.js environment
 * This script sets up the database and collections in Appwrite.
 * It is idempotent, meaning it can be run multiple times without errors.
 */

// Import necessary modules for Node.js
import { Client, Databases, Storage, Users, Query, ID, Permission, Role } from 'node-appwrite';
import 'dotenv/config';

// --- 1. Client Configuration & Validation ---

// Check for all required environment variables
if (
  !process.env.VITE_APPWRITE_ENDPOINT ||
  !process.env.VITE_APPWRITE_PROJECT_ID ||
  !process.env.APPWRITE_SERVER_API_KEY
) {
  console.error('Error: Missing environment variables.');
  console.error('Please ensure VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID, and APPWRITE_SERVER_API_KEY are set in your .env file.');
  process.exit(1); // Exit with a failure code
}

// Appwrite configuration
const client = new Client();

console.log('Using server API key for authentication.');

// Initialize the client with ALL required settings
client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_SERVER_API_KEY); // Use server API key for admin access

const databases = new Databases(client);
const storage = new Storage(client);

// Database and collection IDs
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'projectdock_db';

console.log('DATABASE_ID:', DATABASE_ID);
const COLLECTIONS = {
  PROJECTS: 'projects',
  USERS: 'users',
  ORDERS: 'orders',
  REVIEWS: 'reviews'
};
const BUCKET_ID = 'project_files';

class AppwriteSetupService {
  constructor() {
    this.databaseId = DATABASE_ID;
    this.collections = COLLECTIONS;
  }

  /**
   * A helper function to create resources idempotently.
   * It attempts to run the `apiCall` function.
   * If it succeeds, it logs success.
   * If it fails with a 409 error, it logs that the resource exists.
   * If it fails with any other error, it throws it.
   */
  async _createResource(apiCall, resourceName) {
    try {
      await apiCall();
      console.log(`✅ Created: ${resourceName}`);
    } catch (error) {
      if (error.code === 409) {
        console.log(`👍 Exists:  ${resourceName}`);
      } else {
        console.error(`❌ Error creating ${resourceName}:`, error);
        throw error; // Re-throw other errors
      }
    }
  }

  // Create database if it doesn't exist
  async createDatabase() {
    try {
      // First, try to get the database to see if it already exists
      const existingDatabase = await databases.get(this.databaseId);
      console.log(`👍 Exists:  Database '${this.databaseId}'`);
      return existingDatabase;
    } catch (error) {
      // If getting the database fails with 404, it doesn't exist, so we'll create it
      if (error.code === 404) {
        try {
          return await this._createResource(
            () => databases.create(this.databaseId, 'ProjectDock Database'),
            `Database '${this.databaseId}'`
          );
        } catch (createError) {
          if (createError.code === 403 && createError.type === 'additional_resource_not_allowed') {
            console.log(`⚠️  Database limit reached for project. Database '${this.databaseId}' may already exist.`);
            // If we can't create it due to limits, just return without error
            return null;
          } else {
            throw createError;
          }
        }
      } else if (error.code === 403 && error.type === 'additional_resource_not_allowed') {
        console.log(`⚠️  Database limit reached for project. Database '${this.databaseId}' may already exist.`);
        return null;
      } else {
        console.error(`❌ Error checking database:`, error);
        throw error;
      }
    }
  }

  // Create projects collection
  async createProjectsCollection() {
    await this._createResource(
      () => databases.createCollection(
        this.databaseId,
        this.collections.PROJECTS,
        'Projects',
        [
          Permission.read(Role.any()),    // Anyone can read projects
          Permission.create(Role.users()), // Logged-in users can create
          Permission.update(Role.users()), // Logged-in users can update
          Permission.delete(Role.users()), // Logged-in users can delete
        ]
      ),
      `Collection '${this.collections.PROJECTS}'`
    );

    // Create attributes
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.PROJECTS, 'title', 255, true), 'projects: title');
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.PROJECTS, 'author', 255, false), 'projects: author');
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.PROJECTS, 'department', 100, true), 'projects: department');
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.PROJECTS, 'level', 20, false), 'projects: level');

    // --- THIS IS THE FIX ---
    // Instead of huge 10k attributes, store File IDs from your storage bucket
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.PROJECTS, 'abstractFileId', 255, false), 'projects: abstractFileId');
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.PROJECTS, 'chapterOneFileId', 255, false), 'projects: chapterOneFileId');
    // --- END OF FIX ---

    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.PROJECTS, 'chapters', 500, false), 'projects: chapters');
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.PROJECTS, 'formats', 200, false), 'projects: formats');
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.PROJECTS, 'includes', 500, false), 'projects: includes');

    // Removed original fileUrl/fileName/filePath and replaced with one mainFileId
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.PROJECTS, 'mainFileId', 255, false), 'projects: mainFileId');

    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.PROJECTS, 'projectId', 255, false), 'projects: projectId');
    await this._createResource(() => databases.createIntegerAttribute(this.databaseId, this.collections.PROJECTS, 'year', false, 1900, 2100, 2025), 'projects: year');
    await this._createResource(() => databases.createIntegerAttribute(this.databaseId, this.collections.PROJECTS, 'pages', false, 0, 10000, 0), 'projects: pages');
    await this._createResource(() => databases.createIntegerAttribute(this.databaseId, this.collections.PROJECTS, 'priceNGN', false, 0, 1000000, 0), 'projects: priceNGN');
    await this._createResource(() => databases.createIntegerAttribute(this.databaseId, this.collections.PROJECTS, 'downloadCount', false, 0, 100000, 0), 'projects: downloadCount');
    await this._createResource(() => databases.createBooleanAttribute(this.databaseId, this.collections.PROJECTS, 'isActive', false, true), 'projects: isActive');  // Not required, default to true

    // Create indexes
    await this._createResource(() => databases.createIndex(this.databaseId, this.collections.PROJECTS, 'idx_department', 'key', ['department'], ['ASC']), 'projects: idx_department');
    await this._createResource(() => databases.createIndex(this.databaseId, this.collections.PROJECTS, 'idx_year', 'key', ['year'], ['DESC']), 'projects: idx_year');
    await this._createResource(() => databases.createIndex(this.databaseId, this.collections.PROJECTS, 'idx_created_at', 'key', ['$createdAt'], ['DESC']), 'projects: idx_created_at');
  }

  // Create users collection
  async createUsersCollection() {
    await this._createResource(
      () => databases.createCollection(
        this.databaseId,
        this.collections.USERS,
        'Users',
        [
          Permission.read(Role.any()),    // Anyone can read user profiles
          Permission.create(Role.users()), // Logged-in users can create
          Permission.update(Role.users()), // Logged-in users can update
          Permission.delete(Role.users()), // Logged-in users can delete
        ]
      ),
      `Collection '${this.collections.USERS}'`
    );

    // Create attributes
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.USERS, 'email', 255, true), 'users: email');
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.USERS, 'name', 255, true), 'users: name');
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.USERS, 'avatar', 1000, false), 'users: avatar');
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.USERS, 'role', 50, false, 'member'), 'users: role');
    await this._createResource(() => databases.createIntegerAttribute(this.databaseId, this.collections.USERS, 'joinYear', false, new Date().getFullYear()), 'users: joinYear');

    // Create indexes
    await this._createResource(() => databases.createIndex(this.databaseId, this.collections.USERS, 'idx_user_email', 'unique', ['email'], ['ASC']), 'users: idx_user_email');
  }

  // Create orders collection
  async createOrdersCollection() {
    await this._createResource(
      () => databases.createCollection(
        this.databaseId,
        this.collections.ORDERS,
        'Orders',
        [
          // IMPORTANT: Orders are sensitive. Only let logged-in users access them.
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      ),
      `Collection '${this.collections.ORDERS}'`
    );

    // Create attributes
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.ORDERS, 'userId', 255, true), 'orders: userId');
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.ORDERS, 'projectId', 255, true), 'orders: projectId');
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.ORDERS, 'projectTitle', 255, true), 'orders: projectTitle');
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.ORDERS, 'status', 50, false, 'pending'), 'orders: status');  // Not required, has default
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.ORDERS, 'paymentId', 255, false), 'orders: paymentId');
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.ORDERS, 'transactionId', 255, false), 'orders: transactionId');
    await this._createResource(() => databases.createIntegerAttribute(this.databaseId, this.collections.ORDERS, 'amount', false, 0), 'orders: amount');  // Not required, has default
    await this._createResource(() => databases.createIntegerAttribute(this.databaseId, this.collections.ORDERS, 'quantity', false, 1), 'orders: quantity');  // Not required, has default

    // Create indexes
    await this._createResource(() => databases.createIndex(this.databaseId, this.collections.ORDERS, 'idx_user_orders', 'key', ['userId'], ['ASC']), 'orders: idx_user_orders');
    await this._createResource(() => databases.createIndex(this.databaseId, this.collections.ORDERS, 'idx_project_orders', 'key', ['projectId'], ['ASC']), 'orders: idx_project_orders');
    await this._createResource(() => databases.createIndex(this.databaseId, this.collections.ORDERS, 'idx_order_status', 'key', ['status'], ['ASC']), 'orders: idx_order_status');
  }

  // Create reviews collection
  async createReviewsCollection() {
    await this._createResource(
      () => databases.createCollection(
        this.databaseId,
        this.collections.REVIEWS,
        'Reviews',
        [
          Permission.read(Role.any()),    // Anyone can read reviews
          Permission.create(Role.users()), // Logged-in users can create
          Permission.update(Role.users()), // Logged-in users can update
          Permission.delete(Role.users()), // Logged-in users can delete
        ]
      ),
      `Collection '${this.collections.REVIEWS}'`
    );

    // Create attributes
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.REVIEWS, 'userId', 255, true), 'reviews: userId');
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.REVIEWS, 'projectId', 255, true), 'reviews: projectId');
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.REVIEWS, 'userName', 255, true), 'reviews: userName');
    await this._createResource(() => databases.createStringAttribute(this.databaseId, this.collections.REVIEWS, 'comment', 1000, true), 'reviews: comment');
    await this._createResource(() => databases.createIntegerAttribute(this.databaseId, this.collections.REVIEWS, 'rating', false, 1, 5, 1), 'reviews: rating');  // Not required, min 1, max 5, default 1

    // Create indexes
    await this._createResource(() => databases.createIndex(this.databaseId, this.collections.REVIEWS, 'idx_project_reviews', 'key', ['projectId'], ['ASC']), 'reviews: idx_project_reviews');
    await this._createResource(() => databases.createIndex(this.databaseId, this.collections.REVIEWS, 'idx_user_reviews', 'key', ['userId'], ['ASC']), 'reviews: idx_user_reviews');
  }

  // Create storage bucket for project files
  async createStorageBucket() {
    try {
      // First, try to get the bucket to see if it already exists
      const existingBucket = await storage.getBucket(BUCKET_ID);
      console.log(`👍 Exists:  Storage Bucket '${BUCKET_ID}'`);
      return existingBucket;
    } catch (error) {
      // If getting the bucket fails with 404, it doesn't exist, so we'll create it
      if (error.code === 404) {
        try {
          const newBucket = await this._createResource(
            () => storage.createBucket(
              BUCKET_ID,
              'Project Files',
              [
                Permission.read(Role.any()),    // Anyone can read files (if they have the ID)
                Permission.create(Role.users()), // Logged-in users can upload
                Permission.update(Role.users()), // Logged-in users can update
                Permission.delete(Role.users()), // Logged-in users can delete
              ],
              false // fileSecurity (set to true if you want to manage per-file permissions)
            ),
            `Storage Bucket '${BUCKET_ID}'`
          );
          return newBucket;
        } catch (createError) {
          if (createError.code === 403 && createError.type === 'additional_resource_not_allowed') {
            console.log(`⚠️  Storage bucket limit reached for project. Bucket '${BUCKET_ID}' may already exist.`);
            // If we can't create it due to limits, just return without error
            return null;
          } else {
            throw createError;
          }
        }
      } else if (error.code === 403 && error.type === 'additional_resource_not_allowed') {
        console.log(`⚠️  Storage bucket limit reached for project. Bucket '${BUCKET_ID}' may already exist.`);
        return null;
      } else {
        console.error(`❌ Error checking storage bucket:`, error);
        throw error;
      }
    }
  }

  // Initialize all Appwrite resources
  async initialize() {
    try {
      console.log('--- Starting Appwrite Initialization ---');

      // Create database
      await this.createDatabase();

      // Create storage bucket
      await this.createStorageBucket();

      // Create collections
      await this.createProjectsCollection();
      await this.createUsersCollection();
      await this.createOrdersCollection();
      await this.createReviewsCollection();

      console.log('--- Appwrite Initialization Completed Successfully! ---');
      return true;
    } catch (error) {
      console.error('--- Appwrite Initialization Failed ---');
      console.error(error);
      throw error;
    }
  }
}

// Export for use in other modules
export default AppwriteSetupService;

// Run initialization if this script is executed directly
// (e.g., `bun init-appwrite.js`)
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const initializeAppwrite = async () => {
    try {
      const setupService = new AppwriteSetupService();
      await setupService.initialize();
      process.exit(0); // Exit with success
    } catch (error) {
      console.error('Appwrite initialization failed from direct run.');
      process.exit(1); // Exit with failure
    }
  };

  initializeAppwrite();
}
