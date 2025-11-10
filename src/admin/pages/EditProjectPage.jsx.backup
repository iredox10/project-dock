
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaBook, FaInfoCircle, FaDollarSign, FaFileAlt, FaSpinner } from 'react-icons/fa';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export const EditProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const projectRef = doc(db, 'projects', projectId);
        const docSnap = await getDoc(projectRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Convert arrays back to comma-separated strings for the form inputs
          setFormData({
            ...data,
            formats: Array.isArray(data.formats) ? data.formats.join(', ') : data.formats,
            includes: Array.isArray(data.includes) ? data.includes.join(', ') : data.includes,
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
      alert('Please fill out Title, Department, and Price.');
      return;
    }
    setIsSaving(true);

    try {
      const projectRef = doc(db, 'projects', projectId);
      const projectData = {
        ...formData,
        year: Number(formData.year),
        priceNGN: Number(formData.priceNGN),
        pages: Number(formData.pages) || 0,
        formats: formData.formats.split(',').map(item => item.trim()),
        includes: formData.includes.split(',').map(item => item.trim()),
        updatedAt: serverTimestamp() // Add an updated timestamp
      };

      await updateDoc(projectRef, projectData);

      alert(`Project "${formData.title}" has been updated successfully!`);
      navigate('/admin/projects');

    } catch (error) {
      console.error("Error updating document: ", error);
      alert('Failed to update project. Please check the console for errors.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><FaSpinner className="animate-spin text-4xl text-indigo-600" /></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin/projects" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-semibold">
          <FaArrowLeft />
          Back to Manage Projects
        </Link>
      </div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Edit Project</h1>
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
            <button type="submit" disabled={isSaving} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-6 py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:bg-gray-400">
              {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Changes'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
