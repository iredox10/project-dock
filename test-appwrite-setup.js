/**
 * Test script to verify Appwrite setup
 */

import { Client, Databases, Account } from 'node-appwrite';
import 'dotenv/config';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setKey(process.env.APPWRITE_SERVER_API_KEY); // Your server API key with admin privileges

const databases = new Databases(client);
const account = new Account(client);

// IDs from your config
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'projectdock_db';
const COLLECTIONS = {
  PROJECTS: 'projects',
  USERS: 'users',
  ORDERS: 'orders',
  REVIEWS: 'reviews'
};

async function testAppwriteSetup() {
  console.log('Testing Appwrite setup...\n');

  try {
    // 1. Test authentication with server API key
    console.log('1. Testing authentication...');
    const user = await account.get();
    console.log('✅ Authentication successful - connected as:', user.name || user.email || user.$id);

    // 2. Test database existence
    console.log('\n2. Testing database existence...');
    try {
      const database = await databases.get(DATABASE_ID);
      console.log('✅ Database exists:', database.name);
    } catch (dbError) {
      console.log('❌ Database does not exist:', DATABASE_ID);
      console.log('   Error:', dbError.message);
      return;
    }

    // 3. Test collection existence
    console.log('\n3. Testing collection existence...');
    
    for (const [key, collectionId] of Object.entries(COLLECTIONS)) {
      try {
        const collection = await databases.getCollection(DATABASE_ID, collectionId);
        console.log(`✅ ${key} collection exists:`, collection.name);
      } catch (collError) {
        console.log(`❌ ${key} collection does not exist:`, collectionId);
        console.log('   Error:', collError.message);
      }
    }

    // 4. Try a simple read operation
    console.log('\n4. Testing read operations...');
    try {
      const projectsList = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROJECTS,
        [] // No queries, just test if it connects
      );
      console.log('✅ Projects collection accessible, found', projectsList.total, 'documents');
    } catch (readError) {
      console.log('❌ Could not access projects collection:', readError.message);
    }

    try {
      const usersList = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        []
      );
      console.log('✅ Users collection accessible, found', usersList.total, 'documents');
    } catch (readError) {
      console.log('❌ Could not access users collection:', readError.message);
    }

    try {
      const ordersList = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        []
      );
      console.log('✅ Orders collection accessible, found', ordersList.total, 'documents');
    } catch (readError) {
      console.log('❌ Could not access orders collection:', readError.message);
    }

    console.log('\n📋 Summary:');
    console.log('- Make sure your Appwrite project is properly set up');
    console.log('- Verify your API key has the correct permissions');
    console.log('- Ensure the database and collections have been created');
    console.log('- Check that your .env file has correct configuration');

  } catch (error) {
    console.error('❌ Appwrite test failed:', error.message);
    console.error('Additional error details:', {
      code: error.code,
      type: error.type,
      response: error.response
    });
  }
}

// Run the test
testAppwriteSetup();