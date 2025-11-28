import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Service for extracting project data from PDF and DOCX files using Gemini AI
 * Updated to work with Appwrite backend
 */

// Configure PDF.js worker for Vite environment - use local worker
GlobalWorkerOptions.workerSrc = pdfWorker;

// Initialize Gemini AI - Get API key from environment variable
const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Extract text from PDF file using PDF.js
 * @param {File} file - PDF file
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF file: ' + error.message);
  }
};

/**
 * Extract text from DOCX file
 * @param {File} file - DOCX file
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromDOCX = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX file');
  }
};

/**
 * Extract text from file based on type
 * @param {File} file - PDF or DOCX file
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromFile = async (file) => {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return await extractTextFromPDF(file);
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    return await extractTextFromDOCX(file);
  } else {
    throw new Error('Unsupported file type. Please upload PDF or DOCX files only.');
  }
};

/**
 * Parse project data from text using Gemini AI (combined extraction + formatting in one call)
 * @param {string} text - Extracted text from document
 * @returns {Promise<object>} - Parsed project data with formatted abstract and chapterOne
 */
export const parseProjectDataWithAI = async (text) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
  }

  // Primary model — only fall back if it fails
  const primaryModel = 'gemini-2.5-flash';
  const fallbackModels = ['gemini-2.0-flash', 'gemini-1.5-flash-latest'];

  const prompt = `You are an expert at extracting and formatting structured data from academic project documents.
Analyze the following text from a research project document and return EXACTLY one JSON object (no other text) with these fields:

{
  "title": "The main title of the project/research",
  "author": "Name of the author(s)",
  "department": "ONLY the core department name in lowercase without prefixes like 'DEPARTMENT OF', 'SCHOOL OF', or institution names (e.g., 'computer science')",
  "year": 2024,
  "level": "One of: BSc, MSc, HND, ND, PhD",
  "pages": 0,
  "chapters": "Comma-separated list of chapter titles",
  "abstract": "The raw abstract/summary text",
  "chapterOne": "The raw introduction/chapter one text",
  "abstract_formatted": "The abstract reformatted with academic section headings (Background, Objective, Methodology, Results, Conclusion) while preserving ALL original content",
  "chapterOne_formatted": "Chapter one reformatted with academic section headings (Introduction, Background of Study, Statement of the Problem, Objectives, Significance, Scope) while preserving ALL original content"
}

Guidelines:
1. Extract exact text where possible, don't paraphrase
2. If a field cannot be found, use "" for text or 0 for numbers
3. For abstract_formatted and chapterOne_formatted, keep ALL original content but add section headings to organize it properly
4. Return ONLY valid JSON, no additional text
5. Ensure year is a valid number (current year or earlier)
6. level must be one of: BSc, MSc, HND, ND, PhD (default BSc if unclear)

Document text:
${text.substring(0, 15000)}

Return only the JSON object:`;

  const modelsToTry = [primaryModel, ...fallbackModels];
  let lastError;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Trying model: ${modelName}`);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        throw new Error('No response text from AI');
      }

      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('AI did not return valid JSON');
      }

      const projectData = JSON.parse(jsonMatch[0]);
      console.log(`Successfully used model: ${modelName}`);

      // Clean up department name
      let cleanDepartment = projectData.department || '';
      cleanDepartment = cleanDepartment
        .replace(/^(DEPARTMENT OF|DEPT OF|SCHOOL OF|FACULTY OF|COLLEGE OF)\s*/i, '')
        .replace(/,.*$/, '')
        .trim()
        .toLowerCase();

      // Use formatted versions if available, otherwise fall back to raw
      const result = {
        title: projectData.title || '',
        author: projectData.author || '',
        department: cleanDepartment,
        year: Number(projectData.year) || new Date().getFullYear(),
        level: ['BSc', 'MSc', 'HND', 'ND', 'PhD'].includes(projectData.level)
          ? projectData.level
          : 'BSc',
        abstract: projectData.abstract_formatted || projectData.abstract || '',
        chapterOne: projectData.chapterOne_formatted || projectData.chapterOne || '',
        pages: Number(projectData.pages) || 0,
        chapters: projectData.chapters || '1-5',
        formats: 'PDF, DOCX',
        includes: 'References, Questionnaire'
      };

      // Update chapters field to range format (e.g., '1-5')
      if (projectData.chapters && projectData.chapters !== 'null' && projectData.chapters !== '') {
        const chapterNumbers = projectData.chapters.match(/\d+/g);
        if (chapterNumbers && chapterNumbers.length > 0) {
          const lastChapter = Math.max(...chapterNumbers.map(Number));
          result.chapters = `1-${lastChapter}`;
        } else {
          result.chapters = '1-5';
        }
      } else {
        result.chapters = '1-5';
      }

      return result;
    } catch (error) {
      console.log(`Model ${modelName} failed:`, error.message);
      lastError = error;
      continue;
    }
  }

  throw new Error('Failed to parse project data with AI: ' + (lastError?.message || 'All models failed'));
};

/**
 * Format Abstract content to follow academic structure
 * @param {string} content - Original Abstract content
 * @returns {Promise<string>} - Formatted Abstract content
 */
export const formatAbstractContent = async (content) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
  }

  // List of models to try in order for formatting
  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
  ];

  const prompt = `Please format the following Abstract text to follow proper academic structure for a research project.
