import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiDownload, FiArrowLeft, FiCheckCircle, FiLoader, FiFileText, FiLock, FiHelpCircle } from 'react-icons/fi';
import { getProjectById, getUserById } from '../api/projectServices';
import { authService } from '../appwrite/auth';
import { downloadFile } from '../api/fileStorageService';
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
          navigate(`/login?redirect=/projects/${projectId}/download-file`);
        }
      } catch (error) {
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
        const projectData = await getProjectById(projectId);

        if (!projectData) {
          setError('Project not found.');
          return;
        }

        setProject({ id: projectData.$id, ...projectData });

        let hasPurchasedLocally = false;

        try {
          const userDoc = await getUserById(user.$id);
          if (userDoc) {
            const purchasedProjects = userDoc.purchasedProjects || [];
            hasPurchasedLocally = purchasedProjects.some(p => p === projectId);
          }
        } catch (userError) {
          console.log("User document not found in users collection, checking orders...");
        }

        if (!hasPurchasedLocally) {
          try {
            const { databases, DATABASE_ID, COLLECTIONS } = await import('../appwrite/config');
            const { Query } = await import('appwrite');

            const orderResponse = await databases.listDocuments(
              DATABASE_ID,
              COLLECTIONS.ORDERS,
              [
                Query.equal('userId', user.$id),
                Query.equal('projectId', projectId),
                Query.equal('status', 'completed')
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
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <FiLoader className="animate-spin text-2xl text-gray-400" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{error || 'Project not found'}</h2>
          <Link to="/projects" className="text-gray-900 underline hover:text-gray-600">
            Return to Library
          </Link>
        </div>
      </div>
    );
  }

  if (!hasPurchased) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-20">
        <Modal {...modal} onClose={closeModal} />
        <div className="max-w-md w-full bg-white border border-gray-100 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiLock className="text-2xl text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Purchase Required</h2>
          <p className="text-gray-500 mb-8">You need to purchase this project to download it.</p>
          <Link
            to={`/projects/${projectId}/payment`}
            className="inline-flex items-center justify-center w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition-colors font-medium"
          >
            Purchase Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pt-24 pb-20">
      <Modal {...modal} onClose={closeModal} />

      <div className="max-w-4xl mx-auto px-6">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to={`/projects/${projectId}`}
            className="inline-flex items-center text-sm text-gray-400 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Project
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <FiCheckCircle className="text-green-500 text-xl" />
            <span className="text-green-600 font-medium text-sm">Purchase Complete</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Download Project</h1>
          <p className="text-gray-500">
            Your files are ready. Choose a format to download.
          </p>
        </div>

        {/* Project Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-12 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-2">{project.title}</h2>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{project.department}</span>
            <span>•</span>
            <span>{project.level || 'BSc'}</span>
            <span>•</span>
            <span>{project.year || 'N/A'}</span>
          </div>
        </div>

        {/* Download Options */}
        <div className="space-y-4 mb-12">
          <h3 className="font-medium text-gray-900 mb-4">Available Formats</h3>

          {(project.mainFileId || project.fileName || project.filePath) ? (
            <>
              {/* PDF Option */}
              <button
                onClick={() => handleDownload('pdf')}
                disabled={isDownloading}
                className="w-full flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:border-gray-900 transition-all group disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                    <FiFileText className="text-xl text-red-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">PDF Document</div>
                    <div className="text-sm text-gray-500">Portable Document Format</div>
                  </div>
                </div>
                <FiDownload className="text-xl text-gray-400 group-hover:text-gray-900 transition-colors" />
              </button>

              {/* DOCX Option */}
              <button
                onClick={() => handleDownload('docx')}
                disabled={isDownloading}
                className="w-full flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:border-gray-900 transition-all group disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <FiFileText className="text-xl text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Word Document</div>
                    <div className="text-sm text-gray-500">Microsoft Word</div>
                  </div>
                </div>
                <FiDownload className="text-xl text-gray-400 group-hover:text-gray-900 transition-colors" />
              </button>
            </>
          ) : (
            <div className="bg-yellow-50 border border-yellow-100 text-yellow-800 p-4 rounded-lg text-sm">
              <p className="font-medium mb-1">Files Not Available</p>
              <p>The project files are currently being processed. Please contact support.</p>
            </div>
          )}
        </div>

        {isDownloading && (
          <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-bottom-4">
            <FiLoader className="animate-spin" />
            <span>Preparing download...</span>
          </div>
        )}

        {/* Help Section */}
        <div className="border-t border-gray-100 pt-8">
          <div className="flex items-start gap-3">
            <FiHelpCircle className="text-gray-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 text-sm mb-2">Need help downloading?</h4>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>Check your browser's download settings if the download doesn't start.</li>
                <li>You can access this page anytime from your dashboard.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DownloadFilePage;
