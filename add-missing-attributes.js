/**
 * Script to add missing attributes to existing Appwrite collections
 */

import { Client, Databases } from 'node-appwrite';
import 'dotenv/config';

// Appwrite configuration - using server API key
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setKey(process.env.APPWRITE_SERVER_API_KEY); // Server API key with write permissions

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'projectdock_db';

async function addMissingAttributes() {
  console.log('Adding missing attributes to collections...');

  try {
    // ========== USERS COLLECTION ==========
    console.log('\n📋 Adding attributes to Users collection...');
    
    // Add purchasedProjects array attribute
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        'users',
        'purchasedProjects',
        1000, // Array stored as JSON string, max 1000 chars
        false, // optional
        '[]'   // default empty array
      );
      console.log('✅ Added "purchasedProjects" attribute to users collection');
    } catch (error) {
      if (error.type === 'attribute_already_exists') {
        console.log('ℹ️  "purchasedProjects" attribute already exists in users collection');
      } else {
        console.error('❌ Error adding "purchasedProjects" attribute:', error.message);
      }
    }

    // Add favoriteProjects array attribute
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        'users',
        'favoriteProjects',
        1000, // Array stored as JSON string, max 1000 chars
        false, // optional
        '[]'   // default empty array
      );
      console.log('✅ Added "favoriteProjects" attribute to users collection');
    } catch (error) {
      if (error.type === 'attribute_already_exists') {
        console.log('ℹ️  "favoriteProjects" attribute already exists in users collection');
      } else {
        console.error('❌ Error adding "favoriteProjects" attribute:', error.message);
      }
    }

    // Add joinYear attribute
    try {
      await databases.createIntegerAttribute(
        DATABASE_ID,
        'users',
        'joinYear',
        false, // not required
        new Date().getFullYear(), // default to current year
        1900,
        2100
      );
      console.log('✅ Added "joinYear" integer attribute to users collection');
    } catch (error) {
      if (error.type === 'attribute_already_exists') {
        console.log('ℹ️  "joinYear" attribute already exists in users collection');
      } else {
        console.error('❌ Error adding "joinYear" attribute:', error.message);
      }
    }

    // ========== PROJECTS COLLECTION ==========
    console.log('\n📋 Adding attributes to Projects collection...');
    
    // Add the abstract attribute (text field for project abstract/description)
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        'projects',
        'abstract',
        10000, // 10k characters
        false  // optional
      );
      console.log('✅ Added "abstract" string attribute to projects collection');
    } catch (error) {
      if (error.type === 'attribute_already_exists') {
        console.log('ℹ️  "abstract" attribute already exists in projects collection');
      } else {
        console.error('❌ Error adding "abstract" attribute:', error.message);
      }
    }

    // Add other potentially missing attributes that AI extraction might need
    const additionalAttributes = [
      { key: 'chapterOne', size: 10000, required: false },
      { key: 'chapters', size: 500, required: false },
      { key: 'formats', size: 200, required: false },
      { key: 'includes', size: 500, required: false },
      { key: 'mainFileId', size: 255, required: false },
      { key: 'projectId', size: 255, required: false },
    ];

    for (const attr of additionalAttributes) {
      try {
        await databases.createStringAttribute(
          DATABASE_ID,
          'projects',
          attr.key,
          attr.size,
          attr.required
        );
        console.log(`✅ Added "${attr.key}" string attribute to projects collection`);
      } catch (error) {
        if (error.type === 'attribute_already_exists') {
          console.log(`ℹ️  "${attr.key}" attribute already exists in projects collection`);
        } else {
          console.error(`❌ Error adding "${attr.key}" attribute:`, error.message);
        }
      }
    }

    // Add integer attributes that might be missing
    const integerAttributes = [
      { key: 'year', min: 1900, max: 2100, default: 2025 },
      { key: 'pages', min: 0, max: 10000, default: 0 },
      { key: 'priceNGN', min: 0, max: 1000000, default: 0 },
      { key: 'downloadCount', min: 0, max: 100000, default: 0 },
    ];

    for (const attr of integerAttributes) {
      try {
        await databases.createIntegerAttribute(
          DATABASE_ID,
          'projects',
          attr.key,
          false, // not required
          attr.default,
          attr.min,
          attr.max
        );
        console.log(`✅ Added "${attr.key}" integer attribute to projects collection`);
      } catch (error) {
        if (error.type === 'attribute_already_exists') {
          console.log(`ℹ️  "${attr.key}" integer attribute already exists in projects collection`);
        } else {
          console.error(`❌ Error adding "${attr.key}" integer attribute:`, error.message);
        }
      }
    }

    // Add boolean attribute
    try {
      await databases.createBooleanAttribute(
        DATABASE_ID,
        'projects',
        'isActive',
        false, // not required
        true   // default value
      );
      console.log('✅ Added "isActive" boolean attribute to projects collection');
    } catch (error) {
      if (error.type === 'attribute_already_exists') {
        console.log('ℹ️  "isActive" boolean attribute already exists in projects collection');
      } else {
        console.error('❌ Error adding "isActive" boolean attribute:', error.message);
      }
    }

    console.log('\n🎉 All missing attributes have been added!');
    console.log('\n✅ Users collection: purchasedProjects, favoriteProjects, joinYear');
    console.log('✅ Projects collection: All attributes updated');
    console.log('\nYou can now:');
    console.log('  - Add projects to favorites');
    console.log('  - Purchase projects');
    console.log('  - View purchased projects in dashboard');
  } catch (error) {
    console.error('❌ Error during attribute setup:', error);
  }
}

addMissingAttributes();