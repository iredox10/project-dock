
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaFilePdf, FaCode, FaBook, FaSearch } from 'react-icons/fa';

// ===================================================================================
// MOCK DATA GENERATION - In a real MERN app, this data would come from your API.
// This function simulates having a large number of projects for each department.
// ===================================================================================
const generateMockProjectsForDept = (departmentName) => {
  const projects = [];
  const levels = ['BSc', 'HND', 'ND', 'MSc'];
  const years = [2020, 2021, 2022, 2023, 2024];
  const fileTypes = ['PDF', 'Code'];
  const firstNames = ['Amina', 'Bayo', 'Chioma', 'David', 'Efe', 'Fatima', 'Gozie', 'Habib'];
  const lastNames = ['Abubakar', 'Lawal', 'Okafor', 'Adeboye', 'Igwe', 'Yusuf', 'Eze', 'Okoro'];

  for (let i = 0; i < 150; i++) { // Generate 150 projects for the department
    projects.push({
      id: i + 1,
      title: `${departmentName} Project Title #${i + 1}`,
      department: departmentName,
      level: levels[Math.floor(Math.random() * levels.length)],
      year: years[Math.floor(Math.random() * years.length)],
      author: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      tags: ['Research', 'Web', 'Data'],
      fileType: fileTypes[Math.floor(Math.random() * fileTypes.length)],
    });
  }
  return projects;
};
// ===================================================================================


const ProjectCard = ({ project }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
    <div className="p-6 flex-grow">
      <div className="flex justify-between items-start">
        <span className="text-sm text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full">{project.level}</span>
        {project.fileType === 'PDF' ?
          <FaFilePdf className="text-red-500 text-2xl" /> :
          <FaCode className="text-gray-700 text-2xl" />
        }
      </div>
      <h3 className="text-xl font-bold text-gray-900 mt-4 h-14">{project.title}</h3>
      <p className="text-gray-600 mt-2">By {project.author} - {project.year}</p>
    </div>
    <div className="p-6 bg-gray-50">
      <Link to={`/projects/${project.id}`} className="w-full text-center block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out">
        View Details
      </Link>
    </div>
  </div>
);


const DepartmentPage = () => {
  const { departmentName } = useParams();
  const decodedDeptName = decodeURIComponent(departmentName);

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [sortOption, setSortOption] = useState('year-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const PROJECTS_PER_PAGE = 9;

  // In a real app, you would fetch this data. We generate it for demonstration.
  const allProjectsInDept = useMemo(() => generateMockProjectsForDept(decodedDeptName), [decodedDeptName]);

  const uniqueLevels = useMemo(() => ['All', ...new Set(allProjectsInDept.map(p => p.level))], [allProjectsInDept]);
  const uniqueYears = useMemo(() => ['All', ...new Set(allProjectsInDept.map(p => p.year))].sort((a, b) => b - a), [allProjectsInDept]);

  const filteredAndSortedProjects = useMemo(() => {
    return allProjectsInDept
      .filter(p => {
        const searchMatch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.author.toLowerCase().includes(searchTerm.toLowerCase());
        const levelMatch = levelFilter === 'All' || p.level === levelFilter;
        const yearMatch = yearFilter === 'All' || p.year === parseInt(yearFilter);
        return searchMatch && levelMatch && yearMatch;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'year-desc':
            return b.year - a.year;
          case 'year-asc':
            return a.year - b.year;
          case 'title-asc':
            return a.title.localeCompare(b.title);
          case 'title-desc':
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
  }, [allProjectsInDept, searchTerm, levelFilter, yearFilter, sortOption]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAndSortedProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = filteredAndSortedProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link to="/departments" className="text-indigo-600 hover:underline">&larr; Back to all departments</Link>
      </div>
      <div className="text-center mb-12">
        <FaBook className="mx-auto h-12 w-auto text-indigo-600" />
        <h1 className="mt-6 text-4xl font-extrabold text-gray-900">{decodedDeptName}</h1>
        <p className="mt-4 text-lg text-gray-600">Browse all {filteredAndSortedProjects.length} projects submitted from this department.</p>
      </div>

      {/* Filter and Sort Controls */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        <div className="relative lg:col-span-2">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full px-4 py-3 pl-10 rounded-md text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <select value={levelFilter} onChange={e => { setLevelFilter(e.target.value); setCurrentPage(1); }} className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400">
          {uniqueLevels.map(level => <option key={level} value={level}>{level === 'All' ? 'All Levels' : level}</option>)}
        </select>
        <select value={yearFilter} onChange={e => { setYearFilter(e.target.value); setCurrentPage(1); }} className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400">
          {uniqueYears.map(year => <option key={year} value={year}>{year === 'All' ? 'All Years' : year}</option>)}
        </select>
      </div>


      {/* Projects Grid */}
      {paginatedProjects.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {paginatedProjects.map(project => <ProjectCard key={project.id} project={project} />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800">No projects found</h3>
          <p className="text-gray-600 mt-2">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DepartmentPage;
