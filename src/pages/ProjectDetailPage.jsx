
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaDownload, FaStar, FaArrowLeft, FaUserGraduate, FaCalendarAlt, FaSpinner, FaPaperPlane, FaFilePdf, FaFileWord, FaHashtag, FaBookOpen, FaCheckCircle, FaDatabase, FaUniversity, FaEye, FaShieldAlt, FaClock, FaQuoteLeft } from 'react-icons/fa';
import { db, auth } from '../firebase/config';
import { getDoc, doc, collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

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
      const user = auth.currentUser;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userName = userDoc.exists() ? userDoc.data().name : 'Anonymous';

      const reviewData = { userId: user.uid, userName, rating, comment, isApproved: false, createdAt: serverTimestamp() };
      await addDoc(collection(db, 'projects', projectId, 'reviews'), reviewData);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  const fetchProjectAndReviews = async () => {
    setIsLoading(true);
    try {
      const projectDocRef = doc(db, 'projects', projectId);
      const docSnap = await getDoc(projectDocRef);

      if (docSnap.exists()) {
        const projectData = { id: docSnap.id, ...docSnap.data() };
        setProject(projectData);

        const reviewsRef = collection(db, 'projects', projectId, 'reviews');
        const q = query(reviewsRef, where('isApproved', '==', true), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedReviews = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setReviews(fetchedReviews);

        if (fetchedReviews.length > 0) {
          projectData.averageRating = fetchedReviews.reduce((acc, review) => acc + review.rating, 0) / fetchedReviews.length;
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
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setHasPurchased(userDoc.data().purchasedProjects?.includes(projectId));
        }
      };
      checkPurchase();
    }
  }, [currentUser, project, projectId]);

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="detail-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#detail-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <Link 
            to="/projects" 
            className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold mb-8 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
          >
            <FaArrowLeft />
            <span>Back to Projects</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              {/* Department Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4">
                <FaUniversity className="text-white" />
                <span className="text-white font-bold text-sm uppercase tracking-wide">{project.department}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                {project.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <FaUserGraduate />
                  <span className="font-medium">{project.author}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <FaCalendarAlt />
                  <span className="font-medium">{project.year || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <StarRating rating={project.averageRating || 0} />
                  <span className="font-medium">({project.ratingCount || 0})</span>
                </div>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-black text-white">{project.pages || 'N/A'}</div>
                  <div className="text-sm text-white/80">Pages</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white">{project.chapters || 'N/A'}</div>
                  <div className="text-sm text-white/80">Chapters</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                <p className="text-lg">{project.abstract}</p>
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
                {project.chapterOne?.split('\n\n').map((p, i) => (
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
    </div>
  );
};

export default ProjectDetailPage;
