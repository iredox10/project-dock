import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiSearch, FiArrowLeft, FiLoader, FiX } from 'react-icons/fi';
import { getProjectsByDepartment } from '../api/projectServices';

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

const CleanDepartmentPage = () => {
  const { departmentName } = useParams();
  const decodedDeptName = decodeURIComponent(departmentName);

  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMIT = 20;

  useEffect(() => {
    const fetchDepartmentProjects = async () => {
      setIsLoading(true);
      try {
        const response = await getProjectsByDepartment(decodedDeptName, {
          limit: LIMIT,
          offset: 0
        });
        const fetchedProjects = response.documents.map(d => ({ id: d.$id, ...d }));
        setProjects(fetchedProjects);
        setHasMore(fetchedProjects.length === LIMIT);
        setOffset(LIMIT);
      } catch (error) {
        console.error("Error fetching department projects: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDepartmentProjects();
  }, [decodedDeptName]);

  const fetchMoreProjects = async () => {
    if (!hasMore) return;
    setIsMoreLoading(true);
    try {
      const response = await getProjectsByDepartment(decodedDeptName, {
        limit: LIMIT,
        offset: offset
      });
      const newProjects = response.documents.map(d => ({ id: d.$id, ...d }));

      setProjects(prev => [...prev, ...newProjects]);
      setHasMore(newProjects.length === LIMIT);
      setOffset(prev => prev + LIMIT);
    } catch (error) {
      console.error("Error fetching more projects: ", error);
    } finally {
      setIsMoreLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.author && p.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [projects, searchTerm]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">

        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/departments"
            className="inline-flex items-center text-sm text-gray-400 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Departments
          </Link>
        </div>

        {/* Header & Search */}
        <div className="mb-16">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Department: {decodedDeptName}
          </h1>
          <p className="text-gray-500 mb-8">
            {projects.length}{hasMore ? '+' : ''} research projects available
          </p>

          <div className="relative">
            <input
              type="text"
              placeholder="Search within department..."
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

        {/* Projects List */}
        <div className="space-y-1 mb-16 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FiLoader className="w-8 h-8 animate-spin mb-4" />
              <span className="text-sm">Loading projects...</span>
            </div>
          ) : filteredProjects.length > 0 ? (
            <>
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}

              {hasMore && !searchTerm && (
                <div className="mt-12 text-center">
                  <button
                    onClick={fetchMoreProjects}
                    disabled={isMoreLoading}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                  >
                    {isMoreLoading && <FiLoader className="animate-spin w-4 h-4" />}
                    {isMoreLoading ? 'Loading...' : 'Load More Projects'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center text-gray-400 text-sm">
              No projects found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CleanDepartmentPage;