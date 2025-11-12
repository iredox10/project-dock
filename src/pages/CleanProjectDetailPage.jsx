import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaUser, FaCalendar, FaDownload, FaStar, FaChevronLeft, FaBook, FaFilePdf, FaHeart, FaShareAlt, FaCheck } from 'react-icons/fa';
import { getProjectById, getReviewsByProject } from '../api/projectServices';
import { authService } from '../appwrite/auth';

const CleanProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        setCurrentUser(null);
      }
    };
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const fetchProjectAndReviews = async () => {
      setIsLoading(true);
      try {
        const projectData = await getProjectById(projectId);

        if (projectData) {
          // Appwrite returns $id as the document ID
          setProject({ id: projectData.$id, ...projectData });

          // Get reviews for this project
          const reviewsResponse = await getReviewsByProject(projectId);
          const fetchedReviews = reviewsResponse.documents.map(doc => ({
            id: doc.$id,
            ...doc
          }));
          setReviews(fetchedReviews);
        } else {
          setError('Project not found.');
        }
      } catch (err) {
        setError('Failed to fetch project details.');
        console.error("Error fetching document:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) fetchProjectAndReviews();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-4">Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/projects"
            className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
          >
            <FaChevronLeft className="mr-2" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link
              to="/projects"
              className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <FaChevronLeft className="mr-2" />
              Back to Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs md:text-sm font-medium bg-indigo-100 text-indigo-800 mb-2">
                    <FaBook className="mr-1" />
                    {project.department}
                  </span>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{project.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center text-sm md:text-base">
                      <FaUser className="mr-1" />
                      <span>{project.author}</span>
                    </div>
                    <div className="flex items-center text-sm md:text-base">
                      <FaCalendar className="mr-1" />
                      <span>{project.year || 'N/A'}</span>
                    </div>
                    {project.rating && (
                      <div className="flex items-center text-sm md:text-base">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span>{project.rating.toFixed(1)} ({reviews.length} reviews)</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                    <FaHeart className={isFavorite ? 'fill-current text-red-500' : ''} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                    <FaShareAlt />
                  </button>
                </div>
              </div>

              {/* Download Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">₦{project.priceNGN?.toLocaleString() || '0'}</div>
                    <div className="text-sm text-gray-600">One-time payment</div>
                  </div>
                  <Link
                    to={`/projects/${projectId}/payment`}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <FaDownload className="mr-2" />
                    Download Project
                  </Link>
                </div>
              </div>
            </div>

            {/* Abstract Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Abstract</h2>
              <div className="prose max-w-none text-gray-700 text-base">
                <p>{project.abstractFileId}</p>
              </div>
            </div>

            {/* Chapter One Preview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Chapter One Preview</h2>
              <div className="prose max-w-none text-gray-700 text-base">
                <p>{project.chapterOneFileId}</p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-indigo-800 text-sm font-medium">
                            {review.userName?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{review.userName}</div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-base">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet. Be the first to review this project.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-gray-600">Format</span>
                  <span className="font-medium">PDF</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Pages</span>
                  <span className="font-medium">{project.pages || 'N/A'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">File Size</span>
                  <span className="font-medium">{project.fileSize || 'N/A'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Chapters</span>
                  <span className="font-medium">{project.chapters || 'N/A'}</span>
                </li>
              </ul>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Includes</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FaCheck className="text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">Complete Abstract</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheck className="text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">Chapter One Preview</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheck className="text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">All Chapters</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Related Projects */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Related Projects</h3>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-md">
                  <div className="text-sm md:text-base font-medium text-gray-900">Project Title</div>
                  <div className="text-xs md:text-sm text-gray-600">Department</div>
                </div>
                <div className="p-3 border border-gray-200 rounded-md">
                  <div className="text-sm md:text-base font-medium text-gray-900">Project Title</div>
                  <div className="text-xs md:text-sm text-gray-600">Department</div>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                <span className="text-green-800 font-medium">Verified Quality</span>
              </div>
              <p className="text-sm text-green-700 mt-1">This project has been peer-reviewed and verified for academic excellence.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanProjectDetailPage;