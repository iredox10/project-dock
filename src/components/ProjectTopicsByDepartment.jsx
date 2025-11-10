import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaSearch, FaGraduationCap, FaChevronRight, FaFilter, FaChevronDown, FaPlus } from 'react-icons/fa';
import { getProjectTopicsByDepartment } from '../api/projectTopicService';

const ProjectTopicsByDepartment = ({ departmentName }) => {
  const [topics, setTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch project topics for the department
  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true);
      try {
        const departmentTopics = await getProjectTopicsByDepartment(departmentName);
        setTopics(departmentTopics);
      } catch (error) {
        console.error('Error fetching project topics:', error);
        // For now, if there's an error, we'll just set an empty array
        setTopics([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [departmentName]);

  const filteredTopics = useMemo(() => {
    return topics.filter(topic =>
      topic.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (levelFilter === 'All' || topic.level === levelFilter)
    );
  }, [topics, searchTerm, levelFilter]);

  const availableLevels = useMemo(() => [...new Set(topics.map(t => t.level).filter(Boolean))], [topics]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-slate-600 font-medium">Loading project topics...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search and Filters Section */}
      <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-lg p-6 mb-8">
        {/* Search Bar */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-30 group-focus-within:opacity-30 transition duration-300"></div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search project topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent font-medium placeholder:text-slate-400"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Toggle Button (Mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden w-full flex items-center justify-between gap-2 bg-indigo-50 text-indigo-700 font-bold px-4 py-3 rounded-xl mb-4 transition-all"
        >
          <div className="flex items-center gap-2">
            <FaFilter />
            <span>Filter by Level</span>
          </div>
          <FaChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {/* Filters */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-2">Level</label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent font-medium"
              >
                <option value="All">All Levels</option>
                {availableLevels.map((level, index) => (
                  <option key={index} value={level}>{level}</option>
                ))}
              </select>
            </div>
            {(levelFilter !== 'All') && (
              <div className="flex items-end">
                <button
                  onClick={() => setLevelFilter('All')}
                  className="px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  Clear Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Project Topics in {departmentName}
            </h2>
            <p className="text-slate-600 mt-1">
              Browse <span className="font-bold text-indigo-600">{filteredTopics.length}</span> project topics
            </p>
          </div>
          
          {/* Request Custom Topic Button */}
          <Link
            to="/hire-writer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-4 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            <FaPlus className="text-sm" />
            <span>Request Topic</span>
          </Link>
        </div>
      </div>

      {/* Topics Grid */}
      {filteredTopics.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="block group bg-white rounded-2xl border-2 border-slate-200 border-opacity-20 hover:border-opacity-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full"
            >
              <div className="p-6 flex-grow">
                {/* Top accent bar */}
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-blue-600 mb-4"></div>
                
                {/* Topic title */}
                <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight group-hover:text-indigo-700 transition-colors line-clamp-3 min-h-[4rem]">
                  {topic.title}
                </h3>
                
                {/* Topic metadata */}
                <div className="space-y-2 text-sm text-slate-600">
                  {topic.level && (
                    <div className="flex items-center gap-2">
                      <FaGraduationCap className="text-xs" />
                      <span>Level: {topic.level}</span>
                    </div>
                  )}
                  
                  {topic.description && (
                    <div className="mt-2 text-xs text-slate-500 line-clamp-2">
                      {topic.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {topic.isAvailable ? 'Available' : 'Request to Write'}
                  </span>
                  {topic.isAvailable ? (
                    <Link
                      to={`/department/${encodeURIComponent(departmentName)}?search=${encodeURIComponent(topic.title)}`}
                      className="text-indigo-600 font-bold text-sm flex items-center gap-1"
                    >
                      <span>View Project</span>
                      <FaChevronRight className="text-xs" />
                    </Link>
                  ) : (
                    <Link
                      to={`/hire-writer?topic=${encodeURIComponent(topic.title)}&department=${encodeURIComponent(departmentName)}`}
                      className="text-indigo-600 font-bold text-sm flex items-center gap-1"
                    >
                      <span>Request</span>
                      <FaChevronRight className="text-xs" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-slate-100 shadow-lg">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBook className="text-2xl text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Topics Found</h3>
          <p className="text-slate-600 mb-4">
            {searchTerm || levelFilter !== 'All'
              ? 'No project topics match your criteria. Try adjusting your filters.'
              : 'No project topics available in this department yet.'}
          </p>
          <div className="space-y-3">
            {(searchTerm || levelFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setLevelFilter('All');
                }}
                className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors mr-3"
              >
                Clear Filters
              </button>
            )}
            <Link
              to="/hire-writer"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-6 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-colors"
            >
              Request Custom Topic
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTopicsByDepartment;