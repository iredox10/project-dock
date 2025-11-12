import React from 'react';
import { Link } from 'react-router-dom';
import { FaFolderOpen, FaExclamationTriangle } from 'react-icons/fa';

const CleanNotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <FaExclamationTriangle className="h-8 w-8 text-red-600" />
        </div>
        <FaFolderOpen className="mx-auto h-16 w-auto text-indigo-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block w-full py-2 px-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Go Home
          </Link>
          <div className="mt-2">
            <Link
              to="/projects"
              className="inline-block w-full py-2 px-4 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Browse Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanNotFoundPage;