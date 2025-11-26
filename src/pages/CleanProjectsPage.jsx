import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiChevronLeft, FiChevronRight, FiFilter, FiX, FiLoader, FiBook } from 'react-icons/fi';
import { getAllProjects, getUniqueDepartments } from '../api/projectServices';

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="block group py-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors -mx-4 px-4 rounded-lg"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
        <h3 className="text-base font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
          {project.title}
        </h3>
        <span className="text-xs text-gray-400 font-mono flex-shrink-0">
          {project.year || 'N/A'}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="font-medium text-gray-900">{project.department}</span>
        <span>•</span>
        <span className="font-medium text-gray-900">{project.level || 'BSc'}</span>
        <span>•</span>
        <span>{project.pages || '?'} pages</span>
      </div>
    </Link>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
      >
        <FiChevronLeft /> Previous
      </button>

      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="text-gray-400 text-sm px-2">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors ${currentPage === page
                    ? 'bg-gray-900 text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
      >
        Next <FiChevronRight />
      </button>
    </div>
  );
};

const ProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearchTerm = searchParams.get('search') || '';
  const initialDept = searchParams.get('department') || '';
  const initialLevel = searchParams.get('level') || '';
  const initialPage = parseInt(searchParams.get('page')) || 1;

  const [projects, setProjects] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState(initialDept);
  const [selectedLevel, setSelectedLevel] = useState(initialLevel);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showDeptFilters, setShowDeptFilters] = useState(false);
  const [showLevelFilters, setShowLevelFilters] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [deptSearchTerm, setDeptSearchTerm] = useState('');

  const PROJECTS_PER_PAGE = 20;
  const LEVELS = ['BSc', 'MSc', 'HND', 'ND', 'PhD'];

  // Fetch departments from DB on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const depts = await getUniqueDepartments();
        setDepartments(depts);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  // Filter departments based on search
  const filteredDepartments = useMemo(() => {
    if (!deptSearchTerm) return departments;
    return departments.filter(dept =>
      dept.toLowerCase().includes(deptSearchTerm.toLowerCase())
    );
  }, [departments, deptSearchTerm]);

  // Fetch projects when params change
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const offset = (currentPage - 1) * PROJECTS_PER_PAGE;
        const response = await getAllProjects({
          limit: PROJECTS_PER_PAGE,
          offset: offset,
          search: searchTerm,
          department: selectedDepartment,
          level: selectedLevel
        });

        const fetchedProjects = response.documents.map(doc => ({
          id: doc.$id,
          ...doc
        }));

        setProjects(fetchedProjects);
        setTotalProjects(response.total);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search to avoid excessive API calls
    const timeoutId = setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm, selectedDepartment, selectedLevel]);

  // Update URL params
  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedDepartment) params.department = selectedDepartment;
    if (selectedLevel) params.level = selectedLevel;
    if (currentPage > 1) params.page = currentPage;
    setSearchParams(params);
  }, [searchTerm, selectedDepartment, selectedLevel, currentPage, setSearchParams]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleDepartmentChange = (dept) => {
    setSelectedDepartment(dept);
    setShowDeptFilters(false);
    setCurrentPage(1); // Reset to first page on filter
  };

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    setShowLevelFilters(false);
    setCurrentPage(1); // Reset to first page on filter
  };

  const totalPages = Math.ceil(totalProjects / PROJECTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header & Search */}
        <div className="mb-16">
          <h1 className="text-3xl font-semibold tracking-tight mb-8">Library</h1>

          <div className="relative">
            <input
              type="text"
              placeholder="Search for projects..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-transparent border-b border-gray-200 py-4 text-lg placeholder-gray-400 focus:border-gray-900 focus:outline-none transition-colors"
            />
            {searchTerm ? (
              <button
                onClick={() => handleSearchChange({ target: { value: '' } })}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
              >
                <FiX />
              </button>
            ) : (
              <FiSearch className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" />
            )}
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 gap-4">
            <div className="flex items-center gap-4">

              {/* Department Filter */}
              <div className="relative">
                <button
                  onClick={() => { setShowDeptFilters(!showDeptFilters); setShowLevelFilters(false); }}
                  className={`text-sm font-medium flex items-center gap-2 transition-colors ${selectedDepartment ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <FiFilter className="w-4 h-4" />
                  {selectedDepartment || 'All Departments'}
                </button>

                {showDeptFilters && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDeptFilters(false)} />
                    <div className="absolute top-full left-0 mt-2 w-72 max-h-96 overflow-hidden bg-white border border-gray-100 rounded-lg shadow-lg z-20 flex flex-col">
                      <div className="p-2 border-b border-gray-50 sticky top-0 bg-white">
                        <div className="relative">
                          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
                          <input
                            type="text"
                            placeholder="Find department..."
                            value={deptSearchTerm}
                            onChange={(e) => setDeptSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded text-xs focus:outline-none focus:border-gray-300"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="overflow-y-auto flex-1 py-1">
                        <button
                          onClick={() => handleDepartmentChange('')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        >
                          All Departments
                        </button>
                        {filteredDepartments.map(dept => (
                          <button
                            key={dept}
                            onClick={() => handleDepartmentChange(dept)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 hover:text-gray-900 ${selectedDepartment === dept ? 'text-gray-900 font-medium bg-gray-50' : 'text-gray-500'}`}
                          >
                            {dept}
                          </button>
                        ))}
                        {filteredDepartments.length === 0 && (
                          <div className="px-4 py-3 text-xs text-gray-400 text-center">
                            No departments found
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Level Filter */}
              <div className="relative">
                <button
                  onClick={() => { setShowLevelFilters(!showLevelFilters); setShowDeptFilters(false); }}
                  className={`text-sm font-medium flex items-center gap-2 transition-colors ${selectedLevel ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <FiBook className="w-4 h-4" />
                  {selectedLevel || 'All Levels'}
                </button>

                {showLevelFilters && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowLevelFilters(false)} />
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-20 py-2">
                      <button
                        onClick={() => handleLevelChange('')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      >
                        All Levels
                      </button>
                      {LEVELS.map(level => (
                        <button
                          key={level}
                          onClick={() => handleLevelChange(level)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 hover:text-gray-900 ${selectedLevel === level ? 'text-gray-900 font-medium bg-gray-50' : 'text-gray-500'}`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="text-xs text-gray-400 font-mono">
              {totalProjects} results
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-1 mb-16 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FiLoader className="w-8 h-8 animate-spin mb-4" />
              <span className="text-sm">Loading library...</span>
            </div>
          ) : projects.length > 0 ? (
            projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="py-20 text-center text-gray-400 text-sm">
              No projects found matching your criteria.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
