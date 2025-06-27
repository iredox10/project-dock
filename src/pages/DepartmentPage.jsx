
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaFilePdf, FaCode, FaBook, FaSearch, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';


const ProjectCard = ({ project }) => (
  <div className="group bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-100">
    <div className="p-6 flex-grow">
      <div className="flex justify-between items-start mb-4">
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${project.level === 'BSc' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{project.level}</span>
        {project.formats?.includes('PDF') ? <FaFilePdf className="text-red-500 text-2xl" /> : <FaCode className="text-gray-700 text-2xl" />}
      </div>
      <h3 className="text-xl font-bold text-gray-900 h-16 group-hover:text-indigo-600 transition-colors duration-300">{project.title}</h3>
      <p className="text-gray-500 mt-2 text-sm">By {project.author} - {project.year}</p>
    </div>
    <div className="p-4 bg-gray-50/70 border-t mt-auto">
      <Link to={`/projects/${project.id}`} className="w-full text-center block bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition duration-150">
        View Details
      </Link>
    </div>
  </div>
);

const DepartmentPage = () => {
  const { departmentName } = useParams();
  const decodedDeptName = decodeURIComponent(departmentName);

  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const PROJECTS_PER_PAGE = 9;

  const fetchDepartmentProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(
        projectsRef,
        where('department', '==', decodedDeptName),
        orderBy('year', 'desc'),
        limit(PROJECTS_PER_PAGE)
      );
      const docSnapshots = await getDocs(q);
      const fetchedProjects = docSnapshots.docs.map(d => ({ id: d.id, ...d.data() }));
      const lastDoc = docSnapshots.docs[docSnapshots.docs.length - 1];
      setProjects(fetchedProjects);
      setLastVisible(lastDoc);
      setHasMore(fetchedProjects.length === PROJECTS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching department projects: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [decodedDeptName]);

  useEffect(() => {
    fetchDepartmentProjects();
  }, [fetchDepartmentProjects]);

  const fetchMoreProjects = async () => {
    if (!hasMore || !lastVisible) return;
    setIsMoreLoading(true);
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(
        projectsRef,
        where('department', '==', decodedDeptName),
        orderBy('year', 'desc'),
        startAfter(lastVisible),
        limit(PROJECTS_PER_PAGE)
      );
      const docSnapshots = await getDocs(q);
      const newProjects = docSnapshots.docs.map(d => ({ id: d.id, ...d.data() }));
      const lastDoc = docSnapshots.docs[docSnapshots.docs.length - 1];
      setProjects(prev => [...prev, ...newProjects]);
      setLastVisible(lastDoc);
      setHasMore(newProjects.length === PROJECTS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching more projects: ", error);
    } finally {
      setIsMoreLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p =>
      (p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (levelFilter === 'All' || p.level === levelFilter) &&
      (yearFilter === 'All' || p.year === parseInt(yearFilter))
    );
  }, [projects, searchTerm, levelFilter, yearFilter]);

  return (
    <div className="bg-gradient-to-b from-indigo-50 via-white to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-8">
          <Link to="/departments" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-semibold">
            <FaArrowLeft />
            Back to Department Explorer
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
            {decodedDeptName}
          </h1>
        </div>

        <div className="p-4 bg-white/60 backdrop-blur-lg rounded-xl shadow-md mb-10 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <input type="text" placeholder="Search projects in this department..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="w-full md:w-auto px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="All">All Levels</option>
              {[...new Set(projects.map(p => p.level))].map(level => <option key={level} value={level}>{level}</option>)}
            </select>
            <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="w-full md:w-auto px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="All">All Years</option>
              {[...new Set(projects.map(p => p.year))].sort((a, b) => b - a).map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20"><FaSpinner className="animate-spin text-5xl text-indigo-600" /></div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map(project => <ProjectCard key={project.id} project={project} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800">No Projects Found</h3>
            <p className="text-gray-600 mt-2">There are no projects matching your criteria in this department.</p>
          </div>
        )}

        {hasMore && !isLoading && (
          <div className="mt-16 flex justify-center">
            <button onClick={fetchMoreProjects} disabled={isMoreLoading} className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition">
              {isMoreLoading ? 'Loading...' : 'Load More Projects'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentPage;

