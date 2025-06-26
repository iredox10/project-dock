
import React from 'react';
import { FaSearch } from 'react-icons/fa';

const Hero = () => {
  return (
    <header className="text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">Find and Download Your Final Year Project</h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-indigo-100 mb-8">
          Access a vast repository of high-quality final year projects across various departments. Get the inspiration and foundation you need to succeed.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <input type="text" placeholder="Search for projects by title, department, or keyword..." className="w-full sm:w-1/2 px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          <button className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-md hover:bg-gray-100 transition duration-150 ease-in-out w-full sm:w-auto flex items-center justify-center gap-2">
            <FaSearch />
            <span>Search</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Hero;
