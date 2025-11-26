import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiFileText, FiUploadCloud, FiTrash2, FiCheckCircle, FiLoader, FiDownload } from 'react-icons/fi';
import { db } from '../../firebase/config';
import { collection, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import * as XLSX from 'xlsx'; // Import the xlsx library

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
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
      setUploadSuccess(false); setUploadError('');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setUploadSuccess(false); setUploadError('');
    }
  };

  const handleUpload = () => {
    if (!uploadedFile) return;
    setIsUploading(true);
    setUploadSuccess(false);
    setUploadError('');
    setProgressMessage('Reading file...');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const projects = XLSX.utils.sheet_to_json(worksheet);

        if (!projects || projects.length === 0) {
          setUploadError('The file is empty or formatted incorrectly.');
          setIsUploading(false);
          return;
        }

        setProgressMessage(`Parsed ${projects.length} projects. Starting upload...`);

        const batchSize = 400;
        for (let i = 0; i < projects.length; i += batchSize) {
          const batch = writeBatch(db);
          const chunk = projects.slice(i, i + batchSize);
          chunk.forEach((project) => {
            const projectData = { ...project, year: Number(project.year) || 0, priceNGN: Number(project.priceNGN) || 0, downloadCount: 0, createdAt: serverTimestamp() };
            const projectRef = doc(collection(db, 'projects'));
            batch.set(projectRef, projectData);
          });
          await batch.commit();
          setProgressMessage(`Uploaded projects ${i + 1} to ${Math.min(i + batchSize, projects.length)}...`);
        }

        setIsUploading(false);
        setUploadSuccess(true);
        setUploadedFile(null);
        setProgressMessage('');
        setTimeout(() => navigate('/admin/projects'), 2000);
      } catch (error) {
        setUploadError('An error occurred during processing. Make sure the file format is correct.');
        console.error("Error processing or uploading file: ", error);
        setIsUploading(false);
      }
    };
    reader.readAsBinaryString(uploadedFile);
  };

  const handleDownloadTemplate = () => {
    const headers = ["title", "department", "author", "year", "priceNGN", "level", "abstract", "chapterOne", "pages", "fileSize", "formats", "chapters", "includes"];
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Projects");
    XLSX.writeFile(wb, "project_upload_template.xlsx");
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-8">
        <Link to="/admin/projects" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors mb-4 text-sm">
          <FiArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FiUploadCloud className="text-gray-900" />
              Bulk Upload
            </h1>
            <p className="text-sm text-gray-500 mt-1">Upload multiple projects via Excel/CSV.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">How It Works</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Download the Template</h4>
                <p className="text-sm text-gray-500 mt-1">Start by downloading our Excel template to ensure your data is structured correctly.</p>
                <button
                  onClick={handleDownloadTemplate}
                  className="text-sm font-medium text-gray-900 hover:text-black underline mt-2 inline-flex items-center gap-1"
                >
                  <FiDownload className="w-3 h-3" /> Download Template
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Fill in Your Data</h4>
                <p className="text-sm text-gray-500 mt-1">Open the template with any spreadsheet software and add your project details. Do not change the column headers.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Upload the File</h4>
                <p className="text-sm text-gray-500 mt-1">Drag and drop your completed spreadsheet file into the uploader to add all projects to the library.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Upload Your File</h3>
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
          >
            <label htmlFor="dropzone-file" className="w-full h-full flex flex-col items-center justify-center">
              <FiUploadCloud className={`w-10 h-10 mb-3 transition-colors duration-300 ${isDragging ? 'text-gray-900' : 'text-gray-400'}`} />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold text-gray-700">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">XLSX, XLS, or CSV</p>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
            </label>
          </div>

          {uploadSuccess && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md font-medium flex items-center gap-3 text-sm border border-green-100">
              <FiCheckCircle /> Upload complete! Redirecting...
            </div>
          )}
          {uploadError && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md font-medium text-sm border border-red-100">
              {uploadError}
            </div>
          )}
          {isUploading && progressMessage && (
            <div className="mt-4 p-4 bg-gray-50 text-gray-700 rounded-md font-medium flex items-center gap-3 text-sm border border-gray-100">
              <FiLoader className="animate-spin" /> {progressMessage}
            </div>
          )}

          {uploadedFile && !uploadSuccess && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md font-medium flex items-center justify-between border border-gray-100">
              <div className="flex items-center gap-3">
                <FiFileText className="text-gray-500 text-xl" />
                <span className="text-gray-900 text-sm truncate">{uploadedFile.name}</span>
              </div>
              <button
                onClick={() => setUploadedFile(null)}
                className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0 ml-4"
              >
                <FiTrash2 />
              </button>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleUpload}
              disabled={!uploadedFile || isUploading}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-medium py-3 px-6 rounded-md hover:bg-black transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
            >
              {isUploading ? (
                <>
                  <FiLoader className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FiUploadCloud />
                  <span>Process & Upload File</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};