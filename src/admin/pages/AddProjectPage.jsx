import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCloudUploadAlt, FaSave, FaBook, FaInfoCircle, FaDollarSign, FaFileAlt, FaSpinner, FaRobot } from 'react-icons/fa';
import { getStandardizedDepartment } from '../../api/departmentService';
import { createProject, updateProject } from '../../api/projectServices';
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
    <div className="w-full">
      <Modal {...modal} onClose={closeModal} />

      <div className="mb-6">
        <Link to="/admin/projects" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-semibold">
          <FaArrowLeft />
          Back to Manage Projects
        </Link>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Create a New Project</h1>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/projects/ai-upload" className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 text-sm">
            <FaRobot />
            <span>AI Extract</span>
          </Link>
          <Link to="/admin/projects/bulk-upload" className="flex items-center gap-2 bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 text-sm">
            <FaCloudUploadAlt />
            <span>Bulk Upload</span>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-700 flex items-center gap-2"><FaBook /> Project Content</h3>
          <div className="space-y-4">
            <textarea 
              name="abstract" 
              value={formData.abstract} 
              onChange={handleChange} 
              placeholder="Project Abstract..." 
              rows="4" 
              className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400" 
              required
            ></textarea>
            <textarea 
              name="chapterOne" 
              value={formData.chapterOne} 
              onChange={handleChange} 
              placeholder="Chapter One Preview..." 
              rows="6" 
              className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400" 
              required
            ></textarea>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-700 flex items-center gap-2"><FaInfoCircle /> Basic Information</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="Project Title" 
                className="w-full p-3 border rounded-lg" 
                required 
              />
              <input 
                type="text" 
                name="author" 
                value={formData.author} 
                onChange={handleChange} 
                placeholder="Author Name" 
                className="w-full p-3 border rounded-lg" 
                required 
              />
              <input 
                type="text" 
                name="department" 
                value={formData.department} 
                onChange={handleChange} 
                placeholder="Department" 
                className="w-full p-3 border rounded-lg" 
                required 
              />
              <select 
                name="level" 
                value={formData.level} 
                onChange={handleChange} 
                className="w-full p-3 border rounded-lg bg-white"
              >
                <option>BSc</option> 
                <option>MSc</option> 
                <option>HND</option> 
                <option>ND</option>
                <option>PhD</option>
              </select>
              <input 
                type="number" 
                name="year" 
                value={formData.year} 
                onChange={handleChange} 
                placeholder="Year" 
                className="w-full p-3 border rounded-lg" 
                required 
              />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-700 flex items-center gap-2"><FaDollarSign /> Pricing & Details</h3>
            <div className="space-y-4">
              <input 
                type="number" 
                name="priceNGN" 
                value={formData.priceNGN} 
                onChange={handleChange} 
                placeholder="Price (NGN)" 
                className="w-full p-3 border rounded-lg" 
                required 
              />
              <input 
                type="number" 
                name="pages" 
                value={formData.pages} 
                onChange={handleChange} 
                placeholder="Number of Pages" 
                className="w-full p-3 border rounded-lg" 
              />
              <input 
                type="text" 
                name="fileSize" 
                value={formData.fileSize} 
                onChange={handleChange} 
                placeholder="File Size (e.g., 2.5 MB)" 
                className="w-full p-3 border rounded-lg" 
              />
              <input 
                type="text" 
                name="chapters" 
                value={formData.chapters} 
                onChange={handleChange} 
                placeholder="Chapters (e.g., 1-5)" 
                className="w-full p-3 border rounded-lg" 
              />
              <input 
                type="text" 
                name="formats" 
                value={formData.formats} 
                onChange={handleChange} 
                placeholder="Formats (e.g., PDF, DOCX)" 
                className="w-full p-3 border rounded-lg" 
              />
              <input 
                type="text" 
                name="includes" 
                value={formData.includes} 
                onChange={handleChange} 
                placeholder="Included items (e.g., References, Questionnaire)" 
                className="w-full p-3 border rounded-lg" 
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:bg-gray-400"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
            <span>{isLoading ? 'Saving...' : 'Save & Publish Project'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};