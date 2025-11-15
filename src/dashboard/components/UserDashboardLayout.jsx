
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { FaBook, FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaHeart, FaBars, FaTimes } from 'react-icons/fa';
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
        // Try to get user details from database
        try {
          const userData = await getUserById(user.$id);
          if (userData && userData.name) {
            setUserName(userData.name);
          } else {
            setUserName(user.name || user.email?.split('@')[0] || 'User');
          }
        } catch (dbError) {
          // User not in database, use auth name
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

  const linkClasses = "flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-colors";
  const activeLinkClasses = "bg-indigo-100 text-indigo-600 font-bold";

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b text-center">
        <FaUserCircle className="mx-auto text-5xl text-gray-400 mb-2" />
        <h2 className="text-lg font-bold text-gray-800 truncate">{userName || 'Welcome'}</h2>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        <NavLink 
          to="/dashboard" 
          end 
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        <NavLink 
          to="/dashboard/my-library" 
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FaHeart />
          <span>My Library</span>
        </NavLink>
        <NavLink 
          to="/dashboard/my-projects" 
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FaBook />
          <span>My Purchased Projects</span>
        </NavLink>
        <NavLink 
          to="/dashboard/profile" 
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FaUserCircle />
          <span>Profile Settings</span>
        </NavLink>
      </nav>
      <div className="p-4 border-t">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r flex-shrink-0 flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-3xl text-gray-400" />
            <div>
              <h2 className="font-bold text-gray-800">{userName || 'Dashboard'}</h2>
              <p className="text-xs text-gray-500">Welcome back</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="text-2xl text-gray-700" />
            ) : (
              <FaBars className="text-2xl text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="border-t bg-white shadow-lg">
            <div className="p-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
              <NavLink 
                to="/dashboard" 
                end 
                className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaTachometerAlt />
                <span>Dashboard</span>
              </NavLink>
              <NavLink 
                to="/dashboard/my-library" 
                className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaHeart />
                <span>My Library</span>
              </NavLink>
              <NavLink 
                to="/dashboard/my-projects" 
                className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaBook />
                <span>My Purchased Projects</span>
              </NavLink>
              <NavLink 
                to="/dashboard/profile" 
                className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaUserCircle />
                <span>Profile Settings</span>
              </NavLink>
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }} 
                className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const UserDashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row" style={{ fontFamily: "'Inter', sans-serif" }}>
      <UserSidebar />
      <main className="flex-1 pt-20 lg:pt-0 pb-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserDashboardLayout;
