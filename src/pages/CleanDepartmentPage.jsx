import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaSearch, FaArrowLeft, FaUniversity, FaFilter, FaChevronDown, FaBook, FaSpinner } from 'react-icons/fa';
import { getProjectsByDepartment } from '../api/projectServices';

const CleanProjectCard = ({ project }) => {
  // Simple color classes for departments
  const getColorClass = (dept) => {
    const colors = {
      'Computer Science': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Electrical Engineering': 'bg-amber-100 text-amber-800 border-amber-200',
      'Mechanical Engineering': 'bg-red-100 text-red-800 border-red-200',
      'Civil Engineering': 'bg-purple-100 text-purple-800 border-purple-200',
      'Economics': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Business Administration': 'bg-blue-100 text-blue-800 border-blue-200',
      'Mass Communication': 'bg-pink-100 text-pink-800 border-pink-200',
    };
    return colors[dept] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass(project.department)}`}>
          {project.level || 'BSc'}
        </span>
        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
          <FaBook className="text-gray-500" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
        {project.title}
      </h3>

      <div className="space-y-2 mb-4">
        <div className="text-sm text-gray-600">
          By {project.author}
        </div>
        <div className="text-sm text-gray-600">
          {project.year || 'N/A'}
        </div>
      </div>

      <Link
        to={`/projects/${project.id}`}
        className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors"
      >
        View Details
      </Link>
    </div>
  );
};

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
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link
              to="/departments"
              className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors mr-4"
            >
              <FaArrowLeft className="mr-2" />
              Back to Departments
            </Link>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <FaUniversity className="text-gray-400 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">{decodedDeptName}</h1>
            </div>
            <p className="text-lg text-gray-600">
              {projects.length} projects available in {decodedDeptName}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden w-full flex items-center justify-between bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-gray-100 transition-colors mb-4"
          >
            <span className="flex items-center">
              <FaFilter className="mr-2" />
              Filters
            </span>
            <FaChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {searchTerm ? 'Search Results' : 'All Projects'}
          </h2>
          <p className="text-gray-600 mt-1">
            Showing <span className="font-medium">{filteredProjects.length}</span> {filteredProjects.length === 1 ? 'project' : 'projects'}
            {searchTerm && <span> matching "{searchTerm}"</span>}
          </p>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-3xl text-indigo-600" />
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => <CleanProjectCard key={project.id} project={project} />)}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaBook className="text-gray-400 text-xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No projects found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? `No projects match "${searchTerm}". Try a different search.`
                : 'No projects available in this department yet.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CleanDepartmentPage;