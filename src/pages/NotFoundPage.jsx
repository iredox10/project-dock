import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiSearch, FiAlertCircle } from 'react-icons/fi';

const CleanNotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-6 py-12">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gray-50 mb-8 ring-1 ring-gray-100">
          <FiAlertCircle className="h-10 w-10 text-gray-400" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">Page not found</h1>
        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
          The page you are looking for doesn't exist or has been moved to another location.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-all shadow-sm"
          >
            <FiHome className="w-4 h-4" />
            Return Home
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <FiSearch className="w-4 h-4" />
            Browse Projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CleanNotFoundPage;