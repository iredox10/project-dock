
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaFolderOpen, FaArrowRight, FaBars, FaTimes, FaHome, FaLayerGroup, FaBuilding, FaPen, FaEnvelope, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('nav')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  const navLinkClasses = "flex items-center gap-3 py-3 px-4 text-base relative font-medium text-gray-700 hover:text-indigo-600 transition-all duration-200 rounded-lg hover:bg-indigo-50";
  const activeNavLinkClasses = "text-indigo-600 bg-indigo-50";
  const desktopNavLinkClasses = "relative font-medium text-white/90 hover:text-white transition-all duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full";
  const desktopActiveNavLinkClasses = "text-white after:w-full";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
        : 'bg-gradient-to-r from-violet-600/95 via-indigo-600/95 to-blue-700/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              isScrolled 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                : 'bg-white/20 group-hover:bg-white/30'
            }`}>
              <FaFolderOpen className={`h-6 w-6 md:h-7 md:w-7 transition-colors ${
                isScrolled ? 'text-white' : 'text-white'
              }`} />
            </div>
            <span className={`text-xl md:text-2xl font-bold transition-colors ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              Project Dock
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => `${isScrolled ? navLinkClasses : desktopNavLinkClasses} ${
                isActive ? (isScrolled ? activeNavLinkClasses : desktopActiveNavLinkClasses) : ''
              }`}
            >
              Home
            </NavLink>
            <NavLink 
              to="/projects" 
              className={({ isActive }) => `${isScrolled ? navLinkClasses : desktopNavLinkClasses} ${
                isActive ? (isScrolled ? activeNavLinkClasses : desktopActiveNavLinkClasses) : ''
              }`}
            >
              Projects
            </NavLink>
            <NavLink 
              to="/departments" 
              className={({ isActive }) => `${isScrolled ? navLinkClasses : desktopNavLinkClasses} ${
                isActive ? (isScrolled ? activeNavLinkClasses : desktopActiveNavLinkClasses) : ''
              }`}
            >
              Departments
            </NavLink>
            <NavLink 
              to="/hire-writer" 
              className={({ isActive }) => `${isScrolled ? navLinkClasses : desktopNavLinkClasses} ${
                isActive ? (isScrolled ? activeNavLinkClasses : desktopActiveNavLinkClasses) : ''
              }`}
            >
              Hire Writer
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => `${isScrolled ? navLinkClasses : desktopNavLinkClasses} ${
                isActive ? (isScrolled ? activeNavLinkClasses : desktopActiveNavLinkClasses) : ''
              }`}
            >
              Contact
            </NavLink>
          </div>

          {/* Get Started Button (Desktop) */}
          <div className="hidden md:flex items-center">
            <Link 
              to="/signup" 
              className={`group flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 ${
                isScrolled
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:scale-105'
                  : 'bg-white text-indigo-600 hover:bg-indigo-50 hover:shadow-xl hover:scale-105'
              }`}
            >
              <span>Get Started</span>
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link 
              to="/signup" 
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                isScrolled
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/20 text-white backdrop-blur-sm'
              }`}
            >
              Sign Up
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`p-2 rounded-lg transition-all ${
                isScrolled 
                  ? 'text-gray-800 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/20'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Slide down animation */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-gray-100 shadow-2xl">
          <div className="px-4 py-4 space-y-1">
            <NavLink 
              to="/" 
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} 
              onClick={() => setIsMenuOpen(false)}
            >
              <FaHome className="h-5 w-5" />
              <span>Home</span>
            </NavLink>
            <NavLink 
              to="/projects" 
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} 
              onClick={() => setIsMenuOpen(false)}
            >
              <FaLayerGroup className="h-5 w-5" />
              <span>Projects</span>
            </NavLink>
            <NavLink 
              to="/departments" 
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} 
              onClick={() => setIsMenuOpen(false)}
            >
              <FaBuilding className="h-5 w-5" />
              <span>Departments</span>
            </NavLink>
            <NavLink 
              to="/hire-writer" 
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} 
              onClick={() => setIsMenuOpen(false)}
            >
              <FaPen className="h-5 w-5" />
              <span>Hire a Writer</span>
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} 
              onClick={() => setIsMenuOpen(false)}
            >
              <FaEnvelope className="h-5 w-5" />
              <span>Contact</span>
            </NavLink>
            
            <div className="pt-4 pb-2">
              <Link 
                to="/signup" 
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUserPlus className="h-5 w-5" />
                <span>Get Started Free</span>
                <FaArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
