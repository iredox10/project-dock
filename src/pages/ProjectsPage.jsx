
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilePdf, FaCode, FaChevronRight, FaList } from 'react-icons/fa';

// Mock data for projects - replace with API call in a real app
const mockProjects = [
  { id: 1, title: 'AI-Powered E-commerce Chatbot', department: 'Computer Science', year: 2023, author: 'Bello Adekunle', tags: ['AI', 'React', 'Node.js'], fileType: 'PDF' },
  { id: 2, title: 'Smart Irrigation System using IoT', department: 'Electrical Engineering', year: 2023, author: 'Fatima Yusuf', tags: ['IoT', 'Arduino', 'C++'], fileType: 'Code' },
  { id: 3, title: 'Analysis of Financial Market Trends', department: 'Economics', year: 2022, author: 'Obinna Okoro', tags: ['Finance', 'Python', 'Data Science'], fileType: 'PDF' },
  { id: 4, title: 'Portable Water Purification Device', department: 'Mechanical Engineering', year: 2023, author: 'Aisha Ibrahim', tags: ['Health', 'CAD', 'Engineering'], fileType: 'PDF' },
  { id: 5, title: 'Student Attendance Management System', department: 'Computer Science', year: 2022, author: 'Emeka Nwosu', tags: ['Web', 'PHP', 'MySQL'], fileType: 'Code' },
  { id: 6, title: 'Effect of Monetary Policy on Inflation in Nigeria', department: 'Economics', year: 2023, author: 'Ngozi Eze', tags: ['Economics', 'Stata', 'Research'], fileType: 'PDF' },
  { id: 7, title: 'Reinforced Concrete Beam Design', department: 'Civil Engineering', year: 2023, author: 'David Akpan', tags: ['Structural', 'AutoCAD'], fileType: 'PDF' },
];


const ProjectCard = ({ project }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
    <div className="p-6 flex-grow">
      <div className="flex justify-between items-start">
        <span className="text-sm text-indigo-600 font-semibold bg-indigo-100 px-2 py-1 rounded-full">{project.department}</span>
        {project.fileType === 'PDF' ?
          <FaFilePdf className="text-red-500 text-2xl" /> :
          <FaCode className="text-gray-700 text-2xl" />
        }
      </div>
      <h3 className="text-xl font-bold text-gray-900 mt-4 h-14">{project.title}</h3>
      <p className="text-gray-600 mt-2">By {project.author} - {project.year}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map(tag => (
          <span key={tag} className="text-xs text-gray-700 bg-gray-200 px-2 py-1 rounded-full">{tag}</span>
        ))}
      </div>
    </div>
    <div className="p-6 bg-gray-50">
      <Link to={`/projects/${project.id}`} className="w-full text-center block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out">
        View Details
      </Link>
    </div>
  </div>
);

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState('');

  const departments = useMemo(() => {
    const uniqueDepartments = [...new Set(mockProjects.map(p => p.department))];
    return uniqueDepartments.sort();
  }, []);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleDepartmentSearch = (e) => setDepartmentSearchTerm(e.target.value);

  const filteredProjects = mockProjects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDepartments = departments.filter(dept =>
    dept.toLowerCase().includes(departmentSearchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">Browse Projects</h1>
        <p className="mt-4 text-lg text-gray-600">Find the perfect project to kickstart your work.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4">
          <div className="p-6 bg-white rounded-lg shadow-md sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Departments</h3>

            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search departments..."
                value={departmentSearchTerm}
                onChange={handleDepartmentSearch}
                className="w-full px-3 py-2 pl-8 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
              <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            </div>

            <ul>
              {filteredDepartments.map(dept => (
                <li key={dept} className="mb-2">
                  <Link to={`/department/${encodeURIComponent(dept)}`} className="flex justify-between items-center text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-md transition-colors duration-200">
                    <span>{dept}</span>
                    <FaChevronRight className="text-xs" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t pt-4">
              <Link to="/departments" className="flex items-center gap-2 text-indigo-600 hover:underline font-semibold">
                <FaList />
                <span>See All Departments</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-3/4">
          <div className="mb-8 relative">
            <input
              type="text"
              placeholder="Search all projects..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-3 pl-10 rounded-md text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => <ProjectCard key={project.id} project={project} />)
            ) : (
              <p className="text-center text-gray-600 sm:col-span-2 lg:col-span-3">No projects found for your search term.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectsPage;
