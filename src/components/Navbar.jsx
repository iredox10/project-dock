
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaFolderOpen } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <FaFolderOpen className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">Project Dock</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#features" className="text-gray-600 hover:text-indigo-600 transition duration-150 ease-in-out">Features</a>
            <a href="/#how-it-works" className="text-gray-600 hover:text-indigo-600 transition duration-150 ease-in-out">How It Works</a>
            <a href="/#testimonials" className="text-gray-600 hover:text-indigo-600 transition duration-150 ease-in-out">Testimonials</a>
            <a href="/#contact" className="text-gray-600 hover:text-indigo-600 transition duration-150 ease-in-out">Contact</a>
          </div>
          <div className="flex items-center">
            <Link to="/get-started" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out">Get Started</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
