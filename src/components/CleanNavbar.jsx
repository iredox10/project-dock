import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaTachometerAlt, FaFolderOpen } from 'react-icons/fa';
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
    const checkAuthStatus = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          try {
            const fullUser = await usersService.getUserById(currentUser.$id);
            setUser({
              uid: currentUser.$id,
              email: currentUser.email,
              displayName: currentUser.name || currentUser.email?.split('@')[0],
              role: fullUser?.role || 'user'
            });
          } catch (dbError) {
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
    const interval = setInterval(checkAuthStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('nav')) setIsMenuOpen(false);
      if (showUserMenu && !e.target.closest('.user-menu-container')) setShowUserMenu(false);
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

  const navLinkClasses = "text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors";
  const activeNavLinkClasses = "text-gray-900 font-semibold";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${isScrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-100' : 'bg-white border-b border-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center group-hover:bg-gray-800 transition-colors">
              <FaFolderOpen className="text-white text-sm" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Project Dock
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({ isActive }) => isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses}>Home</NavLink>
            <NavLink to="/projects" className={({ isActive }) => isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses}>Projects</NavLink>
            <NavLink to="/departments" className={({ isActive }) => isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses}>Departments</NavLink>
          </div>

          {/* User Menu / Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <span>{user.displayName}</span>
                  <FaUser className="text-gray-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-in fade-in zoom-in-95 duration-100">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>Dashboard</Link>
                    <Link to="/dashboard/my-library" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>My Library</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>Admin</Link>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Sign in</Link>
                <Link to="/signup" className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-gray-900">
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 space-y-4">
          <NavLink to="/" className="block text-sm font-medium text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
          <NavLink to="/projects" className="block text-sm font-medium text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Projects</NavLink>
          <NavLink to="/departments" className="block text-sm font-medium text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Departments</NavLink>
          <div className="pt-4 border-t border-gray-100">
            {user ? (
              <>
                <div className="text-sm font-medium text-gray-900 mb-2">{user.displayName}</div>
                <Link to="/dashboard" className="block text-sm text-gray-600 mb-2" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="text-sm text-red-600">Logout</button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-600" onClick={() => setIsMenuOpen(false)}>Sign in</Link>
                <Link to="/signup" className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg text-center" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default CleanNavbar;