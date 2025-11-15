import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaDownload, FaBook, FaSpinner, FaStar, FaCalendar, FaEye, FaUniversity, FaUser, FaFilePdf, FaCode, FaShoppingCart } from 'react-icons/fa';
import { getAllProjects, getProjectById, getAllOrders, getUserById, updateUser } from '../../api/projectServices';
import { authService } from '../../appwrite/auth';
import { Query } from 'appwrite';

const departmentColors = {
  'Computer Science': { border: 'border-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-700', icon: 'bg-gradient-to-br from-indigo-500 to-blue-600' },
  'Electrical Engineering': { border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', icon: 'bg-gradient-to-br from-amber-500 to-orange-600' },
  'Economics': { border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'bg-gradient-to-br from-emerald-500 to-green-600' },
  'Mechanical Engineering': { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-700', icon: 'bg-gradient-to-br from-red-500 to-rose-600' },
  'Civil Engineering': { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-700', icon: 'bg-gradient-to-br from-purple-500 to-fuchsia-600' },
  'Business Administration': { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', icon: 'bg-gradient-to-br from-blue-500 to-cyan-600' },
  'Mass Communication': { border: 'border-pink-500', bg: 'bg-pink-50', text: 'text-pink-700', icon: 'bg-gradient-to-br from-pink-500 to-rose-600' },
};

const defaultColors = { border: 'border-slate-400', bg: 'bg-slate-50', text: 'text-slate-700', icon: 'bg-gradient-to-br from-slate-500 to-slate-600' };

const MyLibraryPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('purchased'); // 'purchased' or 'favorites'
  const [purchasedProjects, setPurchasedProjects] = useState([]);
  const [favoriteProjects, setFavoriteProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserLibrary();
    }
  }, [user]);

  // Refresh data when the component mounts or becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        fetchUserLibrary();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const fetchUserLibrary = async () => {
    setIsLoading(true);
    try {
      // Fetch orders to get purchased projects
      const ordersResponse = await getAllOrders({
        userId: user.$id,
        status: 'completed'
      });
      
      const userOrders = ordersResponse.documents || [];
      setOrders(userOrders.map(doc => ({ id: doc.$id, ...doc })));

      // Get unique project IDs from orders
      const purchasedIds = [...new Set(userOrders.map(order => order.projectId))];

      // Fetch purchased projects
      if (purchasedIds.length > 0) {
        const purchasedPromises = purchasedIds.map(async (projectId) => {
          try {
            const projectData = await getProjectById(projectId);
            return projectData ? { id: projectData.$id, ...projectData } : null;
          } catch (error) {
            console.error(`Error fetching project ${projectId}:`, error);
            return null;
          }
        });
        const purchased = await Promise.all(purchasedPromises);
        setPurchasedProjects(purchased.filter(p => p !== null));
      } else {
        setPurchasedProjects([]);
      }

      // Fetch favorite projects from user data (if field exists)
      try {
        const userData = await getUserById(user.$id);
        if (userData && userData.favoriteProjects) {
          const favoriteIds = userData.favoriteProjects || [];
          
          if (favoriteIds.length > 0) {
            const favoritePromises = favoriteIds.map(async (projectId) => {
              try {
                const projectData = await getProjectById(projectId);
                return projectData ? { id: projectData.$id, ...projectData } : null;
              } catch (error) {
                console.error(`Error fetching project ${projectId}:`, error);
                return null;
              }
            });
            const favorites = await Promise.all(favoritePromises);
            setFavoriteProjects(favorites.filter(p => p !== null));
          } else {
            setFavoriteProjects([]);
          }
        } else {
          setFavoriteProjects([]);
        }
      } catch (userError) {
        // User document doesn't exist or favoriteProjects field doesn't exist
        console.log('Favorites feature not available');
        setFavoriteProjects([]);
      }

    } catch (error) {
      console.error('Error fetching library:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (projectId) => {
    if (!user) return;

    try {
      const userData = await getUserById(user.$id);
      const favoriteIds = userData.favoriteProjects || [];

      if (favoriteIds.includes(projectId)) {
        // Remove from favorites
        const updatedFavorites = favoriteIds.filter(id => id !== projectId);
        await updateUser(user.$id, {
          ...userData,
          favoriteProjects: updatedFavorites
        });
        setFavoriteProjects(prev => prev.filter(p => p.id !== projectId));
      } else {
        // Add to favorites
        const updatedFavorites = [...favoriteIds, projectId];
        await updateUser(user.$id, {
          ...userData,
          favoriteProjects: updatedFavorites
        });
        // Fetch and add project
        const projectData = await getProjectById(projectId);
        if (projectData) {
          setFavoriteProjects(prev => [...prev, { id: projectData.$id, ...projectData }]);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const ProjectCard = ({ project, showRemoveFavorite = false }) => {
    const order = orders.find(o => o.projectId === project.id);
    const isPurchased = purchasedProjects.some(p => p.id === project.id) || orders.some(o => o.projectId === project.id);
    const colors = departmentColors[project.department] || defaultColors;

    return (
      <div className={`group bg-white rounded-2xl border-2 ${colors.border} border-opacity-20 hover:border-opacity-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col`}>
        {/* Top accent bar */}
        <div className={`h-2 ${colors.icon}`}></div>

        <div className="p-6 flex-grow">
          {/* Department badge & Icon */}
          <div className="flex justify-between items-start mb-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${colors.bg} ${colors.text} rounded-lg text-xs font-bold uppercase tracking-wide`}>
              <FaUniversity className="text-xs" />
              {project.department}
            </span>
            <div className={`w-10 h-10 ${colors.icon} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {project.formats?.includes('PDF') ? (
                <FaFilePdf className="text-white text-lg" />
              ) : (
                <FaCode className="text-white text-lg" />
              )}
            </div>
          </div>

          {/* Title */}
          <Link to={`/projects/${project.id}`}>
            <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-indigo-700 transition-colors min-h-[3.5rem] line-clamp-2">
              {project.title}
            </h3>
          </Link>

          {/* Metadata */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <FaUser className="text-slate-400 text-xs" />
              <span className="font-medium">{project.author || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <FaCalendar className="text-slate-400 text-xs" />
              <span>{project.year || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <FaBook className="text-slate-400 text-xs" />
              <span>{project.pages || 'N/A'} pages</span>
            </div>
          </div>

          {/* Rating */}
          {project.averageRating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={`text-sm ${i < Math.round(project.averageRating) ? 'text-yellow-400' : 'text-slate-200'}`} />
              ))}
              <span className="text-xs text-slate-500 ml-1">({project.averageRating.toFixed(1)})</span>
            </div>
          )}

          {/* Purchase Status Badge */}
          {order && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaShoppingCart className="text-green-600" />
                  <div>
                    <div className="text-sm font-bold text-green-800">Purchased</div>
                    <div className="text-xs text-green-600">
                      {order.$createdAt ? new Date(order.$createdAt).toLocaleDateString() : 'Recently'}
                    </div>
                  </div>
                </div>
                {showRemoveFavorite && (
                  <button
                    onClick={() => toggleFavorite(project.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                    title="Remove from favorites"
                  >
                    <FaHeart className="text-lg" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <div className="flex gap-2">
            {isPurchased ? (
              <>
                <Link
                  to={`/projects/${project.id}/download-file`}
                  className={`flex-1 flex items-center justify-center gap-2 ${colors.icon} text-white font-bold px-4 py-3 rounded-xl hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]`}
                >
                  <FaDownload />
                  <span>Download</span>
                </Link>
                <Link
                  to={`/projects/${project.id}`}
                  className="flex items-center justify-center gap-2 bg-slate-200 text-slate-700 font-semibold px-4 py-3 rounded-xl hover:bg-slate-300 transition-all"
                >
                  <FaEye />
                </Link>
              </>
            ) : (
              <Link
                to={`/projects/${project.id}/payment`}
                className={`w-full flex items-center justify-center gap-2 ${colors.icon} text-white font-bold px-4 py-3 rounded-xl hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]`}
              >
                <span>Purchase ₦{project.priceNGN?.toLocaleString()}</span>
              </Link>
            )}
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">My Library</h1>
        <p className="text-lg text-slate-600">Your purchased projects and favorites in one place</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">Purchased</p>
              <p className="text-4xl font-bold text-indigo-600">{purchasedProjects.length}</p>
            </div>
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <FaDownload className="text-3xl text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-pink-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">Favorites</p>
              <p className="text-4xl font-bold text-pink-600">{favoriteProjects.length}</p>
            </div>
            <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center">
              <FaHeart className="text-3xl text-pink-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">Orders</p>
              <p className="text-4xl font-bold text-slate-700">{orders.length}</p>
            </div>
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
              <FaShoppingCart className="text-3xl text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-slate-200">
        <button
          onClick={() => setActiveTab('purchased')}
          className={`px-6 py-3 font-bold text-lg transition-all ${
            activeTab === 'purchased'
              ? 'text-indigo-600 border-b-4 border-indigo-600 -mb-0.5'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <FaDownload />
            <span>Purchased ({purchasedProjects.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-6 py-3 font-bold text-lg transition-all ${
            activeTab === 'favorites'
              ? 'text-pink-600 border-b-4 border-pink-600 -mb-0.5'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <FaHeart />
            <span>Favorites ({favoriteProjects.length})</span>
          </div>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'purchased' && (
        <div>
          {purchasedProjects.length === 0 ? (
            <div className="text-center py-16 bg-white border-2 border-slate-200 rounded-2xl shadow-lg">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBook className="text-5xl text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No Purchased Projects</h3>
              <p className="text-slate-600 mb-6">Start building your library by purchasing projects</p>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 hover:shadow-xl transition-all"
              >
                Browse Projects
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div>
          {favoriteProjects.length === 0 ? (
            <div className="text-center py-16 bg-white border-2 border-slate-200 rounded-2xl shadow-lg">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-5xl text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No Favorite Projects</h3>
              <p className="text-slate-600 mb-6">Add projects to your favorites for quick access</p>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 bg-pink-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-pink-700 hover:shadow-xl transition-all"
              >
                Browse Projects
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProjects.map(project => (
                <ProjectCard key={project.id} project={project} showRemoveFavorite={true} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyLibraryPage;
