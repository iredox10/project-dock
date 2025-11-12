import { Client, Databases, Storage, Account, Functions } from 'appwrite';

// Appwrite configuration
const client = new Client();

// Update these with your actual Appwrite endpoint and project ID
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1') // Your Appwrite endpoint
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || 'your-project-id'); // Your project ID

export const appwrite = {
  client,
  databases: new Databases(client),
  storage: new Storage(client),
  account: new Account(client),
  functions: new Functions(client)
};

export const {
  databases,
  storage,
  account,
  functions
} = appwrite;

// Database ID - you can change this as needed
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'projectdock_db';

// Collection IDs
export const COLLECTIONS = {
  PROJECTS: 'projects',
  USERS: 'users',
  ORDERS: 'orders',
  REVIEWS: 'reviews'
};

// Bucket ID for file storage
export const BUCKET_ID = 'project_files';