/**
 * Department service for standardizing department names
 */

// Common department name variations and their standardized forms
const DEPARTMENT_MAPPINGS = {
  // Computer Science related
  'computer science': 'Computer Science',
  'computer sci': 'Computer Science',
  'comp sci': 'Computer Science',
  'csc': 'Computer Science',
  'computer s': 'Computer Science',
  
  // Engineering
  'computer engineering': 'Computer Engineering',
  'comp eng': 'Computer Engineering',
  'computer eng': 'Computer Engineering',
  'electrical engineering': 'Electrical Engineering',
  'elect eng': 'Electrical Engineering',
  'mechanical engineering': 'Mechanical Engineering',
  'mech eng': 'Mechanical Engineering',
  
  // Business
  'business administration': 'Business Administration',
  'bus admin': 'Business Administration',
  'accounting': 'Accounting',
  'acc': 'Accounting',
  
  // Mathematics
  'mathematics': 'Mathematics',
  'maths': 'Mathematics',
  'math': 'Mathematics',
  
  // English
  'english': 'English',
  'english language': 'English',
  
  // Economics
  'economics': 'Economics',
  'econ': 'Economics',
  
  // Mass Communication
  'mass communication': 'Mass Communication',
  'mass comm': 'Mass Communication',
  'mcb': 'Mass Communication',
  
  // Others
  'chemistry': 'Chemistry',
  'physics': 'Physics',
  'biology': 'Biology',
  'biochemistry': 'Biochemistry',
  'microbiology': 'Microbiology',
  'public administration': 'Public Administration',
  'international relations': 'International Relations',
  'political science': 'Political Science',
  'law': 'Law',
  'medicine': 'Medicine',
  'nursing': 'Nursing',
  'education': 'Education',
  'library science': 'Library Science',
  'agriculture': 'Agriculture',
  'agricultural science': 'Agriculture',
  'geology': 'Geology',
  'geography': 'Geography',
  'geographic information science': 'Geographic Information Science',
  'architecture': 'Architecture',
  'urban planning': 'Urban Planning',
  'surveying': 'Surveying',
  'quantity surveying': 'Quantity Surveying',
  'building': 'Building',
  'estate management': 'Estate Management',
  'insurance': 'Insurance',
  'banking and finance': 'Banking and Finance',
  'finance': 'Finance',
  'marketing': 'Marketing',
  'human resource': 'Human Resource Management',
  'human resource management': 'Human Resource Management',
  
  // Information Technology
  'information technology': 'Information Technology',
  'information tech': 'Information Technology',
  'it': 'Information Technology',
  
  // Science related
  'applied science': 'Applied Science',
  'science': 'Science',
  'general studies': 'General Studies'
};

/**
 * Standardizes a department name to a consistent format
 * @param {string} departmentName - The department name to standardize
 * @returns {string} - Standardized department name
 */
export const getStandardizedDepartment = (departmentName) => {
  if (!departmentName || typeof departmentName !== 'string') {
    return '';
  }

  const lowerCaseName = departmentName.trim().toLowerCase();
  
  // Direct mapping
  if (DEPARTMENT_MAPPINGS[lowerCaseName]) {
    return DEPARTMENT_MAPPINGS[lowerCaseName];
  }

  // Partial matching with fuzzy logic
  for (const [key, value] of Object.entries(DEPARTMENT_MAPPINGS)) {
    if (lowerCaseName.includes(key) || key.includes(lowerCaseName)) {
      return value;
    }
    
    // Check for common abbreviations or variations
    const normalizedKey = key.replace(/\s+/g, '');
    const normalizedInput = lowerCaseName.replace(/\s+/g, '');
    
    if (normalizedInput.includes(normalizedKey) || normalizedKey.includes(normalizedInput)) {
      return value;
    }
  }

  // If no mapping found, return the original name with proper capitalization
  return departmentName.trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Get all available department options for dropdowns
 * @returns {Array} - Array of standardized department names
 */
export const getAllDepartments = () => {
  return [
    ...new Set(Object.values(DEPARTMENT_MAPPINGS))
  ].sort();
};

/**
 * Search for departments matching a query
 * @param {string} query - Search query
 * @returns {Array} - Array of matching department names
 */
export const searchDepartments = (query) => {
  if (!query) return [];

  const lowerQuery = query.trim().toLowerCase();
  const allDepartments = getAllDepartments();
  
  return allDepartments.filter(dept => 
    dept.toLowerCase().includes(lowerQuery)
  );
};