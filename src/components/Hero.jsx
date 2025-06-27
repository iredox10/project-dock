
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center pt-24 pb-32">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900"><span className="block">Find Your Next</span><span className="block text-indigo-600">Breakthrough Project</span></h1>
          <p className="max-w-2xl mx-auto lg:mx-0 mt-6 text-lg md:text-xl text-gray-600">Access thousands of verified final year projects, research papers, and case studies from universities across Nigeria.</p>
          <form onSubmit={handleSearch} className="max-w-xl mx-auto lg:mx-0 mt-8">
            <div className="relative">
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search projects by title, department..." className="w-full px-5 py-4 pl-12 rounded-full text-gray-800 border-2 border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all" />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-indigo-700 transition duration-150 ease-in-out">Search</button>
            </div>
          </form>
          <div className="mt-6 flex justify-center lg:justify-start items-center flex-wrap gap-x-4 gap-y-2">
            <span className="text-sm font-semibold text-gray-500">Trending:</span>
            <Link to="/department/Computer%20Science" className="text-sm font-medium text-indigo-600 hover:underline">Computer Science</Link>
            <Link to="/department/Economics" className="text-sm font-medium text-indigo-600 hover:underline">Economics</Link>
            <Link to="/department/Mass%20Communication" className="text-sm font-medium text-indigo-600 hover:underline">Mass Comm</Link>
          </div>
        </div>
        <div className="hidden lg:block">
          <style>{`@keyframes float{0%{transform:translateY(0)}50%{transform:translateY(-20px)}100%{transform:translateY(0)}}@keyframes float-reverse{0%{transform:translateY(0)}50%{transform:translateY(20px)}100%{transform:translateY(0)}}.float-1{animation:float 6s ease-in-out infinite}.float-2{animation:float-reverse 8s ease-in-out infinite;animation-delay:1s}.float-3{animation:float 7s ease-in-out infinite;animation-delay:2s}`}</style>
          <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <g className="float-1"><path d="M426.1,288.3c-23.3,34.9-66.2,56.5-110.8,63.1c-44.6,6.6-91-1.7-129.8-24.1 c-38.9-22.4-70.2-58.8-79.5-102.2C96.7,181.8,118,131,154.5,95.3c36.5-35.7,88.2-56.1,141.4-55.4 c53.2,0.7,107.9,22.4,142.4,62.1C472.9,141,472.6,204.2,426.1,288.3z" fill="#f0f5ff"></path></g>
            <g transform="translate(150, 180) rotate(20)" className="float-2"><rect x="0" y="0" width="200" height="150" fill="#4f46e5" rx="15" ry="15" stroke="#fff" strokeWidth="5"></rect><rect x="95" y="-10" width="10" height="170" fill="#a5b4fc"></rect><line x1="20" y1="20" x2="70" y2="20" stroke="#a5b4fc" strokeWidth="8" strokeLinecap="round"></line><line x1="20" y1="40" x2="70" y2="40" stroke="#a5b4fc" strokeWidth="8" strokeLinecap="round"></line><line x1="130" y1="50" x2="180" y2="50" stroke="#a5b4fc" strokeWidth="8" strokeLinecap="round"></line><line x1="130" y1="70" x2="180" y2="70" stroke="#a5b4fc" strokeWidth="8" strokeLinecap="round"></line></g>
            <g className="float-3"><rect x="80" y="100" width="100" height="75" fill="#c7d2fe" rx="10" ry="10" transform="rotate(-15)"></rect><line x1="90" y1="115" x2="120" y2="115" stroke="#fff" strokeWidth="5" strokeLinecap="round"></line><line x1="90" y1="130" x2="160" y2="130" stroke="#fff" strokeWidth="5" strokeLinecap="round"></line></g>
            <g className="float-1" style={{ animationDelay: '1.5s' }}><rect x="350" y="320" width="80" height="60" fill="#818cf8" rx="10" ry="10" transform="rotate(30)"></rect><line x1="360" y1="335" x2="380" y2="335" stroke="#fff" strokeWidth="4" strokeLinecap="round"></line><line x1="360" y1="345" x2="410" y2="345" stroke="#fff" strokeWidth="4" strokeLinecap="round"></line></g>
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Hero;
