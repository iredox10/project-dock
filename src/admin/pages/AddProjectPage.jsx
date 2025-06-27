
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCloudUploadAlt, FaSave } from 'react-icons/fa';
import { db } from '../../firebase/config'; // Import your Firebase config
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const AddProjectPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    author: '',
    year: new Date().getFullYear(),
    priceNGN: '',
    level: 'BSc',
    abstract: '',
    chapterOne: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.department || !formData.priceNGN) {
      alert('Please fill out all required fields.');
      return;
    }
    setIsLoading(true);

    try {
      // Prepare the data for Firestore
      const projectData = {
        ...formData,
        year: Number(formData.year),
        priceNGN: Number(formData.priceNGN),
        downloadCount: 0,
        createdAt: serverTimestamp() // Add a server-side timestamp
      };

      // Get a reference to the 'projects' collection and add a new document
      const projectsCollectionRef = collection(db, 'projects');
      await addDoc(projectsCollectionRef, projectData);

      alert(`Project "${formData.title}" has been added successfully!`);
      navigate('/admin/projects'); // Redirect back to the projects list

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900">Add a Single Project</h1>
        <Link to="/admin/projects/bulk-upload" className="flex items-center gap-2 bg-green-600 text-white font-bold px-5 py-3 rounded-lg hover:bg-green-700 transition-all duration-300">
          <FaCloudUploadAlt />
          <span>Bulk Upload Projects</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-8">
        {/* Section 1: Basic Information */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Project Title" className="w-full p-3 border rounded-lg" required />
            <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Author Name" className="w-full p-3 border rounded-lg" required />
            <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department" className="w-full p-3 border rounded-lg" required />
            <select name="level" value={formData.level} onChange={handleChange} className="w-full p-3 border rounded-lg">
              <option value="BSc">BSc</option> <option value="MSc">MSc</option> <option value="HND">HND</option> <option value="ND">ND</option>
            </select>
            <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Year" className="w-full p-3 border rounded-lg" required />
            <input type="number" name="priceNGN" value={formData.priceNGN} onChange={handleChange} placeholder="Price (NGN)" className="w-full p-3 border rounded-lg" required />
          </div>
        </div>

        {/* Section 2: Content */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Project Content</h3>
          <textarea name="abstract" value={formData.abstract} onChange={handleChange} placeholder="Project Abstract..." rows="5" className="w-full p-3 border rounded-lg" required></textarea>
          <textarea name="chapterOne" value={formData.chapterOne} onChange={handleChange} placeholder="Chapter One Preview..." rows="8" className="w-full p-3 border rounded-lg mt-4" required></textarea>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isLoading} className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
            <FaSave />
            <span>{isLoading ? 'Saving...' : 'Save Project'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
