import React, { useState } from 'react';
import { FaUpload, FaFile, FaCheckCircle, FaSpinner, FaTimes } from 'react-icons/fa';
import { uploadProjectFile } from '../api/fileStorageService';

/**
 * File Upload Component for Project Files
 */
export const FileUploader = ({ projectId, onUploadComplete, fileType = 'pdf', label }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const extension = selectedFile.name.split('.').pop().toLowerCase();
    if (fileType === 'pdf' && extension !== 'pdf') {
      setError('Please select a PDF file');
      return;
    }
    if (fileType === 'docx' && extension !== 'docx') {
      setError('Please select a DOCX file');
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!projectId) {
      setError('Project ID is required. Please save the project first.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadProjectFile(
        file,
        projectId,
        fileType,
        (progress) => setUploadProgress(progress)
      );

      setUploadedUrl(result.url);
      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setUploadedUrl(null);
    setError(null);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
      <label className="block font-semibold text-gray-700 mb-3">
        {label || `Upload ${fileType.toUpperCase()} File`}
      </label>

      {!uploadedUrl ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept={fileType === 'pdf' ? '.pdf' : '.docx'}
              onChange={handleFileSelect}
              className="hidden"
              id={`file-${fileType}`}
              disabled={isUploading}
            />
            <label
              htmlFor={`file-${fileType}`}
              className="cursor-pointer flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              <FaFile />
              Choose File
            </label>
            {file && (
              <span className="text-sm text-gray-600 flex-1 truncate">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            )}
          </div>

          {file && !isUploading && (
            <button
              onClick={handleUpload}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaUpload />
              Upload {fileType.toUpperCase()}
            </button>
          )}

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600">
                <FaSpinner className="animate-spin" />
                <span>Uploading... {uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-700">
              <FaCheckCircle />
              <span className="font-semibold">File uploaded successfully!</span>
            </div>
            <button
              onClick={handleRemove}
              className="text-red-600 hover:text-red-700"
              title="Remove file"
            >
              <FaTimes />
            </button>
          </div>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:underline mt-2 block"
          >
            View uploaded file
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
