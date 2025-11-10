
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCloudUploadAlt, FaSave, FaBook, FaInfoCircle, FaDollarSign, FaFileAlt, FaSpinner, FaRobot } from 'react-icons/fa';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const AddProjectPage = () => {
  const navigate = useNavigate();
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
      alert('Please fill out Title, Department, and Price.');
      return;
    }
    setIsLoading(true);

    try {
      const projectData = {
        ...formData,
        year: Number(formData.year),
        priceNGN: Number(formData.priceNGN),
        pages: Number(formData.pages) || 0,
        // Split comma-separated strings into arrays for clean data storage
        formats: formData.formats.split(',').map(item => item.trim()),
        includes: formData.includes.split(',').map(item => item.trim()),
        downloadCount: 0,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'projects'), projectData);

      alert(`Project "${formData.title}" has been added successfully!`);
      navigate('/admin/projects');

    } catch (error) {
      console.error("Error adding document: ", error);
      alert('Failed to add project. Please check the console for errors.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin/projects" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-semibold">
          <FaArrowLeft />
          Back to Manage Projects
        </Link>
      </div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Create a New Project</h1>
        <div className="flex gap-3">
          <Link to="/admin/projects/ai-upload" className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-5 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300">
            <FaRobot />
            <span>AI Extract from PDF/DOCX</span>
          </Link>
          <Link to="/admin/projects/bulk-upload" className="flex items-center gap-2 bg-green-600 text-white font-bold px-5 py-3 rounded-lg hover:bg-green-700 transition-all duration-300">
            <FaCloudUploadAlt />
            <span>Bulk Upload CSV/Excel</span>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-gray-700 flex items-center gap-2"><FaBook /> Project Content</h3>
            <div className="space-y-6">
              <textarea name="abstract" value={formData.abstract} onChange={handleChange} placeholder="Project Abstract..." rows="6" className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400" required></textarea>
              <textarea name="chapterOne" value={formData.chapterOne} onChange={handleChange} placeholder="Chapter One Preview..." rows="10" className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400" required></textarea>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-gray-700 flex items-center gap-2"><FaInfoCircle /> Basic Information</h3>
            <div className="space-y-4">
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Project Title" className="w-full p-3 border rounded-lg" required />
              <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Author Name" className="w-full p-3 border rounded-lg" required />
              <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department" className="w-full p-3 border rounded-lg" required />
              <select name="level" value={formData.level} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
                <option>BSc</option> <option>MSc</option> <option>HND</option> <option>ND</option><option>PhD</option>
              </select>
              <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Year" className="w-full p-3 border rounded-lg" required />
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-gray-700 flex items-center gap-2"><FaDollarSign /> Pricing & Details</h3>
            <div className="space-y-4">
              <input type="number" name="priceNGN" value={formData.priceNGN} onChange={handleChange} placeholder="Price (NGN)" className="w-full p-3 border rounded-lg" required />
              <input type="number" name="pages" value={formData.pages} onChange={handleChange} placeholder="Number of Pages" className="w-full p-3 border rounded-lg" />
              <input type="text" name="fileSize" value={formData.fileSize} onChange={handleChange} placeholder="File Size (e.g., 2.5 MB)" className="w-full p-3 border rounded-lg" />
              <input type="text" name="chapters" value={formData.chapters} onChange={handleChange} placeholder="Chapters (e.g., 1-5)" className="w-full p-3 border rounded-lg" />
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-gray-700 flex items-center gap-2"><FaFileAlt /> Formats & Included Items</h3>
            <div className="space-y-4">
              <input type="text" name="formats" value={formData.formats} onChange={handleChange} placeholder="Formats (e.g., PDF, DOCX)" className="w-full p-3 border rounded-lg" />
              <input type="text" name="includes" value={formData.includes} onChange={handleChange} placeholder="Included items (e.g., References, Questionnaire)" className="w-full p-3 border rounded-lg" />
            </div>
          </div>
          <div>
            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-6 py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:bg-gray-400">
              {isLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
              <span>{isLoading ? 'Saving...' : 'Save & Publish Project'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
