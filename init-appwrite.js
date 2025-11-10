/**
 * Appwrite initialization script for Node.js environment
 * This script sets up the database and collections in Appwrite
 */

// Import necessary modules for Node.js
import { Client, Databases, Storage, Account, Users, Query } from 'node-appwrite';
import 'dotenv/config';

// Appwrite configuration
const client = new Client();

client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || 'your-project-id');

const databases = new Databases(client);
const storage = new Storage(client);

// Database and collection IDs
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'projectdock_db';
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

  // Create database if it doesn't exist
  async createDatabase() {
    try {
      // First, try to list databases to see if ours exists
      let databasesList;
      try {
        databasesList = await databases.list();
      } catch (error) {
        console.log('Could not list databases, attempting creation...');
        // If we can't list databases, try creating it anyway
      }

      if (databasesList) {
        const existingDatabase = databasesList.databases.find(
          db => db.$id === this.databaseId
        );
        
        if (!existingDatabase) {
          console.log(`Creating database: ${this.databaseId}`);
          const database = await databases.create(
            this.databaseId,
            'ProjectDock Database'
          );
          console.log('Database created:', database.$id);
        } else {
          console.log(`Database ${this.databaseId} already exists`);
        }
      } else {
        console.log(`Creating database: ${this.databaseId}`);
        const database = await databases.create(
          this.databaseId,
          'ProjectDock Database'
        );
        console.log('Database created:', database.$id);
      }
    } catch (error) {
      console.error('Error creating database:', error);
      throw error;
    }
  }

  // Create projects collection
  async createProjectsCollection() {
    try {
      // Try to get the collection to see if it exists
      try {
        const existingCollection = await databases.getCollection(
          this.databaseId,
          this.collections.PROJECTS
        );
        console.log(`Collection ${this.collections.PROJECTS} already exists`);
        return existingCollection;
      } catch (error) {
        // Collection doesn't exist, so create it
        console.log(`Creating collection: ${this.collections.PROJECTS}`);
        
        const collection = await databases.createCollection(
          this.databaseId,
          this.collections.PROJECTS,
          'Projects',
          [] // Public read permissions
        );

        // Create string attributes for projects
        await Promise.all([
          databases.createStringAttribute(
            this.databaseId,
            this.collections.PROJECTS,
            'title',
            255,
            true // required
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.PROJECTS,
            'author',
            255,
            false // optional
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.PROJECTS,
            'department',
            100,
            true // required
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.PROJECTS,
            'level',
            20,
            false // optional
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.PROJECTS,
            'abstract',
            10000, // 10k characters
            false // optional
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.PROJECTS,
            'chapterOne',
            10000, // 10k characters
            false // optional
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.PROJECTS,
            'chapters',
            500, // chapter list
            false // optional
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.PROJECTS,
            'formats',
            200, // format list
            false // optional
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.PROJECTS,
            'includes',
            500, // includes list
            false // optional
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.PROJECTS,
            'fileUrl',
            1000, // URL
            false // optional
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.PROJECTS,
            'fileName',
            255, // filename
            false // optional
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.PROJECTS,
            'filePath',
            500, // file path
            false // optional
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.PROJECTS,
            'fileType',
            10, // file type
            false // optional
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.PROJECTS,
            'projectId',
            255, // project ID
            false // optional
          )
        ]);

        // Create integer attributes
        await Promise.all([
          databases.createIntegerAttribute(
            this.databaseId,
            this.collections.PROJECTS,
            'year',
            false, // optional
            2025,  // default value
            1900,  // min
            2100   // max
          ),
          databases.createIntegerAttribute(
            this.databaseId,
            this.collections.PROJECTS,
            'pages',
            false, // optional
            0,     // default value
            0,     // min
            10000  // max
          ),
          databases.createIntegerAttribute(
            this.databaseId,
            this.collections.PROJECTS,
            'priceNGN',
            false, // optional
            0,     // default value
            0,     // min
            1000000 // max
          ),
          databases.createIntegerAttribute(
            this.databaseId,
            this.collections.PROJECTS,
            'downloadCount',
            false, // optional
            0      // default value
          )
        ]);

        // Create boolean attribute
        await databases.createBooleanAttribute(
          this.databaseId,
          this.collections.PROJECTS,
          'isActive',
          true,  // required
          true   // default value
        );

        // Create index on department for faster queries
        await databases.createIndex(
          this.databaseId,
          this.collections.PROJECTS,
          'idx_department',
          'key',
          ['department'],
          ['ASC']
        );

        // Create index on year for faster queries
        await databases.createIndex(
          this.databaseId,
          this.collections.PROJECTS,
          'idx_year',
          'key',
          ['year'],
          ['DESC']
        );

        // Create index on createdAt for sorting
        await databases.createIndex(
          this.databaseId,
          this.collections.PROJECTS,
          'idx_created_at',
          'key',
          ['$createdAt'],
          ['DESC']
        );

        console.log(`Collection ${this.collections.PROJECTS} created with attributes and indexes`);
        return collection;
      }
    } catch (error) {
      console.error(`Error creating ${this.collections.PROJECTS} collection:`, error);
      throw error;
    }
  }

  // Create users collection
  async createUsersCollection() {
    try {
      try {
        const existingCollection = await databases.getCollection(
          this.databaseId,
          this.collections.USERS
        );
        console.log(`Collection ${this.collections.USERS} already exists`);
        return existingCollection;
      } catch (error) {
        console.log(`Creating collection: ${this.collections.USERS}`);
        
        const collection = await databases.createCollection(
          this.databaseId,
          this.collections.USERS,
          'Users',
          [] // Public read permissions
        );

        // Create string attributes for users
        await Promise.all([
          databases.createStringAttribute(
            this.databaseId,
            this.collections.USERS,
            'email',
            255,
            true // required
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.USERS,
            'name',
            255,
            true // required
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.USERS,
            'avatar',
            1000, // URL
            false // optional
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.USERS,
            'role',
            50,
            false,
            'member' // default value
          )
        ]);

        // Create integer attributes
        await databases.createIntegerAttribute(
          this.databaseId,
          this.collections.USERS,
          'joinYear',
          false, // optional
          new Date().getFullYear() // default value
        );

        // Create index on email for unique lookup
        await databases.createIndex(
          this.databaseId,
          this.collections.USERS,
          'idx_user_email',
          'unique',
          ['email'],
          ['ASC']
        );

        console.log(`Collection ${this.collections.USERS} created with attributes and indexes`);
        return collection;
      }
    } catch (error) {
      console.error(`Error creating ${this.collections.USERS} collection:`, error);
      throw error;
    }
  }

  // Create orders collection
  async createOrdersCollection() {
    try {
      try {
        const existingCollection = await databases.getCollection(
          this.databaseId,
          this.collections.ORDERS
        );
        console.log(`Collection ${this.collections.ORDERS} already exists`);
        return existingCollection;
      } catch (error) {
        console.log(`Creating collection: ${this.collections.ORDERS}`);
        
        const collection = await databases.createCollection(
          this.databaseId,
          this.collections.ORDERS,
          'Orders',
          [] // Public read permissions
        );

        // Create string attributes for orders
        await Promise.all([
          databases.createStringAttribute(
            this.databaseId,
            this.collections.ORDERS,
            'userId',
            255,
            true // required
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.ORDERS,
            'projectId',
            255,
            true // required
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.ORDERS,
            'projectTitle',
            255,
            true // required
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.ORDERS,
            'status',
            50,
            true,
            'pending' // default value
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.ORDERS,
            'paymentId',
            255,
            false // optional
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.ORDERS,
            'transactionId',
            255,
            false // optional
          )
        ]);

        // Create integer attributes
        await Promise.all([
          databases.createIntegerAttribute(
            this.databaseId,
            this.collections.ORDERS,
            'amount',
            true, // required
            0     // default value
          ),
          databases.createIntegerAttribute(
            this.databaseId,
            this.collections.ORDERS,
            'quantity',
            true, // required
            1     // default value
          )
        ]);

        // Create index on userId for faster queries
        await databases.createIndex(
          this.databaseId,
          this.collections.ORDERS,
          'idx_user_orders',
          'key',
          ['userId'],
          ['ASC']
        );

        // Create index on project for faster queries
        await databases.createIndex(
          this.databaseId,
          this.collections.ORDERS,
          'idx_project_orders',
          'key',
          ['projectId'],
          ['ASC']
        );

        // Create index on status for faster queries
        await databases.createIndex(
          this.databaseId,
          this.collections.ORDERS,
          'idx_order_status',
          'key',
          ['status'],
          ['ASC']
        );

        console.log(`Collection ${this.collections.ORDERS} created with attributes and indexes`);
        return collection;
      }
    } catch (error) {
      console.error(`Error creating ${this.collections.ORDERS} collection:`, error);
      throw error;
    }
  }

  // Create reviews collection
  async createReviewsCollection() {
    try {
      try {
        const existingCollection = await databases.getCollection(
          this.databaseId,
          this.collections.REVIEWS
        );
        console.log(`Collection ${this.collections.REVIEWS} already exists`);
        return existingCollection;
      } catch (error) {
        console.log(`Creating collection: ${this.collections.REVIEWS}`);
        
        const collection = await databases.createCollection(
          this.databaseId,
          this.collections.REVIEWS,
          'Reviews',
          [] // Public read permissions
        );

        // Create string attributes for reviews
        await Promise.all([
          databases.createStringAttribute(
            this.databaseId,
            this.collections.REVIEWS,
            'userId',
            255,
            true // required
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.REVIEWS,
            'projectId',
            255,
            true // required
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.REVIEWS,
            'userName',
            255,
            true // required
          ),
          databases.createStringAttribute(
            this.databaseId,
            this.collections.REVIEWS,
            'comment',
            1000,
            true // required
          )
        ]);

        // Create integer attributes
        await Promise.all([
          databases.createIntegerAttribute(
            this.databaseId,
            this.collections.REVIEWS,
            'rating',
            true, // required
            0,    // default value
            1,    // min
            5     // max
          )
        ]);

        // Create index on projectId for faster queries
        await databases.createIndex(
          this.databaseId,
          this.collections.REVIEWS,
          'idx_project_reviews',
          'key',
          ['projectId'],
          ['ASC']
        );

        // Create index on userId for faster queries
        await databases.createIndex(
          this.databaseId,
          this.collections.REVIEWS,
          'idx_user_reviews',
          'key',
          ['userId'],
          ['ASC']
        );

        console.log(`Collection ${this.collections.REVIEWS} created with attributes and indexes`);
        return collection;
      }
    } catch (error) {
      console.error(`Error creating ${this.collections.REVIEWS} collection:`, error);
      throw error;
    }
  }

  // Create storage bucket for project files
  async createStorageBucket() {
    try {
      // For Node.js, we need to use the proper Appwrite Storage SDK
      try {
        const bucketsList = await storage.listBuckets();
        
        const existingBucket = bucketsList.buckets.find(
          bucket => bucket.$id === BUCKET_ID
        );
        
        if (!existingBucket) {
          console.log(`Creating storage bucket: ${BUCKET_ID}`);
          const bucket = await storage.createBucket(
            BUCKET_ID,
            'Project Files',
            [], // permissions
            false // file security
          );
          console.log('Storage bucket created:', bucket.$id);
          return bucket;
        } else {
          console.log(`Storage bucket ${BUCKET_ID} already exists`);
          return existingBucket;
        }
      } catch (error) {
        // If listBuckets fails (due to permissions), try creating directly
        console.log(`Creating storage bucket: ${BUCKET_ID}`);
        try {
          const bucket = await storage.createBucket(
            BUCKET_ID,
            'Project Files',
            [], // permissions
            false // file security
          );
          console.log('Storage bucket created:', bucket.$id);
          return bucket;
        } catch (createError) {
          // Check if it's because bucket already exists
          if (createError.toString().includes('409') || createError.toString().includes('already exists')) {
            console.log(`Storage bucket ${BUCKET_ID} already exists`);
            return { $id: BUCKET_ID };
          } else {
            throw createError;
          }
        }
      }
    } catch (error) {
      console.error('Error creating storage bucket:', error);
      throw error;
    }
  }

  // Initialize all Appwrite resources
  async initialize() {
    try {
      console.log('Starting Appwrite initialization...');
      
      // Create database
      await this.createDatabase();
      
      // Create storage bucket
      await this.createStorageBucket();
      
      // Create collections
      await this.createProjectsCollection();
      await this.createUsersCollection();
      await this.createOrdersCollection();
      await this.createReviewsCollection();
      
      console.log('Appwrite initialization completed successfully!');
      return true;
    } catch (error) {
      console.error('Appwrite initialization failed:', error);
      throw error;
    }
  }
}

// Export for use in other modules
export default AppwriteSetupService;

// Run initialization if this script is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const initializeAppwrite = async () => {
    console.log('Starting Appwrite initialization...');
    
    try {
      const setupService = new AppwriteSetupService();
      await setupService.initialize();
      console.log('Appwrite initialization completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('Appwrite initialization failed:', error);
      process.exit(1);
    }
  };

  initializeAppwrite();
}