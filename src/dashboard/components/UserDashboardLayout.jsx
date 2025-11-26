
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiGrid, FiBook, FiUser, FiLogOut, FiMenu, FiX, FiShoppingBag, FiHeart } from 'react-icons/fi';
import { authService } from '../../appwrite/auth';
import { getUserById } from '../../api/projectServices';

const UserSidebar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, [navigate]);

  const checkAuthStatus = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        try {
          const userData = await getUserById(user.$id);
          if (userData && userData.name) {
            setUserName(userData.name);
          } else {
            setUserName(user.name || user.email?.split('@')[0] || 'User');
          }
        } catch (dbError) {
          setUserName(user.name || user.email?.split('@')[0] || 'User');
        }
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/login');
    }
  };

  const linkClasses = "flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 rounded-md transition-colors hover:text-gray-900";
  const activeLinkClasses = "text-gray-900 bg-gray-100";

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-lg font-bold tracking-tight text-gray-900">Dashboard</h2>
        <p className="text-xs text-gray-500 mt-1 truncate">
          {userName}
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FiGrid className="w-4 h-4" />
          <span>Overview</span>
        </NavLink>
        <NavLink
          to="/dashboard/my-library"
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FiHeart className="w-4 h-4" />
          <span>My Library</span>
        </NavLink>
        <NavLink
          to="/dashboard/my-projects"
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FiShoppingBag className="w-4 h-4" />
          <span>Purchases</span>
        </NavLink>
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FiUser className="w-4 h-4" />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
        >
          <FiLogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <span className="font-bold text-gray-900">Dashboard</span>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-500 hover:text-gray-900"
          >
            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-100 bg-white h-[calc(100vh-57px)]">
            <SidebarContent />
          </div>
        )}
      </div>
    </>
  );
};

const UserDashboardLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      <UserSidebar />
      <main className="flex-1 pt-20 lg:pt-0 px-4 sm:px-8 py-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserDashboardLayout;
