
import React, { useState, useEffect } from 'react';
import { FaSpinner, FaSave } from 'react-icons/fa';
import { authService } from '../../appwrite/auth';
import { getUserById, updateUser, createUser } from '../../api/projectServices';

export const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        // Try to get full user details from the database
        try {
          const fullUser = await getUserById(currentUser.$id);
          if (fullUser) {
            setUser({ uid: currentUser.$id, email: currentUser.email, ...fullUser });
            setName(fullUser.name || currentUser.name || '');
          } else {
            // User document doesn't exist, use auth data
            setUser({
              uid: currentUser.$id,
              name: currentUser.name || currentUser.email?.split('@')[0],
              email: currentUser.email,
            });
            setName(currentUser.name || currentUser.email?.split('@')[0] || '');
          }
        } catch (dbError) {
          // User doesn't exist in database, use auth data
          setUser({
            uid: currentUser.$id,
            name: currentUser.name || currentUser.email?.split('@')[0],
            email: currentUser.email,
          });
          setName(currentUser.name || currentUser.email?.split('@')[0] || '');
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // Check if user document exists
      const userData = await getUserById(user.uid);
      
      if (userData) {
        // Update existing user document
        await updateUser(user.uid, {
          ...userData,
          name
        });
      } else {
        // Create new user document
        await createUser({
          $id: user.uid,
          email: user.email,
          name,
          role: 'user'
        });
      }
      
      setSuccessMessage('Your profile has been updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh user data
      await checkAuthStatus();
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage('Failed to update profile. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center py-20"><FaSpinner className="animate-spin text-4xl text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-sm md:text-base text-gray-600">Update your account information</p>
      </div>
      <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg max-w-2xl">
        <form onSubmit={handleUpdateProfile} className="space-y-4 md:space-y-6">
          <div>
            <label className="block font-semibold text-gray-700 mb-1 text-sm md:text-base">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full p-2 md:p-3 border rounded-lg text-sm md:text-base" 
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1 text-sm md:text-base">Email Address</label>
            <input 
              type="email" 
              value={user?.email || ''} 
              disabled 
              className="w-full p-2 md:p-3 border rounded-lg bg-gray-100 cursor-not-allowed text-sm md:text-base" 
            />
          </div>
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4">
              <p className="text-green-600 font-semibold text-sm md:text-base">{successMessage}</p>
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4">
              <p className="text-red-600 font-semibold text-sm md:text-base">{errorMessage}</p>
            </div>
          )}
          <button 
            type="submit" 
            disabled={isSaving} 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 text-sm md:text-base"
          >
            {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};
