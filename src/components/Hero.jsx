import React, { useState, useEffect } from 'react';
import { FaSearch, FaGraduationCap, FaBook, FaAward, FaUsers, FaDownload, FaCheckCircle, FaUniversity, FaFileAlt, FaCertificate, FaBookReader, FaLaptopCode, FaFlask } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 15,
        y: (e.clientY / window.innerHeight) * 15
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-16 md:pt-20 min-h-[95vh] flex items-center">
      {/* Academic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle gradient orbs */}
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.5s ease-out'
          }}
        >
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Academic pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="academic-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="1" fill="#1e40af"/>
                <path d="M 20 40 L 40 30 L 60 40 L 40 50 Z" fill="none" stroke="#1e40af" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#academic-pattern)" />
          </svg>
        </div>

        {/* Floating academic icons - desktop only */}
        <div className="hidden lg:block">
          <div className="absolute top-20 left-10 text-indigo-300/20 animate-float-slow">
            <FaBook className="w-16 h-16" />
          </div>
          <div className="absolute top-40 right-20 text-blue-300/20 animate-float animation-delay-1000">
            <FaGraduationCap className="w-20 h-20" />
          </div>
          <div className="absolute bottom-32 left-1/4 text-purple-300/20 animate-float-delayed">
            <FaCertificate className="w-14 h-14" />
          </div>
          <div className="absolute bottom-40 right-1/3 text-indigo-300/20 animate-float animation-delay-2000">
            <FaUniversity className="w-12 h-12" />
          </div>
        </div>

        {/* Decorative lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-200/30 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-200/30 to-transparent"></div>
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left space-y-6 md:space-y-8 animate-slide-up">
            {/* Academic Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border-2 border-indigo-200 rounded-full px-4 py-2 md:px-5 md:py-2.5 shadow-lg shadow-indigo-100 animate-fade-in">
              <FaUniversity className="text-indigo-600 text-base md:text-lg" />
              <span className="text-indigo-900 text-xs md:text-sm font-bold">
                Nigeria's Premier Academic Resource Hub
              </span>
            </div>

            {/* Main heading - Academic style */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
              <span className="block text-slate-900 mb-2">
                Excellence in
              </span>
              <span className="block relative">
                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Academic Research
                </span>
                {/* Elegant underline */}
                <svg className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-3 md:h-4" viewBox="0 0 400 12" fill="none">
                  <path d="M2 6 Q100 2, 200 6 T398 6" stroke="url(#academic-gradient)" strokeWidth="3" strokeLinecap="round" className="animate-draw-line"/>
                  <defs>
                    <linearGradient id="academic-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="50%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Professional subheading */}
            <p className="max-w-2xl mx-auto lg:mx-0 text-base md:text-lg lg:text-xl text-slate-700 leading-relaxed px-2 md:px-0 animate-fade-in-up animation-delay-500">
              Access a comprehensive library of <span className="font-bold text-indigo-700">10,000+ verified academic projects</span>, research papers, and dissertations across 50+ departments. 
              Elevate your research with quality resources.
            </p>

            {/* Professional Search bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-700">
              <div className="relative group">
                {/* Subtle shadow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl opacity-20 group-hover:opacity-30 group-focus-within:opacity-30 blur transition duration-300"></div>
                
                <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl shadow-xl border-2 border-indigo-100 overflow-hidden group-focus-within:border-indigo-300 transition-all">
                  <div className="relative flex-1">
                    <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2">
                      <FaSearch className="text-slate-400 h-5 w-5 md:h-5 md:w-5" />
                    </div>
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      placeholder="Search by topic, title, department, or keyword..." 
                      className="w-full px-4 py-5 md:px-6 md:py-6 pl-14 md:pl-16 text-slate-800 text-base md:text-lg font-medium focus:outline-none bg-transparent placeholder:text-slate-400" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="m-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold px-6 py-4 md:px-10 md:py-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:scale-[1.02] active:scale-95"
                  >
                    <span className="text-base md:text-lg">Search Projects</span>
                    <FaGraduationCap className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Trending departments */}
              <div className="flex items-center gap-2 mt-4 text-xs md:text-sm text-slate-600 flex-wrap justify-center lg:justify-start">
                <FaBookReader className="text-indigo-600" />
                <span className="font-semibold">Trending:</span>
                <Link to="/department/Computer%20Science" className="text-indigo-600 font-medium hover:underline hover:text-indigo-700">Computer Science</Link>
                <span>•</span>
                <Link to="/department/Economics" className="text-indigo-600 font-medium hover:underline hover:text-indigo-700">Economics</Link>
                <span>•</span>
                <Link to="/department/Mass%20Communication" className="text-indigo-600 font-medium hover:underline hover:text-indigo-700">Mass Communication</Link>
              </div>
            </form>

            {/* Academic trust indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 md:gap-6 pt-2 animate-fade-in-up animation-delay-900">
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-green-600 text-sm" />
                </div>
                <span className="text-sm md:text-base font-semibold">Peer Reviewed</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-blue-600 text-sm" />
                </div>
                <span className="text-sm md:text-base font-semibold">Quality Assured</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-indigo-600 text-sm" />
                </div>
                <span className="text-sm md:text-base font-semibold">Instant Access</span>
              </div>
            </div>

            {/* Academic Stats with professional styling */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 pt-6 animate-fade-in-up animation-delay-1100">
              <div className="bg-white/70 backdrop-blur-sm border-2 border-indigo-100 rounded-2xl p-4 md:p-6 text-center hover:border-indigo-200 hover:bg-white/90 transition-all duration-300 hover:shadow-lg group">
                <div className="text-indigo-600 mb-2 flex justify-center">
                  <FaBook className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl md:text-3xl font-black text-slate-900">10,000+</div>
                <div className="text-xs md:text-sm text-slate-600 mt-1 font-semibold">Research Projects</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm border-2 border-blue-100 rounded-2xl p-4 md:p-6 text-center hover:border-blue-200 hover:bg-white/90 transition-all duration-300 hover:shadow-lg group">
                <div className="text-blue-600 mb-2 flex justify-center">
                  <FaUniversity className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl md:text-3xl font-black text-slate-900">50+</div>
                <div className="text-xs md:text-sm text-slate-600 mt-1 font-semibold">Departments</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm border-2 border-purple-100 rounded-2xl p-4 md:p-6 text-center hover:border-purple-200 hover:bg-white/90 transition-all duration-300 hover:shadow-lg group">
                <div className="text-purple-600 mb-2 flex justify-center">
                  <FaUsers className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl md:text-3xl font-black text-slate-900">5,000+</div>
                <div className="text-xs md:text-sm text-slate-600 mt-1 font-semibold">Students Helped</div>
              </div>
            </div>
          </div>

          {/* Right side - Academic illustration with floating books */}
          <div className="hidden lg:block relative animate-fade-in-right">
            <div className="relative h-[650px]">
              {/* Main academic illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Central graduation cap with glow */}
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-400/20 blur-3xl rounded-full"></div>
                  <div className="relative w-64 h-64 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border-8 border-white/50 animate-pulse-slow">
                    <FaGraduationCap className="w-32 h-32 text-white" />
                  </div>
                </div>
              </div>

              {/* Orbiting academic elements */}
              <div className="absolute inset-0 animate-orbit">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl p-4 border-2 border-indigo-100">
                  <FaBook className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
              
              <div className="absolute inset-0 animate-orbit-reverse">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl p-4 border-2 border-blue-100">
                  <FaFileAlt className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="absolute inset-0 animate-orbit animation-delay-2000">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-4 border-2 border-purple-100">
                  <FaAward className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="absolute inset-0 animate-orbit-reverse animation-delay-2000">
                <div className="absolute top-1/2 right-0 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-4 border-2 border-indigo-100">
                  <FaCertificate className="w-8 h-8 text-indigo-600" />
                </div>
              </div>

              {/* Floating academic cards */}
              <div className="absolute top-10 -left-8 bg-white rounded-xl shadow-2xl p-5 border-2 border-indigo-100 w-48 animate-float hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <FaLaptopCode className="text-white text-lg" />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-slate-200 rounded w-full mb-1.5"></div>
                    <div className="h-2 bg-slate-100 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 bg-slate-100 rounded"></div>
                  <div className="h-1.5 bg-slate-100 rounded w-5/6"></div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-bold">CS</span>
                  <div className="flex text-yellow-400 text-xs">
                    ★★★★★
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 -right-8 bg-white rounded-xl shadow-2xl p-5 border-2 border-blue-100 w-48 animate-float animation-delay-1000 hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <FaFlask className="text-white text-lg" />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-slate-200 rounded w-full mb-1.5"></div>
                    <div className="h-2 bg-slate-100 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 bg-slate-100 rounded"></div>
                  <div className="h-1.5 bg-slate-100 rounded w-5/6"></div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold">SCI</span>
                  <div className="flex text-yellow-400 text-xs">
                    ★★★★★
                  </div>
                </div>
              </div>

              {/* Academic badges */}
              <div className="absolute top-20 right-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce-slow">
                <FaCheckCircle />
                <span>Verified</span>
              </div>
              <div className="absolute bottom-32 left-10 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce-slow animation-delay-1000">
                <FaAward />
                <span>Premium</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile academic features */}
        <div className="grid grid-cols-2 gap-3 mt-12 lg:hidden animate-fade-in-up animation-delay-1300">
          <div className="bg-white/80 backdrop-blur-sm border-2 border-indigo-100 rounded-2xl p-5 text-center hover:border-indigo-200 transition-all duration-300 hover:shadow-lg group">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <FaDownload className="text-white text-xl" />
            </div>
            <div className="text-slate-900 font-bold text-base">Instant Access</div>
            <div className="text-slate-600 text-xs mt-1">Download Immediately</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border-2 border-blue-100 rounded-2xl p-5 text-center hover:border-blue-200 transition-all duration-300 hover:shadow-lg group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <FaCertificate className="text-white text-xl" />
            </div>
            <div className="text-slate-900 font-bold text-base">Verified Quality</div>
            <div className="text-slate-600 text-xs mt-1">Peer Reviewed ★★★★★</div>
          </div>
        </div>
      </div>

      {/* Professional academic animations and styles */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.1); }
          66% { transform: translate(-25px, 25px) scale(0.95); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes draw-line {
          from { stroke-dasharray: 400; stroke-dashoffset: 400; }
          to { stroke-dasharray: 400; stroke-dashoffset: 0; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(180px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(180px) rotate(-360deg); }
        }
        @keyframes orbit-reverse {
          from { transform: rotate(0deg) translateX(180px) rotate(0deg); }
          to { transform: rotate(-360deg) translateX(180px) rotate(360deg); }
        }
        
        .animate-blob { animation: blob 8s infinite ease-in-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 3.5s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-fade-in-right { animation: fade-in-right 1s ease-out; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-draw-line { animation: draw-line 1.5s ease-out 0.5s forwards; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-orbit { animation: orbit 20s linear infinite; }
        .animate-orbit-reverse { animation: orbit-reverse 25s linear infinite; }
        
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-700 { animation-delay: 0.7s; }
        .animation-delay-900 { animation-delay: 0.9s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1100 { animation-delay: 1.1s; }
        .animation-delay-1300 { animation-delay: 1.3s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </header>
  );
};

export default Hero;
