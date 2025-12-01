import React from 'react';
import { Link } from 'react-router-dom';
import { FaFolderOpen } from 'react-icons/fa';

const CleanFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center">
                <FaFolderOpen className="text-white text-xs" />
              </div>
              <span className="text-base font-bold text-gray-900">Project Dock</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              The standard for academic research in Nigeria. Verified projects, instant downloads.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/projects" className="text-gray-500 hover:text-gray-900 transition-colors">Browse Projects</Link></li>
              <li><Link to="/departments" className="text-gray-500 hover:text-gray-900 transition-colors">Departments</Link></li>
              <li><Link to="/pricing" className="text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/help" className="text-gray-500 hover:text-gray-900 transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-gray-900 transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-gray-500 hover:text-gray-900 transition-colors">About</Link></li>
              <li><Link to="/careers" className="text-gray-500 hover:text-gray-900 transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="text-gray-500 hover:text-gray-900 transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-gray-400">
            <span>&copy; {currentYear} Project Dock. All rights reserved.</span>
            <span className="hidden md:inline mx-1">•</span>
            <span>
              Built by <a href="https://iredox.tech" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors font-medium">iredox.tech</a>
            </span>
          </div>
          <div className="flex gap-6">
            {/* Socials can go here if needed, keeping it clean for now */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CleanFooter;