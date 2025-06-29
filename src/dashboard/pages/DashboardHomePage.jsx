
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaUserCircle, FaTachometerAlt, FaSpinner } from 'react-icons/fa';
import { auth, db } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const UserDashboardHomePage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser({ uid: currentUser.uid, ...userDoc.data() });
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const QuickLinkCard = ({ to, icon, title, description }) => (
    <Link to={to} className="group block bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center py-20"><FaSpinner className="animate-spin text-4xl text-indigo-600" /></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Welcome back, <span className="text-indigo-600">{user?.name || 'User'}!</span>
        </h1>
        <p className="mt-2 text-lg text-gray-600">Here's a quick overview of your account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickLinkCard
          to="/dashboard/my-projects"
          icon={<FaBook className="text-2xl" />}
          title="My Purchased Projects"
          description={`View and access all ${user?.purchasedProjects?.length || 0} of your projects.`}
        />
        <QuickLinkCard
          to="/dashboard/profile"
          icon={<FaUserCircle className="text-2xl" />}
          title="Profile Settings"
          description="Update your name and account details."
        />
      </div>

      <div className="mt-10 bg-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800">Looking for something new?</h2>
        <p className="mt-2 text-gray-600">Expand your knowledge and get inspired by browsing our full library.</p>
        <Link to="/projects" className="mt-4 inline-block bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-indigo-700 transition">
          Browse All Projects
        </Link>
      </div>
    </div>
  );
};

// Also exporting the other placeholder pages from the same file for convenience
// In a larger app, you would have these in their own files.

// File: src/dashboard/pages/MyProjectsPage.js
export const MyProjectsPage = () => (
  <div>
    <h1 className="text-4xl font-extrabold text-gray-900 mb-6">My Purchased Projects</h1>
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <p>A list of all projects you have purchased will appear here soon.</p>
    </div>
  </div>
);

// File: src/dashboard/pages/ProfilePage.js
export const ProfilePage = () => (
  <div>
    <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Profile Settings</h1>
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <p>You will be able to update your name and password here.</p>
    </div>
  </div>
);
