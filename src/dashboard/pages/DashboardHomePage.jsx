
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaUserCircle, FaTachometerAlt, FaSpinner, FaHeart, FaDownload, FaShoppingCart, FaChartLine } from 'react-icons/fa';
import { authService } from '../../appwrite/auth';
import { getUserById, getAllOrders } from '../../api/projectServices';

export const UserDashboardHomePage = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    purchasedProjects: 0,
    totalOrders: 0,
    favoriteProjects: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Refresh data when the component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuthStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        // Try to get full user details from the database
        try {
          const fullUser = await getUserById(currentUser.$id);
          if (fullUser) {
            setUser({ uid: currentUser.$id, ...fullUser });
          } else {
            // User document doesn't exist, use auth data
            setUser({
              uid: currentUser.$id,
              name: currentUser.name || currentUser.email?.split('@')[0],
              email: currentUser.email,
            });
          }
        } catch (dbError) {
          // If user doesn't exist in the database, use the basic auth data
          setUser({
            uid: currentUser.$id,
            name: currentUser.name || currentUser.email?.split('@')[0],
            email: currentUser.email,
          });
        }

        // Fetch user stats from orders
        try {
          const ordersResponse = await getAllOrders({
            userId: currentUser.$id,
            status: 'completed'
          });
          
          const userOrders = ordersResponse.documents || [];
          const uniqueProjects = [...new Set(userOrders.map(order => order.projectId))];
          
          setStats({
            purchasedProjects: uniqueProjects.length,
            totalOrders: userOrders.length,
            favoriteProjects: 0 // Can be implemented later
          });
        } catch (statsError) {
          console.error('Error fetching stats:', statsError);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const QuickLinkCard = ({ to, icon, title, description, iconBg }) => (
    <Link to={to} className="group block bg-white border-2 border-slate-200 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className={`${iconBg || 'bg-indigo-100'} p-3 rounded-xl text-indigo-600 flex-shrink-0 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{title}</h3>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <FaSpinner className="animate-spin text-5xl text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
          Welcome back, <span className="text-indigo-600">{user?.name || 'User'}!</span>
        </h1>
        <p className="text-lg text-slate-600">Here's an overview of your academic library.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">Purchased Projects</p>
              <p className="text-4xl font-bold text-indigo-600">{stats.purchasedProjects}</p>
            </div>
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <FaBook className="text-3xl text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">Total Orders</p>
              <p className="text-4xl font-bold text-slate-700">{stats.totalOrders}</p>
            </div>
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
              <FaShoppingCart className="text-3xl text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-pink-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">Favorites</p>
              <p className="text-4xl font-bold text-pink-600">{stats.favoriteProjects}</p>
            </div>
            <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center">
              <FaHeart className="text-3xl text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickLinkCard
            to="/dashboard/my-library"
            icon={<FaBook className="text-2xl" />}
            title="My Library"
            description={`Browse your ${stats.purchasedProjects} purchased projects and favorites`}
          />
          <QuickLinkCard
            to="/dashboard/my-projects"
            icon={<FaDownload className="text-2xl" />}
            title="My Purchases"
            description="Download and access all your purchased projects"
          />
          <QuickLinkCard
            to="/dashboard/profile"
            icon={<FaUserCircle className="text-2xl" />}
            title="Profile Settings"
            description="Update your account information and preferences"
          />
          <QuickLinkCard
            to="/projects"
            icon={<FaTachometerAlt className="text-2xl" />}
            title="Browse Projects"
            description="Discover new academic projects and research"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg text-center">
        <FaChartLine className="text-5xl text-indigo-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Expand Your Knowledge</h2>
        <p className="text-slate-600 mb-6">Explore our extensive library of academic research projects</p>
        <Link to="/projects" className="inline-block bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 hover:shadow-xl transition-all">
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
