import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaDownload, FaBook, FaSpinner, FaStar, FaCalendar, FaEye, FaHeartBroken } from 'react-icons/fa';
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject, getProjectsByDepartment, getProjectsByLevel, getAllUsers, getUserById, createUser, updateUser, deleteUser, getUserByEmail } from '../../api/projectServices';
import { authService } from '../../appwrite/auth';
import { Query } from 'appwrite';

const MyLibraryPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('purchased'); // 'purchased' or 'favorites'
  const [purchasedProjects, setPurchasedProjects] = useState([]);
  const [favoriteProjects, setFavoriteProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserLibrary();
    }
  }, [user]);

  const fetchUserLibrary = async () => {
    setIsLoading(true);
    try {
      // Get user data
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) return;

      const userData = userDoc.data();
      const purchasedIds = userData.purchasedProjects || [];
      const favoriteIds = userData.favoriteProjects || [];

      // Fetch purchased projects
      if (purchasedIds.length > 0) {
        const purchasedPromises = purchasedIds.map(async (projectId) => {
          const projectDoc = await getDoc(doc(db, 'projects', projectId));
          return projectDoc.exists() ? { id: projectDoc.id, ...projectDoc.data() } : null;
        });
        const purchased = await Promise.all(purchasedPromises);
        setPurchasedProjects(purchased.filter(p => p !== null));
      }

      // Fetch favorite projects
      if (favoriteIds.length > 0) {
        const favoritePromises = favoriteIds.map(async (projectId) => {
          const projectDoc = await getDoc(doc(db, 'projects', projectId));
          return projectDoc.exists() ? { id: projectDoc.id, ...projectDoc.data() } : null;
        });
        const favorites = await Promise.all(favoritePromises);
        setFavoriteProjects(favorites.filter(p => p !== null));
      }

      // Fetch orders
      const ordersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid));
      const ordersSnap = await getDocs(ordersQuery);
      const ordersData = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);

    } catch (error) {
      console.error('Error fetching library:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (projectId) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    const favoriteIds = userDoc.data()?.favoriteProjects || [];

    if (favoriteIds.includes(projectId)) {
      // Remove from favorites
      await updateDoc(userRef, {
        favoriteProjects: arrayRemove(projectId)
      });
      setFavoriteProjects(prev => prev.filter(p => p.id !== projectId));
    } else {
      // Add to favorites
      await updateDoc(userRef, {
        favoriteProjects: arrayUnion(projectId)
      });
      // Fetch and add project
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      if (projectDoc.exists()) {
        setFavoriteProjects(prev => [...prev, { id: projectDoc.id, ...projectDoc.data() }]);
      }
    }
  };

  const ProjectCard = ({ project, showRemoveFavorite = false }) => {
    const order = orders.find(o => o.projectId === project.id);
    const isPurchased = purchasedProjects.some(p => p.id === project.id);

    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                  {project.department}
                </span>
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                  {project.level}
                </span>
              </div>
              <Link to={`/projects/${project.id}`}>
                <h3 className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2">
                  {project.title}
                </h3>
              </Link>
            </div>
            {showRemoveFavorite && (
              <button
                onClick={() => toggleFavorite(project.id)}
                className="text-red-500 hover:text-red-600 transition-colors ml-2"
                title="Remove from favorites"
              >
                <FaHeart className="text-xl" />
              </button>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <FaCalendar className="text-gray-400" />
              <span>{project.year}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaBook className="text-gray-400" />
              <span>{project.pages || 'N/A'} pages</span>
            </div>
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400" />
              <span>{project.averageRating?.toFixed(1) || 'N/A'}</span>
            </div>
          </div>

          {/* Purchase Info */}
          {order && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-green-800">
                <FaDownload className="text-green-600" />
                <span className="font-semibold">Purchased</span>
              </div>
              <div className="text-xs text-green-700 mt-1">
                {order.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {isPurchased ? (
              <Link
                to={`/projects/${project.id}/download-file`}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                <FaDownload />
                Download
              </Link>
            ) : (
              <Link
                to={`/projects/${project.id}/payment`}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Purchase ₦{project.priceNGN?.toLocaleString()}
              </Link>
            )}
            <Link
              to={`/projects/${project.id}`}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaEye />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <FaSpinner className="animate-spin text-5xl text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">My Library</h1>
        <p className="text-gray-600">Manage your purchased and favorite projects</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-4 md:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-xs md:text-sm font-medium mb-1">Purchased Projects</p>
              <p className="text-3xl md:text-4xl font-bold">{purchasedProjects.length}</p>
            </div>
            <FaDownload className="text-4xl md:text-5xl text-indigo-200 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-red-600 text-white rounded-xl p-4 md:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-xs md:text-sm font-medium mb-1">Favorite Projects</p>
              <p className="text-3xl md:text-4xl font-bold">{favoriteProjects.length}</p>
            </div>
            <FaHeart className="text-4xl md:text-5xl text-pink-200 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-xl p-4 md:p-6 shadow-lg sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs md:text-sm font-medium mb-1">Total Orders</p>
              <p className="text-3xl md:text-4xl font-bold">{orders.length}</p>
            </div>
            <FaBook className="text-4xl md:text-5xl text-green-200 opacity-50" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md p-2 flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => setActiveTab('purchased')}
          className={`flex-1 px-4 md:px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'purchased'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FaDownload />
            <span className="hidden sm:inline">Purchased</span>
            <span className="sm:hidden">Purchased</span>
            <span className="hidden sm:inline">({purchasedProjects.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 px-4 md:px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'favorites'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FaHeart />
            <span className="hidden sm:inline">Favorites</span>
            <span className="sm:hidden">Favorites</span>
            <span className="hidden sm:inline">({favoriteProjects.length})</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'purchased' ? (
          <div>
            {purchasedProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {purchasedProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center">
                <FaBook className="text-5xl md:text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">No Purchased Projects</h3>
                <p className="text-sm md:text-base text-gray-600 mb-6">You haven't purchased any projects yet</p>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
                >
                  Browse Projects
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div>
            {favoriteProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {favoriteProjects.map(project => (
                  <ProjectCard key={project.id} project={project} showRemoveFavorite={true} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center">
                <FaHeartBroken className="text-5xl md:text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">No Favorite Projects</h3>
                <p className="text-sm md:text-base text-gray-600 mb-6">Start adding projects to your favorites</p>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
                >
                  Browse Projects
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLibraryPage;
