import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiChevronLeft, FiChevronRight, FiFilter, FiX } from 'react-icons/fi';
import { getAllProjects } from '../api/projectServices';

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
        <span>{project.pages || '?'} pages</span>
      </div>
    </Link>
  );
};

const ProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearchTerm = searchParams.get('search') || '';
  const initialDept = searchParams.get('department') || '';

  const [allProjects, setAllProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState(initialDept);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const PROJECTS_PER_PAGE = 20;

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await getAllProjects({ limit: 100 });
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

  // Update URL params when filters change
  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedDepartment) params.department = selectedDepartment;
    setSearchParams(params);
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment, setSearchParams]);

  const departments = useMemo(() => {
    return [...new Set(allProjects.map(p => p.department))].sort();
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    return allProjects.filter(p => {
      const matchesSearch = !searchTerm ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = !selectedDepartment || p.department === selectedDepartment;
      return matchesSearch && matchesDept;
    });
  }, [allProjects, searchTerm, selectedDepartment]);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);

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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-b border-gray-200 py-4 text-lg placeholder-gray-400 focus:border-gray-900 focus:outline-none transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
              >
                <FiX />
              </button>
            )}
          </div>

          {/* Filters Bar */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`text-sm font-medium flex items-center gap-2 transition-colors ${selectedDepartment ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <FiFilter className="w-4 h-4" />
                  {selectedDepartment || 'All Departments'}
                </button>

                {showFilters && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFilters(false)} />
                    <div className="absolute top-full left-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white border border-gray-100 rounded-lg shadow-lg z-20 py-2">
                      <button
                        onClick={() => { setSelectedDepartment(''); setShowFilters(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      >
                        All Departments
                      </button>
                      {departments.map(dept => (
                        <button
                          key={dept}
                          onClick={() => { setSelectedDepartment(dept); setShowFilters(false); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 hover:text-gray-900 ${selectedDepartment === dept ? 'text-gray-900 font-medium bg-gray-50' : 'text-gray-500'}`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="text-xs text-gray-400 font-mono">
              {filteredProjects.length} results
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-1 mb-16">
          {isLoading ? (
            <div className="py-20 text-center text-gray-400 text-sm">Loading library...</div>
          ) : paginatedProjects.length > 0 ? (
            paginatedProjects.map(project => (
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
          <div className="flex items-center justify-between border-t border-gray-100 pt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:hover:text-gray-500 flex items-center gap-2 transition-colors"
            >
              <FiChevronLeft /> Previous
            </button>
            <span className="text-xs text-gray-400 font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:hover:text-gray-500 flex items-center gap-2 transition-colors"
            >
              Next <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
