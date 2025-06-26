
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';

const initialProjects = [
  { id: 1, title: 'AI-Powered E-commerce Chatbot', department: 'Computer Science', year: 2023, author: 'Bello Adekunle', priceNGN: 5000, level: 'BSc' },
  { id: 2, title: 'Smart Irrigation System using IoT', department: 'Electrical Engineering', year: 2023, author: 'Fatima Yusuf', priceNGN: 4500, level: 'MSc' },
];

export const ProjectsAdminPage = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900">Manage Projects</h1>
        <Link to="/admin/projects/add" className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-5 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300">
          <FaPlus />
          <span>Add New Project</span>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Department</th>
                <th className="p-3">Year</th>
                <th className="p-3">Price</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(project => (
                <tr key={project.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold">{project.title}</td>
                  <td className="p-3">{project.department}</td>
                  <td className="p-3">{project.year}</td>
                  <td className="p-3">₦{project.priceNGN.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <Link to={`/admin/projects/edit/${project.id}`} className="text-blue-500 hover:text-blue-700 mr-4"><FaEdit /></Link>
                    <button onClick={() => handleDelete(project.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
