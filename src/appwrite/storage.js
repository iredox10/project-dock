import { storage, BUCKET_ID } from './config';
import { ID } from 'appwrite';

/**
 * File storage service using Appwrite Storage
 */

// Upload project files to Appwrite Storage
export const uploadProjectFile = async (file, projectId, fileType, onProgress) => {
  try {
    // Create a unique filename using projectId and timestamp
    const fileName = `${projectId}_${fileType}_${Date.now()}.${fileType === 'pdf' ? 'pdf' : 'docx'}`;
    
    // Upload file to Appwrite storage bucket
    const fileUpload = await storage.createFile(
      BUCKET_ID,
      ID.unique(), // Auto-generate file ID
      file,
      undefined, // Permissions - using bucket defaults
      onProgress // Progress callback
    );

    // Get the file preview URL (this is accessible if the bucket has read permissions)
    const fileUrl = storage.getFileView(
      BUCKET_ID,
      fileUpload.$id
    );

    return {
      success: true,
      url: fileUrl, // This is the view URL
      fileId: fileUpload.$id, // File ID for future reference
      bucketId: BUCKET_ID,
      fileName: fileName,
      originalFileName: file.name,
      mimeType: file.type,
      size: file.size
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error(error.message);
  }
};

// Get file download URL
export const getFileDownloadURL = (fileId) => {
  try {
    // For download, we use getFileDownload
    // This returns a URL string, not a promise
    const downloadUrl = storage.getFileDownload(
      BUCKET_ID,
      fileId
    );
    return downloadUrl;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw new Error(error.message);
  }
};

// Get file preview URL
export const getFilePreviewURL = (fileId) => {
  try {
    const previewUrl = storage.getFileView(
      BUCKET_ID,
      fileId
    );
    return previewUrl;
  } catch (error) {
    console.error('Error getting preview URL:', error);
    throw new Error(error.message);
  }
};

// Delete file from storage
export const deleteProjectFile = async (fileId) => {
  try {
    const result = await storage.deleteFile(
      BUCKET_ID,
      fileId
    );
    return result;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error(error.message);
  }
};

// List files in a bucket
export const listFiles = async (queries = [], limit = 25, offset = 0) => {
  try {
    const response = await storage.listFiles(
      BUCKET_ID,
      [
        ...queries,
        // Query.limit(limit),
        // Query.offset(offset)
      ].filter(q => q) // Remove any undefined queries
    );
    return response;
  } catch (error) {
    console.error('Error listing files:', error);
    throw new Error(error.message);
  }
};

// Get file information
export const getFileInfo = async (fileId) => {
  try {
    const fileInfo = await storage.getFile(
      BUCKET_ID,
      fileId
    );
    return fileInfo;
  } catch (error) {
    console.error('Error getting file info:', error);
    throw new Error(error.message);
  }
};

// Download file directly (triggers browser download)
export const downloadFile = (fileId, fileName = 'download') => {
  try {
    // Get the download URL
    // This returns a URL string, not a promise
    const downloadUrl = storage.getFileDownload(
      BUCKET_ID,
      fileId
    );

    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return { success: true, downloadUrl };
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error(error.message);
  }
};

// Get file preview (for PDFs, images, etc.)
export const getFilePreview = (fileId, width = 0, height = 0, quality = 100, background = 'transparent', output = undefined) => {
  try {
    const previewUrl = storage.getFilePreview(
      BUCKET_ID,
      fileId,
      width,
      height,
      quality,
      background,
      output
    );
    return previewUrl;
  } catch (error) {
    console.error('Error getting file preview:', error);
    throw new Error(error.message);
  }
};

export default {
  uploadProjectFile,
  getFileDownloadURL,
  getFilePreviewURL,
  deleteProjectFile,
  listFiles,
  getFileInfo,
  downloadFile,
  getFilePreview
};