Preserve ALL the original content and meaning, but organize it into proper academic sections with clear headings.
DO NOT change the actual content - only improve the formatting.
Maintain the original paragraphs and information, but add proper structure with section headings like Background, Objective, Methodology, Results, Conclusion.

Original text:
${content.substring(0, 10000)}

Return only the formatted text with proper academic structure but with all the original content preserved. Do not add any explanatory text, just return the formatted content.`;

  let lastError;

  // Try each model for formatting
  for (const modelName of modelsToTry) {
    try {
      console.log(`Formatting abstract with model: ${modelName}`);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        throw new Error('No response text from AI for abstract formatting');
      }

      console.log(`Successfully formatted Abstract with model: ${modelName}`);
      return responseText; // Return the formatted content
    } catch (error) {
      console.log(`Abstract formatting with model ${modelName} failed:`, error.message);
      lastError = error;
      continue;
    }
  }

  // If all models failed for formatting, return the original content
  console.warn('Abstract formatting failed, returning original content:', lastError);
  return content;
};

/**
 * Format Chapter One content to follow academic structure
 * @param {string} content - Original Chapter One content
 * @returns {Promise<string>} - Formatted Chapter One content
 */
export const formatChapterOneContent = async (content) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
  }

  // List of models to try in order for formatting
  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
  ];

  const prompt = `Please format the following Chapter One text to follow proper academic structure for a research project.
Preserve ALL the original content and meaning, but organize it into proper academic sections with clear headings.
DO NOT change the actual content - only improve the formatting.
Maintain the original paragraphs and information, but add proper structure with section headings.

Original text:
${content.substring(0, 10000)}

Return only the formatted text with proper academic structure (Introduction, Background of Study, Statement of the Problem, etc.) but with all the original content preserved. Do not add any explanatory text, just return the formatted content.`;

  let lastError;

  // Try each model for formatting
  for (const modelName of modelsToTry) {
    try {
      console.log(`Formatting chapter one with model: ${modelName}`);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        throw new Error('No response text from AI for formatting');
      }

      console.log(`Successfully formatted Chapter One with model: ${modelName}`);
      return responseText; // Return the formatted content
    } catch (error) {
      console.log(`Chapter One formatting with model ${modelName} failed:`, error.message);
      lastError = error;
      continue;
    }
  }

  // If all models failed for formatting, return the original content
  console.warn('Chapter One formatting failed, returning original content:', lastError);
  return content;
};

/**
 * Complete extraction pipeline: read file and parse with AI
 * @param {File} file - PDF or DOCX file
 * @returns {Promise<object>} - Parsed project data
 */
export const extractProjectFromFile = async (file) => {
  try {
    // Step 1: Extract text from file
    const text = await extractTextFromFile(file);

    if (!text || text.trim().length < 100) {
      throw new Error('Extracted text is too short or empty');
    }

    // Step 2: Parse with AI
    const projectData = await parseProjectDataWithAI(text);

    return projectData;
  } catch (error) {
    console.error('Error in extraction pipeline:', error);
    throw error;
  }
};

/**
 * Batch process multiple files with concurrency control
 * @param {FileList|Array<File>} files - Array of PDF or DOCX files
 * @param {Function} onProgress - Progress callback (index, total, result)
 * @param {number} concurrency - Max parallel extractions (default 3)
 * @returns {Promise<Array>} - Array of parsed project data
 */
export const batchExtractProjects = async (files, onProgress, concurrency = 3) => {
  const fileArray = Array.from(files);
  const results = new Array(fileArray.length);
  let completedCount = 0;

  // Process files in batches with controlled concurrency
  const processFile = async (file, index) => {
    try {
      const projectData = await extractProjectFromFile(file);
      const resultObj = {
        success: true,
        data: projectData,
        fileName: file.name
      };
      results[index] = resultObj;
      completedCount++;

      if (onProgress) {
        onProgress(completedCount, fileArray.length, resultObj);
      }
      return resultObj;
    } catch (error) {
      const resultObj = {
        success: false,
        error: error.message,
        fileName: file.name
      };
      results[index] = resultObj;
      completedCount++;

      if (onProgress) {
        onProgress(completedCount, fileArray.length, resultObj);
      }
      return resultObj;
    }
  };

  // Simple concurrency limiter
  const executing = new Set();
  const enqueue = async (file, index) => {
    const promise = processFile(file, index);
    executing.add(promise);
    promise.finally(() => executing.delete(promise));

    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  };

  // Queue all files
  for (let i = 0; i < fileArray.length; i++) {
    await enqueue(fileArray[i], i);
  }

  // Wait for remaining
  await Promise.all(executing);

  return results;
};