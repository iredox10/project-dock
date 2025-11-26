import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiArrowRight, FiGrid, FiLoader } from 'react-icons/fi';
import { getAllProjects } from '../api/projectServices';

const CleanDepartmentsPage = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
      .sort((a, b) => b.count - a.count);
  }, [allProjects, isLoading]);

  const filteredDepartments = useMemo(() => {
    return departments.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Academic Departments
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Explore our comprehensive collection of research projects across {departments.length} departments.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 text-lg" />
            </div>
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-b-2 border-transparent focus:border-gray-900 focus:bg-white transition-all outline-none text-lg placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Results Info */}
        <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-semibold">
              {searchTerm ? 'Search Results' : 'All Departments'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredDepartments.length} {filteredDepartments.length === 1 ? 'department' : 'departments'} available
            </p>
          </div>
        </div>

        {/* Departments Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <FiLoader className="animate-spin text-3xl text-gray-300" />
          </div>
        ) : filteredDepartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((dept) => (
              <Link
                key={dept.name}
                to={`/department/${encodeURIComponent(dept.name)}`}
                className="group block p-8 bg-white border border-gray-100 rounded-lg hover:border-gray-300 transition-all hover:shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                    <FiGrid className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                  </div>
                  <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {dept.count} projects
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:underline decoration-1 underline-offset-4">
                  {dept.name}
                </h3>
                <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-900 transition-colors mt-4">
                  <span>Browse Projects</span>
                  <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-gray-200 rounded-lg">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No departments found</h3>
            <p className="text-gray-500 mb-6">
              We couldn't find any departments matching "{searchTerm}".
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-sm font-medium text-gray-900 underline hover:text-gray-600"
            >
              Clear search
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-24 text-center border-t border-gray-100 pt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Can't find what you're looking for?
          </h3>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            We are constantly updating our database with new departments and research projects.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-black transition-colors"
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
