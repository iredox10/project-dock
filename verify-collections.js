/**
 * Script to verify Appwrite collections exist
 */

import { Client, Databases } from 'node-appwrite';
import 'dotenv/config';

// Appwrite configuration - using server API key
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setKey(process.env.APPWRITE_SERVER_API_KEY); // Server API key with read/write permissions

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'projectdock_db';

async function verifyCollections() {
  console.log('Verifying Appwrite collections...');

  try {
    // List all collections in the database
    const response = await databases.listCollections(DATABASE_ID);
    
    console.log('\nCollections found in database:');
    response.collections.forEach(collection => {
      console.log(`- ${collection.$id} (${collection.name})`);
    });

    const requiredCollections = ['projects', 'users', 'orders', 'reviews'];
    const existingCollections = response.collections.map(col => col.$id);

    console.log('\nVerification Results:');
    for (const reqCol of requiredCollections) {
      if (existingCollections.includes(reqCol)) {
        console.log(`✅ ${reqCol} collection exists`);
      } else {
        console.log(`❌ ${reqCol} collection is missing`);
      }
    }

    // If all collections exist, check if there are any users
    if (existingCollections.includes('users')) {
      try {
        const usersResponse = await databases.listDocuments(
          DATABASE_ID,
          'users'
        );
        console.log(`\nFound ${usersResponse.total} user(s) in the database`);
        if (usersResponse.documents.length > 0) {
          console.log('Sample user data:');
          usersResponse.documents.forEach(user => {
            console.log(`- ID: ${user.$id}, Email: ${user.email}, Role: ${user.role || 'user'}`);
          });
        }
      } catch (userError) {
        console.log(`\nCould not fetch users:`, userError.message);
      }
    }

  } catch (error) {
    console.error('❌ Error verifying collections:', error);
    console.log('\nThis could mean:');
    console.log('1. Your APPWRITE_SERVER_API_KEY is incorrect');
    console.log('2. Your database ID is incorrect');
    console.log('3. The API key does not have proper permissions');
    console.log('4. The database does not exist');
  }
}

verifyCollections();