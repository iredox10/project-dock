
import { Client, Users, Databases, ID, Query } from 'node-appwrite';
import 'dotenv/config';

const endpoint = process.env.APPWRITE_ENDPOINT || process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_SERVER_API_KEY;

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const users = new Users(client);
const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'projectdock_db';
const USERS_COLLECTION_ID = 'users';

async function createTestUser() {
  const email = 'testuser@projectdock.com';
  const password = 'password123';
  const name = 'Test User';

  console.log('Creating test user...');

  try {
    // 1. Check or Create Auth Account
    let userId;
    try {
        // Try to find existing first
        const list = await users.list([Query.equal('email', email)]);
        if (list.users.length > 0) {
            userId = list.users[0].$id;
            console.log(`User already exists (ID: ${userId})`);
            
            // Update password to ensure login works
            await users.updatePassword(userId, password);
            console.log('Password reset to: password123');
        } else {
            const user = await users.create(ID.unique(), email, undefined, password, name);
            userId = user.$id;
            console.log(`Created new auth account (ID: ${userId})`);
        }
    } catch (e) {
        console.error('Auth error:', e);
        return;
    }

    // 2. Create or Update Database Document
    const referralCode = 'TEST' + Math.floor(100 + Math.random() * 900);
    
    try {
        // Check if document exists
        await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, userId);
        
        // Update existing
        console.log('Updating existing user document...');
        await databases.updateDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            userId,
            {
                walletBalance: 5000.0,
                referralCode: referralCode // Ensure they have a code
            }
        );
        console.log('✅ Wallet balance set to ₦5,000');
    } catch (e) {
        if (e.code === 404) {
            // Create new
            console.log('Creating new user document...');
            await databases.createDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                userId,
                {
                    email,
                    name,
                    role: 'user',
                    walletBalance: 5000.0,
                    referralCode: referralCode,
                    joinYear: new Date().getFullYear()
                }
            );
            console.log('✅ User document created with ₦5,000 balance');
        } else {
            throw e;
        }
    }

    console.log('\n------------------------------------------------');
    console.log('🎉 Test User Created Successfully!');
    console.log(`📧 Email:    ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`💰 Balance:  ₦5,000`);
    console.log('------------------------------------------------');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTestUser();
