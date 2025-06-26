
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaFileCsv, FaCloudUploadAlt, FaList } from 'react-icons/fa';

export const BulkUploadPage = () => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!uploadedFile) {
      alert('Please select a file to upload.');
      return;
    }
    // In a real app, you would use a library like Papaparse to parse the CSV
    // and then send the data to your API in batches.
    alert(`Uploading file: ${uploadedFile.name}. This would trigger the bulk upload process.`);
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin/projects" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-semibold">
          <FaArrowLeft />
          Back to Manage Projects
        </Link>
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Bulk Upload Projects</h1>

      <div className="bg-white p-8 rounded-xl shadow-lg space-y-8">
        {/* Instructions Section */}
        <div className="p-6 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-lg">
          <h3 className="text-xl font-bold text-indigo-800">Instructions</h3>
          <p className="mt-2 text-indigo-700">To upload many projects at once, please format your data in a CSV file with the following columns in order:</p>
          <ul className="list-disc list-inside mt-2 font-mono text-indigo-700 bg-indigo-100 p-3 rounded">
            <li>title</li>
            <li>department</li>
            <li>author</li>
            <li>year</li>
            <li>priceNGN</li>
            <li>level</li>
            <li>abstract</li>
            <li>chapterOne</li>
          </ul>
          <a href="#" className="font-bold text-indigo-600 hover:underline mt-4 inline-block">Download CSV Template</a>
        </div>

        {/* File Upload Section */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Upload CSV File</h3>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaFileCsv className="w-12 h-12 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">CSV file only</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".csv" />
            </label>
          </div>
          {uploadedFile && (
            <div className="text-center mt-4 p-4 bg-green-50 text-green-800 rounded-lg font-semibold flex items-center justify-center gap-2">
              <FaList /> {uploadedFile.name} selected and ready to upload.
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button onClick={handleUpload} disabled={!uploadedFile} className="flex items-center gap-2 bg-green-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
            <FaCloudUploadAlt />
            <span>Upload Projects</span>
          </button>
        </div>
      </div>
    </div>
  );
};
