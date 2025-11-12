import React from 'react';
import { Link } from 'react-router-dom';
import { FaFolderOpen, FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const CleanFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FaFolderOpen className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Project Dock</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Nigeria's premier academic resource hub, trusted by thousands of students for quality research materials and project excellence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <FaLinkedin size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <FaGithub size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/projects" className="text-gray-600 hover:text-indigo-600 transition-colors">Projects</Link></li>
              <li><Link to="/departments" className="text-gray-600 hover:text-indigo-600 transition-colors">Departments</Link></li>
              <li><Link to="/hire-writer" className="text-gray-600 hover:text-indigo-600 transition-colors">Hire Writer</Link></li>
              <li><Link to="/about-us" className="text-gray-600 hover:text-indigo-600 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</Link></li>
              <li><Link to="/help" className="text-gray-600 hover:text-indigo-600 transition-colors">Help Center</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-indigo-600 transition-colors">Terms</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-indigo-600 transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {currentYear} Project Dock. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 text-sm text-gray-600">
            Made with ❤️ for Nigerian Students
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CleanFooter;