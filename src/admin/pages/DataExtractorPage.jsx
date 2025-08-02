import React, { useState, useCallback } from 'react';
import { Upload, FileText, Download, Loader2, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import mammoth from 'mammoth';
import Papa from 'papaparse';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as XLSX from 'xlsx';

// Setup PDF worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

// Get API key from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const DataExtractorPage = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState([]);
  const [progress, setProgress] = useState(0);

  const analyzeWithGemini = async (text, filename, page_count, file) => {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API Key not configured.');
    }
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Analyze this academic document text and extract the following information in a valid JSON format.
      If a field is not found, use "Not Found" or an appropriate empty value.

      Document Filename: ${filename}
      Document Text (first 12000 characters):
      ---
      ${text.substring(0, 12000)}
      ---

      Return a single JSON object with these exact fields:
      {
        "title": "Document title",
        "department": "The specific department",
        "author": "Author name(s)",
        "year": "Publication year as a string",
        "priceNGN": "Price in NGN as a number, default to 3000 if not found",
        "level": "Academic level (e.g., BSc, MSc, HND, ND)",
        "abstract": "The complete abstract or summary",
        "chapterOne": "The full text of the first chapter",
        "pages": "Total number of pages as a number",
        "fileSize": "File size in MB as a number",
        "formats": "Available formats (e.g., PDF, DOCX)",
        "chapters": "List of chapters (e.g., 1-5)",
        "includes": "List of included items (e.g., Full Source Code, Questionnaire)"
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text();
      
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Manually set fields that the AI can't know
        parsed.fileSize = (file.size / 1024 / 1024).toFixed(2);
        parsed.pages = page_count;
        return parsed;
      } else {
        throw new Error('No valid JSON found in AI response.');
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  };

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map(item => item.str).join(' ') + '\n';
    }
    return { text: fullText, page_count: pdf.numPages, file };
  };

  const extractTextFromDOCX = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return { text: result.value, page_count: 'N/A', file };
  };

  const processFile = async (file) => {
    let textData;
    try {
      if (file.type === 'application/pdf') {
        textData = await extractTextFromPDF(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        textData = await extractTextFromDOCX(file);
      } else {
        throw new Error('Unsupported file type');
      }

      const extractedInfo = await analyzeWithGemini(textData.text, file.name, textData.page_count, textData.file);
      
      return {
        filename: file.name,
        ...extractedInfo
      };
    } catch (error) {
      return {
        filename: file.name,
        error: error.message,
      };
    }
  };

  const handleFileUpload = useCallback((event) => {
    const uploadedFiles = Array.from(event.target.files || []);
    const validFiles = uploadedFiles.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    setFiles(prev => [...prev, ...validFiles.map(file => ({ file, status: 'pending' }))]);
  }, []);

  const processAllFiles = async () => {
    if (files.length === 0) return;
    
    setProcessing(true);
    setProgress(0);
    const results = [];

    for (let i = 0; i < files.length; i++) {
      const fileObj = files[i];
      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'processing' } : f));
      
      const result = await processFile(fileObj.file);
      results.push(result);
      
      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: result.error ? 'error' : 'completed' } : f));
      setProgress(((i + 1) / files.length) * 100);
    }

    setExtractedData(prev => [...prev, ...results]);
    setProcessing(false);
  };

  const downloadExcel = () => {
    if (extractedData.length === 0) return;

    const headers = ['title', 'department', 'author', 'year', 'priceNGN', 'level', 'abstract', 'chapterOne', 'pages', 'fileSize', 'formats', 'chapters', 'includes'];
    
    const ws = XLSX.utils.json_to_sheet(
      extractedData.map(row => {
        const newRow = {};
        headers.forEach(header => {
          newRow[header] = Array.isArray(row[header]) ? row[header].join('; ') : row[header];
        });
        return newRow;
      }),
      { header: headers }
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ExtractedProjects');
    XLSX.writeFile(wb, 'extracted_projects.xlsx');
  };

  const clearFiles = () => {
    setFiles([]);
    setExtractedData([]);
    setProgress(0);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'processing': return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default: return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold">AI-Powered Project Data Extractor</h1>
          <p className="text-blue-100 mt-1">Upload project files to automatically populate the database fields.</p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <input type="file" multiple accept=".pdf,.docx" onChange={handleFileUpload} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer block">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <span className="text-lg font-semibold text-gray-700">Click to Upload or Drag & Drop</span>
              <p className="text-gray-500 mt-1">PDF and DOCX files supported</p>
            </label>
          </div>

          {files.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">File Queue ({files.length})</h3>
                <button onClick={clearFiles} className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors flex items-center gap-1">
                  <Trash2 className="w-4 h-4" /> Clear All
                </button>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto p-1">
                {files.map((fileObj, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {getStatusIcon(fileObj.status)}
                      <span className="text-sm font-medium text-gray-800 truncate">{fileObj.file.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">({(fileObj.file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-600 p-1 rounded-full transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {processing && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">Processing... {Math.round(progress)}%</p>
                </div>
              )}

              <div className="mt-6 text-center">
                <button onClick={processAllFiles} disabled={processing || files.some(f => f.status === 'processing')} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-all shadow-lg hover:shadow-indigo-200">
                  {processing ? 'Processing...' : `Extract Data from ${files.length} File(s)`}
                </button>
              </div>
            </div>
          )}

          {extractedData.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Extraction Results</h3>
                <button onClick={downloadExcel} className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download as Excel
                </button>
              </div>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 uppercase">
                    <tr>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Author</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Year</th>
                      <th className="px-4 py-3">Price (NGN)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extractedData.map((data, index) => (
                      <tr key={index} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{data.error ? <AlertCircle className="w-5 h-5 text-red-500" /> : <CheckCircle className="w-5 h-5 text-green-500" />}</td>
                        <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-xs">{data.title || 'N/A'}</td>
                        <td className="px-4 py-3">{data.author || 'N/A'}</td>
                        <td className="px-4 py-3">{data.department || 'N/A'}</td>
                        <td className="px-4 py-3">{data.year || 'N/A'}</td>
                        <td className="px-4 py-3">{data.priceNGN || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataExtractorPage;