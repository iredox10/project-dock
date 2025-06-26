
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaFolderOpen, FaArrowRight } from 'react-icons/fa';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect to detect scroll and apply styles
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClasses = "relative font-semibold text-gray-700 hover:text-indigo-600 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:w-0 after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full";
  const activeNavLinkClasses = "text-indigo-600 after:w-full";


  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <FaFolderOpen className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">Project Dock</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
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
          </div>

          {/* Get Started Button */}
          <div className="flex items-center">
            <Link
              to="/signup"
              className="group flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-5 py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-700 transition-all duration-300"
            >
              <span>Get Started</span>
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

