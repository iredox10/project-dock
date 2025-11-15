import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import mammoth from 'mammoth';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Service for extracting project data from PDF and DOCX files using Gemini AI
 * Updated to work with Appwrite backend
 */

// Configure PDF.js worker for Vite environment - use local worker
GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

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
 * Parse project data from text using Gemini AI
 * @param {string} text - Extracted text from document
 * @returns {Promise<object>} - Parsed project data
 */
export const parseProjectDataWithAI = async (text) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
  }

  // List of models to try in order
  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-2.0-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
  ];

  const prompt = `You are an expert at extracting structured data from academic project documents.
Analyze the following text from a research project document and extract the following information in JSON format:

{
  "title": "The main title of the project/research",
  "author": "Name of the author(s)",
  "department": "Academic department (e.g., Computer Science, Engineering, etc.)",
  "year": "Year of publication (as a number)",
  "level": "Academic level - one of: BSc, MSc, HND, ND, or PhD",
  "abstract": "The abstract/summary of the project (full text)",
  "chapterOne": "The introduction/chapter one content (full text, or first 500 words if too long)",
  "pages": "Estimated number of pages (as a number)",
  "chapters": "List of chapter titles separated by commas"
}

Important guidelines:
1. Extract exact text where possible, don't paraphrase
2. If a field cannot be found, use an empty string "" for text fields or 0 for numeric fields
3. For the abstract, include the complete abstract section
4. For chapterOne, include the introduction or first chapter content
5. Return ONLY valid JSON, no additional text or explanations
6. Ensure the year is a valid number (current year or earlier)
7. Make sure level is one of: BSc, MSc, HND, ND, PhD (default to BSc if unclear)

Document text:
${text.substring(0, 15000)}

Return the JSON object:`;

  let lastError;

  // Try each model using direct API calls
  for (const modelName of modelsToTry) {
    try {
      console.log(`Trying model: ${modelName}`);

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
        throw new Error('No response text from AI');
      }

      // Try to extract JSON from response
      let jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('AI did not return valid JSON');
      }

      const projectData = JSON.parse(jsonMatch[0]);

      console.log(`Successfully used model: ${modelName}`);

      // Validate and set defaults
      const result = {
        title: projectData.title || '',
        author: projectData.author || '',
        department: projectData.department || '',
        year: Number(projectData.year) || new Date().getFullYear(),
        level: ['BSc', 'MSc', 'HND', 'ND', 'PhD'].includes(projectData.level)
          ? projectData.level
          : 'BSc',
        abstract: projectData.abstract || '',
        chapterOne: projectData.chapterOne || '',
        pages: Number(projectData.pages) || 0,
        chapters: projectData.chapters || '1-5',
        formats: projectData.formats || 'PDF, DOCX',
        includes: projectData.includes || 'References, Questionnaire'
      };

      // Format Chapter One content to follow proper academic structure if it exists
      if (result.chapterOne) {
        result.chapterOne = await formatChapterOneContent(result.chapterOne);
      }
      
      // Format Abstract content to follow proper academic structure if it exists
      if (result.abstract) {
        result.abstract = await formatAbstractContent(result.abstract);
      }
      
      // Update chapters field to show range format (e.g., '1-5')
      // Handle cases where projectData.chapters might be null, undefined, or empty
      if (projectData.chapters && projectData.chapters !== null && projectData.chapters !== 'null' && projectData.chapters !== '') {
        // Try to extract the last chapter number from the chapters field
        const chapterNumbers = projectData.chapters.match(/\d+/g);
        if (chapterNumbers && chapterNumbers.length > 0) {
          const lastChapter = Math.max(...chapterNumbers.map(Number));
          result.chapters = `1-${lastChapter}`;
        } else {
          // If we can't determine the number of chapters from digits, default to '1-5'
          result.chapters = '1-5';
        }
      } else {
        // If no chapters data exists, default to '1-5'
        result.chapters = '1-5';
      }
      
      return result;
    } catch (error) {
      console.log(`Model ${modelName} failed:`, error.message);
      lastError = error;
      continue;
    }
  }

  // If all models failed
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
 * Batch process multiple files
 * @param {FileList|Array<File>} files - Array of PDF or DOCX files
 * @param {Function} onProgress - Progress callback (index, total, result)
 * @returns {Promise<Array>} - Array of parsed project data
 */
export const batchExtractProjects = async (files, onProgress) => {
  const results = [];
  const fileArray = Array.from(files);

  for (let i = 0; i < fileArray.length; i++) {
    try {
      const projectData = await extractProjectFromFile(fileArray[i]);
      results.push({
        success: true,
        data: projectData,
        fileName: fileArray[i].name
      });

      if (onProgress) {
        onProgress(i + 1, fileArray.length, { success: true, fileName: fileArray[i].name });
      }
    } catch (error) {
      results.push({
        success: false,
        error: error.message,
        fileName: fileArray[i].name
      });

      if (onProgress) {
        onProgress(i + 1, fileArray.length, { success: false, fileName: fileArray[i].name, error: error.message });
      }
    }
  }

  return results;
};