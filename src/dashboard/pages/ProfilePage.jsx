
import React, { useState, useEffect } from 'react';
import { FaSpinner, FaSave } from 'react-icons/fa';
import { db, auth } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({ uid: currentUser.uid, ...userData });
          setName(userData.name);
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { name });
      setSuccessMessage('Your profile has been updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center py-20"><FaSpinner className="animate-spin text-4xl text-indigo-600" /></div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Profile Settings</h1>
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg">
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border rounded-lg" />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
            <input type="email" value={user?.email || ''} disabled className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed" />
          </div>
          {successMessage && <p className="text-green-600 font-semibold">{successMessage}</p>}
          <button type="submit" disabled={isSaving} className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400">
            {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};
