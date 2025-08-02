
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaFileExcel, FaCloudUploadAlt, FaList, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { databases } from '../../appwrite/config';
import { ID } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID_PROJECTS;

export const BulkUploadPage = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || selectedFile.name.endsWith('.xlsx'))) {
      setFile(selectedFile);
      setUploadStatus(null);
    } else {
      alert('Please select a valid .xlsx Excel file.');
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadStatus({ success: [], errors: [] });

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      // Assuming the first row is the header
      const headers = data[0];
      const projects = data.slice(1).map(row => {
        let project = {};
        headers.forEach((header, index) => {
          project[header] = row[index];
        });
        return project;
      });

      let currentStatus = { success: [], errors: [] };

      for (const project of projects) {
        try {
          await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
            ...project,
            year: project.year ? project.year.toString() : '',
            priceNGN: project.priceNGN.toString(),
            pages: project.pages.toString(),
            fileSize: project.fileSize.toString(),
          });
          currentStatus.success.push(project.title);
        } catch (error) {
          currentStatus.errors.push({ title: project.title, error: error.message });
          console.error('Failed to upload project:', error);
        }
      }

      setUploadStatus(currentStatus);
      setIsUploading(false);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/admin/projects" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-semibold transition-colors">
          <FaArrowLeft />
          Back to Manage Projects
        </Link>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Bulk Project Upload</h1>
          <p className="text-gray-500 mt-2">Upload an Excel file to add multiple projects at once.</p>
        </div>

        {/* Instructions & Template Download */}
        <div className="p-6 mb-8 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Instructions</h3>
          <p className="text-gray-600 mb-4">
            Use the template to format your project data. The required columns are:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm font-mono text-gray-700 mb-4">
            <span className="bg-gray-200 px-2 py-1 rounded">title</span>
            <span className="bg-gray-200 px-2 py-1 rounded">department</span>
            <span className="bg-gray-200 px-2 py-1 rounded">author</span>
            <span className="bg-gray-200 px-2 py-1 rounded">year</span>
            <span className="bg-gray-200 px-2 py-1 rounded">priceNGN</span>
            <span className="bg-gray-200 px-2 py-1 rounded">level</span>
            <span className="bg-gray-200 px-2 py-1 rounded">abstract</span>
            <span className="bg-gray-200 px-2 py-1 rounded">chapterOne</span>
            <span className="bg-gray-200 px-2 py-1 rounded">pages</span>
            <span className="bg-gray-200 px-2 py-1 rounded">fileSize</span>
            <span className="bg-gray-200 px-2 py-1 rounded">formats</span>
            <span className="bg-gray-200 px-2 py-1 rounded">chapters</span>
            <span className="bg-gray-200 px-2 py-1 rounded">includes</span>
          </div>
          <a href="/project_template.xlsx" download className="font-bold text-indigo-600 hover:underline inline-flex items-center gap-2">
            <FaFileExcel />
            Download Excel Template
          </a>
        </div>

        {/* File Upload Area */}
        <div className="text-center">
          <label htmlFor="excel-upload" className="cursor-pointer block p-10 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FaFileExcel className="w-16 h-16 mx-auto mb-4 text-indigo-300" />
            <span className="text-lg font-semibold text-gray-700">
              {file ? `Selected: ${file.name}` : 'Click to select .xlsx file'}
            </span>
            <p className="text-sm text-gray-500">or drag and drop</p>
          </label>
          <input id="excel-upload" type="file" className="hidden" onChange={handleFileChange} accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
        </div>

        {/* Upload Button */}
        <div className="mt-8 flex justify-center">
          <button onClick={handleUpload} disabled={!file || isUploading} className="w-full md:w-auto flex items-center justify-center gap-3 bg-indigo-600 text-white font-bold px-8 py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-300/50">
            <FaCloudUploadAlt />
            <span>{isUploading ? 'Uploading...' : 'Start Upload'}</span>
          </button>
        </div>

        {/* Upload Status */}
        {uploadStatus && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Upload Results</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {uploadStatus.success.map((title, i) => (
                <div key={i} className="p-3 bg-green-50 text-green-800 rounded-lg flex items-center gap-3">
                  <FaCheckCircle />
                  <span>Successfully uploaded: <strong>{title}</strong></span>
                </div>
              ))}
              {uploadStatus.errors.map((err, i) => (
                <div key={i} className="p-3 bg-red-50 text-red-800 rounded-lg flex items-center gap-3">
                  <FaTimesCircle />
                  <span>Failed to upload <strong>{err.title}</strong>: {err.error}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
