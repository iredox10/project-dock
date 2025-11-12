import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaDownload, FaArrowLeft, FaCheckCircle, FaSpinner, FaFilePdf, FaFileWord, FaLock } from 'react-icons/fa';
import { getProjectById, getUserById } from '../api/projectServices';
import { authService } from '../appwrite/auth';
import { downloadFile, getFileDownloadURL } from '../api/fileStorageService';
import { Modal, useModal } from '../components/Modal';

const DownloadFilePage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { modal, showModal, closeModal } = useModal();
  
  const [project, setProject] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        if (!currentUser) {
          // Redirect to login with redirect parameter
          navigate(`/login?redirect=/projects/${projectId}/download-file`);
        }
      } catch (error) {
        // If auth check fails, redirect to login
        navigate(`/login?redirect=/projects/${projectId}/download-file`);
      }
    };

    checkAuthStatus();
  }, [projectId, navigate]);

  useEffect(() => {
    const fetchProjectAndCheckAccess = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch project
        const projectData = await getProjectById(projectId);
        
        if (!projectData) {
          setError('Project not found.');
          return;
        }
        
        setProject({ id: projectData.$id, ...projectData });
        
        // Check if user has purchased - try multiple methods
        let hasPurchasedLocally = false;

        // First, check the user's purchasedProjects array
        try {
          const userDoc = await getUserById(user.$id);
          if (userDoc) {
            const purchasedProjects = userDoc.purchasedProjects || [];
            hasPurchasedLocally = purchasedProjects.some(p => p === projectId);
          }
        } catch (userError) {
          console.log("User document not found in users collection, checking orders...");
        }

        // If not found in user doc, check the orders collection as a backup
        if (!hasPurchasedLocally) {
          try {
            const { databases, DATABASE_ID, COLLECTIONS } = await import('../appwrite/config');
            const { Query } = await import('appwrite');
            
            // Look for completed orders for this user and project
            const orderResponse = await databases.listDocuments(
              DATABASE_ID,
              COLLECTIONS.ORDERS,
              [
                Query.equal('userId', user.$id),
                Query.equal('projectId', projectId),
                Query.equal('status', 'completed') // Only completed orders
              ]
            );

            if (orderResponse.documents.length > 0) {
              hasPurchasedLocally = true;
            }
          } catch (orderError) {
            console.error("Error checking orders:", orderError);
          }
        }

        setHasPurchased(hasPurchasedLocally);

        if (!hasPurchasedLocally) {
          showModal(
            'Access Denied',
            'You need to purchase this project to download it.',
            'warning'
          );
          setTimeout(() => navigate(`/projects/${projectId}/payment`), 2000);
        }
      } catch (err) {
        setError('Failed to load project.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectAndCheckAccess();
  }, [user, projectId]);

  const handleDownload = (fileType) => {
    if (!hasPurchased) {
      showModal('Access Denied', 'Please purchase this project first.', 'warning');
      return;
    }

    setIsDownloading(true);

    try {
      // Get the file path from project data
      // Use the mainFileId field since that's what we use in our Appwrite schema
      const fileId = project.mainFileId || project.fileId || project.filePath;

      if (!fileId) {
        showModal(
          'File Not Available',
          `The file is not available for this project. Please contact support.`,
          'error'
        );
        setIsDownloading(false);
        return;
      }

      // Download file directly - the actual file extension is determined by the stored file in Appwrite
      // We'll use the project title as the filename
      const fileName = `${project.title.replace(/[^a-z0-9]/gi, '_')}`;
      downloadFile(fileId, fileName);
      
      showModal('Success', 'Download started successfully!', 'success');
    } catch (error) {
      console.error('Download error:', error);
      showModal('Download Failed', error.message, 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center pt-20">
        <FaSpinner className="animate-spin text-5xl text-indigo-600" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Project not found'}</h2>
          <Link to="/projects" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (!hasPurchased) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 pt-20">
        <Modal {...modal} onClose={closeModal} />
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <FaLock className="text-6xl text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Purchase Required</h2>
          <p className="text-gray-600 mb-6">You need to purchase this project to download it.</p>
          <Link
            to={`/projects/${projectId}/payment`}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
          >
            Purchase Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 pb-12">
      <Modal {...modal} onClose={closeModal} />
      
      <div className="max-w-4xl mx-auto px-4">
        <Link
          to={`/projects/${projectId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-semibold mb-6"
        >
          <FaArrowLeft />
          Back to Project
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <FaCheckCircle className="text-4xl text-green-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Download Your Project</h1>
              <p className="text-gray-600">Your purchase is complete. Download below.</p>
            </div>
          </div>

          {/* Project Info */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-lg text-gray-900 mb-2">{project.title}</h3>
            <div className="text-sm text-gray-600">
              {project.department} • {project.level} • {project.year}
            </div>
          </div>

          {/* Download Options */}
          <div className="space-y-4 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Choose Format:</h3>
            
            {/* PDF Download - Check using mainFileId or fileName */}
            {(project.mainFileId || project.fileName || project.filePath) && (
              <button
                onClick={() => handleDownload('pdf')}
                disabled={isDownloading}
                className="w-full flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <FaFilePdf className="text-2xl text-red-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900">PDF Format</div>
                    <div className="text-sm text-gray-600">Portable Document Format</div>
                  </div>
                </div>
                <FaDownload className="text-2xl text-indigo-600" />
              </button>
            )}

            {/* DOCX Download - Check using mainFileId or fileName */}
            {(project.mainFileId || project.fileName || project.filePath) && (
              <button
                onClick={() => handleDownload('docx')}
                disabled={isDownloading}
                className="w-full flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaFileWord className="text-2xl text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900">DOCX Format</div>
                    <div className="text-sm text-gray-600">Microsoft Word Document</div>
                  </div>
                </div>
                <FaDownload className="text-2xl text-indigo-600" />
              </button>
            )}

            {!(project.mainFileId || project.fileName || project.filePath) && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
                <p className="font-semibold mb-2">Files Not Available</p>
                <p className="text-sm">
                  The project files are not available yet. Please contact support for assistance.
                </p>
              </div>
            )}
          </div>

          {isDownloading && (
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg flex items-center gap-3">
              <FaSpinner className="animate-spin text-indigo-600" />
              <span className="text-indigo-900">Preparing your download...</span>
            </div>
          )}

          {/* Help Section */}
          <div className="bg-gray-50 rounded-lg p-6 mt-8">
            <h4 className="font-bold text-gray-900 mb-3">Need Help?</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• If download doesn't start, check your browser's download settings</li>
              <li>• Make sure you have enough storage space</li>
              <li>• You can re-download this project anytime from your dashboard</li>
              <li>• For issues, contact support with your order reference</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadFilePage;
