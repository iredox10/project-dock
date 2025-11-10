import { projectsService } from '../appwrite/api';

/**
 * Get all project topics, optionally filtered by department
 * @param {string} department - Optional department filter
 * @returns {Promise<Array>} - Array of project topics
 */
export const getProjectTopicsByDepartment = async (department = null) => {
  try {
    // Query projects based on department if provided
    if (department) {
      const response = await projectsService.getProjectsByDepartment(department);
      return response.documents || [];
    } else {
      const response = await projectsService.getAllProjects();
      return response.documents || [];
    }
  } catch (error) {
    console.error('Error fetching project topics:', error);
    throw new Error('Failed to fetch project topics: ' + error.message);
  }
};

/**
 * Get all unique departments that have project topics
 * @returns {Promise<Array>} - Array of department names
 */
export const getProjectTopicsDepartments = async () => {
  try {
    // Fetch all projects to extract unique departments
    const response = await projectsService.getAllProjects();
    const allProjects = response.documents || [];
    
    // Extract unique departments
    const departments = [...new Set(allProjects.map(project => project.department))];
    
    return departments;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw new Error('Failed to fetch departments: ' + error.message);
  }
};

/**
 * Get all unique levels available in the system
 * @returns {Promise<Array>} - Array of level names
 */
export const getProjectTopicsLevels = async () => {
  try {
    // Fetch all projects to extract unique levels
    const response = await projectsService.getAllProjects();
    const allProjects = response.documents || [];
    
    // Extract unique levels
    const levels = [...new Set(allProjects.map(project => project.level).filter(level => level))];
    
    return levels;
  } catch (error) {
    console.error('Error fetching levels:', error);
    throw new Error('Failed to fetch levels: ' + error.message);
  }
};

export default {
  getProjectTopicsByDepartment,
  getProjectTopicsDepartments,
  getProjectTopicsLevels
};