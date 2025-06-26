
import React from 'react';
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold">Project Dock</h3>
            <p className="mt-2 text-gray-400">Your #1 source for final year projects.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="/#features" className="hover:text-indigo-400">Features</a></li>
              <li><Link to="/browse" className="hover:text-indigo-400">Browse Projects</Link></li>
              <li><Link to="/signup" className="hover:text-indigo-400">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="/#contact" className="hover:text-indigo-400">Contact Us</a></li>
              <li><Link to="/faq" className="hover:text-indigo-400">FAQ</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-400">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><span className="sr-only">Facebook</span><FaFacebook className="h-6 w-6" /></a>
              <a href="#" className="text-gray-400 hover:text-white"><span className="sr-only">Twitter</span><FaTwitter className="h-6 w-6" /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Project Dock. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
