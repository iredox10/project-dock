import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilePdf, FaBook, FaSpinner, FaUniversity, FaFilter, FaStar, FaCalendar, FaUser, FaChevronDown } from 'react-icons/fa';
import { getAllProjects } from '../api/projectServices';

const ProjectCard = ({ project }) => {
  const getDepartmentColor = (dept) => {
    const colors = {
      'Computer Science': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Electrical Engineering': 'bg-amber-100 text-amber-800 border-amber-200',
      'Economics': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Mechanical Engineering': 'bg-red-100 text-red-800 border-red-200',
      'Civil Engineering': 'bg-purple-100 text-purple-800 border-purple-200',
      'Business Administration': 'bg-blue-100 text-blue-800 border-blue-200',
      'Mass Communication': 'bg-pink-100 text-pink-800 border-pink-200',
    };
    return colors[dept] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDepartmentColor(project.department)}`}>
          <FaUniversity className="mr-1" />
          {project.department}
        </span>
        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
          {project.formats?.includes('PDF') ? (
            <FaFilePdf className="text-red-500" />
          ) : (
            <FaFilePdf className="text-red-500" />
          )}
        </div>
      </div>

      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
        {project.title}
      </h3>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm md:text-base text-gray-600">
          <FaUser className="mr-2 text-gray-400" />
          <span>{project.author}</span>
        </div>
        <div className="flex items-center text-sm md:text-base text-gray-600">
          <FaCalendar className="mr-2 text-gray-400" />
          <span>{project.year || 'N/A'}</span>
        </div>
      </div>

      {project.rating && (
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.floor(project.rating) ? 'fill-current' : 'text-gray-300'} />
            ))}
          </div>
          <span className="text-sm md:text-base text-gray-600">({project.rating.toFixed(1)})</span>
        </div>
      )}

      <Link
        to={`/projects/${project.id}`}
        className="w-full flex items-center justify-center gap-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors"
      >
        View Details
        <FaChevronDown className="transform rotate-90 text-xs" />
      </Link>
    </div>
  );
};

const ProjectsPage = () => {
  const [searchParams] = useSearchParams();
  const initialSearchTerm = searchParams.get('search') || '';

  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all projects on initial load.
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await getAllProjects({
          limit: 100 // Adjust limit as needed
        });

        // Appwrite returns documents with $id as the ID field
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

  return (
    <div className="min-h-screen  bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Project Library</h1>
            <p className="text-lg text-gray-600">
              Browse {allProjects.length.toLocaleString()}+ academic projects
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by project title, author, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaUniversity className="mr-2" />
                  Departments
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {departments.map(dept => (
                    <Link
                      key={dept}
                      to={`/department/${encodeURIComponent(dept)}`}
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      {dept}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Statistics</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Total Projects:</span>
                    <span className="font-medium">{allProjects.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departments:</span>
                    <span className="font-medium">{departments.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center">
                <FaFilter className="mr-2" />
                Filters
              </span>
              <FaChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {showFilters && (
              <div className="mt-4 bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Departments</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {departments.map(dept => (
                    <Link
                      key={dept}
                      to={`/department/${encodeURIComponent(dept)}`}
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setShowFilters(false)}
                    >
                      {dept}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {searchTerm ? 'Search Results' : 'All Projects'}
                </h2>
                <p className="text-gray-600 mt-1">
                  Showing <span className="font-medium">{filteredProjects.length}</span> {filteredProjects.length === 1 ? 'project' : 'projects'}
                  {searchTerm && <span> for "{searchTerm}"</span>}
                </p>
              </div>
            </div>

            {/* Projects Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <FaSpinner className="animate-spin text-3xl text-indigo-600" />
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => <ProjectCard key={project.id} project={project} />)}
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
                    : 'No projects available at the moment.'}
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
