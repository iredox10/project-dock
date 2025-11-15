import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaBook, FaInfoCircle, FaDollarSign, FaFileAlt, FaSpinner } from 'react-icons/fa';
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
    return <div className="flex justify-center items-center h-full"><FaSpinner className="animate-spin text-4xl text-indigo-600" /></div>;
  }

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
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Edit Project</h1>
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
            disabled={isSaving} 
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:bg-gray-400"
          >
            {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};