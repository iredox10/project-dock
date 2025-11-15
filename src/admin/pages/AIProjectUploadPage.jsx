import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRobot, FaFileUpload, FaCheckCircle, FaTimesCircle, FaSpinner, FaPlus, FaTimes } from 'react-icons/fa';
import { extractProjectFromFile, batchExtractProjects } from '../../api/aiExtractionService';
import { getStandardizedDepartment } from '../../api/departmentService';
import { uploadProjectFile } from '../../api/fileStorageService';
import { createProject, updateProject } from '../../api/projectServices';

// Modal Component
const Modal = ({ isOpen, onClose, title, message, type = 'info' }) => {
  if (!isOpen) return null;

  const typeStyles = {
    success: 'bg-green-50 border-green-500 text-green-900',
    error: 'bg-red-50 border-red-500 text-red-900',
    info: 'bg-blue-50 border-blue-500 text-blue-900',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-900',
  };

  const iconStyles = {
    success: <FaCheckCircle className="text-green-600 text-3xl" />,
    error: <FaTimesCircle className="text-red-600 text-3xl" />,
    info: <FaCheckCircle className="text-blue-600 text-3xl" />,
    warning: <FaCheckCircle className="text-yellow-600 text-3xl" />,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className={`p-6 border-l-4 ${typeStyles[type]}`}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              {iconStyles[type]}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-sm leading-relaxed">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const AIProjectUploadPage = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [originalFile, setOriginalFile] = useState(null); // Store the original file for upload
  const [originalFilesMap, setOriginalFilesMap] = useState(new Map()); // Store batch files
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState([]);
  const [extractedData, setExtractedData] = useState(null);
  const [isSingleMode, setIsSingleMode] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const showModal = (title, message, type = 'info') => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setResults([]);
    setExtractedData(null);
  };

  const handleSingleFileExtraction = async () => {
    if (selectedFiles.length === 0) {
      showModal('No File Selected', 'Please select a file first', 'warning');
      return;
    }

    setIsProcessing(true);
    setCurrentFile(selectedFiles[0].name);
    setOriginalFile(selectedFiles[0]); // Store original file for later upload

    try {
      const data = await extractProjectFromFile(selectedFiles[0]);
      setExtractedData(data);
      showModal('Success!', 'Project data extracted successfully! Review and adjust if needed, then save.', 'success');
    } catch (error) {
      showModal('Extraction Failed', 'Error extracting data: ' + error.message, 'error');
      console.error(error);
    } finally {
      setIsProcessing(false);
      setCurrentFile('');
    }
  };

  const handleBatchExtraction = async () => {
    if (selectedFiles.length === 0) {
      showModal('No Files Selected', 'Please select files first', 'warning');
      return;
    }

    setIsProcessing(true);
    setResults([]);
    setProgress({ current: 0, total: selectedFiles.length });

    // Create a map to store original files by their name
    const filesMap = new Map();
    selectedFiles.forEach(file => {
      filesMap.set(file.name, file);
    });
    setOriginalFilesMap(filesMap);

    try {
      const batchResults = await batchExtractProjects(
        selectedFiles,
        (current, total, result) => {
          setProgress({ current, total });
          setCurrentFile(result.fileName);
          setResults(prev => [...prev, result]);
        }
      );

      const successCount = batchResults.filter(r => r.success).length;
      showModal(
        'Batch Processing Complete',
        `Successfully processed ${successCount} out of ${batchResults.length} files.`,
        successCount > 0 ? 'success' : 'error'
      );
    } catch (error) {
      showModal('Batch Processing Failed', 'Error in batch processing: ' + error.message, 'error');
      console.error(error);
    } finally {
      setIsProcessing(false);
      setCurrentFile('');
    }
  };

  const handleSaveExtractedProject = async () => {
    if (!extractedData) return;

    if (!extractedData.title || !extractedData.department) {
      showModal('Missing Information', 'Please ensure Title and Department are filled.', 'warning');
      return;
    }

    if (!originalFile) {
      showModal('No File', 'Original file not found. Please re-extract the file.', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Starting save process...', { extractedData, originalFile });

      // Standardize department name to avoid duplicates
      const standardizedDepartment = await getStandardizedDepartment(extractedData.department);
      console.log('Standardized department:', standardizedDepartment);

      const projectData = {
        title: extractedData.title,
        author: extractedData.author,
        department: standardizedDepartment, // Use standardized department name
        level: extractedData.level,
        abstractFileId: extractedData.abstract, // Map 'abstract' to 'abstractFileId' field in your db
        chapterOneFileId: extractedData.chapterOne, // Map 'chapterOne' to 'chapterOneFileId' field in your db
        year: Number(extractedData.year),
        pages: Number(extractedData.pages) || 0,
        priceNGN: Number(extractedData.priceNGN) || 0,
        formats: typeof extractedData.formats === 'string'
          ? extractedData.formats
          : Array.isArray(extractedData.formats) ? extractedData.formats.join(', ') : 'PDF, DOCX',
        includes: typeof extractedData.includes === 'string'
          ? extractedData.includes
          : Array.isArray(extractedData.includes) ? extractedData.includes.join(', ') : 'References, Questionnaire',
        downloadCount: 0,
        isActive: true
      };

      console.log('Saving project to database...', projectData);
      // Add project to database first to get the project ID
      const createdProject = await createProject(projectData);
      const projectId = createdProject.$id; // Appwrite returns $id as the document ID
      console.log('Project saved to database with ID:', projectId);

      // Upload the original file to storage
      const fileType = originalFile.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx';
      console.log('Uploading file to storage...', { fileType, fileName: originalFile.name });
      const uploadResult = await uploadProjectFile(originalFile, projectId, fileType);
      console.log('File uploaded successfully:', uploadResult);

      // Update project with file information
      console.log('Updating project with file info...');
      const updatedProject = await updateProject(projectId, {
        ...createdProject,
        fileUrl: uploadResult.url,
        fileName: originalFile.name,
        filePath: uploadResult.fileId, // Store the file ID from Appwrite storage
        fileType: fileType,
        mainFileId: uploadResult.fileId // Using mainFileId as the primary file reference
      });
      console.log('Project updated with file info:', updatedProject);

      showModal('Project Saved!', `Project "${extractedData.title}" saved successfully with file uploaded to storage!`, 'success');

      // Reset form after a short delay
      setTimeout(() => {
        setExtractedData(null);
        setSelectedFiles([]);
        setOriginalFile(null);
      }, 2000);

    } catch (error) {
      console.error('Error saving project:', error);
      console.error('Error details:', {
        message: error.message,
        code: error?.code,
        type: error?.type,
        stack: error?.stack
      });
      showModal('Save Failed', 'Failed to save project: ' + error.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveBatchResults = async () => {
    const successfulResults = results.filter(r => r.success);

    if (successfulResults.length === 0) {
      showModal('No Projects to Save', 'No successful extractions to save', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      let savedCount = 0;

      for (const result of successfulResults) {
        // Standardize department name to avoid duplicates
        const standardizedDepartment = await getStandardizedDepartment(result.data.department);

        const projectData = {
          title: result.data.title,
          author: result.data.author,
          department: standardizedDepartment, // Use standardized department name
          level: result.data.level,
          abstractFileId: result.data.abstract, // Map 'abstract' to 'abstractFileId' field in your db
          chapterOneFileId: result.data.chapterOne, // Map 'chapterOne' to 'chapterOneFileId' field in your db
          year: Number(result.data.year),
          pages: Number(result.data.pages) || 0,
          priceNGN: Number(result.data.priceNGN) || 0,
          formats: typeof result.data.formats === 'string'
            ? result.data.formats
            : Array.isArray(result.data.formats) ? result.data.formats.join(', ') : 'PDF, DOCX',
          includes: typeof result.data.includes === 'string'
            ? result.data.includes
            : Array.isArray(result.data.includes) ? result.data.includes.join(', ') : 'References, Questionnaire',
          chapters: result.data.chapters,
          mainFileId: result.data.mainFileId,
          projectId: result.data.projectId,
          downloadCount: 0,
          isActive: true
        };

        // Add project to database first to get the project ID
        const createdProject = await createProject(projectData);
        const projectId = createdProject.$id; // Appwrite returns $id as the document ID

        // Upload the original file to storage if available
        const originalFile = originalFilesMap.get(result.fileName);
        if (originalFile) {
          try {
            const fileType = originalFile.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx';
            const uploadResult = await uploadProjectFile(originalFile, projectId, fileType);

            // Update project with file information
            await updateProject(projectId, {
              ...createdProject,
              fileUrl: uploadResult.url,
              fileName: originalFile.name,
              filePath: uploadResult.fileId, // Store the file ID from Appwrite storage
              fileType: fileType,
              mainFileId: uploadResult.fileId // Using mainFileId as the primary file reference
            });
          } catch (uploadError) {
            console.error('Error uploading file for project:', result.fileName, uploadError);
            // Continue even if upload fails - project data is already saved
          }
        }

        savedCount++;
      }

      showModal('Batch Save Complete!', `Successfully saved ${savedCount} projects to database with files uploaded!`, 'success');

      setTimeout(() => {
        navigate('/admin/projects');
      }, 2000);

    } catch (error) {
      console.error('Error saving projects:', error);
      showModal('Save Failed', 'Failed to save projects: ' + error.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setExtractedData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full">
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      <div className="mb-6">
        <Link to="/admin/projects" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-semibold">
          <FaArrowLeft />
          Back to Manage Projects
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <FaRobot className="text-indigo-600" />
            AI Project Extractor
          </h1>
          <p className="text-gray-600 mt-2">Upload PDF or DOCX files to automatically extract project data using AI</p>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setIsSingleMode(true)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              isSingleMode
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Single File Mode
          </button>
          <button
            onClick={() => setIsSingleMode(false)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              !isSingleMode
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Batch Mode
          </button>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg mb-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaFileUpload className="text-indigo-600" />
          Upload Files
        </h3>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".pdf,.docx"
            multiple={!isSingleMode}
            onChange={handleFileSelect}
            className="hidden"
            id="fileInput"
            disabled={isProcessing}
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <FaFileUpload className="text-4xl text-gray-400" />
            <span className="text-base font-semibold text-gray-700">
              Click to select {isSingleMode ? 'a file' : 'files'} (PDF or DOCX)
            </span>
            <span className="text-sm text-gray-500">
              {isSingleMode ? 'Single file mode' : 'Multiple files supported'}
            </span>
          </label>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold mb-2">Selected Files ({selectedFiles.length}):</p>
            <ul className="space-y-1 max-h-32 overflow-y-auto">
              {selectedFiles.map((file, idx) => (
                <li key={idx} className="text-sm text-gray-600 truncate">
                  • {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedFiles.length > 0 && !isProcessing && !extractedData && (
          <div className="mt-6 flex justify-center">
            {isSingleMode ? (
              <button
                onClick={handleSingleFileExtraction}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-2"
              >
                <FaRobot />
                Extract with AI
              </button>
            ) : (
              <button
                onClick={handleBatchExtraction}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-2"
              >
                <FaRobot />
                Process Batch
              </button>
            )}
          </div>
        )}
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FaSpinner className="animate-spin text-xl text-blue-600" />
            <div>
              <p className="font-semibold text-blue-900">Processing...</p>
              <p className="text-sm text-blue-700 truncate max-w-full">{currentFile}</p>
            </div>
          </div>
          {progress.total > 0 && (
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              ></div>
            </div>
          )}
        </div>
      )}

      {/* Single File: Extracted Data Form */}
      {extractedData && isSingleMode && (
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Review & Edit Extracted Data</h3>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label className="block font-semibold mb-2">Title *</label>
              <input
                type="text"
                value={extractedData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Author</label>
              <input
                type="text"
                value={extractedData.author}
                onChange={(e) => handleFieldChange('author', e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Department *</label>
              <input
                type="text"
                value={extractedData.department}
                onChange={(e) => handleFieldChange('department', e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Level</label>
                <select
                  value={extractedData.level}
                  onChange={(e) => handleFieldChange('level', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white"
                >
                  <option>BSc</option>
                  <option>MSc</option>
                  <option>HND</option>
                  <option>ND</option>
                  <option>PhD</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">Year</label>
                <input
                  type="number"
                  value={extractedData.year}
                  onChange={(e) => handleFieldChange('year', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Pages</label>
                <input
                  type="number"
                  value={extractedData.pages}
                  onChange={(e) => handleFieldChange('pages', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Price (NGN)</label>
                <input
                  type="number"
                  value={extractedData.priceNGN || ''}
                  onChange={(e) => handleFieldChange('priceNGN', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter price"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-2">Chapters</label>
              <input
                type="text"
                value={extractedData.chapters}
                onChange={(e) => handleFieldChange('chapters', e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Abstract</label>
            <textarea
              value={extractedData.abstract}
              onChange={(e) => handleFieldChange('abstract', e.target.value)}
              className="w-full p-3 border rounded-lg"
              rows="4"
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Chapter One</label>
            <textarea
              value={extractedData.chapterOne}
              onChange={(e) => handleFieldChange('chapterOne', e.target.value)}
              className="w-full p-3 border rounded-lg"
              rows="6"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSaveExtractedProject}
              disabled={isProcessing}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
            >
              <FaPlus />
              Save Project to Database
            </button>
          </div>
        </div>
      )}

      {/* Batch Mode: Results */}
      {results.length > 0 && !isSingleMode && (
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h3 className="text-xl font-bold text-gray-700">Batch Processing Results</h3>
            {results.filter(r => r.success).length > 0 && (
              <button
                onClick={handleSaveBatchResults}
                disabled={isProcessing}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 text-sm"
              >
                <FaPlus />
                Save All Successful ({results.filter(r => r.success).length})
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.map((result, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  result.success
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <FaCheckCircle className="text-green-600 text-xl mt-1" />
                  ) : (
                    <FaTimesCircle className="text-red-600 text-xl mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold truncate">{result.fileName}</p>
                    {result.success ? (
                      <p className="text-sm text-gray-700 mt-1">
                        Title: {result.data.title || 'N/A'} | Department: {result.data.department || 'N/A'}
                      </p>
                    ) : (
                      <p className="text-sm text-red-700 mt-1 truncate">{result.error}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Key Warning */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mt-6">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Make sure you have set your <code>VITE_GEMINI_API_KEY</code> in your .env file.
          You can get a free API key from{' '}
          <a
            href="https://makersuite.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            Google AI Studio
          </a>
        </p>
      </div>
    </div>
  );
};