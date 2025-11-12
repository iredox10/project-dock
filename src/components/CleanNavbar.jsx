import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaFolderOpen, FaBars, FaTimes, FaUser, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { authService } from '../appwrite/auth';
import { usersService } from '../appwrite/database';

const CleanNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // In Appwrite, we need to manually check authentication status
    const checkAuthStatus = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          // Try to get full user details including role from the database
          try {
            const fullUser = await usersService.getUserById(currentUser.$id);
            setUser({
              uid: currentUser.$id,
              email: currentUser.email,
              displayName: currentUser.name || currentUser.email?.split('@')[0],
              role: fullUser?.role || 'user'
            });
          } catch (dbError) {
            // If user doesn't exist in the database, default to user role
            setUser({
              uid: currentUser.$id,
              email: currentUser.email,
              displayName: currentUser.name || currentUser.email?.split('@')[0],
              role: 'user'
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
    };

    checkAuthStatus();

    // Set up a periodic check or use auth events if available in your setup
    const interval = setInterval(checkAuthStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('nav')) {
        setIsMenuOpen(false);
      }
      if (showUserMenu && !e.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen, showUserMenu]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      navigate('/');
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Clean navigation link classes
  const navLinkClasses = "flex items-center gap-2 py-2 px-3 text-base font-medium text-gray-700 hover:text-indigo-600 transition-colors rounded-md hover:bg-gray-50";
  const activeNavLinkClasses = "text-indigo-600 font-semibold bg-indigo-50";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 font-sans'
        : 'bg-white border-b border-gray-100 font-sans'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FaFolderOpen className="text-white text-lg" />
            </div>
            <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`}>
              Project Dock
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
            >
              Projects
            </NavLink>
            <NavLink
              to="/departments"
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
            >
              Departments
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
            >
              Contact
            </NavLink>
          </div>

          {/* User Menu or Get Started Button (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FaUser className="text-gray-600" />
                  <span className="font-medium">{user.displayName || user.email?.split('@')[0]}</span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaTachometerAlt className="text-gray-500" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/dashboard/my-library"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaFolderOpen className="text-gray-500" />
                      <span>My Library</span>
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaTachometerAlt className="text-gray-500" />
                        <span>Admin</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-gray-200 py-4">
          <div className="px-4 py-2 space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </NavLink>
            <NavLink
              to="/departments"
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Departments
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </NavLink>

            {/* User Section */}
            {user ? (
              <div className="pt-2 border-t border-gray-200">
                <div className="px-3 py-2 bg-gray-50 rounded-md mb-2">
                  <div className="font-medium text-gray-900">{user.displayName || 'User'}</div>
                  <div className="text-xs text-gray-600 truncate">{user.email}</div>
                </div>
                
                <Link
                  to="/dashboard"
                  className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaTachometerAlt className="text-gray-500" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/dashboard/my-library"
                  className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaFolderOpen className="text-gray-500" />
                  <span>My Library</span>
                </Link>
                
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaTachometerAlt className="text-gray-500" />
                    <span>Admin</span>
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 pb-2 space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CleanNavbar;