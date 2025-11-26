
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiLoader, FiShoppingBag, FiHeart, FiGrid, FiArrowRight } from 'react-icons/fi';
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
        try {
          const fullUser = await getUserById(currentUser.$id);
          if (fullUser) {
            setUser({ uid: currentUser.$id, ...fullUser });
          } else {
            setUser({
              uid: currentUser.$id,
              name: currentUser.name || currentUser.email?.split('@')[0],
              email: currentUser.email,
            });
          }
        } catch (dbError) {
          setUser({
            uid: currentUser.$id,
            name: currentUser.name || currentUser.email?.split('@')[0],
            email: currentUser.email,
          });
        }

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
            favoriteProjects: 0
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <FiLoader className="animate-spin text-2xl text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-gray-500 mt-2">Here's what's happening with your library.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Purchased Projects</p>
          <p className="text-4xl font-bold text-gray-900">{stats.purchasedProjects}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
          <p className="text-4xl font-bold text-gray-900">{stats.totalOrders}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Favorites</p>
          <p className="text-4xl font-bold text-gray-900">{stats.favoriteProjects}</p>
        </div>
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/dashboard/my-library" className="group block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <FiHeart className="text-xl text-gray-900" />
              <FiArrowRight className="text-gray-400 group-hover:text-gray-900 transition-colors" />
            </div>
            <h3 className="font-medium text-gray-900">My Library</h3>
            <p className="text-sm text-gray-500 mt-1">View your favorite projects</p>
          </Link>

          <Link to="/dashboard/my-projects" className="group block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <FiShoppingBag className="text-xl text-gray-900" />
              <FiArrowRight className="text-gray-400 group-hover:text-gray-900 transition-colors" />
            </div>
            <h3 className="font-medium text-gray-900">My Purchases</h3>
            <p className="text-sm text-gray-500 mt-1">Access your downloaded materials</p>
          </Link>

          <Link to="/projects" className="group block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <FiGrid className="text-xl text-gray-900" />
              <FiArrowRight className="text-gray-400 group-hover:text-gray-900 transition-colors" />
            </div>
            <h3 className="font-medium text-gray-900">Browse Projects</h3>
            <p className="text-sm text-gray-500 mt-1">Discover new research materials</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Placeholder exports to maintain compatibility if they are imported from here
export const MyProjectsPage = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Purchases</h1>
    <div className="p-8 text-center border border-dashed border-gray-200 rounded-lg">
      <p className="text-gray-500">Your purchased projects will appear here.</p>
    </div>
  </div>
);

export const ProfilePage = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
    <div className="p-8 text-center border border-dashed border-gray-200 rounded-lg">
      <p className="text-gray-500">Profile settings will be available here.</p>
    </div>
  </div>
);
