import { account } from './config';
import { ID } from 'appwrite';

/**
 * Authentication service using Appwrite
 */

// Current user state
let currentUser = null;

// Set up authentication state listener
const setupAuthListener = () => {
  // Check if user is already logged in on app start
  checkCurrentSession();
};

// Check if there's an active session
const checkCurrentSession = async () => {
  try {
    const user = await account.get();
    currentUser = user;
    return user;
  } catch (error) {
    // No active session
    currentUser = null;
    return null;
  }
};

// Register a new user
const register = async (email, password, name, referralCode = null) => {
  try {
    // Create account
    const userAccount = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    // Create session automatically after registration
    const session = await account.createEmailPasswordSession(email, password);

    // Get full user data
    const userData = await account.get();
    currentUser = userData;

    // Also add user to users collection for extended profile data
    try {
      const { databases, DATABASE_ID, COLLECTIONS } = await import('./config');
      const { Query } = await import('appwrite');

      // Generate a unique referral code
      // Format: First 3 letters of name (or random) + 3 random digits
      const baseCode = (name.replace(/[^a-zA-Z]/g, '').substring(0, 3) || 'USR').toUpperCase();
      const randomDigits = Math.floor(100 + Math.random() * 900);
      const newReferralCode = `${baseCode}${randomDigits}`;

      // Resolve referrer if code provided
      let referredBy = null;
      if (referralCode) {
        try {
          const referrers = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [Query.equal('referralCode', referralCode)]
          );
          if (referrers.documents.length > 0) {
            referredBy = referrers.documents[0].$id;
          }
        } catch (refError) {
          console.error('Error resolving referral code:', refError);
        }
      }

      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        userAccount.$id,
        {
          email,
          name,
          role: 'user', // Default role is 'user'
          joinYear: new Date().getFullYear(),
          purchasedProjects: [],
          favoriteProjects: [],
          referralCode: newReferralCode,
          walletBalance: 0.0,
          referredBy: referredBy
        }
      );
    } catch (dbError) {
      console.error('Error adding user to database:', dbError);
      // Don't throw this error as the account creation was successful
    }

    return {
      success: true,
      user: userData,
      session
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.message);
  }
};

// Login with email and password
const login = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    currentUser = user;
    
    // Ensure user document exists in database (for users who registered before the update)
    try {
      const { databases, DATABASE_ID, COLLECTIONS } = await import('./config');
      const { Query } = await import('appwrite');
      
      // Check if user document exists
      try {
        await databases.getDocument(DATABASE_ID, COLLECTIONS.USERS, user.$id);
      } catch (docError) {
        // Document doesn't exist, create it
        if (docError.code === 404) {
          await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            user.$id,
            {
              email: user.email,
              name: user.name || user.email?.split('@')[0],
              role: 'user',
              joinYear: new Date().getFullYear(),
              purchasedProjects: [],
              favoriteProjects: []
            }
          );
        }
      }
    } catch (dbError) {
      console.error('Error checking/creating user document:', dbError);
      // Don't throw as login was successful
    }
    
    return {
      success: true,
      user,
      session
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.message);
  }
};

// Login with OAuth (Google, GitHub, etc.)
const loginWithOAuth = async (provider) => {
  try {
    // OAuth login will redirect to provider and back
    await account.createOAuth2Session(
      provider,
      `${window.location.origin}/auth-success`, // success redirect
      `${window.location.origin}/auth-failure`  // failure redirect
    );
  } catch (error) {
    console.error(`OAuth login error with ${provider}:`, error);
    throw new Error(error.message);
  }
};

// Logout current user
const logout = async () => {
  try {
    await account.deleteSession('current');
    currentUser = null;
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error(error.message);
  }
};

// Get current user
const getCurrentUser = async () => {
  try {
    const user = await account.get();
    currentUser = user; // Update cached user
    return user;
  } catch (error) {
    currentUser = null; // Clear cached user if not authenticated
    return null;
  }
};

// Update user profile
const updateProfile = async (name, email) => {
  try {
    let user;
    
    if (name) {
      user = await account.updateName(name);
    }
    
    if (email) {
      // Update email requires password
      // For now, we'll just update the name if email is different
      user = await account.get();
    }
    
    // Update in users collection as well
    try {
      const { databases, DATABASE_ID, COLLECTIONS } = await import('./config');
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        user.$id,
        {
          name: name || user.name,
          email: email || user.email
        }
      );
    } catch (dbError) {
      console.error('Error updating user in database:', dbError);
    }
    
    currentUser = user;
    return user;
  } catch (error) {
    console.error('Update profile error:', error);
    throw new Error(error.message);
  }
};

// Update user password
const updatePassword = async (currentPassword, newPassword) => {
  try {
    // Note: Appwrite requires the current password to update to a new one
    const user = await account.updatePassword(newPassword, currentPassword);
    return user;
  } catch (error) {
  console.error('Update password error:', error);
    throw new Error(error.message);
  }
};

// Send password reset email
const sendPasswordReset = async (email) => {
  try {
    // This will send a reset email to the user
    await account.createRecovery(
      email,
      `${window.location.origin}/reset-password` // reset URL
    );
    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    throw new Error(error.message);
  }
};

// Complete password reset
const resetPassword = async (userId, secret, password, confirmPassword) => {
  try {
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    const response = await account.updateRecovery(
      userId,
      secret,
      password,
      confirmPassword
    );
    
    return { success: true, response };
  } catch (error) {
    console.error('Password reset completion error:', error);
    throw new Error(error.message);
  }
};

// Delete user account
const deleteAccount = async (password) => {
  try {
    const result = await account.delete(password);
    currentUser = null;
    return { success: true, result };
  } catch (error) {
    console.error('Delete account error:', error);
    throw new Error(error.message);
  }
};

// Resend verification email
const resendVerification = async () => {
  try {
    await account.createVerification(
      `${window.location.origin}/verify-email` // verify URL
    );
    return { success: true };
  } catch (error) {
    console.error('Resend verification error:', error);
    throw new Error(error.message);
  }
};

// Get authentication state
const getAuthState = () => {
  return {
    isAuthenticated: !!currentUser,
    user: currentUser
  };
};

// Export all auth functions
export const authService = {
  register,
  login,
  loginWithOAuth,
  logout,
  getCurrentUser,
  updateProfile,
  updatePassword,
  sendPasswordReset,
  resetPassword,
  deleteAccount,
  resendVerification,
  getAuthState,
  setupAuthListener,
  checkCurrentSession
};

export default authService;