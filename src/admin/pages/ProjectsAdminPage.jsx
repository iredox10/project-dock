import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Modal, useModal } from '../../components/Modal';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit, FiTrash, FiLoader, FiCpu, FiFilter, FiMoreHorizontal } from 'react-icons/fi';
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject, getProjectsByDepartment, getProjectsByLevel } from '../../api/projectServices';
import { Query } from 'appwrite';


// Reusable Confirmation Modal
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, showDeleteFileOption, onDeleteFileChange, deleteFile }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-100 w-full max-w-md text-center transform transition-all">
        <h2 className="text-xl font-bold mb-2 text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">{message}</p>

        {showDeleteFileOption && (
          <div className="mb-6 flex items-center justify-center gap-2">
            <input
              type="checkbox"
              id="deleteFile"
              checked={deleteFile}
              onChange={(e) => onDeleteFileChange(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="deleteFile" className="text-sm text-gray-700 select-none cursor-pointer">
              Also delete associated project file?
            </label>
          </div>
        )}

        <div className="flex justify-center gap-3">
          <button onClick={onClose} className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors">Confirm Delete</button>
        </div>
      </div>
    </div>
  );
};

// Bulk Delete Confirmation Modal
const BulkConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, count, showDeleteFileOption, onDeleteFileChange, deleteFile }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-100 w-full max-w-md text-center transform transition-all">
        <h2 className="text-xl font-bold mb-2 text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mb-2">{message}</p>
        <p className="text-base font-semibold text-red-600 mb-6">{count} project{count !== 1 ? 's' : ''} will be deleted.</p>

        {showDeleteFileOption && (
          <div className="mb-6 flex items-center justify-center gap-2">
            <input
              type="checkbox"
              id="bulkDeleteFile"
              checked={deleteFile}
              onChange={(e) => onDeleteFileChange(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="bulkDeleteFile" className="text-sm text-gray-700 select-none cursor-pointer">
              Also delete associated project files?
            </label>
          </div>
        )}

        <div className="flex justify-center gap-3">
          <button onClick={onClose} className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors">Confirm Delete</button>
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
  const [deleteFileWithProject, setDeleteFileWithProject] = useState(false);

  // Inline Editing State
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
    setDeleteFileWithProject(false); // Reset default
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete, deleteFileWithProject);
      setProjects(projects.filter(p => p.id !== projectToDelete));
      setShowConfirmModal(false);
      setProjectToDelete(null);
      setDeleteFileWithProject(false);
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
        deleteProject(projectId, deleteFileWithProject)
      );
      await Promise.all(deletePromises);

      // Update the local state to remove deleted projects
      setProjects(prev => prev.filter(p => !selectedProjects.includes(p.id)));

      // Clear selection
      setSelectedProjects([]);
      setShowBulkConfirmModal(false);
      setDeleteFileWithProject(false);
    } catch (error) {
      console.error("Error deleting projects: ", error);
      showModal("Error", "Failed to delete some or all projects.", "error");
    }
  };

  // Inline Editing Functions
  const handleDoubleClick = (project) => {
    setEditingId(project.id);
    setEditValue(project.priceNGN);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleSave = async (id) => {
    if (!editValue || isNaN(editValue)) {
      handleCancel();
      return;
    }

    setIsSaving(true);
    try {
      const updatedProject = await updateProject(id, {
        priceNGN: parseFloat(editValue)
      });

      setProjects(prev => prev.map(p =>
        p.id === id ? { ...p, priceNGN: parseFloat(editValue) } : p
      ));

      setEditingId(null);
      setEditValue('');
      showModal("Success", "Price updated successfully", "success");
    } catch (error) {
      console.error("Error updating price:", error);
      showModal("Error", "Failed to update price", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      handleSave(id);
    } else if (e.key === 'Escape') {
      handleCancel();
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and organize all project uploads.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/projects/ai-upload" className="flex items-center gap-2 bg-gray-900 text-white font-medium px-4 py-2 rounded-md hover:bg-black transition-all duration-300 text-sm shadow-sm">
            <FiCpu className="w-4 h-4" />
            <span>AI Extract</span>
          </Link>
          <Link to="/admin/projects/add" className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-medium px-4 py-2 rounded-md hover:bg-gray-50 transition-all duration-300 text-sm shadow-sm">
            <FiPlus className="w-4 h-4" />
            <span>Add New</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          {selectedProjects.length > 0 && (
            <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-md border border-gray-200">
              <span className="text-xs font-medium text-gray-600">
                {selectedProjects.length} selected
              </span>
              <button
                onClick={() => {
                  setDeleteFileWithProject(false);
                  setShowBulkConfirmModal(true);
                }}
                className="text-red-600 hover:text-red-700 text-xs font-medium flex items-center gap-1"
              >
                <FiTrash className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile view for projects */}
        <div className="md:hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-12"><FiLoader className="animate-spin text-2xl text-gray-400" /></div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredProjects.map(project => (
                <div key={project.id} className={`p-4 ${selectedProjects.includes(project.id) ? 'bg-gray-50' : 'bg-white'}`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => handleSelectProject(project.id)}
                      className="w-4 h-4 mt-1 rounded border-gray-300 text-gray-900 focus:ring-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{project.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {project.department}
                        </span>
                        <span className="text-xs text-gray-500 py-0.5">
                          {project.year}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-2">₦{project.priceNGN}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link to={`/admin/projects/edit/${project.id}`} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                        <FiEdit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(project.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <FiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop view for projects */}
        <div className="hidden md:block overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20"><FiLoader className="animate-spin text-3xl text-gray-300" /></div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedProjects.length > 0 && selectedProjects.length === filteredProjects.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-200"
                    />
                  </th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProjects.map(project => (
                  <tr key={project.id} className={`hover:bg-gray-50 transition-colors ${selectedProjects.includes(project.id) ? 'bg-gray-50' : ''}`}>
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedProjects.includes(project.id)}
                        onChange={() => handleSelectProject(project.id)}
                        className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-200"
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900 max-w-xs truncate" title={project.title}>{project.title}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{project.department}</td>
                    <td className="p-4 text-sm text-gray-600">{project.year}</td>
                    <td
                      className="p-4 text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                      onDoubleClick={() => handleDoubleClick(project)}
                      title="Double click to edit price"
                    >
                      {editingId === project.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">₦</span>
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, project.id)}
                            onBlur={() => handleSave(project.id)}
                            autoFocus
                            className="w-24 px-2 py-1 text-sm border border-indigo-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          {isSaving && <FiLoader className="animate-spin text-indigo-600 w-3 h-3" />}
                        </div>
                      ) : (
                        `₦${project.priceNGN?.toLocaleString()}`
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/projects/edit/${project.id}`} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                          <FiEdit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDeleteClick(project.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                          <FiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {hasMore && !isLoading && (
          <div className="p-4 border-t border-gray-100 text-center">
            <button onClick={fetchMoreProjects} disabled={isMoreLoading} className="text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors">
              {isMoreLoading ? 'Loading...' : 'Load More Projects'}
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
        showDeleteFileOption={true}
        deleteFile={deleteFileWithProject}
        onDeleteFileChange={setDeleteFileWithProject}
      />
      <BulkConfirmationModal
        isOpen={showBulkConfirmModal}
        onClose={() => setShowBulkConfirmModal(false)}
        onConfirm={confirmBulkDelete}
        title="Confirm Bulk Deletion"
        message="Are you sure you want to permanently delete the selected projects?"
        count={selectedProjects.length}
        showDeleteFileOption={true}
        deleteFile={deleteFileWithProject}
        onDeleteFileChange={setDeleteFileWithProject}
      />
    </div>
  );
};