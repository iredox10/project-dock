
import apiClient from './axios';

// === Projects API Service ===

/**
 * Fetches all projects, optionally with query parameters for filtering.
 * @param {object} params - Query parameters (e.g., { department: 'Computer Science', level: 'BSc' })
 * @returns {Promise<object>}
 */
export const getAllProjects = (params) => {
  return apiClient.get('/projects', { params });
};

/**
 * Fetches a single project by its ID.
 * @param {string} projectId - The ID of the project.
 * @returns {Promise<object>}
 */
export const getProjectById = (projectId) => {
  return apiClient.get(`/projects/${projectId}`);
};

/**
 * Creates a new project (Admin only).
 * @param {object} projectData - The data for the new project.
 * @returns {Promise<object>}
 */
export const createProject = (projectData) => {
  return apiClient.post('/projects', projectData);
};

/**
 * Updates an existing project (Admin only).
 * @param {string} projectId - The ID of the project to update.
 * @param {object} projectData - The new data for the project.
 * @returns {Promise<object>}
 */
export const updateProject = (projectId, projectData) => {
  return apiClient.put(`/projects/${projectId}`, projectData);
};

/**
 * Deletes a project (Admin only).
 * @param {string} projectId - The ID of the project to delete.
 * @returns {Promise<object>}
 */
export const deleteProject = (projectId) => {
  return apiClient.delete(`/projects/${projectId}`);
};

// You can create more services for other parts of your app in new files:

// === Departments API Service (in departmentService.js) ===
export const getAllDepartments = () => {
  return apiClient.get('/departments');
};


// === Auth API Service (in authService.js) ===
export const registerUser = (userData) => {
  return apiClient.post('/auth/register', userData);
}

export const loginUser = (credentials) => {
  return apiClient.post('/auth/login', credentials);
}

