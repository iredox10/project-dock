
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFileCsv, FaFileExcel, FaCloudUploadAlt, FaTrash, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { db } from '../../firebase/config.js'; // Your Firebase config
import { collection, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import Papa from 'papaparse'; // Import Papaparse

export const BulkUploadPage = () => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [progressMessage, setProgressMessage] = useState('');

  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
      setUploadSuccess(false);
      setUploadError('');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setUploadSuccess(false);
      setUploadError('');
    }
  };

  const handleUpload = () => {
    if (!uploadedFile) return;
    setIsUploading(true);
    setUploadSuccess(false);
    setUploadError('');
    setProgressMessage('Parsing file...');

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const projects = results.data;
        if (!projects || projects.length === 0) {
          setUploadError('The file is empty or formatted incorrectly.');
          setIsUploading(false);
          return;
        }

        setProgressMessage(`Parsed ${projects.length} projects. Starting upload...`);

        // Use Firestore Batch Writes for efficiency
        const batchSize = 400; // Firestore allows up to 500 operations per batch
        for (let i = 0; i < projects.length; i += batchSize) {
          const batch = writeBatch(db);
          const chunk = projects.slice(i, i + batchSize);

          chunk.forEach((project) => {
            // Ensure required fields exist and data types are correct
            const projectData = {
              ...project,
              year: Number(project.year) || 0,
              priceNGN: Number(project.priceNGN) || 0,
              downloadCount: 0,
              createdAt: serverTimestamp(),
            };
            const projectRef = doc(collection(db, 'projects'));
            batch.set(projectRef, projectData);
          });

          try {
            await batch.commit();
            setProgressMessage(`Uploaded projects ${i + 1} to ${Math.min(i + batchSize, projects.length)}...`);
          } catch (error) {
            setUploadError('An error occurred during upload. Some projects may not have been saved.');
            console.error("Error committing batch: ", error);
            setIsUploading(false);
            return;
          }
        }

        setIsUploading(false);
        setUploadSuccess(true);
        setUploadedFile(null);
        setProgressMessage('');
        setTimeout(() => navigate('/admin/projects'), 2000); // Redirect after success
      },
      error: (error) => {
        setUploadError('Failed to parse the file.');
        console.error("Papaparse error:", error);
        setIsUploading(false);
      }
    });
  };

  const handleDownloadTemplate = () => {
    const headers = ["title", "department", "author", "year", "priceNGN", "level", "abstract", "chapterOne", "pages", "fileSize", "formats", "chapters", "includes"];
    const csvContent = headers.join(",") + "\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "project_upload_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="mb-6"><Link to="/admin/projects" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-semibold"><FaArrowLeft />Back to Manage Projects</Link></div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Bulk Upload Projects</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h3>
          <div className="space-y-4">
            <div className="flex gap-4"><div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">1</div><div><h4 className="font-bold">Download the Template</h4><p className="text-gray-600">Start by downloading our CSV template to ensure your data is structured correctly.</p><button onClick={handleDownloadTemplate} className="font-bold text-indigo-600 hover:underline mt-1 inline-block">Download CSV Template &rarr;</button></div></div>
            <div className="flex gap-4"><div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">2</div><div><h4 className="font-bold">Fill in Your Data</h4><p className="text-gray-600">Open with Excel or Google Sheets and add your project details. Do not change the column headers.</p></div></div>
            <div className="flex gap-4"><div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">3</div><div><h4 className="font-bold">Upload the File</h4><p className="text-gray-600">Drag and drop your completed CSV file into the uploader to add all projects to the library.</p></div></div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Upload Your File</h3>
          <div onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
            <label htmlFor="dropzone-file" className="w-full h-full flex flex-col items-center justify-center">
              <FaCloudUploadAlt className={`w-12 h-12 mb-3 transition-colors duration-300 ${isDragging ? 'text-indigo-600' : 'text-gray-400'}`} />
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500">CSV file only</p>
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".csv" />
            </label>
          </div>

          {uploadSuccess && <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg font-semibold flex items-center gap-3"><FaCheckCircle />Upload complete! Redirecting...</div>}
          {uploadError && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg font-semibold">{uploadError}</div>}
          {isUploading && progressMessage && <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded-lg font-semibold flex items-center gap-3"><FaSpinner className="animate-spin" /> {progressMessage}</div>}

          {uploadedFile && !uploadSuccess && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg font-semibold flex items-center justify-between">
              <div className="flex items-center gap-3"><FaFileCsv className="text-blue-600 text-2xl" /> <span className="text-gray-800">{uploadedFile.name}</span></div>
              <button onClick={() => setUploadedFile(null)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
            </div>
          )}

          <div className="mt-auto pt-6">
            <button onClick={handleUpload} disabled={!uploadedFile || isUploading} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {isUploading ? <><FaSpinner className="animate-spin" /><span>Processing...</span></> : <><FaCloudUploadAlt /><span>Process & Upload File</span></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
