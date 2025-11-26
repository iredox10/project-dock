import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiArrowRight, FiBook, FiCpu, FiGlobe, FiTrendingUp, FiLoader, FiFileText } from 'react-icons/fi';
import { getAllProjects } from '../api/projectServices';
import { getAllDepartments } from '../api/departmentService';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentProjects, setRecentProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch recent projects - Limit to 3
        const projectsResponse = await getAllProjects({ limit: 3 });
        const fetchedProjects = projectsResponse.documents.map(doc => ({
          id: doc.$id,
          ...doc
        }));
        setRecentProjects(fetchedProjects);

        // Fetch departments
        const depts = getAllDepartments();
        setDepartments(depts);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Helper to get icon for department (simple mapping or default)
  const getDepartmentIcon = (deptName) => {
    const lowerName = deptName.toLowerCase();
    if (lowerName.includes('computer') || lowerName.includes('technology')) return FiCpu;
    if (lowerName.includes('engineering')) return FiGlobe;
    if (lowerName.includes('business') || lowerName.includes('finance') || lowerName.includes('accounting')) return FiTrendingUp;
    return FiBook;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 mb-6 text-balance">
            Academic Research. <span className="text-gray-500">Simplified.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
            Access thousands of verified academic projects, theses, and dissertations. Clean, fast, and reliable.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all shadow-sm"
                placeholder="Search for topics, departments, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-2 right-2 px-4 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span>Popular:</span>
            <Link to="/projects?q=machine+learning" className="hover:text-gray-900 underline decoration-gray-300 underline-offset-4">Machine Learning</Link>
            <Link to="/projects?q=fintech" className="hover:text-gray-900 underline decoration-gray-300 underline-offset-4">Fintech</Link>
            <Link to="/projects?q=education" className="hover:text-gray-900 underline decoration-gray-300 underline-offset-4">Education</Link>
          </div>
        </div>
      </section>

      {/* Browse Projects Section */}
      <section className="py-16 px-6 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-xl font-semibold text-gray-900">Browse Projects</h2>
            <Link to="/projects" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
              View all <FiArrowRight />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <FiLoader className="animate-spin text-2xl text-gray-400" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="group bg-white p-6 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all flex flex-col h-full"
                >
                  <div className="mb-4">
                    <span className="inline-block px-2 py-1 bg-gray-50 text-xs font-medium text-gray-600 rounded-md mb-2">
                      {project.department}
                    </span>
                    <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  <div className="mt-auto flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-50">
                    <span className="flex items-center gap-1">
                      <FiFileText /> {project.pages || '?'} pages
                    </span>
                    <span>{project.year || 'N/A'}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-16 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-xl font-semibold text-gray-900">Browse by Department</h2>
            <Link to="/departments" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
              View all <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {departments.slice(0, 3).map((deptName) => {
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
                  <h3 className="font-medium text-gray-900 line-clamp-1">{deptName}</h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Minimal Features/Info */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Instant Access</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Download your project files immediately after purchase. No waiting, no hassle. PDF and DOCX formats available.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Verified Quality</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              All projects are reviewed for academic standards. We ensure you get complete, high-quality research materials.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">AI-Powered</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Our platform uses advanced AI to organize and categorize research, making it easier for you to find exactly what you need.
            </p>
          </div>
        </div>
      </section>

      {/* Simple Footer CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Start your research today.</h2>
        <div className="flex justify-center gap-4">
          <Link to="/projects" className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Browse Library
          </Link>
          <Link to="/signup" className="px-6 py-3 bg-white text-gray-900 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
