import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUploadCloud, FiSave, FiBook, FiInfo, FiDollarSign, FiFileText, FiLoader, FiCpu, FiLayers } from 'react-icons/fi';
import { getStandardizedDepartment } from '../../api/departmentService';
import { createProject } from '../../api/projectServices';
import { Modal, useModal } from '../../components/Modal';

export const AddProjectPage = () => {
  const navigate = useNavigate();
  const { modal, showModal, closeModal } = useModal();
  const [formData, setFormData] = useState({
    title: '', department: '', author: '', year: new Date().getFullYear(),
    priceNGN: '', level: 'BSc', abstract: '', chapterOne: '',
    pages: '', fileSize: '', formats: 'PDF, DOCX', chapters: '1-5',
    includes: 'References, Questionnaire'
  });
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    try {
      // Standardize department name to avoid duplicates
      const standardizedDepartment = await getStandardizedDepartment(formData.department);

      const projectData = {
        title: formData.title,
        author: formData.author,
        department: standardizedDepartment, // Use standardized department name
        level: formData.level,
        abstractFileId: formData.abstract, // Map 'abstract' to 'abstractFileId' field in your db
        chapterOneFileId: formData.chapterOne, // Map 'chapterOne' to 'chapterOneFileId' field in your db
        year: Number(formData.year),
        priceNGN: Number(formData.priceNGN),
        pages: Number(formData.pages) || 0,
        // Split comma-separated strings into arrays for clean data storage
        formats: typeof formData.formats === 'string'
          ? formData.formats
          : Array.isArray(formData.formats) ? formData.formats.join(', ') : formData.formats,
        includes: typeof formData.includes === 'string'
          ? formData.includes
          : Array.isArray(formData.includes) ? formData.includes.join(', ') : formData.includes,
        downloadCount: 0,
        isActive: true
      };

      await createProject(projectData);

      showModal('Success!', `Project "${formData.title}" has been added successfully!`, 'success');
      setTimeout(() => navigate('/admin/projects'), 2000);

    } catch (error) {
      console.error("Error adding project: ", error);
      showModal('Error', `Failed to add project: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">New Project</h1>
            <p className="text-sm text-gray-500 mt-1">Add a new project to the database.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/projects/ai-upload" className="flex items-center gap-2 bg-gray-900 text-white font-medium px-4 py-2 rounded-md hover:bg-black transition-all duration-300 text-sm shadow-sm">
              <FiCpu className="w-4 h-4" />
              <span>AI Extract</span>
            </Link>
            <Link to="/admin/projects/bulk-upload" className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-medium px-4 py-2 rounded-md hover:bg-gray-50 transition-all duration-300 text-sm shadow-sm">
              <FiUploadCloud className="w-4 h-4" />
              <span>Bulk Upload</span>
            </Link>
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
            disabled={isLoading}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-900 text-white font-medium px-8 py-3 rounded-md hover:bg-black transition-all duration-300 disabled:bg-gray-400 shadow-lg shadow-gray-200"
          >
            {isLoading ? <FiLoader className="animate-spin" /> : <FiSave />}
            <span>{isLoading ? 'Saving...' : 'Save & Publish Project'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};