
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { FaFilePdf, FaCode, FaBook, FaSearch, FaArrowLeft, FaSpinner, FaUniversity, FaGraduationCap, FaFilter, FaCalendar, FaUser, FaEye, FaStar, FaChevronDown, FaLaptopCode, FaFlask, FaChartLine, FaBriefcase, FaNewspaper, FaHeart, FaBuilding, FaCalculator } from 'react-icons/fa';
import { getProjectsByDepartment } from '../api/projectServices';

// Department icon mapping (same as AllDepartmentsPage)
const departmentIcons = {
  'Computer Science': FaLaptopCode,
  'Electrical Engineering': FaFlask,
  'Mechanical Engineering': FaFlask,
  'Civil Engineering': FaBuilding,
  'Economics': FaChartLine,
  'Business Administration': FaBriefcase,
  'Mass Communication': FaNewspaper,
  'Nursing': FaHeart,
  'Mathematics': FaCalculator,
};

// Department color schemes (same as AllDepartmentsPage)
const departmentColors = {
  'Computer Science': { 
    gradient: 'from-indigo-500 to-blue-600', 
    bg: 'bg-indigo-50', 
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    buttonBg: 'bg-gradient-to-r from-indigo-600 to-blue-600'
  },
  'Electrical Engineering': { 
    gradient: 'from-amber-500 to-orange-600', 
    bg: 'bg-amber-50', 
    border: 'border-amber-200',
    text: 'text-amber-700',
    buttonBg: 'bg-gradient-to-r from-amber-600 to-orange-600'
  },
  'Economics': { 
    gradient: 'from-emerald-500 to-green-600', 
    bg: 'bg-emerald-50', 
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    buttonBg: 'bg-gradient-to-r from-emerald-600 to-green-600'
  },
  'Mechanical Engineering': { 
    gradient: 'from-red-500 to-rose-600', 
    bg: 'bg-red-50', 
    border: 'border-red-200',
    text: 'text-red-700',
    buttonBg: 'bg-gradient-to-r from-red-600 to-rose-600'
  },
  'Civil Engineering': { 
    gradient: 'from-purple-500 to-fuchsia-600', 
    bg: 'bg-purple-50', 
    border: 'border-purple-200',
    text: 'text-purple-700',
    buttonBg: 'bg-gradient-to-r from-purple-600 to-fuchsia-600'
  },
  'Business Administration': { 
    gradient: 'from-blue-500 to-cyan-600', 
    bg: 'bg-blue-50', 
    border: 'border-blue-200',
    text: 'text-blue-700',
    buttonBg: 'bg-gradient-to-r from-blue-600 to-cyan-600'
  },
  'Mass Communication': { 
    gradient: 'from-pink-500 to-rose-600', 
    bg: 'bg-pink-50', 
    border: 'border-pink-200',
    text: 'text-pink-700',
    buttonBg: 'bg-gradient-to-r from-pink-600 to-rose-600'
  },
};

const defaultColors = { 
  gradient: 'from-slate-500 to-slate-600', 
  bg: 'bg-slate-50', 
  border: 'border-slate-200',
  text: 'text-slate-700',
  buttonBg: 'bg-gradient-to-r from-slate-600 to-slate-700'
};

