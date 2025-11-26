import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiSearch, FiArrowLeft, FiFilter, FiChevronDown, FiBook, FiLoader, FiUser, FiCalendar, FiFileText, FiCode } from 'react-icons/fi';
import { getProjectsByDepartment } from '../api/projectServices';

const CleanDepartmentPage = () => {
  const { departmentName } = useParams();
  const decodedDeptName = decodeURIComponent(departmentName);

  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchDepartmentProjects = async () => {
      setIsLoading(true);
      try {
        const response = await getProjectsByDepartment(decodedDeptName, {
          limit: 100
        });
        const fetchedProjects = response.documents.map(d => ({ id: d.$id, ...d }));
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching department projects: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDepartmentProjects();
  }, [decodedDeptName]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link
              to="/departments"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back to Departments
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                {decodedDeptName}
              </h1>
              <p className="text-lg text-gray-500">
                {projects.length} research projects available
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-96 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search within department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 focus:bg-white transition-all placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Info */}
        <div className="mb-8 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{filteredProjects.length}</span> results
          </p>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center text-sm font-medium text-gray-900"
          >
            <FiFilter className="mr-2" />
            Filters
            <FiChevronDown className={`ml-1 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <FiLoader className="animate-spin text-3xl text-gray-300" />
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group block bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-all hover:shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {project.level || 'BSc'}
                  </span>
                  {project.formats?.includes('PDF') ? (
                    <FiFileText className="text-gray-400" />
                  ) : (
                    <FiCode className="text-gray-400" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:underline decoration-1 underline-offset-4">
                  {project.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-500 mt-auto pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-1">
                    <FiUser className="w-3 h-3" />
                    <span className="truncate max-w-[100px]">{project.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-3 h-3" />
                    <span>{project.year || 'N/A'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-gray-200 rounded-lg">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBook className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No projects found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? `No projects match "${searchTerm}" in this department.`
                : 'No projects available in this department yet.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm font-medium text-gray-900 underline hover:text-gray-600"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CleanDepartmentPage;