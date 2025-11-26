import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiLayout, FiFolder, FiGrid, FiLayers } from 'react-icons/fi';
import { authService } from '../appwrite/auth';
import { usersService } from '../appwrite/database';

const CleanNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef(null);
  const userMenuRef = useRef(null);

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
      // Close mobile menu if clicking outside nav
      if (isMenuOpen && navRef.current && !navRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
      // Close user menu if clicking outside user menu container
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, showUserMenu]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      navigate('/');
      setShowUserMenu(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinkClasses = "text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors";
  const activeNavLinkClasses = "text-gray-900 font-semibold";

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm' : 'bg-white border-b border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMenuOpen(false)}>
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center group-hover:bg-gray-800 transition-colors">
              <FiFolder className="text-white text-lg" />
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
            <NavLink to="/hire-writer" className={({ isActive }) => isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses}>Hire a Writer</NavLink>
          </div>

          {/* User Menu / Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors focus:outline-none"
                >
                  <span>{user.displayName}</span>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiUser className="text-gray-600" />
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                      <FiLayout className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/dashboard/my-library" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                      <FiGrid className="w-4 h-4" /> My Library
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                        <FiLayers className="w-4 h-4" /> Admin
                      </Link>
                    )}
                    <div className="border-t border-gray-50 mt-1">
                      <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left">
                        <FiLogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Sign in</Link>
                <Link to="/signup" className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute top-16 left-0 right-0 animate-in slide-in-from-top-5 duration-200">
          <div className="px-6 py-6 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <NavLink to="/" className="block text-base font-medium text-gray-600 hover:text-gray-900 py-2" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
            <NavLink to="/projects" className="block text-base font-medium text-gray-600 hover:text-gray-900 py-2" onClick={() => setIsMenuOpen(false)}>Projects</NavLink>
            <NavLink to="/departments" className="block text-base font-medium text-gray-600 hover:text-gray-900 py-2" onClick={() => setIsMenuOpen(false)}>Departments</NavLink>
            <NavLink to="/hire-writer" className="block text-base font-medium text-gray-600 hover:text-gray-900 py-2" onClick={() => setIsMenuOpen(false)}>Hire a Writer</NavLink>

            <div className="pt-4 border-t border-gray-100">
              {user ? (
                <>
                  <div className="flex items-center gap-3 mb-4 p-2 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center">
                      <FiUser className="text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.displayName}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[150px]">{user.email}</div>
                    </div>
                  </div>
                  <Link to="/dashboard" className="flex items-center gap-3 text-base font-medium text-gray-600 hover:text-gray-900 py-2" onClick={() => setIsMenuOpen(false)}>
                    <FiLayout className="w-5 h-5" /> Dashboard
                  </Link>
                  <Link to="/dashboard/my-library" className="flex items-center gap-3 text-base font-medium text-gray-600 hover:text-gray-900 py-2" onClick={() => setIsMenuOpen(false)}>
                    <FiGrid className="w-5 h-5" /> My Library
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-3 text-base font-medium text-gray-600 hover:text-gray-900 py-2" onClick={() => setIsMenuOpen(false)}>
                      <FiLayers className="w-5 h-5" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left text-base font-medium text-red-600 hover:text-red-700 py-2 mt-2">
                    <FiLogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-2">
                  <Link to="/login" className="w-full py-3 text-center text-base font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" onClick={() => setIsMenuOpen(false)}>Sign in</Link>
                  <Link to="/signup" className="w-full py-3 text-center text-base font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CleanNavbar;