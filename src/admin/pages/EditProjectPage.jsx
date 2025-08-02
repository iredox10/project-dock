
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { databases } from '../../appwrite/config';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID_PROJECTS;

const EditProjectPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [formData, setFormData] = useState({
    title: '', department: '', author: '', year: '',
    priceNGN: '', level: 'BSc', abstract: '', chapterOne: '',
    pages: '', fileSize: '', formats: '', chapters: '', includes: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, projectId);
        setFormData({
          title: response.title || '',
          department: response.department || '',
          author: response.author || '',
          year: response.year || '',
          priceNGN: response.priceNGN || '',
          level: response.level || 'BSc',
          abstract: response.abstract || '',
          chapterOne: response.chapterOne || '',
          pages: response.pages || '',
          fileSize: response.fileSize || '',
          formats: response.formats || '',
          chapters: response.chapters || '',
          includes: response.includes || '',
        });
      } catch (error) {
        setError(error.message);
        console.error('Failed to fetch project:', error);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, projectId, {
        ...formData,
        year: formData.year.toString(),
        priceNGN: parseFloat(formData.priceNGN),
        pages: parseInt(formData.pages),
        fileSize: parseFloat(formData.fileSize),
      });
      alert(`Project "${formData.title}" has been updated successfully!`);
      navigate('/admin/projects');
    } catch (error) {
      setError(error.message);
      console.error('Failed to update project:', error);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900">Edit Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-8">
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Project Title" className="w-full p-3 border rounded-lg" required />
            <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Author Name" className="w-full p-3 border rounded-lg" required />
            <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department" className="w-full p-3 border rounded-lg" required />
            <select name="level" value={formData.level} onChange={handleChange} className="w-full p-3 border rounded-lg">
              <option value="BSc">BSc</option> <option value="MSc">MSc</option> <option value="HND">HND</option> <option value="ND">ND</option>
            </select>
            <input type="text" name="year" value={formData.year} onChange={handleChange} placeholder="Year" className="w-full p-3 border rounded-lg" required />
            <input type="number" name="priceNGN" value={formData.priceNGN} onChange={handleChange} placeholder="Price (NGN)" className="w-full p-3 border rounded-lg" required />
          </div>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Details & Specs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="number" name="pages" value={formData.pages} onChange={handleChange} placeholder="Number of Pages" className="w-full p-3 border rounded-lg" />
            <input type="number" step="0.1" name="fileSize" value={formData.fileSize} onChange={handleChange} placeholder="File Size (MB)" className="w-full p-3 border rounded-lg" />
            <input type="text" name="formats" value={formData.formats} onChange={handleChange} placeholder="File Formats (e.g., PDF, DOCX)" className="w-full p-3 border rounded-lg" />
            <input type="text" name="chapters" value={formData.chapters} onChange={handleChange} placeholder="Chapters (e.g., 1-5)" className="w-full p-3 border rounded-lg" />
          </div>
          <div className="mt-6">
            <input type="text" name="includes" value={formData.includes} onChange={handleChange} placeholder="What's Included (e.g., Full Source Code)" className="w-full p-3 border rounded-lg" />
          </div>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Project Content</h3>
          <textarea name="abstract" value={formData.abstract} onChange={handleChange} placeholder="Project Abstract..." rows="5" className="w-full p-3 border rounded-lg" required></textarea>
          <textarea name="chapterOne" value={formData.chapterOne} onChange={handleChange} placeholder="Chapter One Preview..." rows="8" className="w-full p-3 border rounded-lg mt-4" required></textarea>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300">
            <FaSave />
            <span>Update Project</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProjectPage;
