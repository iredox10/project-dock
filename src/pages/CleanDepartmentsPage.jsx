import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUniversity, FaSpinner, FaChevronRight, FaGraduationCap } from 'react-icons/fa';
import { getAllProjects } from '../api/projectServices';

// Clean department card component
const CleanDepartmentCard = ({ name, count }) => {
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
    <Link
      to={`/department/${encodeURIComponent(name)}`}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex justify-between items-center"
    >
      <div>
        <div className="flex items-center mb-2">
          <FaUniversity className="text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        </div>
        <p className="text-sm text-gray-600">{count} projects</p>
      </div>
      <FaChevronRight className="text-gray-400" />
    </Link>
  );
};

const CleanDepartmentsPage = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all projects to aggregate department data
  useEffect(() => {
    const fetchAllProjects = async () => {
      setIsLoading(true);
      try {
        const response = await getAllProjects({ limit: 10000 });
        const fetchedProjects = response.documents || [];
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
    return departments.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Departments</h1>
            <p className="text-lg text-gray-600">
              Browse {departments.length} departments with {allProjects.length.toLocaleString()}+ projects
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
                placeholder={`Search from ${departments.length} departments...`}
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
        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {searchTerm ? 'Search Results' : 'All Departments'}
          </h2>
          <p className="text-gray-600 mt-1">
            Showing <span className="font-medium">{filteredDepartments.length}</span> {filteredDepartments.length === 1 ? 'department' : 'departments'}
            {searchTerm && <span> matching "{searchTerm}"</span>}
          </p>
        </div>

        {/* Departments Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-3xl text-indigo-600" />
          </div>
        ) : filteredDepartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map(dept => <CleanDepartmentCard key={dept.name} {...dept} />)}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaUniversity className="text-gray-400 text-xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No departments found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? `No departments match "${searchTerm}". Try a different search.`
                : 'No departments available at the moment.'}
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

        {/* CTA Section */}
        <div className="mt-16 bg-indigo-600 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Can't Find Your Department?
          </h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            We're constantly adding new departments and projects. Contact us to request your department.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 font-bold px-6 py-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              Contact Us
              <FaChevronRight className="text-sm" />
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-2 bg-indigo-700 text-white font-bold px-6 py-3 rounded-md hover:bg-indigo-800 transition-colors"
            >
              Browse All Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanDepartmentsPage;
