/**
 * Appwrite compatibility layer for Firebase
 * This file provides the same interface as the Firebase config but uses Appwrite
 */

import { appwrite } from '../appwrite/config';
import { authService } from '../appwrite/api';
import { projectsService, usersService, ordersService } from '../appwrite/database';

// Create compatibility functions for Auth
const auth = {
  // Sign in with email and password
  signInWithEmailAndPassword: async (email, password) => {
    try {
      const result = await authService.login(email, password);
      return {
        user: {
          uid: result.user.$id,
          email: result.user.email,
          displayName: result.user.name,
          getIdToken: () => Promise.resolve('mock-token') // In real implementation, you'd handle tokens properly
        }
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Create user with email and password
  createUserWithEmailAndPassword: async (email, password) => {
    try {
      // Since Appwrite requires a name, we'll use email as name for now
      const name = email.split('@')[0]; // Extract name from email
      const result = await authService.register(email, password, name);
      return {
        user: {
          uid: result.user.$id,
          email: result.user.email,
          displayName: result.user.name,
          getIdToken: () => Promise.resolve('mock-token')
        }
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Sign out
  signOut: async () => {
    try {
      await authService.logout();
    } catch (error) {
      throw error;
    }
  },
  
  // Send password reset email
  sendPasswordResetEmail: async (email) => {
    try {
      await authService.sendPasswordReset(email);
    } catch (error) {
      throw error;
    }
  },
  
  // On auth state change - simplified implementation
  onAuthStateChanged: (callback) => {
    // In a real implementation, you would set up a proper listener
    // For now, we'll just get the current user
    authService.getCurrentUser()
      .then(user => {
        if (user) {
          callback({
            uid: user.$id,
            email: user.email,
            displayName: user.name,
            getIdToken: () => Promise.resolve('mock-token')
          });
        } else {
          callback(null);
        }
      })
      .catch(() => callback(null));
      
    // Return a cleanup function
    return () => {};
  },
  
  // Current user (simplified)
  currentUser: null // This would be updated with actual current user if needed
};

// Create compatibility functions for Firestore
const db = {
  // Collection function - returns collection identifier
  collection: (dbInstance, collectionName) => {
    return { collectionName };
  },
  
  // Add document to collection
  addDoc: async (collectionRef, data) => {
    const collectionName = collectionRef.collectionName;
    
    switch(collectionName) {
      case 'projects':
        return await projectsService.createProject(data);
      case 'users':
        // For users, we'd typically use auth service, but sometimes projects create user docs
        return await usersService.createUser(data);
      case 'orders':
        return await ordersService.createOrder(data);
      default:
        throw new Error(`Unsupported collection: ${collectionName}`);
    }
  },
  
  // Get document by reference
  getDoc: async (docRef) => {
    // Extract collection and document ID from the reference
    // This is a simplified version - in practice you'd need more robust parsing
    const pathParts = docRef.path ? docRef.path.split('/') : [];
    if (pathParts.length >= 2) {
      const collectionName = pathParts[0];
      const documentId = pathParts[1];
      
      switch(collectionName) {
        case 'projects':
          return await projectsService.getProjectById(documentId);
        case 'users':
          return await usersService.getUserById(documentId);
        case 'orders':
          return await ordersService.getOrderById(documentId);
        default:
          throw new Error(`Unsupported collection: ${collectionName}`);
      }
    }
    
    throw new Error('Invalid document reference');
  },
  
  // Get documents from collection
  getDocs: async (queryRef) => {
    // This is a simplified version - in practice you'd need to implement query parsing
    let collectionName;
    if (queryRef.collectionRef) {
      collectionName = queryRef.collectionRef.collectionName;
    } else if (queryRef.collectionName) {
      collectionName = queryRef.collectionName;
    } else {
      throw new Error('Collection name not found in query reference');
    }
    
    switch(collectionName) {
      case 'projects':
        return await projectsService.getAllProjects();
      case 'users':
        return await usersService.getAllUsers();
      case 'orders':
        return await ordersService.getAllOrders();
      default:
        throw new Error(`Unsupported collection: ${collectionName}`);
    }
  },
  
  // Update document
  updateDoc: async (docRef, data) => {
    // Extract collection and document ID from the reference
    const pathParts = docRef.path ? docRef.path.split('/') : [];
    if (pathParts.length >= 2) {
      const collectionName = pathParts[0];
      const documentId = pathParts[1];
      
      switch(collectionName) {
        case 'projects':
          return await projectsService.updateProject(documentId, data);
        case 'users':
          return await usersService.updateUser(documentId, data);
        case 'orders':
          return await ordersService.updateOrder(documentId, data);
        default:
          throw new Error(`Unsupported collection: ${collectionName}`);
      }
    }
    
    throw new Error('Invalid document reference');
  },
  
  // Delete document
  deleteDoc: async (docRef) => {
    // Extract collection and document ID from the reference
    const pathParts = docRef.path ? docRef.path.split('/') : [];
    if (pathParts.length >= 2) {
      const collectionName = pathParts[0];
      const documentId = pathParts[1];
      
      switch(collectionName) {
        case 'projects':
          return await projectsService.deleteProject(documentId);
        case 'users':
          return await usersService.deleteUser(documentId);
        case 'orders':
          return await ordersService.deleteOrder(documentId);
        default:
          throw new Error(`Unsupported collection: ${collectionName}`);
      }
    }
    
    throw new Error('Invalid document reference');
  },
  
  // Query builder - simplified version
  query: (collectionRef, ...queryConstraints) => {
    return {
      collectionRef,
      constraints: queryConstraints
    };
  },
  
  // Where clause - simplified version
  where: (field, operator, value) => {
    return { type: 'where', field, operator, value };
  },
  
  // Order by clause
  orderBy: (field, direction = 'desc') => {
    return { type: 'orderBy', field, direction };
  },
  
  // Limit results
  limit: (count) => {
    return { type: 'limit', count };
  },
  
  // Server timestamp
  serverTimestamp: () => {
    return new Date().toISOString();
  },
  
  // Document reference
  doc: (dbInstance, collectionName, documentId) => {
    return { path: `${collectionName}/${documentId}` };
  }
};

// Create compatibility functions for Storage
const storage = {
  ref: (storageInstance, path) => {
    return { path };
  },
  
  uploadBytes: async (storageRef, file) => {
    // Extract project info from path (simplified)
    const pathParts = storageRef.path.split('/');
    if (pathParts.length >= 2) {
      const projectId = pathParts[1]; // projects/{projectId}/{filename}
      const fileType = file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx';
      
      const result = await import('../appwrite/storage').then(module => 
        module.uploadProjectFile(file, projectId, fileType)
      );
      
      return {
        ref: {
          fullPath: storageRef.path,
          name: file.name
        },
        taskId: result.fileId
      };
    }
    
    throw new Error('Invalid storage path reference');
  },
  
  getDownloadURL: async (storageRef) => {
    // For this simplified version, we need document ID from path
    // In a real implementation you'd need to store and retrieve file IDs
    throw new Error('getDownloadURL requires actual file ID - implement based on your use case');
  },
  
  deleteObject: async (storageRef) => {
    // Implementation would require mapping to actual file IDs
    // This is a placeholder that would need real implementation
    throw new Error('deleteObject requires actual file ID - implement based on your use case');
  }
};

export { auth, db, storage };

export default {
  auth,
  db,
  storage
};