import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiArrowRight, FiGrid, FiLoader, FiX } from 'react-icons/fi';
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
    <div className="min-h-screen bg-white font-sans text-gray-900 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header & Search */}
        <div className="mb-16">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Departments
          </h1>
          <p className="text-gray-500 mb-8">
            Browse research projects by department
          </p>

          <div className="relative">
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-b border-gray-200 py-4 text-lg placeholder-gray-400 focus:border-gray-900 focus:outline-none transition-colors"
            />
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
              >
                <FiX />
              </button>
            ) : (
              <FiSearch className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" />
            )}
          </div>
        </div>

        {/* Departments Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <FiLoader className="animate-spin text-3xl text-gray-300" />
          </div>
        ) : filteredDepartments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDepartments.map((dept) => (
              <Link
                key={dept.name}
                to={`/department/${encodeURIComponent(dept.name)}`}
                className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1 group-hover:text-gray-600 transition-colors">
                    {dept.name}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {dept.count} {dept.count === 1 ? 'project' : 'projects'}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                  <FiArrowRight className="text-gray-400 group-hover:text-gray-900 transition-colors" />
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
      </div>
    </div>
  );
};

export default CleanDepartmentsPage;
