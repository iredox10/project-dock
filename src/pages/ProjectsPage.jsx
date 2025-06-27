
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilePdf, FaCode, FaChevronRight, FaBook, FaSpinner } from 'react-icons/fa';
import { db } from '../firebase/config'; // Your Firebase config
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';


const departmentColors = {
  'Computer Science': 'border-t-4 border-blue-500',
  'Electrical Engineering': 'border-t-4 border-yellow-500',
  'Economics': 'border-t-4 border-green-500',
  'Mechanical Engineering': 'border-t-4 border-red-500',
  'Civil Engineering': 'border-t-4 border-purple-500',
};

const ProjectCard = ({ project }) => (
  <div className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col ${departmentColors[project.department] || 'border-t-4 border-gray-500'}`}>
    <div className="p-6 flex-grow">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-semibold text-gray-600">{project.department}</span>
        {/* Assuming fileType is stored; otherwise, this can be removed or adapted */}
        {project.formats?.includes('PDF') ? <FaFilePdf className="text-red-500 text-2xl" /> : <FaCode className="text-gray-700 text-2xl" />}
      </div>
      <h3 className="text-xl font-bold text-gray-900 h-16">{project.title}</h3>
      <p className="text-gray-500 mt-2 text-sm">By {project.author} - {project.year}</p>
    </div>
    <div className="p-4 bg-gray-50 border-t">
      <Link to={`/projects/${project.id}`} className="w-full text-center block bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition duration-150 ease-in-out">
        View Details
      </Link>
    </div>
  </div>
);

const ProjectsPage = () => {
  const [searchParams] = useSearchParams();
  const initialSearchTerm = searchParams.get('search') || '';

  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all projects on initial load.
  // NOTE: For very large datasets (10,000+ projects), a more advanced search solution like Algolia is recommended
  // as fetching all documents upfront can become slow and costly. This approach is excellent for up to a few thousand projects.
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Effect to filter projects whenever the main list or search term changes
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

  const filteredDepartments = departments.filter(dept =>
    dept.toLowerCase().includes(departmentSearchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            Explore Our <span className="text-indigo-600">Project Library</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Dive into a curated collection of academic work from top institutions.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4">
            <div className="p-6 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Departments</h3>
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={departmentSearchTerm}
                  onChange={(e) => setDepartmentSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-8 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                />
                <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              </div>
              <ul className="space-y-1">
                {filteredDepartments.map(dept => (
                  <li key={dept}>
                    <Link to={`/department/${encodeURIComponent(dept)}`} className="flex justify-between items-center font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-100 p-2.5 rounded-lg transition-colors duration-200">
                      <span>{dept}</span>
                      <FaChevronRight className="text-xs" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t pt-4">
                <Link to="/departments" className="font-bold text-indigo-600 hover:underline">
                  View All Departments &rarr;
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="w-full md:w-3/4">
            <div className="mb-8 relative">
              <input
                type="text"
                placeholder="Search by project title, author, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-4 pl-12 rounded-full text-gray-800 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20"><FaSpinner className="animate-spin text-4xl text-indigo-600" /></div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map(project => <ProjectCard key={project.id} project={project} />)}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-md">
                <FaBook className="mx-auto text-5xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800">No Projects Found</h3>
                <p className="text-gray-600 mt-2">Your search did not match any projects. Please try again.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
