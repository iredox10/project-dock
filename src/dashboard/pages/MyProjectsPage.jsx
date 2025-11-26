
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, getProjectById } from '../../api/projectServices';
import { authService } from '../../appwrite/auth';
import { FiDownload, FiLoader, FiEye, FiShoppingBag, FiCalendar, FiSearch } from 'react-icons/fi';

export const MyProjectsPage = () => {
  const [purchasedProjects, setPurchasedProjects] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPurchasedProjects();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchPurchasedProjects();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const fetchPurchasedProjects = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const ordersResponse = await getAllOrders({
          userId: user.$id,
          status: 'completed'
        });

        const userOrders = ordersResponse.documents || [];
        setOrders(userOrders.map(doc => ({ id: doc.$id, ...doc })));

        const projectIds = [...new Set(userOrders.map(order => order.projectId))];

        if (projectIds.length > 0) {
          const projectsPromises = projectIds.map(async (projectId) => {
            try {
              const projectData = await getProjectById(projectId);
              return projectData ? { id: projectData.$id, ...projectData } : null;
            } catch (error) {
              console.error(`Error fetching project ${projectId}:`, error);
              return null;
            }
          });
          const projectsData = await Promise.all(projectsPromises);
          setPurchasedProjects(projectsData.filter(p => p !== null));
        } else {
          setPurchasedProjects([]);
        }
      }
    } catch (error) {
      console.error("Error fetching purchased projects:", error);
    } finally {
      setIsLoading(false);
    }
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
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Purchases</h1>
        <p className="text-gray-500 mt-2">Access and download your purchased projects.</p>
      </div>

      {/* Projects List */}
      {purchasedProjects.length > 0 ? (
        <div className="space-y-4">
          {purchasedProjects.map(project => {
            const order = orders.find(o => o.projectId === project.id);
            return (
              <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-all">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Purchased
                      </span>
                      <span className="text-xs text-gray-500">
                        {project.department}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{project.title}</h3>
                    {order && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FiCalendar className="w-3 h-3" />
                        <span>
                          Purchased on {order.$createdAt ? new Date(order.$createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Link
                      to={`/projects/${project.id}`}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiEye className="w-4 h-4" />
                      <span className="hidden sm:inline">View</span>
                    </Link>
                    <Link
                      to={`/projects/${project.id}/download-file`}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-black transition-colors"
                    >
                      <FiDownload className="w-4 h-4" />
                      <span>Download</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
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
      )}
    </div>
  );
};
