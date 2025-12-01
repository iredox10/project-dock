import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShare2, FiHeart, FiCheck, FiDownload } from 'react-icons/fi';
import { getProjectById, getReviewsByProject } from '../api/projectServices';
import { authService } from '../appwrite/auth';
import ReactMarkdown from 'react-markdown';

const CleanProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowFloatingButton(true);
      } else {
        setShowFloatingButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
        if (user) {
          try {
            const { usersService } = await import('../appwrite/database');
            const userDoc = await usersService.getUserById(user.$id);
            if (project && userDoc?.favoriteProjects?.includes(project.id)) {
              setIsFavorite(true);
            }
          } catch (dbError) {
            console.error('Error fetching user favorites:', dbError);
          }
        }
      } catch (error) {
        setCurrentUser(null);
      }
    };
    checkAuthStatus();
  }, [project?.id]);

  useEffect(() => {
    const fetchProjectAndReviews = async () => {
      setIsLoading(true);
      try {
        const projectData = await getProjectById(projectId);
        if (projectData) {
          setProject({ id: projectData.$id, ...projectData });
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

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = project?.title || 'Academic Project';
    const shareText = `Check out this academic project: ${project?.title} from Project Dock`;

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
      } catch (error) { console.log('Error sharing:', error); }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      } catch (error) { console.log('Error copying link:', error); }
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      alert('Please log in to add projects to favorites');
      return;
    }
    if (!project) return;

    try {
      const { usersService } = await import('../appwrite/database');
      const userDoc = await usersService.getUserById(currentUser.$id);
      let updatedFavorites = [...(userDoc?.favoriteProjects || [])];

      if (isFavorite) {
        updatedFavorites = updatedFavorites.filter(id => id !== project.id);
        setIsFavorite(false);
      } else {
        if (!updatedFavorites.includes(project.id)) {
          updatedFavorites.push(project.id);
        }
        setIsFavorite(true);
      }
      // Only send the fields to update, not the entire document with system attributes
      await usersService.updateUser(currentUser.$id, { favoriteProjects: updatedFavorites });
    } catch (error) {
      console.error('Error updating favorites:', error);
      alert('Failed to update favorites');
    }
  };

  if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center text-sm text-gray-500">Loading...</div>;
  if (error) return <div className="min-h-screen bg-white flex items-center justify-center text-sm text-gray-500">{error}</div>;
  if (!project) return null;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Back Link */}
        <Link to="/projects" className="inline-flex items-center text-sm text-gray-400 hover:text-gray-900 transition-colors mb-12">
          <FiArrowLeft className="mr-2" /> Back to Library
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="mb-12">
              <span className="inline-block text-xs font-medium tracking-wider text-gray-500 uppercase mb-4">
                {project.department}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                {project.title}
              </h1>
              <div className="flex items-center gap-6 text-sm text-gray-500 font-mono">
                <span>{project.author}</span>
                <span>•</span>
                <span>{project.year || 'N/A'}</span>
                {project.rating && (
                  <>
                    <span>•</span>
                    <span>{project.rating.toFixed(1)} Rating</span>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Top Download Button */}
            <div className="md:hidden mb-12">
              <Link
                to={`/projects/${projectId}/payment`}
                className="block w-full bg-gray-900 text-white text-center py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Get Full Access (₦{project.priceNGN?.toLocaleString() || '0'})
              </Link>
            </div>

            <div className="prose prose-gray max-w-none mb-16">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Abstract</h3>
              <div className="text-gray-600 leading-relaxed">
                <ReactMarkdown>{project.abstractFileId || 'No abstract available'}</ReactMarkdown>
              </div>
            </div>

            <div className="prose prose-gray max-w-none mb-16">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
              <div className="p-8 bg-gray-50 rounded-lg text-gray-600 leading-relaxed border border-gray-100">
                <ReactMarkdown>{project.chapterOneFileId || 'No preview available'}</ReactMarkdown>
              </div>
            </div>

            {/* Reviews */}
            <div className="border-t border-gray-100 pt-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-8">Reviews</h3>
              {reviews.length > 0 ? (
                <div className="space-y-8">
                  {reviews.map(review => (
                    <div key={review.id} className="group">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="font-medium text-gray-900">{review.userName}</span>
                        <span className="text-xs text-gray-400 font-mono">Verified Purchase</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No reviews yet.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-24">
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-100 mb-8">
                <div className="flex items-baseline justify-between mb-8">
                  <span className="text-3xl font-bold text-gray-900">₦{project.priceNGN?.toLocaleString() || '0'}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">One-time</span>
                </div>

                <Link
                  to={`/projects/${projectId}/payment`}
                  className="block w-full bg-gray-900 text-white text-center py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors mb-4"
                >
                  Get Full Access
                </Link>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-2 rounded-full hover:bg-gray-200 transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    <FiHeart className={isFavorite ? 'fill-current' : ''} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                  >
                    <FiShare2 />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wider mb-4">Project Specs</h4>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-500">Format</dt>
                      <dd className="font-medium text-gray-900">PDF</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-500">Pages</dt>
                      <dd className="font-medium text-gray-900">{project.pages || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-500">Size</dt>
                      <dd className="font-medium text-gray-900">{project.fileSize || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-500">Chapters</dt>
                      <dd className="font-medium text-gray-900">{project.chapters || 'N/A'}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wider mb-4">Includes</h4>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-center gap-3">
                      <FiCheck className="text-gray-900" /> Complete Abstract
                    </li>
                    <li className="flex items-center gap-3">
                      <FiCheck className="text-gray-900" /> Chapter 1-5
                    </li>
                    <li className="flex items-center gap-3">
                      <FiCheck className="text-gray-900" /> References
                    </li>
                    <li className="flex items-center gap-3">
                      <FiCheck className="text-gray-900" /> Questionnaires
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* Mobile Floating Download Button */}
      {showFloatingButton && (
        <Link
          to={`/projects/${projectId}/payment`}
          className="md:hidden fixed bottom-24 right-6 z-50 flex items-center justify-center w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-all animate-bounce"
        >
          <FiDownload className="text-xl" />
        </Link>
      )}
    </div>
  );
};

export default CleanProjectDetailPage;