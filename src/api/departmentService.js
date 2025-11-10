import apiClient from './axios';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Get all departments from the database
 */
export const getAllDepartments = async () => {
  try {
    // Using the API service to fetch departments
    const response = await apiClient.get('/departments');
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    // Fallback: Get departments directly from Firebase if API fails
    try {
      const departmentsSnapshot = await getDocs(collection(db, 'departments'));
      return departmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (firebaseError) {
      console.error('Error fetching departments from Firebase:', firebaseError);
      return [];
    }
  }
};

/**
 * Calculate similarity between two strings using a simple algorithm
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Similarity score between 0 and 1
 */
export const calculateStringSimilarity = (str1, str2) => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1;
  if (!s1 || !s2) return 0;
  
  // Using a simple similarity algorithm (Levenshtein distance based)
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = computeLevenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

/**
 * Compute Levenshtein distance between two strings
 */
const computeLevenshteinDistance = (str1, str2) => {
  const matrix = Array(str2.length + 1)
    .fill()
    .map(() => Array(str1.length + 1).fill(0));

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + cost // substitution
      );
    }
  }
  return matrix[str2.length][str1.length];
};

/**
 * Find the best matching department from existing departments
 * @param {string} extractedDepartment - The department name extracted by AI
 * @param {Array} allDepartments - Array of all existing departments
 * @param {number} threshold - Similarity threshold (0-1), default 0.8
 * @returns {string|undefined} - Matching department name if found, undefined if no match
 */
export const findMatchingDepartment = (extractedDepartment, allDepartments, threshold = 0.8) => {
  if (!extractedDepartment) return undefined;
  
  const extractedName = extractedDepartment.trim().toLowerCase();
  
  // First, try exact match
  const exactMatch = allDepartments.find(dept => 
    dept.name && dept.name.trim().toLowerCase() === extractedName
  );
  
  if (exactMatch) {
    return exactMatch.name; // Return the original case of the department
  }
  
  // If no exact match, try similarity matching
  let bestMatch = null;
  let bestScore = 0;
  
  for (const dept of allDepartments) {
    if (!dept.name) continue;
    
    const similarity = calculateStringSimilarity(extractedDepartment, dept.name);
    
    if (similarity > bestScore && similarity >= threshold) {
      bestScore = similarity;
      bestMatch = dept.name;
    }
  }
  
  return bestMatch;
};

/**
 * Standardize department names to avoid duplicates with different cases/formats
 * @param {string} department - Raw department name
 * @returns {string} - Standardized department name
 */
export const standardizeDepartmentName = (department) => {
  if (!department) return '';
  
  // Remove extra whitespace and standardize case
  let standardized = department.trim();
  
  // Standardize common abbreviations
  const abbrMap = {
    'comp sci': 'Computer Science',
    'comp. sci.': 'Computer Science',
    'comp.sci': 'Computer Science',
    'computer sci': 'Computer Science',
    'computer eng': 'Computer Engineering',
    'computer eng.': 'Computer Engineering',
    'elect eng': 'Electrical Engineering',
    'elect. eng.': 'Electrical Engineering',
    'elect engg': 'Electrical Engineering',
    'mech eng': 'Mechanical Engineering',
    'mech. eng.': 'Mechanical Engineering',
    'mech engg': 'Mechanical Engineering',
    'bus. admin': 'Business Administration',
    'bus admin': 'Business Administration',
    'acct.': 'Accounting',
    'acc': 'Accounting',
    'econs': 'Economics',
    'econ': 'Economics',
    'maths': 'Mathematics',
    'math': 'Mathematics',
    'biochem': 'Biochemistry',
    'microbio': 'Microbiology',
  };
  
  // Check for common abbreviations
  for (const [abbr, full] of Object.entries(abbrMap)) {
    const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
    standardized = standardized.replace(regex, full);
  }
  
  return standardized;
};

/**
 * Get standardized department name that matches existing departments or return the original if no match
 * @param {string} extractedDepartment - Department name extracted by AI
 * @returns {Promise<string>} - Standardized department name
 */
export const getStandardizedDepartment = async (extractedDepartment) => {
  if (!extractedDepartment) return extractedDepartment;
  
  // First, standardize the extracted department name
  const standardizedExtracted = standardizeDepartmentName(extractedDepartment);
  
  // Get all existing departments
  const allDepartments = await getAllDepartments();
  
  // Look for a match
  const matchingDepartment = findMatchingDepartment(standardizedExtracted, allDepartments);
  
  // Return the matching department name if found, otherwise return the standardized version
  return matchingDepartment || standardizedExtracted;
};