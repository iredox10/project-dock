
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaChevronRight, FaSearch, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

// ===================================================================================
// MOCK DATA GENERATION - In a real MERN app, this data would come from your API.
// This function simulates having a large number of departments.
// ===================================================================================
const generateMockData = () => {
  const departmentsList = [
    'Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering',
    'Petroleum Engineering', 'Architecture', 'Urban & Regional Planning', 'Surveying & Geoinformatics', 'Building',
    'Quantity Surveying', 'Estate Management', 'Fine & Applied Arts', 'Industrial Design', 'Theatre Arts',
    'Music', 'English & Literary Studies', 'History & International Studies', 'Linguistics', 'Mass Communication',
    'Public Administration', 'Economics', 'Sociology', 'Psychology', 'Political Science', 'Biochemistry',
    'Microbiology', 'Industrial Chemistry', 'Physics', 'Geology', 'Mathematics', 'Statistics', 'Medicine & Surgery',
    'Nursing', 'Pharmacy', 'Medical Laboratory Science', 'Radiography', 'Dentistry', 'Law', 'Accounting',
    'Business Administration', 'Marketing', 'Banking & Finance', 'Insurance', 'Veterinary Medicine', 'Agriculture',
    'Forestry & Wildlife', 'Fisheries & Aquaculture', 'Food Science & Technology', 'Home Science & Management'
  ];
  let projects = [];
  let idCounter = 1;
  departmentsList.forEach(dept => {
    const projectCount = Math.floor(Math.random() * 30) + 1; // 1 to 30 projects per dept
    for (let i = 0; i < projectCount; i++) {
      projects.push({ id: idCounter++, department: dept });
    }
  });
  return projects;
}

const mockProjects = generateMockData();
// ===================================================================================


const AllDepartmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const DEPARTMENTS_PER_PAGE = 12;

  const departments = useMemo(() => {
    const departmentCounts = mockProjects.reduce((acc, project) => {
      acc[project.department] = (acc[project.department] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(departmentCounts).map(([name, count]) => ({ name, count }));
  }, []);

  const sortedAndFilteredDepartments = useMemo(() => {
    return departments
      .filter(dept => dept.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        switch (sortOption) {
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'count-desc':
            return b.count - a.count;
          case 'count-asc':
            return a.count - b.count;
          default:
            return 0;
        }
      });
  }, [departments, searchTerm, sortOption]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedAndFilteredDepartments.length / DEPARTMENTS_PER_PAGE);
  const paginatedDepartments = sortedAndFilteredDepartments.slice(
    (currentPage - 1) * DEPARTMENTS_PER_PAGE,
    currentPage * DEPARTMENTS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <FaBook className="mx-auto h-12 w-auto text-indigo-600" />
        <h1 className="mt-6 text-4xl font-extrabold text-gray-900">All Departments</h1>
        <p className="mt-4 text-lg text-gray-600">Explore projects across all fields of study.</p>
      </div>

      {/* Filter and Sort Controls */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-md flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full md:w-auto">
          <input
            type="text"
            placeholder={`Search from ${departments.length} departments...`}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full px-4 py-3 pl-10 rounded-md text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex-shrink-0">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full md:w-auto px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="name-asc">Sort by Name (A-Z)</option>
            <option value="name-desc">Sort by Name (Z-A)</option>
            <option value="count-desc">Sort by Projects (Most)</option>
            <option value="count-asc">Sort by Projects (Fewest)</option>
          </select>
        </div>
      </div>

      {/* Departments Grid */}
      {paginatedDepartments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedDepartments.map(({ name, count }) => (
            <Link
              to={`/department/${encodeURIComponent(name)}`}
              key={name}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{count} {count === 1 ? 'Project' : 'Projects'}</p>
                </div>
                <FaChevronRight className="text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800">No departments found</h3>
          <p className="text-gray-600 mt-2">Try adjusting your search term.</p>
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

export default AllDepartmentsPage;
