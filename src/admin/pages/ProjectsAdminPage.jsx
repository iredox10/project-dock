import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Modal, useModal } from '../../components/Modal';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaSpinner, FaRobot } from 'react-icons/fa';
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject, getProjectsByDepartment, getProjectsByLevel } from '../../api/projectServices';
import { Query } from 'appwrite';


// Reusable Confirmation Modal
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <Modal {...modal} onClose={closeModal} />

      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">Cancel</button>
          <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">Confirm Delete</button>
        </div>
      </div>
    </div>
  );
};

// Bulk Delete Confirmation Modal
const BulkConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, count }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{title}</h2>
        <p className="text-gray-600 mb-2">{message}</p>
        <p className="text-lg font-semibold text-red-600 mb-6">{count} project{count !== 1 ? 's' : ''} will be deleted.</p>
        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">Cancel</button>
          <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">Confirm Delete</button>
        </div>
      </div>
    </div>
  );
};

export const ProjectsAdminPage = () => {
    const { modal, showModal, closeModal } = useModal();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [showBulkConfirmModal, setShowBulkConfirmModal] = useState(false);

  const PROJECTS_PER_PAGE = 10;

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllProjects({
        limit: PROJECTS_PER_PAGE
      });

      // Appwrite returns documents with $id as the ID field
      const fetchedProjects = response.documents.map(doc => ({
        id: doc.$id,
        ...doc
      }));

      setProjects(fetchedProjects);
      // Appwrite doesn't use a cursor system like Firebase, so we'll just check if we got the full page
      setHasMore(response.documents.length === PROJECTS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching projects: ", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const fetchMoreProjects = async () => {
    if (!hasMore) return;
    setIsMoreLoading(true);
    try {
      // For now, just get the next page with offset
      // Note: Implementing proper pagination with Appwrite would require using offset or cursors
      // This is a simplified approach for now
      const response = await getAllProjects({
        limit: PROJECTS_PER_PAGE,
        offset: projects.length
      });

      const newProjects = response.documents.map(doc => ({
        id: doc.$id,
        ...doc
      }));

      setProjects(prev => [...prev, ...newProjects]);
      setHasMore(response.documents.length === PROJECTS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching more projects: ", error);
    } finally {
      setIsMoreLoading(false);
    }
  };

  const handleDeleteClick = (projectId) => {
    setProjectToDelete(projectId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete);
      setProjects(projects.filter(p => p.id !== projectToDelete));
      setShowConfirmModal(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error("Error deleting project: ", error);
      showModal("Error", "Failed to delete project.", "error");
    }
  };

  // Bulk selection functions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProjects(filteredProjects.map(p => p.id));
    } else {
      setSelectedProjects([]);
    }
  };

  const handleSelectProject = (projectId) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const confirmBulkDelete = async () => {
    if (selectedProjects.length === 0) return;
    try {
      // Delete all selected projects
      const deletePromises = selectedProjects.map(projectId =>
        deleteProject(projectId)
      );
      await Promise.all(deletePromises);

      // Update the local state to remove deleted projects
      setProjects(prev => prev.filter(p => !selectedProjects.includes(p.id)));

      // Clear selection
      setSelectedProjects([]);
      setShowBulkConfirmModal(false);
    } catch (error) {
      console.error("Error deleting projects: ", error);
      showModal("Error", "Failed to delete some or all projects.", "error");
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Manage Projects</h1>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/projects/ai-upload" className="flex items-center gap-2 bg-purple-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-300 text-sm">
            <FaRobot />
            <span>AI Extract</span>
          </Link>
          <Link to="/admin/projects/add" className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 text-sm">
            <FaPlus />
            <span>Add New</span>
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-lg">
        <div className="mb-4 relative">
          <input type="text" placeholder="Search loaded projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Mobile view for projects */}
        <div className="md:hidden">
          {selectedProjects.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex justify-between items-center">
              <span className="text-yellow-800 text-sm">
                {selectedProjects.length} project{selectedProjects.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setShowBulkConfirmModal(true)}
                className="flex items-center gap-2 bg-red-600 text-white font-bold px-3 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm"
              >
                <FaTrash />
                <span>Delete</span>
              </button>
            </div>
          )}
          {isLoading ? (
            <div className="flex justify-center items-center py-10"><FaSpinner className="animate-spin text-3xl text-indigo-600" /></div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map(project => (
                <div key={project.id} className={`border rounded-lg p-4 ${selectedProjects.includes(project.id) ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                  <div className="flex items-start justify-between">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => handleSelectProject(project.id)}
                      className="w-5 h-5 mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{project.title}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        <p>Department: {project.department}</p>
                        <p>Year: {project.year}</p>
                        <p>Price: ₦{project.priceNGN}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-3">
                    <Link to={`/admin/projects/edit/${project.id}`} className="text-blue-500 hover:text-blue-700 text-sm">
                      <FaEdit className="inline mr-1" /> Edit
                    </Link>
                    <button 
                      onClick={() => handleDeleteClick(project.id)} 
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      <FaTrash className="inline mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop view for projects */}
        <div className="hidden md:block overflow-x-auto">
          {selectedProjects.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex justify-between items-center">
              <span className="text-yellow-800">
                {selectedProjects.length} project{selectedProjects.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setShowBulkConfirmModal(true)}
                className="flex items-center gap-2 bg-red-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300"
              >
                <FaTrash />
                <span>Delete Selected ({selectedProjects.length})</span>
              </button>
            </div>
          )}
          {isLoading ? (
            <div className="flex justify-center items-center py-20"><FaSpinner className="animate-spin text-4xl text-indigo-600" /></div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 w-12">
                    <input
                      type="checkbox"
                      checked={selectedProjects.length > 0 && selectedProjects.length === filteredProjects.length}
                      onChange={handleSelectAll}
                      className="w-5 h-5"
                    />
                  </th>
                  <th className="p-3">Title</th><th className="p-3">Department</th><th className="p-3">Year</th><th className="p-3">Price</th><th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map(project => (
                  <tr key={project.id} className={`border-b hover:bg-gray-50 ${selectedProjects.includes(project.id) ? 'bg-blue-50' : ''}`}>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedProjects.includes(project.id)}
                        onChange={() => handleSelectProject(project.id)}
                        className="w-5 h-5"
                      />
                    </td>
                    <td className="p-3 font-semibold">{project.title}</td>
                    <td className="p-3">{project.department}</td>
                    <td className="p-3">{project.year}</td>
                    <td className="p-3">₦{project.priceNGN}</td>
                    <td className="p-3 text-center">
                      <Link to={`/admin/projects/edit/${project.id}`} className="text-blue-500 hover:text-blue-700 mr-4"><FaEdit /></Link>
                      <button onClick={() => handleDeleteClick(project.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {hasMore && !isLoading && (
          <div className="text-center mt-6">
            <button onClick={fetchMoreProjects} disabled={isMoreLoading} className="bg-gray-200 text-gray-800 font-bold px-6 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50">
              {isMoreLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to permanently delete this project? This action cannot be undone."
      />
      <BulkConfirmationModal
        isOpen={showBulkConfirmModal}
        onClose={() => setShowBulkConfirmModal(false)}
        onConfirm={confirmBulkDelete}
        title="Confirm Bulk Deletion"
        message="Are you sure you want to permanently delete the selected projects?"
        count={selectedProjects.length}
      />
    </div>
  );
};