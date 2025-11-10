import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRobot, FaFileUpload, FaCheckCircle, FaTimesCircle, FaSpinner, FaPlus } from 'react-icons/fa';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { extractProjectFromFile, batchExtractProjects } from '../../api/aiExtractionService';
import { getStandardizedDepartment } from '../../api/departmentService';

export const AIProjectUploadPage = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState([]);
  const [extractedData, setExtractedData] = useState(null);
  const [isSingleMode, setIsSingleMode] = useState(true);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setResults([]);
    setExtractedData(null);
  };

  const handleSingleFileExtraction = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select a file first');
      return;
    }

    setIsProcessing(true);
    setCurrentFile(selectedFiles[0].name);

    try {
      const data = await extractProjectFromFile(selectedFiles[0]);
      setExtractedData(data);
      alert('Project data extracted successfully! Review and adjust if needed, then save.');
    } catch (error) {
      alert('Error extracting data: ' + error.message);
      console.error(error);
    } finally {
      setIsProcessing(false);
      setCurrentFile('');
    }
  };

  const handleBatchExtraction = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files first');
      return;
    }

    setIsProcessing(true);
    setResults([]);
    setProgress({ current: 0, total: selectedFiles.length });

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
      alert(`Batch processing complete! ${successCount}/${batchResults.length} files processed successfully.`);
    } catch (error) {
      alert('Error in batch processing: ' + error.message);
      console.error(error);
    } finally {
      setIsProcessing(false);
      setCurrentFile('');
    }
  };

  const handleSaveExtractedProject = async () => {
    if (!extractedData) return;

    if (!extractedData.title || !extractedData.department) {
      alert('Please ensure Title and Department are filled.');
      return;
    }

    setIsProcessing(true);

    try {
      // Standardize department name to avoid duplicates
      const standardizedDepartment = await getStandardizedDepartment(extractedData.department);
      
      const projectData = {
        ...extractedData,
        department: standardizedDepartment, // Use standardized department name
        priceNGN: Number(extractedData.priceNGN) || 0,
        year: Number(extractedData.year),
        pages: Number(extractedData.pages) || 0,
        formats: typeof extractedData.formats === 'string' 
          ? extractedData.formats.split(',').map(item => item.trim())
          : extractedData.formats || ['PDF', 'DOCX'],
        includes: typeof extractedData.includes === 'string'
          ? extractedData.includes.split(',').map(item => item.trim())
          : extractedData.includes || ['References', 'Questionnaire'],
        downloadCount: 0,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'projects'), projectData);
      alert(`Project "${extractedData.title}" saved successfully with department: ${standardizedDepartment}!`);
      
      // Reset form
      setExtractedData(null);
      setSelectedFiles([]);
      
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveBatchResults = async () => {
    const successfulResults = results.filter(r => r.success);
    
    if (successfulResults.length === 0) {
      alert('No successful extractions to save');
      return;
    }

    setIsProcessing(true);

    try {
      let savedCount = 0;
      
      for (const result of successfulResults) {
        // Standardize department name to avoid duplicates
        const standardizedDepartment = await getStandardizedDepartment(result.data.department);
        
        const projectData = {
          ...result.data,
          department: standardizedDepartment, // Use standardized department name
          priceNGN: Number(result.data.priceNGN) || 0,
          year: Number(result.data.year),
          pages: Number(result.data.pages) || 0,
          formats: typeof result.data.formats === 'string'
            ? result.data.formats.split(',').map(item => item.trim())
            : result.data.formats || ['PDF', 'DOCX'],
          includes: typeof result.data.includes === 'string'
            ? result.data.includes.split(',').map(item => item.trim())
            : result.data.includes || ['References', 'Questionnaire'],
          downloadCount: 0,
          createdAt: serverTimestamp()
        };

        await addDoc(collection(db, 'projects'), projectData);
        savedCount++;
      }

      alert(`Successfully saved ${savedCount} projects to database!`);
      navigate('/admin/projects');
      
    } catch (error) {
      console.error('Error saving projects:', error);
      alert('Failed to save projects: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setExtractedData(prev => ({ ...prev, [field]: value }));
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
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <FaRobot className="text-indigo-600" />
            AI Project Extractor
          </h1>
          <p className="text-gray-600 mt-2">Upload PDF or DOCX files to automatically extract project data using AI</p>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setIsSingleMode(true)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isSingleMode 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Single File Mode
          </button>
          <button
            onClick={() => setIsSingleMode(false)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
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
      <div className="bg-white p-8 rounded-xl shadow-lg mb-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaFileUpload className="text-indigo-600" />
          Upload Files
        </h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
            <FaFileUpload className="text-5xl text-gray-400" />
            <span className="text-lg font-semibold text-gray-700">
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
            <ul className="space-y-1">
              {selectedFiles.map((file, idx) => (
                <li key={idx} className="text-sm text-gray-600">
                  • {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedFiles.length > 0 && !isProcessing && !extractedData && (
          <div className="mt-6 flex gap-4">
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
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FaSpinner className="animate-spin text-2xl text-blue-600" />
            <div>
              <p className="font-semibold text-blue-900">Processing...</p>
              <p className="text-sm text-blue-700">{currentFile}</p>
            </div>
          </div>
          {progress.total > 0 && (
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              ></div>
            </div>
          )}
        </div>
      )}

      {/* Single File: Extracted Data Form */}
      {extractedData && isSingleMode && (
        <div className="bg-white p-8 rounded-xl shadow-lg mb-6">
          <h3 className="text-xl font-bold mb-6 text-gray-700">Review & Edit Extracted Data</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              rows="6"
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Chapter One</label>
            <textarea
              value={extractedData.chapterOne}
              onChange={(e) => handleFieldChange('chapterOne', e.target.value)}
              className="w-full p-3 border rounded-lg"
              rows="10"
            />
          </div>

          <button
            onClick={handleSaveExtractedProject}
            disabled={isProcessing}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
          >
            <FaPlus />
            Save Project to Database
          </button>
        </div>
      )}

      {/* Batch Mode: Results */}
      {results.length > 0 && !isSingleMode && (
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-700">Batch Processing Results</h3>
            {results.filter(r => r.success).length > 0 && (
              <button
                onClick={handleSaveBatchResults}
                disabled={isProcessing}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
              >
                <FaPlus />
                Save All Successful ({results.filter(r => r.success).length})
              </button>
            )}
          </div>

          <div className="space-y-3">
            {results.map((result, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
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
                    <p className="font-semibold">{result.fileName}</p>
                    {result.success ? (
                      <p className="text-sm text-gray-700 mt-1">
                        Title: {result.data.title || 'N/A'} | Department: {result.data.department || 'N/A'}
                      </p>
                    ) : (
                      <p className="text-sm text-red-700 mt-1">{result.error}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Key Warning */}
      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl mt-6">
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
