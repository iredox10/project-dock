
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, getProjectById } from '../../api/projectServices';
import { authService } from '../../appwrite/auth';
import { FaDownload, FaSpinner, FaEye, FaBook, FaShoppingCart } from 'react-icons/fa';

export const MyProjectsPage = () => {
  const [purchasedProjects, setPurchasedProjects] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPurchasedProjects();
  }, []);

  // Refresh data when the component becomes visible
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
        // Fetch orders to get purchased projects
        const ordersResponse = await getAllOrders({
          userId: user.$id,
          status: 'completed'
        });

        const userOrders = ordersResponse.documents || [];
        setOrders(userOrders.map(doc => ({ id: doc.$id, ...doc })));

        // Get unique project IDs from orders
        const projectIds = [...new Set(userOrders.map(order => order.projectId))];

        if (projectIds.length > 0) {
          // Fetch the projects using the IDs
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
      <div className="flex justify-center items-center py-20">
        <FaSpinner className="animate-spin text-5xl text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <FaShoppingCart className="text-4xl text-indigo-600" />
          <h1 className="text-4xl font-extrabold text-slate-900">My Purchases</h1>
        </div>
        <p className="text-lg text-slate-600">Download and access all your purchased projects</p>
      </div>

      {/* Stats Card */}
      <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium mb-1">Total Purchased Projects</p>
            <p className="text-5xl font-bold text-indigo-600">{purchasedProjects.length}</p>
            <p className="text-sm text-slate-500 mt-2">{orders.length} total orders</p>
          </div>
          <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <FaBook className="text-4xl text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Projects List */}
      {purchasedProjects.length > 0 ? (
        <div className="space-y-4">
          {purchasedProjects.map(project => {
            const order = orders.find(o => o.projectId === project.id);
            return (
              <div key={project.id} className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg uppercase">
                        Purchased
                      </span>
                      <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                        {project.department}
                      </span>
                    </div>
                    <h3 className="font-bold text-xl text-slate-900 mb-1">{project.title}</h3>
                    {order && (
                      <p className="text-sm text-slate-500">
                        Purchased on {order.$createdAt ? new Date(order.$createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently'}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Link 
                      to={`/projects/${project.id}`} 
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-300 transition-all"
                    >
                      <FaEye />
                      <span className="hidden sm:inline">View</span>
                    </Link>
                    <Link
                      to={`/projects/${project.id}/download-file`}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 hover:shadow-xl transition-all duration-300"
                    >
                      <FaDownload />
                      <span>Download</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border-2 border-slate-200 rounded-2xl shadow-lg">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBook className="text-5xl text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No Purchases Yet</h3>
          <p className="text-slate-600 mb-6">Start building your library by purchasing projects</p>
          <Link 
            to="/projects" 
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 hover:shadow-xl transition-all"
          >
            Browse Projects
          </Link>
        </div>
      )}
    </div>
  );
};
