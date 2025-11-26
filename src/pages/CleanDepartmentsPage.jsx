import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiArrowRight, FiGrid, FiLoader, FiX, FiCpu, FiGlobe, FiTrendingUp, FiBook } from 'react-icons/fi';
import { getUniqueDepartments } from '../api/projectServices';

const CleanDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const depts = await getUniqueDepartments();
        setDepartments(depts);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // Helper to get icon for department
  const getDepartmentIcon = (deptName) => {
    const lowerName = deptName.toLowerCase();
    if (lowerName.includes('computer') || lowerName.includes('technology')) return FiCpu;
    if (lowerName.includes('engineering')) return FiGlobe;
    if (lowerName.includes('business') || lowerName.includes('finance') || lowerName.includes('accounting')) return FiTrendingUp;
    return FiBook;
  };

  const filteredDepartments = useMemo(() => {
    return departments.filter(dept =>
      dept.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  const visibleDepartments = useMemo(() => {
    return filteredDepartments.slice(0, visibleCount);
  }, [filteredDepartments, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 20);
  };

  const hasMore = visibleDepartments.length < filteredDepartments.length;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header & Search */}
        <div className="mb-16">
          <h1 className="text-3xl font-semibold tracking-tight mb-8">Departments</h1>

          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(20); // Reset visible count on search
              }}
              className="w-full bg-transparent border-b border-gray-200 py-4 text-lg placeholder-gray-400 focus:border-gray-900 focus:outline-none transition-colors"
            />
            {searchTerm ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setVisibleCount(20);
                }}
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
        <div className="mb-12">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <FiLoader className="animate-spin text-2xl text-gray-400" />
            </div>
          ) : visibleDepartments.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {visibleDepartments.map((deptName) => {
                  const Icon = getDepartmentIcon(deptName);
                  return (
                    <Link
                      key={deptName}
                      to={`/department/${encodeURIComponent(deptName)}`}
                      className="group p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all bg-white flex items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors flex-shrink-0">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{deptName}</h3>
                        <div className="flex items-center text-xs text-gray-500 mt-0.5 group-hover:text-indigo-600 transition-colors">
                          <span>View Projects</span>
                          <FiArrowRight className="ml-1 w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {hasMore && (
                <div className="mt-12 text-center">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Load More Departments
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center text-gray-400">
              No departments found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CleanDepartmentsPage;
