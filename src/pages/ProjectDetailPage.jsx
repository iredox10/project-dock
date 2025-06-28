
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaDownload, FaStar, FaArrowLeft, FaUserGraduate, FaCalendarAlt, FaSpinner, FaPaperPlane, FaFilePdf, FaFileWord, FaHashtag, FaBookOpen, FaCheckCircle, FaDatabase } from 'react-icons/fa';
import { db, auth } from '../firebase/config';
import { getDoc, doc, collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// --- Reusable Components ---
const StarRating = ({ rating, size = 'text-md' }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <FaStar key={i} className={`${size} ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
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
    <div className="bg-gray-50 p-6 rounded-2xl mt-10 border">
      <h3 className="text-2xl font-bold mb-4">Leave a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="font-semibold">Your Rating</label>
          <div className="flex text-2xl mt-1">{[...Array(5)].map((_, i) => <FaStar key={i} onClick={() => setRating(i + 1)} className={`cursor-pointer ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />)}</div>
        </div>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts on this project..." rows="4" className="w-full p-3 border rounded-lg" required></textarea>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 mt-4 bg-indigo-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400">
          {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />} Submit Review
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

        // Calculate average rating
        if (fetchedReviews.length > 0) {
          const totalRating = fetchedReviews.reduce((acc, review) => acc + review.rating, 0);
          projectData.averageRating = totalRating / fetchedReviews.length;
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

  if (isLoading) return <div className="flex justify-center items-center h-screen"><FaSpinner className="animate-spin text-5xl text-indigo-600" /></div>;
  if (error) return <div className="text-center py-20"><h2 className="text-2xl font-bold text-red-600">{error}</h2><Link to="/projects" className="text-indigo-600 hover:underline mt-4">Back to Projects</Link></div>;
  if (!project) return null;

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8"><Link to="/projects" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-semibold"><FaArrowLeft />Back to Showcase</Link></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <main className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <span className="text-base font-semibold text-indigo-600 tracking-wider uppercase">{project.department}</span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2">{project.title}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 mt-4">
                <div className="flex items-center gap-2"><FaUserGraduate /><span>By {project.author}</span></div>
                <div className="flex items-center gap-2"><FaCalendarAlt /><span>{project.year}</span></div>
                <div className="flex items-center gap-2"><StarRating rating={project.averageRating || 0} /><span>({project.ratingCount || 0} reviews)</span></div>
              </div>
              <hr className="my-10" />
              <article className="prose prose-lg max-w-none prose-indigo">
                <h2>Abstract</h2><p>{project.abstract}</p>
                <hr />
                <h2>Chapter One Preview</h2>
                {project.chapterOne?.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
              </article>
              <div className="mt-12">
                <h2 className="text-3xl font-bold mb-6">Ratings & Reviews</h2>
                {reviews.length > 0 ? reviews.map(review => (
                  <div key={review.id} className="border-t py-6"><div className="flex items-center mb-2"><StarRating rating={review.rating} /><p className="ml-4 font-bold text-gray-800">{review.userName}</p></div><p className="text-gray-700">{review.comment}</p></div>
                )) : <p>No reviews yet. Be the first to leave one!</p>}
              </div>
              {currentUser && hasPurchased && <ReviewForm projectId={projectId} onReviewSubmitted={fetchProjectAndReviews} />}
            </div>
          </main>
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-2xl border">
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">Project Information</h3>
              <ul className="space-y-4 text-gray-700">
                {project.formats?.includes('PDF') && <li className="flex items-center gap-3"><FaFilePdf className="text-red-500 text-xl w-6" /><span>Format: PDF Available</span></li>}
                {project.formats?.includes('DOCX') && <li className="flex items-center gap-3"><FaFileWord className="text-blue-500 text-xl w-6" /><span>Format: MS-Word DOC Available</span></li>}
                <li className="flex items-center gap-3"><FaHashtag className="text-gray-500 text-xl w-6" /><span>Pages: {project.pages || 'N/A'}</span></li>
                <li className="flex items-center gap-3"><FaDatabase className="text-gray-500 text-xl w-6" /><span>File Size: {project.fileSize || 'N/A'}</span></li>
                <li className="flex items-center gap-3"><FaBookOpen className="text-gray-500 text-xl w-6" /><span>Chapters: {project.chapters || 'N/A'}</span></li>
              </ul>
              {project.includes && (
                <div className="mt-6 pt-6 border-t">
                  <ul className="space-y-3">
                    {project.includes.map(item => <li key={item} className="flex items-center gap-3 text-gray-800"><FaCheckCircle className="text-green-500 text-xl w-6" /><span>With {item}</span></li>)}
                  </ul>
                </div>
              )}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-center text-gray-600 mb-4">Preview Abstract and Chapter One on the left</p>
                <Link to={`/projects/${project.id}/download`} className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white font-bold px-6 py-4 rounded-lg hover:bg-indigo-700 transition duration-300 text-lg">
                  <FaDownload />
                  <span>Download Project</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
