
/**
 * Script to setup Referral System collections and attributes
 */

import { Client, Databases, Permission, Role } from 'node-appwrite';
import 'dotenv/config';

// Appwrite configuration
const endpoint = process.env.APPWRITE_ENDPOINT || process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const apiKey = process.env.APPWRITE_SERVER_API_KEY;
const projectId = process.env.VITE_APPWRITE_PROJECT_ID;

console.log('Debug Info:');
console.log('- Endpoint:', endpoint);
console.log('- Project ID:', projectId);
console.log('- API Key Status:', apiKey ? `Present (Starts with ${apiKey.substring(0, 10)}...)` : 'MISSING');

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'projectdock_db';
const COLLECTIONS = {
  USERS: 'users',
  REFERRALS: 'referrals',
  PAYOUTS: 'payouts'
};

async function setupReferralSystem() {
  console.log('Setting up Referral System...');

  try {
    // 1. Update Users Collection
    console.log('\nUpdating Users collection...');
    
    // Add referralCode
    try {
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.USERS, 'referralCode', 10, false);
      console.log('✅ Users: referralCode attribute added');
      
      // Create unique index for referralCode
      // Wait a bit for attribute to be available
      console.log('Waiting for attribute to be available...');
      await new Promise(r => setTimeout(r, 2000));
      
      await databases.createIndex(DATABASE_ID, COLLECTIONS.USERS, 'idx_referral_code', 'unique', ['referralCode'], ['ASC']);
      console.log('✅ Users: referralCode index created');
    } catch (e) {
      if (e.type !== 'attribute_already_exists' && e.type !== 'index_already_exists') console.error('Error adding referralCode:', e.message);
      else console.log('ℹ️ referralCode already exists');
    }

    // Add referredBy
    try {
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.USERS, 'referredBy', 255, false);
      console.log('✅ Users: referredBy attribute added');
    } catch (e) {
      if (e.type !== 'attribute_already_exists') console.error('Error adding referredBy:', e.message);
      else console.log('ℹ️ referredBy already exists');
    }

    // Add walletBalance
    try {
      await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.USERS, 'walletBalance', false, 0.0);
      console.log('✅ Users: walletBalance attribute added');
    } catch (e) {
      if (e.type !== 'attribute_already_exists') console.error('Error adding walletBalance:', e.message);
      else console.log('ℹ️ walletBalance already exists');
    }

    // 2. Create Referrals Collection
    console.log('\nCreating Referrals collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        COLLECTIONS.REFERRALS,
        'Referrals',
        [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
      console.log('✅ Referrals collection created');
    } catch (e) {
      if (e.type === 'collection_already_exists') console.log('ℹ️ Referrals collection already exists');
      else console.error('Error creating Referrals collection:', e);
    }

    // Add attributes to Referrals
    const referralAttributes = [
      { key: 'referrerId', type: 'string', size: 255, required: true },
      { key: 'refereeId', type: 'string', size: 255, required: true },
      { key: 'amount', type: 'float', required: true },
      { key: 'status', type: 'string', size: 50, required: false, default: 'pending' }, // pending, paid
      { key: 'orderId', type: 'string', size: 255, required: true },
    ];

    for (const attr of referralAttributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.REFERRALS, attr.key, attr.size, attr.required, attr.default);
        } else if (attr.type === 'float') {
          await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.REFERRALS, attr.key, attr.required, 0.0, 1000000.0, attr.default);
        }
        console.log(`✅ Referrals: ${attr.key} attribute added`);
      } catch (e) {
        if (e.type !== 'attribute_already_exists') console.error(`Error adding ${attr.key}:`, e.message);
      }
    }

    // 3. Create Payouts Collection
    console.log('\nCreating Payouts collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        COLLECTIONS.PAYOUTS,
        'Payouts',
        [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
      console.log('✅ Payouts collection created');
    } catch (e) {
      if (e.type === 'collection_already_exists') console.log('ℹ️ Payouts collection already exists');
      else console.error('Error creating Payouts collection:', e);
    }

    // Add attributes to Payouts
    const payoutAttributes = [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'amount', type: 'float', required: true },
      { key: 'bankDetails', type: 'string', size: 1000, required: true }, // JSON string
      { key: 'status', type: 'string', size: 50, required: false, default: 'pending' }, // pending, processed, rejected
    ];

    for (const attr of payoutAttributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PAYOUTS, attr.key, attr.size, attr.required, attr.default);
        } else if (attr.type === 'float') {
          await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.PAYOUTS, attr.key, attr.required, 0.0, 1000000.0, attr.default);
        }
        console.log(`✅ Payouts: ${attr.key} attribute added`);
      } catch (e) {
        if (e.type !== 'attribute_already_exists') console.error(`Error adding ${attr.key}:`, e.message);
      }
    }

    console.log('\n🎉 Referral System setup complete!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupReferralSystem();
