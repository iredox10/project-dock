import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSearch, FaBook, FaSpinner, FaChevronRight, FaTimes, FaFilter, FaChevronDown, FaFileAlt } from 'react-icons/fa';
import { getAllProjects } from '../api/projectServices';

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="block bg-white border border-gray-200 rounded-lg p-5 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="inline-block px-2.5 py-0.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-full">
          {project.department}
        </span>
        <span className="text-xs text-gray-500">{project.year || 'N/A'}</span>
      </div>

      <h3 className="text-sm font-semibold text-gray-900 mb-4 leading-relaxed group-hover:text-indigo-600 transition-colors min-h-[60px]">
        {project.title}
      </h3>

      <div className="flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <FaFileAlt className="text-gray-400" />
          <span>{project.pages || 'N/A'} pages</span>
        </div>
        <FaChevronRight className="text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
};

const ProjectsPage = () => {
  const [searchParams] = useSearchParams();
  const initialSearchTerm = searchParams.get('search') || '';

  const [allProjects, setAllProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDepartmentFilter, setShowDepartmentFilter] = useState(false);
  const [departmentSearch, setDepartmentSearch] = useState('');

  const PROJECTS_PER_PAGE = 24;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDepartmentFilter && !event.target.closest('.department-filter-container')) {
        setShowDepartmentFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDepartmentFilter]);

  // Fetch all projects on initial load
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await getAllProjects({
          limit: 100
        });

        const fetchedProjects = response.documents.map(doc => ({
          id: doc.$id,
          ...doc
        }));

        setAllProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment]);

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  // Get unique departments
  const departments = useMemo(() => {
    const uniqueDepartments = [...new Set(allProjects.map(p => p.department))];
    return uniqueDepartments.sort();
  }, [allProjects]);

  // Filter departments based on search
  const filteredDepartments = useMemo(() => {
    if (!departmentSearch) return departments;
    return departments.filter(dept =>
      dept.toLowerCase().includes(departmentSearch.toLowerCase())
    );
  }, [departments, departmentSearch]);

  // Filter projects based on search and department
  const filteredProjects = useMemo(() => {
    let projectsToFilter = [...allProjects];

    if (selectedDepartment) {
      projectsToFilter = projectsToFilter.filter(p => p.department === selectedDepartment);
    }

    if (searchTerm) {
      projectsToFilter = projectsToFilter.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return projectsToFilter;
  }, [allProjects, searchTerm, selectedDepartment]);

  // Pagination for filtered projects
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  // Calculate page count
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Explore Projects</h1>
            <p className="text-lg text-gray-600">
              Discover {allProjects.length.toLocaleString()}+ academic research projects
            </p>
          </div>

          {/* Search Bar with Filter */}
          <div className="max-w-4xl mx-auto relative">
            <div className="flex gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects by title or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              {/* Department Filter Button */}
              <div className="relative department-filter-container">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowDepartmentFilter(!showDepartmentFilter);
                  }}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-3.5 border rounded-lg font-medium transition-all whitespace-nowrap ${selectedDepartment
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <FaFilter className="flex-shrink-0" />
                  <span className="text-sm sm:text-base">
                    {selectedDepartment ? (
                      <span className="hidden sm:inline">{selectedDepartment}</span>
                    ) : (
                      'Filter'
                    )}
                  </span>
                  <FaChevronDown className={`text-xs transition-transform flex-shrink-0 ${showDepartmentFilter ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showDepartmentFilter && (
                  <>
                    {/* Backdrop for mobile */}
                    <div
                      className="fixed inset-0 bg-black/20 z-40 md:hidden"
                      onClick={() => setShowDepartmentFilter(false)}
                    />

                    {/* Dropdown */}
                    <div className="fixed md:absolute left-4 right-4 md:left-auto md:right-0 top-auto bottom-4 md:bottom-auto md:top-full mt-0 md:mt-2 w-auto md:w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[70vh] md:max-h-96 flex flex-col">
                      <div className="p-3 border-b border-gray-200 flex-shrink-0">
                        <div className="relative">
                          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                          <input
                            type="text"
                            placeholder="Search departments..."
                            value={departmentSearch}
                            onChange={(e) => setDepartmentSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <div className="overflow-y-auto p-2 flex-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedDepartment('');
                            setShowDepartmentFilter(false);
                            setDepartmentSearch('');
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-md transition-colors ${!selectedDepartment
                              ? 'bg-indigo-50 text-indigo-700 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          All Departments
                        </button>
                        {filteredDepartments.length > 0 ? (
                          filteredDepartments.map(dept => (
                            <button
                              key={dept}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedDepartment(dept);
                                setShowDepartmentFilter(false);
                                setDepartmentSearch('');
                              }}
                              className={`w-full text-left px-4 py-2.5 rounded-md transition-colors ${selectedDepartment === dept
                                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                                  : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                              {dept}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            No departments found
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Results Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{paginatedProjects.length}</span> of <span className="font-semibold text-gray-900">{filteredProjects.length}</span> {filteredProjects.length === 1 ? 'project' : 'projects'}
            {searchTerm && <span> matching "{searchTerm}"</span>}
            {selectedDepartment && <span> in {selectedDepartment}</span>}
          </p>
          {(searchTerm || selectedDepartment) && (
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />
            <p className="text-gray-600">Loading projects...</p>
          </div>
        ) : paginatedProjects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginatedProjects.map(project => <ProjectCard key={project.id} project={project} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    First
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {(() => {
                      const pages = [];
                      const maxVisible = 5;
                      let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                      let endPage = Math.min(totalPages, startPage + maxVisible - 1);

                      if (endPage - startPage < maxVisible - 1) {
                        startPage = Math.max(1, endPage - maxVisible + 1);
                      }

                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === i
                                ? 'bg-indigo-600 text-white'
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            {i}
                          </button>
                        );
                      }

                      return pages;
                    })()}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Last
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FaBook className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedDepartment
                ? "We couldn't find any projects matching your criteria. Try adjusting your filters."
                : 'No projects available at the moment.'}
            </p>
            {(searchTerm || selectedDepartment) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