const ProjectCard = ({ project, deptColors }) => (
  <div className={`group bg-white rounded-2xl border-2 ${deptColors.border} border-opacity-20 hover:border-opacity-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col`}>
    {/* Top accent bar */}
    <div className={`h-2 bg-gradient-to-r ${deptColors.gradient}`}></div>
    
    <div className="p-6 flex-grow">
      {/* Level badge and format icon */}
      <div className="flex justify-between items-start mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${deptColors.bg} ${deptColors.text} rounded-lg text-xs font-bold uppercase tracking-wide`}>
          <FaGraduationCap className="text-xs" />
          {project.level || 'BSc'}
        </span>
        <div className={`w-10 h-10 bg-gradient-to-br ${deptColors.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {project.formats?.includes('PDF') ? (
            <FaFilePdf className="text-white text-lg" />
          ) : (
            <FaCode className="text-white text-lg" />
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-indigo-700 transition-colors min-h-[3.5rem]">
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
        className={`w-full flex items-center justify-center gap-2 ${deptColors.buttonBg} text-white font-bold px-4 py-3 rounded-xl hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]`}
      >
        <FaEye />
        <span>View Details</span>
      </Link>
    </div>
  </div>
);

const DepartmentPage = () => {
  const { departmentName } = useParams();
  const [searchParams] = useSearchParams();
  const decodedDeptName = decodeURIComponent(departmentName);

  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [levelFilter, setLevelFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const PROJECTS_PER_PAGE = 12;

  const deptColors = departmentColors[decodedDeptName] || defaultColors;
  const DeptIcon = departmentIcons[decodedDeptName] || FaUniversity;

  const fetchDepartmentProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getProjectsByDepartment(decodedDeptName, {
        limit: PROJECTS_PER_PAGE
      });
      const fetchedProjects = response.documents.map(d => ({ id: d.$id, ...d }));
      setProjects(fetchedProjects);
      setLastVisible(fetchedProjects[fetchedProjects.length - 1]?.$id || null);
      setHasMore(fetchedProjects.length === PROJECTS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching department projects: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [decodedDeptName]);

  useEffect(() => {
    fetchDepartmentProjects();
  }, [fetchDepartmentProjects]);

  // Update search term when URL parameter changes
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam !== null) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  const fetchMoreProjects = async () => {
    if (!hasMore || !lastVisible) return;
    setIsMoreLoading(true);
    try {
      const offset = projects.length;
      const response = await getProjectsByDepartment(decodedDeptName, {
        limit: PROJECTS_PER_PAGE,
        offset: offset
      });
      const newProjects = response.documents.map(d => ({ id: d.$id, ...d }));
      setProjects(prev => [...prev, ...newProjects]);
      setLastVisible(newProjects[newProjects.length - 1]?.$id || null);
      setHasMore(newProjects.length === PROJECTS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching more projects: ", error);
    } finally {
      setIsMoreLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p =>
      (p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (levelFilter === 'All' || p.level === levelFilter) &&
      (yearFilter === 'All' || p.year === parseInt(yearFilter))
    );
  }, [projects, searchTerm, levelFilter, yearFilter]);

  const availableLevels = useMemo(() => [...new Set(projects.map(p => p.level).filter(Boolean))], [projects]);
  const availableYears = useMemo(() => [...new Set(projects.map(p => p.year).filter(Boolean))].sort((a, b) => b - a), [projects]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Header */}
      <div className={`bg-gradient-to-br ${deptColors.gradient} relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dept-detail-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dept-detail-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative">
          {/* Back button */}
          <Link 
            to="/departments" 
            className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold mb-8 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
          >
            <FaArrowLeft />
            <span>Back to Departments</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              {/* Department icon and name */}
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border-2 border-white/30">
                  <DeptIcon className="text-white text-4xl md:text-5xl" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 mb-3">
                    <FaUniversity className="text-white text-xs" />
                    <span className="text-white text-xs font-bold uppercase tracking-wide">Department</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                    {decodedDeptName}
                  </h1>
                </div>
              </div>

              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
                Explore our comprehensive collection of verified academic projects and research materials in {decodedDeptName}.
              </p>
            </div>

            {/* Stats Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 text-lg">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Total Projects:</span>
                  <span className="text-white font-bold text-xl">{projects.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Filtered Results:</span>
                  <span className="text-white font-bold text-xl">{filteredProjects.length}</span>
                </div>
                {availableYears.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">Latest Year:</span>
                    <span className="text-white font-bold text-xl">{availableYears[0]}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-30 group-focus-within:opacity-30 transition duration-300"></div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search projects by title or author..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent font-medium placeholder:text-slate-400"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`lg:hidden w-full flex items-center justify-between gap-2 ${deptColors.bg} ${deptColors.text} font-bold px-4 py-3 rounded-xl mb-4 transition-all`}
          >
            <div className="flex items-center gap-2">
              <FaFilter />
              <span>Filters</span>
            </div>
            <FaChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Level</label>
                <select 
                  value={levelFilter} 
                  onChange={e => setLevelFilter(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent font-medium"
                >
                  <option value="All">All Levels</option>
                  {availableLevels.map(level => <option key={level} value={level}>{level}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Year</label>
                <select 
                  value={yearFilter} 
                  onChange={e => setYearFilter(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent font-medium"
                >
                  <option value="All">All Years</option>
                  {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
              {(levelFilter !== 'All' || yearFilter !== 'All') && (
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setLevelFilter('All');
                      setYearFilter('All');
                    }}
                    className="px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors whitespace-nowrap"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {searchTerm || levelFilter !== 'All' || yearFilter !== 'All' ? 'Filtered Results' : 'All Projects'}
          </h2>
          <p className="text-slate-600 mt-1">
            Showing <span className={`font-bold ${deptColors.text}`}>{filteredProjects.length}</span> {filteredProjects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <FaSpinner className="animate-spin text-5xl text-indigo-600 mb-4" />
            <p className="text-slate-600 font-medium">Loading projects...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProjects.map(project => <ProjectCard key={project.id} project={project} deptColors={deptColors} />)}
            </div>

            {/* Load More Button */}
            {hasMore && !isLoading && (
              <div className="mt-12 flex justify-center">
                <button 
                  onClick={fetchMoreProjects} 
                  disabled={isMoreLoading} 
                  className={`${deptColors.buttonBg} text-white font-bold px-10 py-4 rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3`}
                >
                  {isMoreLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <FaChevronDown />
                      <span>Load More Projects</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-slate-100 shadow-lg">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBook className="text-4xl text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Projects Found</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              {searchTerm || levelFilter !== 'All' || yearFilter !== 'All'
                ? 'No projects match your search criteria. Try adjusting your filters.'
                : 'There are no projects available in this department yet.'}
            </p>
            {(searchTerm || levelFilter !== 'All' || yearFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setLevelFilter('All');
                  setYearFilter('All');
                }}
                className={`${deptColors.buttonBg} text-white font-bold px-8 py-3 rounded-xl hover:shadow-xl transition-all`}
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentPage;