
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaFilePdf, FaCode, FaBook, FaSearch, FaArrowLeft, FaChartBar, FaGraduationCap, FaCalendarCheck } from 'react-icons/fa';

// ===================================================================================
// MOCK DATA GENERATION - In a real MERN app, this would come from your API.
// ===================================================================================
const generateMockProjectsForDept = (departmentName) => {
  const projects = [];
  const levels = ['BSc', 'HND', 'ND', 'MSc'];
  const years = [2020, 2021, 2022, 2023, 2024];
  const fileTypes = ['PDF', 'Code'];
  const firstNames = ['Amina', 'Bayo', 'Chioma', 'David', 'Efe', 'Fatima', 'Gozie', 'Habib'];
  const lastNames = ['Abubakar', 'Lawal', 'Okafor', 'Adeboye', 'Igwe', 'Yusuf', 'Eze', 'Okoro'];

  for (let i = 0; i < 150; i++) { // Generate 150 projects
    projects.push({
      id: i + 1,
      title: `${departmentName} Research Topic #${i + 1}`,
      department: departmentName,
      level: levels[Math.floor(Math.random() * levels.length)],
      year: years[Math.floor(Math.random() * years.length)],
      author: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      fileType: fileTypes[Math.floor(Math.random() * fileTypes.length)],
    });
  }
  return projects;
};
// ===================================================================================

const ProjectCard = ({ project }) => (
  <div className="group bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-100">
    <div className="p-6 flex-grow">
      <div className="flex justify-between items-start mb-4">
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${project.level === 'BSc' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{project.level}</span>
        {project.fileType === 'PDF' ? <FaFilePdf className="text-red-500 text-2xl" /> : <FaCode className="text-gray-700 text-2xl" />}
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

  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const PROJECTS_PER_PAGE = 9;

  const allProjectsInDept = useMemo(() => generateMockProjectsForDept(decodedDeptName), [decodedDeptName]);

  const stats = useMemo(() => ({
    total: allProjectsInDept.length,
    bsc: allProjectsInDept.filter(p => p.level === 'BSc').length,
    hnd: allProjectsInDept.filter(p => p.level === 'HND').length,
    msc: allProjectsInDept.filter(p => p.level === 'MSc').length,
  }), [allProjectsInDept]);

  const filteredAndSortedProjects = useMemo(() => {
    return allProjectsInDept.filter(p =>
      (p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (levelFilter === 'All' || p.level === levelFilter) &&
      (yearFilter === 'All' || p.year === parseInt(yearFilter))
    );
  }, [allProjectsInDept, searchTerm, levelFilter, yearFilter]);

  const totalPages = Math.ceil(filteredAndSortedProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = filteredAndSortedProjects.slice((currentPage - 1) * PROJECTS_PER_PAGE, currentPage * PROJECTS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

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
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Explore all projects from one of our most active departments.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-12">
          <div className="bg-white p-4 rounded-xl shadow-lg"><p className="text-3xl font-bold text-indigo-600">{stats.total}</p><p className="text-sm font-semibold text-gray-500">Total Projects</p></div>
          <div className="bg-white p-4 rounded-xl shadow-lg"><p className="text-3xl font-bold text-blue-600">{stats.bsc}</p><p className="text-sm font-semibold text-gray-500">BSc Projects</p></div>
          <div className="bg-white p-4 rounded-xl shadow-lg"><p className="text-3xl font-bold text-green-600">{stats.hnd}</p><p className="text-sm font-semibold text-gray-500">HND Projects</p></div>
          <div className="bg-white p-4 rounded-xl shadow-lg"><p className="text-3xl font-bold text-purple-600">{stats.msc}</p><p className="text-sm font-semibold text-gray-500">MSc Projects</p></div>
        </div>

        {/* Filter Controls */}
        <div className="p-4 bg-white/60 backdrop-blur-lg rounded-xl shadow-md mb-10 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <input type="text" placeholder="Search projects in this department..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select value={levelFilter} onChange={e => { setLevelFilter(e.target.value); setCurrentPage(1); }} className="w-full md:w-auto px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="All">All Levels</option>
              {[...new Set(allProjectsInDept.map(p => p.level))].map(level => <option key={level} value={level}>{level}</option>)}
            </select>
            <select value={yearFilter} onChange={e => { setYearFilter(e.target.value); setCurrentPage(1); }} className="w-full md:w-auto px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="All">All Years</option>
              {[...new Set(allProjectsInDept.map(p => p.year))].sort((a, b) => b - a).map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {paginatedProjects.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {paginatedProjects.map(project => <ProjectCard key={project.id} project={project} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800">No Projects Found</h3>
            <p className="text-gray-600 mt-2">Your search and filter criteria did not match any projects.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 font-semibold bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">&larr; Previous</button>
            <span className="text-gray-700 font-bold">Page {currentPage} of {totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 font-semibold bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Next &rarr;</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentPage;
