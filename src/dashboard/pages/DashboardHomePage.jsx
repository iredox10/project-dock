
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaUserCircle, FaTachometerAlt, FaSpinner } from 'react-icons/fa';
import { authService } from '../../appwrite/auth';
import { usersService } from '../../appwrite/database';

export const UserDashboardHomePage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          // Try to get full user details from the database
          try {
            const fullUser = await usersService.getUserById(currentUser.$id);
            setUser({ uid: currentUser.$id, ...fullUser });
          } catch (dbError) {
            // If user doesn't exist in the database, use the basic auth data
            setUser({
              uid: currentUser.$id,
              name: currentUser.name || currentUser.email?.split('@')[0],
              email: currentUser.email,
              purchasedProjects: []
            });
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const QuickLinkCard = ({ to, icon, title, description }) => (
    <Link to={to} className="group block bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="bg-indigo-100 p-2 md:p-3 rounded-lg text-indigo-600 flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-base md:text-lg font-bold text-gray-800 group-hover:text-indigo-600">{title}</h3>
          <p className="text-xs md:text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center py-20"><FaSpinner className="animate-spin text-4xl text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">
          Welcome back, <span className="text-indigo-600">{user?.name || 'User'}!</span>
        </h1>
        <p className="mt-2 text-sm md:text-lg text-gray-600">Here's a quick overview of your account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <QuickLinkCard
          to="/dashboard/my-library"
          icon={<FaBook className="text-xl md:text-2xl" />}
          title="My Library"
          description={`Access all ${user?.purchasedProjects?.length || 0} purchased and favorite projects.`}
        />
        <QuickLinkCard
          to="/dashboard/my-projects"
          icon={<FaBook className="text-xl md:text-2xl" />}
          title="My Purchased Projects"
          description={`View and download all ${user?.purchasedProjects?.length || 0} of your projects.`}
        />
        <QuickLinkCard
          to="/dashboard/profile"
          icon={<FaUserCircle className="text-xl md:text-2xl" />}
          title="Profile Settings"
          description="Update your name and account details."
        />
        <QuickLinkCard
          to="/projects"
          icon={<FaTachometerAlt className="text-xl md:text-2xl" />}
          title="Browse Projects"
          description="Discover new projects to download."
        />
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Looking for something new?</h2>
        <p className="mt-2 text-sm md:text-base text-gray-600">Expand your knowledge and get inspired by browsing our full library.</p>
        <Link to="/projects" className="mt-4 inline-block bg-indigo-600 text-white font-bold px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-indigo-700 transition text-sm md:text-base">
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
  <div className="space-y-6">
    <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">My Purchased Projects</h1>
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg">
      <p className="text-sm md:text-base">A list of all projects you have purchased will appear here soon.</p>
    </div>
  </div>
);

// File: src/dashboard/pages/ProfilePage.js
export const ProfilePage = () => (
  <div className="space-y-6">
    <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">Profile Settings</h1>
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg">
      <p className="text-sm md:text-base">You will be able to update your name and password here.</p>
    </div>
  </div>
);
