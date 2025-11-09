
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUniversity, FaSpinner, FaBook, FaGraduationCap, FaChevronRight, FaLaptopCode, FaFlask, FaCalculator, FaChartLine, FaBuilding, FaNewspaper, FaHeart, FaBriefcase } from 'react-icons/fa';
import { db } from '../firebase/config';
import { collection, getDocs, query } from 'firebase/firestore';

// Department icon mapping
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

// Department color schemes
const departmentColors = {
  'Computer Science': { 
    gradient: 'from-indigo-500 to-blue-600', 
    bg: 'bg-indigo-50', 
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    hover: 'hover:border-indigo-400'
  },
  'Electrical Engineering': { 
    gradient: 'from-amber-500 to-orange-600', 
    bg: 'bg-amber-50', 
    border: 'border-amber-200',
    text: 'text-amber-700',
    hover: 'hover:border-amber-400'
  },
  'Economics': { 
    gradient: 'from-emerald-500 to-green-600', 
    bg: 'bg-emerald-50', 
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    hover: 'hover:border-emerald-400'
  },
  'Mechanical Engineering': { 
    gradient: 'from-red-500 to-rose-600', 
    bg: 'bg-red-50', 
    border: 'border-red-200',
    text: 'text-red-700',
    hover: 'hover:border-red-400'
  },
  'Civil Engineering': { 
    gradient: 'from-purple-500 to-fuchsia-600', 
    bg: 'bg-purple-50', 
    border: 'border-purple-200',
    text: 'text-purple-700',
    hover: 'hover:border-purple-400'
  },
  'Business Administration': { 
    gradient: 'from-blue-500 to-cyan-600', 
    bg: 'bg-blue-50', 
    border: 'border-blue-200',
    text: 'text-blue-700',
    hover: 'hover:border-blue-400'
  },
  'Mass Communication': { 
    gradient: 'from-pink-500 to-rose-600', 
    bg: 'bg-pink-50', 
    border: 'border-pink-200',
    text: 'text-pink-700',
    hover: 'hover:border-pink-400'
  },
};

const defaultColors = { 
  gradient: 'from-slate-500 to-slate-600', 
  bg: 'bg-slate-50', 
  border: 'border-slate-200',
  text: 'text-slate-700',
  hover: 'hover:border-slate-400'
};

const DepartmentCard = ({ name, count }) => {
  const Icon = departmentIcons[name] || FaUniversity;
  const colors = departmentColors[name] || defaultColors;

  return (
    <Link
      to={`/department/${encodeURIComponent(name)}`}
      className={`group relative block bg-white rounded-2xl border-2 ${colors.border} ${colors.hover} shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden`}
    >
      {/* Gradient accent bar */}
      <div className={`h-2 bg-gradient-to-r ${colors.gradient}`}></div>

      <div className="p-8">
        {/* Icon and count */}
        <div className="flex items-start justify-between mb-6">
          <div className={`w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
            <Icon className="text-white text-2xl" />
          </div>
          <div className={`${colors.bg} ${colors.text} px-4 py-2 rounded-xl font-bold text-sm`}>
            {count} {count === 1 ? 'Project' : 'Projects'}
          </div>
        </div>

        {/* Department name */}
        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors leading-tight min-h-[4rem]">
          {name}
        </h3>

        {/* CTA */}
        <div className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-4 transition-all">
          <span>Explore Projects</span>
          <FaChevronRight className="text-sm group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Hover overlay */}
      <div className={`absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}></div>
    </Link>
  );
};


const AllDepartmentsPage = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const DEPARTMENTS_PER_PAGE = 12;

  // Fetch all projects to aggregate department data
  useEffect(() => {
    const fetchAllProjects = async () => {
      setIsLoading(true);
      try {
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef);
        const querySnapshot = await getDocs(q);
        const fetchedProjects = querySnapshot.docs.map(doc => doc.data());
        setAllProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching all projects for department aggregation: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllProjects();
  }, []);


  const departments = useMemo(() => {
    if (isLoading) return [];
    const departmentCounts = allProjects.reduce((acc, project) => {
      acc[project.department] = (acc[project.department] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(departmentCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // Sort by count (most projects first)
  }, [allProjects, isLoading]);

  const filteredDepartments = useMemo(() => {
    return departments.filter(dept => dept.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [departments, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredDepartments.length / DEPARTMENTS_PER_PAGE);
  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * DEPARTMENTS_PER_PAGE,
    currentPage * DEPARTMENTS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dept-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dept-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <FaGraduationCap className="text-white" />
              <span className="text-white text-sm font-bold">Academic Excellence Hub</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Explore Academic Departments
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Browse our comprehensive collection of academic projects organized by department. 
              Find the perfect resources for your field of study.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-white">{departments.length}</div>
                <div className="text-sm text-indigo-200 mt-1">Departments</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-white">{allProjects.length.toLocaleString()}</div>
                <div className="text-sm text-indigo-200 mt-1">Total Projects</div>
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
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-12 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 group-focus-within:opacity-30 transition duration-300"></div>
          <div className="relative">
            <input
              type="text"
              placeholder={`Search from ${departments.length} departments...`}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {searchTerm ? 'Search Results' : 'All Departments'}
          </h2>
          <p className="text-slate-600 mt-1">
            Showing <span className="font-bold text-indigo-600">{filteredDepartments.length}</span> {filteredDepartments.length === 1 ? 'department' : 'departments'}
            {searchTerm && <span> matching "{searchTerm}"</span>}
          </p>
        </div>

        {/* Departments Grid */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <FaSpinner className="animate-spin text-5xl text-indigo-600 mb-4" />
            <p className="text-slate-600 font-medium">Loading departments...</p>
          </div>
        ) : paginatedDepartments.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedDepartments.map(dept => <DepartmentCard key={dept.name} {...dept} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-slate-100 shadow-lg">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUniversity className="text-4xl text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Departments Found</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `We couldn't find any departments matching "${searchTerm}". Try adjusting your search.`
                : 'No departments available at the moment.'}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-6 py-3 font-bold bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <FaChevronRight className="rotate-180" />
              <span>Previous</span>
            </button>
            
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                // Show first, last, current, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 font-bold rounded-lg transition-all ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
                          : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="text-slate-400">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-6 py-3 font-bold bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span>Next</span>
              <FaChevronRight />
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="cta-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill="white"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-pattern)" />
            </svg>
          </div>

          <div className="relative">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
              Can't Find Your Department?
            </h3>
            <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
              We're constantly adding new departments and projects. Contact us to request your department.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <span>Contact Us</span>
                <FaChevronRight />
              </Link>
              <Link 
                to="/projects"
                className="inline-flex items-center justify-center gap-2 bg-indigo-800 text-white font-bold px-8 py-4 rounded-xl border-2 border-white/20 hover:bg-indigo-900 hover:scale-105 transition-all"
              >
                <FaBook />
                <span>Browse All Projects</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllDepartmentsPage;
