
import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaFolderOpen, FaPaperPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">

        {/* Top Section: CTA and Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-b border-gray-700 pb-12">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Ready to get started?</h2>
            <p className="mt-4 text-lg text-gray-400">
              Create an account today and get instant access to thousands of verified academic projects.
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <form className="relative">
              <label htmlFor="email-subscription" className="sr-only">Email</label>
              <input
                type="email"
                id="email-subscription"
                placeholder="Enter your email for updates"
                className="w-full px-5 py-4 rounded-full text-gray-900 border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-indigo-400"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 transition duration-150"
              >
                <FaPaperPlane className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Solutions</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/projects" className="text-base text-gray-300 hover:text-white">Browse Projects</Link></li>
              <li><Link to="/departments" className="text-base text-gray-300 hover:text-white">Departments</Link></li>
              <li><Link to="/get-started" className="text-base text-gray-300 hover:text-white">Get Inspired</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Contact Us</a></li>
              <li><Link to="/faq" className="text-base text-gray-300 hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="text-base text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/terms" className="text-base text-gray-300 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-base text-gray-300 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Social and Copyright */}
        <div className="border-t border-gray-700 py-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <FaFolderOpen className="h-7 w-7 text-indigo-500" />
            <span className="text-xl font-bold">Project Dock</span>
          </div>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">&copy; {new Date().getFullYear()} Project Dock Inc. All rights reserved.</p>
          <div className="flex mt-4 md:mt-0 space-x-6">
            <a href="#" className="text-gray-400 hover:text-white"><span className="sr-only">Facebook</span><FaFacebook className="h-6 w-6" /></a>
            <a href="#" className="text-gray-400 hover:text-white"><span className="sr-only">Twitter</span><FaTwitter className="h-6 w-6" /></a>
            <a href="#" className="text-gray-400 hover:text-white"><span className="sr-only">LinkedIn</span><FaLinkedin className="h-6 w-6" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
