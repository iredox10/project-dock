
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaFolderOpen, FaArrowRight, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClasses = "block py-2 px-4 text-lg md:text-base relative font-semibold text-gray-700 hover:text-indigo-600 transition-colors duration-300";
  const activeNavLinkClasses = "text-indigo-600";

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-white/80 backdrop-blur-lg shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <FaFolderOpen className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">Project Dock</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Home</NavLink>
            <NavLink to="/projects" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Projects</NavLink>
            <NavLink to="/departments" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Departments</NavLink>
            <NavLink to="/hire-writer" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Hire A Writer</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Contact</NavLink>
          </div>

          {/* Get Started Button (Desktop) */}
          <div className="hidden md:flex items-center">
            <Link to="/signup" className="group flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-5 py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-700 transition-all">
              <span>Get Started</span>
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-800">
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-lg shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
            <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
            <NavLink to="/projects" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={() => setIsMenuOpen(false)}>Projects</NavLink>
            <NavLink to="/departments" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={() => setIsMenuOpen(false)}>Departments</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={() => setIsMenuOpen(false)}>Contact</NavLink>
            <div className="pt-4">
              <Link to="/signup" className="group w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-5 py-3 rounded-lg shadow-md">
                <span>Get Started</span>
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

