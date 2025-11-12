import { Client, Account } from 'node-appwrite';
import 'dotenv/config';

// Test script to verify API key authentication
const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setKey(process.env.APPWRITE_SERVER_API_KEY);

const account = new Account(client);

console.log('Testing API key authentication...');

try {
  // Try to get account info (this will tell us if the API key is valid)
  const user = await account.get();
  console.log('✅ API key is valid!');
  console.log('User ID:', user.$id);
  console.log('User name:', user.name);
  console.log('Email:', user.email);
} catch (error) {
  console.log('❌ API key authentication failed:');
  console.error(error);
  
  if (error.type === 'user_unauthorized') {
    console.log('\nThis means the API key is invalid, expired, or does not have required permissions.');
    console.log('Make sure:');
    console.log('1. The API key is correct and belongs to your project');
    console.log('2. The API key has the necessary scopes: databases.write, collections.write, buckets.write, files.write');
    console.log('3. The project ID in your environment matches where the API key was created');
  }
}