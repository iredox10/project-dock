/**
 * Script to ensure all Appwrite collections exist with proper attributes
 * This can be run to set up your Appwrite database collections
 */

import { Client, Databases, Account, Users, Query, Permission, Role } from 'node-appwrite';
import 'dotenv/config';

// Appwrite configuration - using server API key
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setKey(process.env.APPWRITE_SERVER_API_KEY); // Server API key with write permissions

const databases = new Databases(client);

// Database and collection IDs
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'projectdock_db';
const COLLECTIONS = {
  PROJECTS: 'projects',
  USERS: 'users',
  ORDERS: 'orders',
  REVIEWS: 'reviews'
};

async function setupCollections() {
  console.log('Setting up Appwrite collections...');

  try {
    // Create Users Collection
    console.log('Creating Users collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        COLLECTIONS.USERS,
        'Users',
        [
          Permission.read(Role.any()),    // Anyone can read user profiles
          Permission.create(Role.users()), // Logged-in users can create
          Permission.update(Role.users()), // Logged-in users can update
          Permission.delete(Role.users()), // Logged-in users can delete
        ]
      );
      console.log('✅ Users collection created');
    } catch (error) {
      if (error.type === 'collection_already_exists') {
        console.log('ℹ️  Users collection already exists');
      } else {
        console.error('❌ Error creating Users collection:', error);
      }
    }

    // Add attributes to Users collection
    const userAttributes = [
      { key: 'email', size: 255, required: true },
      { key: 'name', size: 255, required: true },
      { key: 'avatar', size: 1000, required: false }, // URL
      { key: 'role', size: 50, required: false, default: 'user' },
    ];

    for (const attr of userAttributes) {
      try {
        if (attr.default !== undefined) {
          await databases.createStringAttribute(
            DATABASE_ID,
            COLLECTIONS.USERS,
            attr.key,
            attr.size,
            attr.required,
            attr.default
          );
        } else {
          await databases.createStringAttribute(
            DATABASE_ID,
            COLLECTIONS.USERS,
            attr.key,
            attr.size,
            attr.required
          );
        }
        console.log(`✅ Users: ${attr.key} attribute added`);

        if (attr.key === 'email') {
          // Create unique index on email
          try {
            await databases.createIndex(
              DATABASE_ID,
              COLLECTIONS.USERS,
              'idx_user_email',
              'unique',
              ['email'],
              ['ASC']
            );
            console.log('✅ Users: email index created');
          } catch (indexError) {
            if (indexError.type !== 'index_already_exists') {
              console.error('❌ Error creating email index:', indexError);
            }
          }
        }
      } catch (attrError) {
        if (attrError.type !== 'attribute_already_exists') {
          console.error(`❌ Error creating ${attr.key} attribute:`, attrError);
        }
      }
    }

    // Create Projects Collection
    console.log('\nCreating Projects collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        COLLECTIONS.PROJECTS,
        'Projects',
        [
          Permission.read(Role.any()),    // Anyone can read projects
          Permission.create(Role.users()), // Logged-in users can create
          Permission.update(Role.users()), // Logged-in users can update
          Permission.delete(Role.users()), // Logged-in users can delete
        ]
      );
      console.log('✅ Projects collection created');
    } catch (error) {
      if (error.type === 'collection_already_exists') {
        console.log('ℹ️  Projects collection already exists');
      } else {
        console.error('❌ Error creating Projects collection:', error);
      }
    }

    // Add attributes to Projects collection
    const projectAttributes = [
      { key: 'title', size: 255, required: true },
      { key: 'author', size: 255, required: false },
      { key: 'department', size: 100, required: true },
      { key: 'level', size: 20, required: false },
      { key: 'abstract', size: 10000, required: false }, // 10k characters
      { key: 'chapterOne', size: 10000, required: false }, // 10k characters
      { key: 'chapters', size: 500, required: false }, // chapter list
      { key: 'formats', size: 200, required: false }, // format list
      { key: 'includes', size: 500, required: false }, // includes list
      { key: 'mainFileId', size: 255, required: false }, // Appwrite file ID
      { key: 'projectId', size: 255, required: false }, // project ID
    ];

    for (const attr of projectAttributes) {
      try {
        await databases.createStringAttribute(
          DATABASE_ID,
          COLLECTIONS.PROJECTS,
          attr.key,
          attr.size,
          attr.required
        );
        console.log(`✅ Projects: ${attr.key} attribute added`);
      } catch (attrError) {
        if (attrError.type !== 'attribute_already_exists') {
          console.error(`❌ Error creating ${attr.key} attribute:`, attrError);
        }
      }
    }

    // Add integer attributes to Projects collection
    const integerAttributes = [
      { key: 'year', min: 1900, max: 2100, default: new Date().getFullYear() },
      { key: 'pages', min: 0, max: 10000, default: 0 },
      { key: 'priceNGN', min: 0, max: 1000000, default: 0 },
      { key: 'downloadCount', min: 0, max: 100000, default: 0 },
    ];

    for (const attr of integerAttributes) {
      try {
        await databases.createIntegerAttribute(
          DATABASE_ID,
          COLLECTIONS.PROJECTS,
          attr.key,
          false, // not required
          attr.default,
          attr.min,
          attr.max
        );
        console.log(`✅ Projects: ${attr.key} integer attribute added`);
      } catch (attrError) {
        if (attrError.type !== 'attribute_already_exists') {
          console.error(`❌ Error creating ${attr.key} integer attribute:`, attrError);
        }
      }
    }

    // Add boolean attribute to Projects collection
    try {
      await databases.createBooleanAttribute(
        DATABASE_ID,
        COLLECTIONS.PROJECTS,
        'isActive',
        false, // not required
        true   // default value
      );
      console.log('✅ Projects: isActive boolean attribute added');
    } catch (attrError) {
      if (attrError.type !== 'attribute_already_exists') {
        console.error('❌ Error creating isActive boolean attribute:', attrError);
      }
    }

    // Create indexes for Projects collection
    const projectIndexes = [
      { name: 'idx_department', attributes: ['department'], orderTypes: ['ASC'] },
      { name: 'idx_year', attributes: ['year'], orderTypes: ['DESC'] },
      { name: 'idx_created_at', attributes: ['$createdAt'], orderTypes: ['DESC'] },
    ];

    for (const idx of projectIndexes) {
      try {
        await databases.createIndex(
          DATABASE_ID,
          COLLECTIONS.PROJECTS,
          idx.name,
          'key',
          idx.attributes,
          idx.orderTypes
        );
        console.log(`✅ Projects: ${idx.name} index created`);
      } catch (indexError) {
        if (indexError.type !== 'index_already_exists') {
          console.error(`❌ Error creating ${idx.name} index:`, indexError);
        }
      }
    }

    // Create Orders Collection
    console.log('\nCreating Orders collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        'Orders',
        [
          Permission.read(Role.users()), // Users can read their own orders
          Permission.create(Role.users()), // Logged-in users can create
          Permission.update(Role.users()), // Logged-in users can update
          Permission.delete(Role.users()), // Logged-in users can delete
        ]
      );
      console.log('✅ Orders collection created');
    } catch (error) {
      if (error.type === 'collection_already_exists') {
        console.log('ℹ️  Orders collection already exists');
      } else {
        console.error('❌ Error creating Orders collection:', error);
      }
    }

    // Add attributes to Orders collection
    const orderAttributes = [
      { key: 'userId', size: 255, required: true },
      { key: 'projectId', size: 255, required: true },
      { key: 'projectTitle', size: 255, required: true },
      { key: 'status', size: 50, required: false, default: 'pending' },
      { key: 'paymentId', size: 255, required: false },
      { key: 'transactionId', size: 255, required: false },
    ];

    for (const attr of orderAttributes) {
      try {
        if (attr.default !== undefined) {
          await databases.createStringAttribute(
            DATABASE_ID,
            COLLECTIONS.ORDERS,
            attr.key,
            attr.size,
            attr.required,
            attr.default
          );
        } else {
          await databases.createStringAttribute(
            DATABASE_ID,
            COLLECTIONS.ORDERS,
            attr.key,
            attr.size,
            attr.required
          );
        }
        console.log(`✅ Orders: ${attr.key} attribute added`);
      } catch (attrError) {
        if (attrError.type !== 'attribute_already_exists') {
          console.error(`❌ Error creating ${attr.key} attribute:`, attrError);
        }
      }
    }

    // Add integer attributes to Orders collection
    const orderIntegerAttributes = [
      { key: 'amount', min: 0, max: 1000000, default: 0 },
      { key: 'quantity', min: 1, max: 1000, default: 1 },
    ];

    for (const attr of orderIntegerAttributes) {
      try {
        await databases.createIntegerAttribute(
          DATABASE_ID,
          COLLECTIONS.ORDERS,
          attr.key,
          false, // not required
          attr.default,
          attr.min,
          attr.max
        );
        console.log(`✅ Orders: ${attr.key} integer attribute added`);
      } catch (attrError) {
        if (attrError.type !== 'attribute_already_exists') {
          console.error(`❌ Error creating ${attr.key} integer attribute:`, attrError);
        }
      }
    }

    // Create indexes for Orders collection
    const orderIndexes = [
      { name: 'idx_user_orders', attributes: ['userId'], orderTypes: ['ASC'] },
      { name: 'idx_project_orders', attributes: ['projectId'], orderTypes: ['ASC'] },
      { name: 'idx_order_status', attributes: ['status'], orderTypes: ['ASC'] },
    ];

    for (const idx of orderIndexes) {
      try {
        await databases.createIndex(
          DATABASE_ID,
          COLLECTIONS.ORDERS,
          idx.name,
          'key',
          idx.attributes,
          idx.orderTypes
        );
        console.log(`✅ Orders: ${idx.name} index created`);
      } catch (indexError) {
        if (indexError.type !== 'index_already_exists') {
          console.error(`❌ Error creating ${idx.name} index:`, indexError);
        }
      }
    }

    // Create Reviews Collection
    console.log('\nCreating Reviews collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        COLLECTIONS.REVIEWS,
        'Reviews',
        [
          Permission.read(Role.any()),    // Anyone can read reviews
          Permission.create(Role.users()), // Logged-in users can create
          Permission.update(Role.users()), // Logged-in users can update
          Permission.delete(Role.users()), // Logged-in users can delete
        ]
      );
      console.log('✅ Reviews collection created');
    } catch (error) {
      if (error.type === 'collection_already_exists') {
        console.log('ℹ️  Reviews collection already exists');
      } else {
        console.error('❌ Error creating Reviews collection:', error);
      }
    }

    // Add attributes to Reviews collection
    const reviewAttributes = [
      { key: 'userId', size: 255, required: true },
      { key: 'projectId', size: 255, required: true },
      { key: 'userName', size: 255, required: true },
      { key: 'comment', size: 1000, required: true },
    ];

    for (const attr of reviewAttributes) {
      try {
        await databases.createStringAttribute(
          DATABASE_ID,
          COLLECTIONS.REVIEWS,
          attr.key,
          attr.size,
          attr.required
        );
        console.log(`✅ Reviews: ${attr.key} attribute added`);
      } catch (attrError) {
        if (attrError.type !== 'attribute_already_exists') {
          console.error(`❌ Error creating ${attr.key} attribute:`, attrError);
        }
      }
    }

    // Add integer attribute to Reviews collection
    try {
      await databases.createIntegerAttribute(
        DATABASE_ID,
        COLLECTIONS.REVIEWS,
        'rating',
        false, // not required
        1,     // default
        1,     // min
        5      // max
      );
      console.log('✅ Reviews: rating integer attribute added');
    } catch (attrError) {
      if (attrError.type !== 'attribute_already_exists') {
        console.error('❌ Error creating rating integer attribute:', attrError);
      }
    }

    // Create indexes for Reviews collection
    const reviewIndexes = [
      { name: 'idx_project_reviews', attributes: ['projectId'], orderTypes: ['ASC'] },
      { name: 'idx_user_reviews', attributes: ['userId'], orderTypes: ['ASC'] },
    ];

    for (const idx of reviewIndexes) {
      try {
        await databases.createIndex(
          DATABASE_ID,
          COLLECTIONS.REVIEWS,
          idx.name,
          'key',
          idx.attributes,
          idx.orderTypes
        );
        console.log(`✅ Reviews: ${idx.name} index created`);
      } catch (indexError) {
        if (indexError.type !== 'index_already_exists') {
          console.error(`❌ Error creating ${idx.name} index:`, indexError);
        }
      }
    }

    console.log('\n🎉 All collections have been set up successfully!');
    console.log('\nNext steps:');
    console.log('1. Create a user account through the app or Appwrite console');
    console.log('2. Go to your Appwrite database and update the user role to "admin" if needed');
    console.log('3. The collections and attributes are now properly configured for ProjectDock');
  } catch (error) {
    console.error('❌ Error during setup:', error);
  }
}

// Run the setup
setupCollections();

export default setupCollections;