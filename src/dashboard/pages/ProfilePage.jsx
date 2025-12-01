
import React, { useState, useEffect } from 'react';
import { FiLoader, FiCheck } from 'react-icons/fi';
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
        try {
          const fullUser = await getUserById(currentUser.$id);
          if (fullUser) {
            setUser({ uid: currentUser.$id, email: currentUser.email, ...fullUser });
            setName(fullUser.name || currentUser.name || '');
          } else {
            setUser({
              uid: currentUser.$id,
              name: currentUser.name || currentUser.email?.split('@')[0],
              email: currentUser.email,
            });
            setName(currentUser.name || currentUser.email?.split('@')[0] || '');
          }
        } catch (dbError) {
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
      const userData = await getUserById(user.uid);

      if (userData) {
        await updateUser(user.uid, {
          name
        });
      } else {
        await createUser({
          $id: user.uid,
          email: user.email,
          name,
          role: 'user'
        });
      }

      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);

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
    return <div className="flex justify-center items-center h-64"><FiLoader className="animate-spin text-2xl text-gray-400" /></div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none transition-colors bg-transparent placeholder-gray-400"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full p-2 border-b border-gray-200 text-gray-500 bg-transparent cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email address cannot be changed</p>
          </div>

          {successMessage && (
            <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-md">
              <FiCheck />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {errorMessage}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-md hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? <FiLoader className="animate-spin" /> : null}
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
