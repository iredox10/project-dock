
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUniversity, FaSpinner } from 'react-icons/fa';
import { db } from '../firebase/config'; // Your Firebase config
import { collection, getDocs, query } from 'firebase/firestore';


const DepartmentCard = ({ name, count }) => (
  <Link
    to={`/department/${encodeURIComponent(name)}`}
    className="group relative block p-8 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-indigo-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex-grow">
        <h3 className="text-3xl font-extrabold text-gray-800 group-hover:text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 transition-all duration-300 h-24">
          {name}
        </h3>
        <p className="mt-2 text-sm text-gray-500 font-semibold">{count} {count === 1 ? 'Project' : 'Projects'}</p>
      </div>
      <div className="mt-6">
        <span className="font-bold text-indigo-600 text-lg">
          Explore
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
        </span>
      </div>
    </div>
  </Link>
);


const AllDepartmentsPage = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const DEPARTMENTS_PER_PAGE = 9;

  // Fetch all projects to aggregate department data
  useEffect(() => {
    const fetchAllProjects = async () => {
      setIsLoading(true);
      try {
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef); // You can add orderBy here if needed
        const querySnapshot = await getDocs(q);
        const fetchedProjects = querySnapshot.docs.map(doc => doc.data());
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
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allProjects, isLoading]);

  const filteredDepartments = useMemo(() => {
    return departments.filter(dept => dept.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [departments, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredDepartments.length / DEPARTMENTS_PER_PAGE);
  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * DEPARTMENTS_PER_PAGE,
    currentPage * DEPARTMENTS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
            Department Explorer
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Discover a world of knowledge, one department at a time.
          </p>
        </div>

        <div className="relative max-w-lg mx-auto mb-16">
          <input
            type="text"
            placeholder={`Search from ${departments.length} departments...`}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full px-5 py-4 pl-12 rounded-full text-gray-800 border-2 border-gray-200 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20"><FaSpinner className="animate-spin text-5xl text-indigo-600" /></div>
        ) : paginatedDepartments.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {paginatedDepartments.map(dept => <DepartmentCard key={dept.name} {...dept} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <FaUniversity className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800">No Departments Found</h3>
            <p className="text-gray-600 mt-2">Your search did not match any departments. Please try again.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 font-semibold bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &larr; Previous
            </button>
            <span className="text-gray-700 font-bold">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 font-semibold bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDepartmentsPage;
