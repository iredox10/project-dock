import { fileStorageService as storageService } from '../appwrite/api';

// Export the Appwrite storage service functions directly
export const {
  uploadProjectFile,
  getFileDownloadURL,
  deleteProjectFile,
  downloadFile
} = storageService;

export default storageService;