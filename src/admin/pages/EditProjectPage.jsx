import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiBook, FiInfo, FiDollarSign, FiLoader } from 'react-icons/fi';
import { getProjectById, updateProject } from '../../api/projectServices';
import { Modal, useModal } from '../../components/Modal';

export const EditProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { modal, showModal, closeModal } = useModal();
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const projectData = await getProjectById(projectId);

        if (projectData) {
          // Convert arrays back to comma-separated strings for the form inputs
          // Also map abstractFileId and chapterOneFileId to abstract and chapterOne for form
          setFormData({
            ...projectData,
            id: projectData.$id, // Store the ID separately since Appwrite uses $id
            abstract: projectData.abstractFileId || '', // Map abstractFileId to abstract for form
            chapterOne: projectData.chapterOneFileId || '', // Map chapterOneFileId to chapterOne for form
            formats: Array.isArray(projectData.formats) ? projectData.formats.join(', ') : projectData.formats,
            includes: Array.isArray(projectData.includes) ? projectData.includes.join(', ') : projectData.includes,
          });
        } else {
          console.error("No such project!");
          navigate('/admin/projects'); // Redirect if project not found
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.department || !formData.priceNGN) {
      showModal('Missing Information', 'Please fill out Title, Department, and Price.', 'warning');
      return;
    }
    setIsSaving(true);

    try {
      const projectData = {
        ...formData,
        // Map form fields to database fields
        abstractFileId: formData.abstract,
        chapterOneFileId: formData.chapterOne,
        year: Number(formData.year),
        priceNGN: Number(formData.priceNGN),
        pages: Number(formData.pages) || 0,
        formats: typeof formData.formats === 'string' ? formData.formats : Array.isArray(formData.formats) ? formData.formats.join(', ') : formData.formats,
        includes: typeof formData.includes === 'string' ? formData.includes : Array.isArray(formData.includes) ? formData.includes.join(', ') : formData.includes,
        // Remove the form-specific fields that shouldn't be saved to the database
        id: undefined, // Don't save the temp id field
        abstract: undefined, // Don't save the temp abstract field
        chapterOne: undefined, // Don't save the temp chapterOne field
      };

      await updateProject(projectId, projectData);

      showModal("Success!", `Project "${formData.title}" has been updated successfully!`, "success");
      setTimeout(() => navigate("/admin/projects"), 2000);

    } catch (error) {
      console.error("Error updating project: ", error);
      showModal('Error', 'Failed to update project. Please check the console for errors.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin text-3xl text-gray-400" /></div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Modal {...modal} onClose={closeModal} />

      <div className="mb-8">
        <Link to="/admin/projects" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors mb-4 text-sm">
          <FiArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Project</h1>
            <p className="text-sm text-gray-500 mt-1">Update project details and content.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 flex items-center gap-2">
            <FiBook className="w-5 h-5 text-gray-400" />
            Project Content
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Abstract</label>
              <textarea
                name="abstract"
                value={formData.abstract}
                onChange={handleChange}
                placeholder="Paste project abstract here..."
                rows="6"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all resize-y"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chapter One Preview</label>
              <textarea
                name="chapterOne"
                value={formData.chapterOne}
                onChange={handleChange}
                placeholder="Paste chapter one preview here..."
                rows="8"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all resize-y"
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 flex items-center gap-2">
              <FiInfo className="w-5 h-5 text-gray-400" />
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Project Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Design and Implementation of..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Author Name</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
                  >
                    <option>BSc</option>
                    <option>MSc</option>
                    <option>HND</option>
                    <option>ND</option>
                    <option>PhD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="YYYY"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 flex items-center gap-2">
              <FiDollarSign className="w-5 h-5 text-gray-400" />
              Pricing & Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Price (NGN)</label>
                <input
                  type="number"
                  name="priceNGN"
                  value={formData.priceNGN}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Pages</label>
                  <input
                    type="number"
                    name="pages"
                    value={formData.pages}
                    onChange={handleChange}
                    placeholder="e.g. 45"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">File Size</label>
                  <input
                    type="text"
                    name="fileSize"
                    value={formData.fileSize}
                    onChange={handleChange}
                    placeholder="e.g. 2.5 MB"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Chapters</label>
                <input
                  type="text"
                  name="chapters"
                  value={formData.chapters}
                  onChange={handleChange}
                  placeholder="e.g. 1-5"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Formats</label>
                <input
                  type="text"
                  name="formats"
                  value={formData.formats}
                  onChange={handleChange}
                  placeholder="e.g. PDF, DOCX"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Includes</label>
                <input
                  type="text"
                  name="includes"
                  value={formData.includes}
                  onChange={handleChange}
                  placeholder="e.g. References, Questionnaire"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-900 text-white font-medium px-8 py-3 rounded-md hover:bg-black transition-all duration-300 disabled:bg-gray-400 shadow-lg shadow-gray-200"
          >
            {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />}
            <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};