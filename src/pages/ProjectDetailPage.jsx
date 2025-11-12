
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaDownload, FaStar, FaArrowLeft, FaUserGraduate, FaCalendarAlt, FaSpinner, FaPaperPlane, FaFilePdf, FaFileWord, FaHashtag, FaBookOpen, FaCheckCircle, FaDatabase, FaUniversity, FaEye, FaShieldAlt, FaClock, FaQuoteLeft, FaHeart } from 'react-icons/fa';
import { getProjectById, getReviewsByProject, getReviewsByUser, createReview, updateReview, deleteReview, getAllOrders, createOrder, updateOrder, deleteOrder, getUserById, updateUser } from '../api/projectServices';
import { authService } from '../appwrite/auth';
import { Query } from 'appwrite';

// --- Helper function to handle data that might be a string or an array ---
const toArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string') {
    return value.split(',').map(item => item.trim());
  }
  return []; // Return empty array if it's neither
};


// --- Reusable Components ---
const StarRating = ({ rating, size = 'text-md' }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <FaStar key={i} className={`${size} ${i < Math.round(rating) ? 'text-yellow-400' : 'text-slate-300'}`} />
    ))}
  </div>
);

const ReviewForm = ({ projectId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) { setError('Please write a comment.'); return; }
    setIsSubmitting(true);
    setError('');
    try {
      const user = await authService.getCurrentUser();
      const userDoc = await getUserById(user.$id);
      const userName = userDoc?.name || user?.name || 'Anonymous';

      const reviewData = { 
        userId: user.$id, 
        userName, 
        projectId: projectId, 
        rating, 
        comment, 
        isApproved: false, 
        createdAt: new Date().toISOString() 
      };
      await createReview(reviewData);

      onReviewSubmitted();
      setComment('');
      setRating(5);
    } catch (err) {
      setError('Failed to submit review.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-100 p-8 rounded-2xl mt-12">
      <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
          <FaPaperPlane className="text-white" />
        </div>
        Leave a Review
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="font-semibold text-slate-700 mb-2 block">Your Rating</label>
          <div className="flex gap-2 text-3xl">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                onClick={() => setRating(i + 1)} 
                className={`cursor-pointer transition-all hover:scale-110 ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`} 
              />
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label className="font-semibold text-slate-700 mb-2 block">Your Review</label>
          <textarea 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
            placeholder="Share your thoughts on this project..." 
            rows="5" 
            className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
            required
          ></textarea>
        </div>
        {error && <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
          <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
        </button>
      </form>
    </div>
  );
};
// --- End of Components ---


const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  // Handle scroll to show/hide floating download button on mobile
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowFloatingButton(true);
      } else {
        setShowFloatingButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // In Appwrite, we need to manually check authentication status periodically
    const checkAuthStatus = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        setCurrentUser(null);
      }
    };

    // Check auth status immediately
    checkAuthStatus();

    // Set up a periodic check every 30 seconds
    const interval = setInterval(checkAuthStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchProjectAndReviews = async () => {
    setIsLoading(true);
    try {
      const projectData = await getProjectById(projectId);
      
      if (projectData) {
        // Appwrite returns $id as the document ID
        setProject({ id: projectData.$id, ...projectData });

        // Get reviews for this project using getReviewsByProject
        const reviewsResponse = await getReviewsByProject(projectId);
        const fetchedReviews = reviewsResponse.documents.map(doc => ({ 
          id: doc.$id, 
          ...doc 
        }));
        setReviews(fetchedReviews);

        if (fetchedReviews.length > 0) {
          const averageRating = fetchedReviews.reduce((acc, review) => acc + review.rating, 0) / fetchedReviews.length;
          projectData.averageRating = averageRating;
          projectData.ratingCount = fetchedReviews.length;
        }
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

  useEffect(() => {
    if (projectId) fetchProjectAndReviews();
  }, [projectId]);

  useEffect(() => {
    if (currentUser && project) {
      const checkPurchase = async () => {
        if (currentUser) {
          try {
            const userData = await getUserById(currentUser.$id);
            if (userData) {
              setHasPurchased(userData.purchasedProjects?.some(p => p === projectId));
              setIsFavorite(userData.favoriteProjects?.some(f => f === projectId));
            }
          } catch (error) {
            // User document doesn't exist yet, set defaults
            console.log('User document not found, setting defaults');
            setHasPurchased(false);
            setIsFavorite(false);
          }
        }
      };
      checkPurchase();
    }
  }, [currentUser, project, projectId]);

  const toggleFavorite = async () => {
    if (!currentUser) {
      // Redirect to login
      window.location.href = `/login?redirect=/projects/${projectId}`;
      return;
    }

    try {
      let userData;
      
      // Try to get user data, if it doesn't exist, create it
      try {
        userData = await getUserById(currentUser.$id);
      } catch (error) {
        // User document doesn't exist, create it using the database directly
        const { databases, DATABASE_ID, COLLECTIONS } = await import('../appwrite/config');
        const { ID } = await import('appwrite');
        
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          currentUser.$id, // Use the auth user ID as document ID
          {
            email: currentUser.email,
            name: currentUser.name || currentUser.email?.split('@')[0],
            role: 'user',
            purchasedProjects: [],
            favoriteProjects: []
          }
        );
        userData = await getUserById(currentUser.$id);
      }

      let favoriteProjects = userData.favoriteProjects || [];
      
      if (isFavorite) {
        favoriteProjects = favoriteProjects.filter(fav => fav !== projectId);
      } else {
        if (!favoriteProjects.some(fav => fav === projectId)) {
          favoriteProjects.push(projectId);
        }
      }
      
      await updateUser(currentUser.$id, {
        ...userData,
        favoriteProjects
      });
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setError('Failed to update favorites. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-slate-50 to-white">
        <FaSpinner className="animate-spin text-6xl text-indigo-600 mb-4" />
        <p className="text-slate-600 font-medium">Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl border-2 border-red-100 p-12 max-w-lg shadow-xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{error}</h2>
          <p className="text-slate-600 mb-8">The project you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/projects" 
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Projects</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!project) return null;

  // Safely process the 'includes' and 'formats' fields
  const projectIncludes = toArray(project.includes);
  const projectFormats = toArray(project.formats);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-16 md:pt-20">
      {/* Elegant Compact Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 relative overflow-hidden shadow-xl">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
          <Link 
            to="/projects" 
            className="inline-flex items-center gap-2 text-white/90 hover:text-white font-medium mb-4 text-sm transition-all hover:gap-3"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to Projects</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Title & Info Section */}
            <div className="flex-1 space-y-3">
              {/* Badges Row */}
              <div className="flex items-center flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                  <FaUniversity className="text-white" />
                  {project.department}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5 text-xs font-medium text-white/90">
                  {project.level || 'BSc'}
                </span>
                <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5">
                  <StarRating rating={project.averageRating || 0} size="text-xs" />
                  <span className="text-xs font-medium text-white/90">({project.ratingCount || 0})</span>
                </div>
              </div>
              
              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight">
                {project.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <FaUserGraduate className="text-white/60" />
                  <span className="font-medium">{project.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-white/60" />
                  <span className="font-medium">{project.year || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEye className="text-white/60" />
                  <span className="font-medium">{project.downloadCount || 0} views</span>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="flex flex-col items-start lg:items-end gap-3">
              <div className="text-right">
                <div className="text-3xl font-bold text-white mb-1">₦{project.priceNGN?.toLocaleString() || 'N/A'}</div>
                <div className="text-xs text-white/70">One-time payment</div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={toggleFavorite}
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 shadow-2xl hover:scale-105 transform ${
                    isFavorite
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <FaHeart className="text-2xl" />
                </button>
                <Link
                  to={`/projects/${projectId}/payment`}
                  className="inline-flex items-center gap-3 bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 transform"
                >
                  <FaDownload className="text-xl" />
                  <span className="text-lg">Download Now</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <main className="lg:col-span-2">
            {/* Abstract Section */}
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-lg p-8 md:p-10 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <FaBookOpen className="text-white text-xl" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Abstract</h2>
              </div>
              <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
                <p className="text-lg">{project.abstractFileId}</p>
              </div>
            </div>

            {/* Chapter One Preview */}
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-lg p-8 md:p-10 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <FaEye className="text-white text-xl" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Chapter One Preview</h2>
              </div>
              <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
                {project.chapterOneFileId?.split('\n\n').map((p, i) => (
                  <p key={i} className="mb-4">{p}</p>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-lg p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-xl flex items-center justify-center">
                  <FaStar className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Ratings & Reviews</h2>
                  <p className="text-slate-600">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="border-t border-slate-200 pt-6 first:border-0 first:pt-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {review.userName?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-bold text-slate-900">{review.userName}</p>
                            <StarRating rating={review.rating} size="text-sm" />
                          </div>
                          <p className="text-slate-700 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                  <FaQuoteLeft className="text-4xl text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">No reviews yet. Be the first to leave one!</p>
                </div>
              )}
            </div>

            {/* Review Form */}
            {currentUser && hasPurchased && (
              <ReviewForm projectId={projectId} onReviewSubmitted={fetchProjectAndReviews} />
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Project Information Card */}
              <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaShieldAlt />
                    Project Details
                  </h3>
                </div>

                <div className="p-6">
                  <ul className="space-y-4">
                    {projectFormats.includes('PDF') && (
                      <li className="flex items-center gap-3 text-slate-700">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaFilePdf className="text-red-600 text-xl" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-slate-500">Format</div>
                          <div className="font-bold">PDF Available</div>
                        </div>
                      </li>
                    )}
                    {projectFormats.includes('DOCX') && (
                      <li className="flex items-center gap-3 text-slate-700">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaFileWord className="text-blue-600 text-xl" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-slate-500">Format</div>
                          <div className="font-bold">MS Word (DOCX)</div>
                        </div>
                      </li>
                    )}
                    <li className="flex items-center gap-3 text-slate-700">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaHashtag className="text-slate-600 text-xl" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-500">Pages</div>
                        <div className="font-bold">{project.pages || 'N/A'}</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3 text-slate-700">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaDatabase className="text-slate-600 text-xl" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-500">File Size</div>
                        <div className="font-bold">{project.fileSize || 'N/A'}</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3 text-slate-700">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaBookOpen className="text-slate-600 text-xl" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-500">Chapters</div>
                        <div className="font-bold">{project.chapters || 'N/A'}</div>
                      </div>
                    </li>
                  </ul>

                  {/* Includes Section */}
                  {projectIncludes.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-4">What's Included</h4>
                      <ul className="space-y-3">
                        {projectIncludes.map(item => (
                          <li key={item} className="flex items-center gap-3 text-slate-700">
                            <FaCheckCircle className="text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Download Button */}
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <Link 
                      to={`/projects/${project.id}/download`} 
                      className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold px-6 py-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
                    >
                      <FaDownload className="group-hover:animate-bounce" />
                      <span>Download Project</span>
                    </Link>
                    <p className="text-xs text-center text-slate-500 mt-3">Instant access after verification</p>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-white text-xl" />
                  </div>
                  <h4 className="font-bold text-slate-900">Quality Guaranteed</h4>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  This project has been peer-reviewed and verified for academic excellence.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating Download Button - Mobile Only */}
      {showFloatingButton && (
        <Link
          to={`/projects/${projectId}/payment`}
          className="md:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transform transition-all duration-300 animate-bounce"
        >
          <FaDownload className="text-2xl" />
        </Link>
      )}
    </div>
  );
};

export default ProjectDetailPage;
