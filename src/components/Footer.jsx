
import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaFolderOpen, FaPaperPlane, FaGraduationCap, FaBook, FaUniversity, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="footer-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="white"/>
              <path d="M 15 30 L 30 20 L 45 30 L 30 40 Z" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top Section: Newsletter CTA */}
        <div className="pt-16 pb-12 border-b border-slate-700/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-6">
                <FaGraduationCap className="text-indigo-400 text-sm" />
                <span className="text-indigo-300 text-sm font-bold uppercase tracking-wide">Join 5,000+ Students</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                Start Your{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                  Academic Journey
                </span>
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                Get instant access to 10,000+ verified projects and exclusive updates on new additions.
              </p>
            </div>
            
            <div className="flex flex-col justify-center">
              <form className="relative group">
                <label htmlFor="email-subscription" className="sr-only">Email</label>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-50 group-focus-within:opacity-50 transition duration-300"></div>
                <div className="relative flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    id="email-subscription"
                    placeholder="Enter your email address"
                    className="flex-1 px-6 py-4 rounded-xl text-slate-900 bg-white border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 font-medium placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 group"
                  >
                    <span>Subscribe</span>
                    <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
              <p className="mt-3 text-sm text-slate-400 flex items-center gap-2 justify-center lg:justify-start">
                <FaCheckCircle className="text-green-400" />
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12 py-16">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110">
                <FaFolderOpen className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-black">Project Dock</span>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-6 text-sm">
              Nigeria's premier academic resource hub, trusted by thousands of students for quality research materials and project excellence.
            </p>
            
            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5">
                <FaUniversity className="text-indigo-400 text-xs" />
                <span className="text-xs font-semibold text-slate-300">50+ Departments</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5">
                <FaBook className="text-blue-400 text-xs" />
                <span className="text-xs font-semibold text-slate-300">10,000+ Projects</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/projects" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link to="/departments" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  Departments
                </Link>
              </li>
              <li>
                <Link to="/hire-writer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  Hire a Writer
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/signup" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#features" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaEnvelope className="text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Email</p>
                  <a href="mailto:support@projectdock.ng" className="text-slate-300 hover:text-white transition-colors text-sm">
                    support@projectdock.ng
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaPhone className="text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Phone</p>
                  <a href="tel:+234" className="text-slate-300 hover:text-white transition-colors text-sm">
                    +234 (0) 123-456-7890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Location</p>
                  <p className="text-slate-300 text-sm">
                    Lagos, Nigeria
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright and Social */}
        <div className="border-t border-slate-700/50 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-slate-400 text-sm">
              <p>&copy; {currentYear} Project Dock. All rights reserved.</p>
              <span className="hidden sm:inline">•</span>
              <p>Made with ❤️ for Nigerian Students</p>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 mr-2">Follow us:</span>
              <a 
                href="#" 
                className="w-10 h-10 bg-slate-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                aria-label="Facebook"
              >
                <FaFacebook className="text-slate-400 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-slate-800 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                aria-label="Twitter"
              >
                <FaTwitter className="text-slate-400 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-slate-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-slate-400 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-slate-800 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                aria-label="Instagram"
              >
                <FaInstagram className="text-slate-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
