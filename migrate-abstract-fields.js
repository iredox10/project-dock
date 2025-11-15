// Migration script to move data from abstractFileId/chapterOneFileId to abstract/chapterOne
import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.VITE_APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.VITE_APPWRITE_PROJECTS_COLLECTION_ID;

async function migrateProjects() {
    console.log('🔄 Starting migration of abstract and chapter one fields...\n');
    
    try {
        // Fetch all projects
        let allProjects = [];
        let offset = 0;
        const limit = 100;
        
        while (true) {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    Query.limit(limit),
                    Query.offset(offset)
                ]
            );
            
            allProjects = allProjects.concat(response.documents);
            
            if (response.documents.length < limit) {
                break;
            }
            offset += limit;
        }
        
        console.log(`📊 Found ${allProjects.length} projects to check\n`);
        
        let migratedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        
        for (const project of allProjects) {
            try {
                const needsMigration = 
                    (!project.abstract && project.abstractFileId) ||
                    (!project.chapterOne && project.chapterOneFileId);
                
                if (needsMigration) {
                    const updateData = {};
                    
                    // Migrate abstract if needed
                    if (!project.abstract && project.abstractFileId) {
                        updateData.abstract = project.abstractFileId;
                        console.log(`  📝 Migrating abstract for: ${project.title}`);
                    }
                    
                    // Migrate chapterOne if needed
                    if (!project.chapterOne && project.chapterOneFileId) {
                        updateData.chapterOne = project.chapterOneFileId;
                        console.log(`  📖 Migrating chapter one for: ${project.title}`);
                    }
                    
                    // Update the document
                    await databases.updateDocument(
                        DATABASE_ID,
                        COLLECTION_ID,
                        project.$id,
                        updateData
                    );
                    
                    migratedCount++;
                    console.log(`  ✅ Migrated: ${project.title}\n`);
                } else {
                    skippedCount++;
                }
            } catch (error) {
                errorCount++;
                console.error(`  ❌ Error migrating ${project.title}:`, error.message);
            }
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('📊 Migration Summary:');
        console.log('='.repeat(50));
        console.log(`✅ Migrated: ${migratedCount} projects`);
        console.log(`⏭️  Skipped: ${skippedCount} projects (already correct)`);
        console.log(`❌ Errors: ${errorCount} projects`);
        console.log('='.repeat(50) + '\n');
        
        if (migratedCount > 0) {
            console.log('🎉 Migration completed successfully!');
            console.log('💡 You can now delete the old fields (abstractFileId, chapterOneFileId) from Appwrite console if desired.\n');
        } else {
            console.log('ℹ️  No projects needed migration.\n');
        }
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrateProjects();
