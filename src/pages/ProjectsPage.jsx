
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilePdf, FaCode, FaChevronRight, FaBook, FaSpinner, FaUniversity, FaFilter, FaStar, FaCalendar, FaUser, FaDownload, FaEye, FaGraduationCap } from 'react-icons/fa';
import { db } from '../firebase/config'; // Your Firebase config
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';


const departmentColors = {
  'Computer Science': { border: 'border-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-700', icon: 'bg-gradient-to-br from-indigo-500 to-blue-600' },
  'Electrical Engineering': { border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', icon: 'bg-gradient-to-br from-amber-500 to-orange-600' },
  'Economics': { border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'bg-gradient-to-br from-emerald-500 to-green-600' },
  'Mechanical Engineering': { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-700', icon: 'bg-gradient-to-br from-red-500 to-rose-600' },
  'Civil Engineering': { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-700', icon: 'bg-gradient-to-br from-purple-500 to-fuchsia-600' },
  'Business Administration': { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', icon: 'bg-gradient-to-br from-blue-500 to-cyan-600' },
  'Mass Communication': { border: 'border-pink-500', bg: 'bg-pink-50', text: 'text-pink-700', icon: 'bg-gradient-to-br from-pink-500 to-rose-600' },
};

const defaultColors = { border: 'border-slate-400', bg: 'bg-slate-50', text: 'text-slate-700', icon: 'bg-gradient-to-br from-slate-500 to-slate-600' };

const ProjectCard = ({ project }) => {
  const colors = departmentColors[project.department] || defaultColors;
  
  return (
    <div className={`group bg-white rounded-2xl border-2 ${colors.border} border-opacity-20 hover:border-opacity-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col`}>
      {/* Top accent bar */}
      <div className={`h-2 ${colors.icon}`}></div>
      
      <div className="p-6 flex-grow">
        {/* Department badge */}
        <div className="flex justify-between items-start mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${colors.bg} ${colors.text} rounded-lg text-xs font-bold uppercase tracking-wide`}>
            <FaUniversity className="text-xs" />
            {project.department}
          </span>
          <div className={`w-10 h-10 ${colors.icon} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {project.formats?.includes('PDF') ? (
              <FaFilePdf className="text-white text-lg" />
            ) : (
              <FaCode className="text-white text-lg" />
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight line-clamp-2 group-hover:text-indigo-700 transition-colors">
          {project.title}
        </h3>

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <FaUser className="text-slate-400 text-xs" />
            <span className="font-medium">{project.author}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <FaCalendar className="text-slate-400 text-xs" />
            <span>{project.year || 'N/A'}</span>
          </div>
        </div>

        {/* Rating (if available) */}
        {project.rating && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={`text-sm ${i < project.rating ? 'text-yellow-400' : 'text-slate-200'}`} />
            ))}
            <span className="text-xs text-slate-500 ml-1">({project.rating}.0)</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <Link 
          to={`/projects/${project.id}`} 
          className={`w-full flex items-center justify-center gap-2 ${colors.icon} text-white font-bold px-4 py-3 rounded-xl hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]`}
        >
          <FaEye />
          <span>View Details</span>
        </Link>
      </div>
    </div>
  );
};

const ProjectsPage = () => {
  const [searchParams] = useSearchParams();
  const initialSearchTerm = searchParams.get('search') || '';

  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all projects on initial load.
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Effect to filter projects
  useEffect(() => {
    let projectsToFilter = [...allProjects];

    if (searchTerm) {
      projectsToFilter = projectsToFilter.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(projectsToFilter);
  }, [searchTerm, allProjects]);

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const departments = useMemo(() => {
    const uniqueDepartments = [...new Set(allProjects.map(p => p.department))];
    return uniqueDepartments.sort();
  }, [allProjects]);

  const filteredDepartments = departments.filter(dept =>
    dept.toLowerCase().includes(departmentSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="projects-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#projects-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <FaGraduationCap className="text-white" />
              <span className="text-white text-sm font-bold">10,000+ Academic Projects</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Explore Our Project Library
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              Discover comprehensive academic research materials from top institutions across Nigeria. 
              All projects are peer-reviewed and verified for quality.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-10">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-white">{allProjects.length.toLocaleString()}+</div>
                <div className="text-sm text-indigo-200 mt-1">Total Projects</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-white">{departments.length}+</div>
                <div className="text-sm text-indigo-200 mt-1">Departments</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-white">100%</div>
                <div className="text-sm text-indigo-200 mt-1">Verified</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Departments Filter */}
              <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaUniversity />
                    Departments
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="mb-4 relative">
                    <input
                      type="text"
                      placeholder="Search departments..."
                      value={departmentSearchTerm}
                      onChange={(e) => setDepartmentSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-10 text-sm rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-slate-50"
                    />
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto space-y-1 custom-scrollbar">
                    {filteredDepartments.map(dept => {
                      const colors = departmentColors[dept] || defaultColors;
                      const count = allProjects.filter(p => p.department === dept).length;
                      
                      return (
                        <Link 
                          key={dept}
                          to={`/department/${encodeURIComponent(dept)}`} 
                          className={`flex justify-between items-center font-semibold text-slate-700 hover:${colors.text} hover:${colors.bg} p-3 rounded-xl transition-all duration-200 group`}
                        >
                          <span className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${colors.icon}`}></div>
                            <span className="text-sm">{dept}</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 group-hover:text-slate-700">({count})</span>
                            <FaChevronRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <Link 
                      to="/departments" 
                      className="flex items-center justify-center gap-2 font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 py-2 rounded-lg transition-colors"
                    >
                      <span>View All Departments</span>
                      <FaChevronRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <FaStar className="text-yellow-300" />
                  Quick Stats
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-100">Projects Found:</span>
                    <span className="font-bold">{filteredProjects.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-100">Departments:</span>
                    <span className="font-bold">{departments.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-100">Latest Year:</span>
                    <span className="font-bold">{new Date().getFullYear()}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <FaFilter />
              <span>Filter by Department</span>
              <span className="ml-auto bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-bold">
                {departments.length}
              </span>
            </button>

            {showFilters && (
              <div className="mt-4 bg-white rounded-2xl border-2 border-slate-100 p-4 shadow-lg">
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={departmentSearchTerm}
                  onChange={(e) => setDepartmentSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 text-sm rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-3"
                />
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {filteredDepartments.map(dept => (
                    <Link 
                      key={dept}
                      to={`/department/${encodeURIComponent(dept)}`} 
                      className="flex justify-between items-center p-3 rounded-lg hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 transition-colors"
                      onClick={() => setShowFilters(false)}
                    >
                      <span className="text-sm font-medium">{dept}</span>
                      <FaChevronRight className="text-xs" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search Bar */}
            <div className="mb-8 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 group-focus-within:opacity-30 transition duration-300"></div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by project title, author, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-5 pl-14 rounded-2xl text-slate-800 bg-white border-2 border-slate-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent font-medium placeholder:text-slate-400"
                />
                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {searchTerm ? 'Search Results' : 'All Projects'}
                </h2>
                <p className="text-slate-600 mt-1">
                  Found <span className="font-bold text-indigo-600">{filteredProjects.length}</span> {filteredProjects.length === 1 ? 'project' : 'projects'}
                  {searchTerm && <span> for "{searchTerm}"</span>}
                </p>
              </div>
            </div>

            {/* Projects Grid */}
            {isLoading ? (
              <div className="flex flex-col justify-center items-center py-32">
                <FaSpinner className="animate-spin text-5xl text-indigo-600 mb-4" />
                <p className="text-slate-600 font-medium">Loading projects...</p>
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProjects.map(project => <ProjectCard key={project.id} project={project} />)}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-slate-100 shadow-lg">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaBook className="text-4xl text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No Projects Found</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  {searchTerm 
                    ? `We couldn't find any projects matching "${searchTerm}". Try adjusting your search.`
                    : 'No projects available at the moment. Please check back later.'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ProjectsPage;
