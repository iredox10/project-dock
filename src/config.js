/**
 * Appwrite compatibility layer for Firebase
 * This file provides the same interface as the Firebase config but uses Appwrite
 */

import { appwrite } from './appwrite/config';
import authService from './appwrite/auth';
import { projectsService, usersService, ordersService } from './appwrite/database';

// Export auth, db, and storage with the same interface as Firebase
export const { auth, db, storage } = appwrite;

// Additional exports to match Firebase interface
export const { 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  doc
} = createFirebaseCompatibilityLayer();

function createFirebaseCompatibilityLayer() {
  // Map Firestore operations to Appwrite operations
  return {
    collection: (database, collectionName) => {
      // Return an object that represents a collection reference
      return { $id: collectionName };
    },
    
    addDoc: async (collectionRef, data) => {
      // Map to Appwrite createDocument
      const { databases, DATABASE_ID } = await import('./appwrite/config');
      
      // Map collection names to Appwrite collections
      let collectionId;
      switch(collectionRef.$id) {
        case 'projects':
          collectionId = 'projects';
          break;
        case 'users':
          collectionId = 'users';
          break;
        case 'orders':
          collectionId = 'orders';
          break;
        case 'reviews':
          collectionId = 'reviews';
          break;
        default:
          collectionId = collectionRef.$id;
      }
      
      const document = await databases.createDocument(
        DATABASE_ID,
        collectionId,
        'unique()',
        data
      );
      
      return { id: document.$id, ...document };
    },
    
    getDoc: async (docRef) => {
      // Map to Appwrite getDocument
      const { databases, DATABASE_ID } = await import('./appwrite/config');
      
      // Extract collection and document ID from the reference
      const parts = docRef.path ? docRef.path.split('/') : [];
      if (parts.length >= 2) {
        const collectionId = parts[0];
        const documentId = parts[1];
        
        const document = await databases.getDocument(
          DATABASE_ID,
          collectionId,
          documentId
        );
        
        return { id: document.$id, data: () => document, ...document };
      }
      
      throw new Error('Invalid document reference');
    },
    
    getDocs: async (queryObj) => {
      // Map to Appwrite listDocuments
      const { databases, DATABASE_ID, COLLECTIONS } = await import('./appwrite/config');
      const { Query } = await import('appwrite');
      
      // For now, simplifying this - in a real implementation you'd need to map query conditions
      const collectionId = queryObj.collectionRef?.$id || queryObj.path;
      
      if (!collectionId) {
        throw new Error('Collection reference is required');
      }
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        collectionId
      );
      
      return {
        docs: response.documents.map(doc => ({
          id: doc.$id,
          data: () => doc,
          ...doc
        })),
        // Simulate forEach for compatibility
        forEach: (callback) => {
          response.documents.forEach((doc, index) => {
            callback({
              id: doc.$id,
              data: () => doc,
              ...doc
            }, index);
          });
        }
      };
    },
    
    updateDoc: async (docRef, data) => {
      const { databases, DATABASE_ID } = await import('./appwrite/config');
      
      // Extract document ID from reference
      const docId = docRef.id || (docRef.path ? docRef.path.split('/')[1] : null);
      const collectionId = docRef.path ? docRef.path.split('/')[0] : null;
      
      if (!docId || !collectionId) {
        throw new Error('Invalid document reference');
      }
      
      const document = await databases.updateDocument(
        DATABASE_ID,
        collectionId,
        docId,
        data
      );
      
      return { id: document.$id, ...document };
    },
    
    deleteDoc: async (docRef) => {
      const { databases, DATABASE_ID } = await import('./appwrite/config');
      
      // Extract document ID from reference
      const docId = docRef.id || (docRef.path ? docRef.path.split('/')[1] : null);
      const collectionId = docRef.path ? docRef.path.split('/')[0] : null;
      
      if (!docId || !collectionId) {
        throw new Error('Invalid document reference');
      }
      
      const result = await databases.deleteDocument(
        DATABASE_ID,
        collectionId,
        docId
      );
      
      return result;
    },
    
    query: (collectionRef, ...queryConstraints) => {
      // Return a query object that includes the collection reference and constraints
      return { collectionRef, constraints: queryConstraints };
    },
    
    where: (field, operator, value) => {
      // Return a constraint object
      return { type: 'where', field, operator, value };
    },
    
    orderBy: (field, direction) => {
      // Return an order constraint
      return { type: 'orderBy', field, direction: direction || 'asc' };
    },
    
    limit: (count) => {
      // Return a limit constraint
      return { type: 'limit', count };
    },
    
    serverTimestamp: () => {
      // Return current timestamp (Appwrite will handle this automatically)
      return new Date().toISOString();
    },
    
    doc: (database, collectionName, documentId) => {
      // Return a document reference
      return { path: `${collectionName}/${documentId}`, id: documentId };
    }
  };
}