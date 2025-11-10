import { Client, Databases, Storage, Account, Users } from 'appwrite';

// Appwrite configuration
const client = new Client();

// Update these with your actual Appwrite endpoint and project ID
client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1') // Your Appwrite endpoint
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || 'your-project-id'); // Your project ID

export const appwrite = {
  client,
  databases: new Databases(client),
  storage: new Storage(client),
  account: new Account(client),
  users: new Users(client)
};

export const {
  databases,
  storage,
  account,
  users
} = appwrite;

// Database ID - you can change this as needed
export const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'projectdock_db';

// Collection IDs
export const COLLECTIONS = {
  PROJECTS: 'projects',
  USERS: 'users',
  ORDERS: 'orders',
  REVIEWS: 'reviews'
};

// Bucket ID for file storage
export const BUCKET_ID = 'project_files';