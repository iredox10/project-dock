import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiDownload, FiBook, FiLoader, FiCalendar, FiEye, FiUser, FiFileText, FiCode, FiShoppingBag, FiSearch } from 'react-icons/fi';
import { getAllProjects, getProjectById, getAllOrders, getUserById, updateUser } from '../../api/projectServices';
import { authService } from '../../appwrite/auth';

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
      const ordersResponse = await getAllOrders({
        userId: user.$id,
        status: 'completed'
      });

      const userOrders = ordersResponse.documents || [];
      setOrders(userOrders.map(doc => ({ id: doc.$id, ...doc })));

      const purchasedIds = [...new Set(userOrders.map(order => order.projectId))];

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
        const updatedFavorites = favoriteIds.filter(id => id !== projectId);
        await updateUser(user.$id, {
          ...userData,
          favoriteProjects: updatedFavorites
        });
        setFavoriteProjects(prev => prev.filter(p => p.id !== projectId));
      } else {
        const updatedFavorites = [...favoriteIds, projectId];
        await updateUser(user.$id, {
          ...userData,
          favoriteProjects: updatedFavorites
        });
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
    const isPurchased = purchasedProjects.some(p => p.id === project.id) || orders.some(o => o.projectId === project.id);

    return (
      <div className="group border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-all bg-white">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {project.department}
          </span>
          {project.formats?.includes('PDF') ? (
            <FiFileText className="text-gray-400" />
          ) : (
            <FiCode className="text-gray-400" />
          )}
        </div>

        <Link to={`/projects/${project.id}`} className="block mb-4">
          <h3 className="text-lg font-bold text-gray-900 group-hover:underline decoration-1 underline-offset-4 line-clamp-2">
            {project.title}
          </h3>
        </Link>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <FiUser className="w-3 h-3" />
            <span>{project.author || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiCalendar className="w-3 h-3" />
            <span>{project.year || 'N/A'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          {isPurchased ? (
            <>
              <Link
                to={`/projects/${project.id}/download-file`}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-black transition-colors"
              >
                <FiDownload className="w-4 h-4" />
                <span>Download</span>
              </Link>
              <Link
                to={`/projects/${project.id}`}
                className="flex items-center justify-center p-2 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <FiEye className="w-5 h-5" />
              </Link>
            </>
          ) : (
            <Link
              to={`/projects/${project.id}/payment`}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-black transition-colors"
            >
              <span>Purchase ₦{project.priceNGN?.toLocaleString()}</span>
            </Link>
          )}

          {showRemoveFavorite && (
            <button
              onClick={() => toggleFavorite(project.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Remove from favorites"
            >
              <FiHeart className="w-5 h-5 fill-current" />
            </button>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-2xl text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Library</h1>
        <p className="text-gray-500 mt-2">Manage your purchased projects and favorites.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('purchased')}
            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'purchased'
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Purchased
            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {purchasedProjects.length}
            </span>
            {activeTab === 'purchased' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'favorites'
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Favorites
            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {favoriteProjects.length}
            </span>
            {activeTab === 'favorites' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'purchased' && (
        <div>
          {purchasedProjects.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShoppingBag className="text-xl text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No purchases yet</h3>
              <p className="text-sm text-gray-500 mb-6">Start building your library by purchasing projects.</p>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:underline"
              >
                Browse Projects <FiSearch />
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
            <div className="text-center py-16 border border-dashed border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeart className="text-xl text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No favorites yet</h3>
              <p className="text-sm text-gray-500 mb-6">Save projects you're interested in to view them later.</p>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:underline"
              >
                Browse Projects <FiSearch />
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
