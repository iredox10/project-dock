import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFolder, FiUsers, FiDownload, FiDollarSign, FiLoader, FiPlus, FiArrowRight } from 'react-icons/fi';
import { databases, DATABASE_ID, COLLECTIONS } from '../../appwrite/config';
import { Query } from 'appwrite';

const StatCard = ({ icon, title, value, isLoading }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-100 hover:border-gray-200 transition-all shadow-sm hover:shadow-md">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-gray-50 rounded-md text-gray-900">
        {icon}
      </div>
      {isLoading && <FiLoader className="animate-spin text-gray-300" />}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">
        {isLoading ? '-' : value}
      </h3>
    </div>
  </div>
);

const DashboardHomePage = () => {
  const [stats, setStats] = useState({
    projects: 0,
    users: 0,
    downloads: 0,
    revenue: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const recentProjectsResponse = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.PROJECTS,
          [Query.orderDesc('$createdAt'), Query.limit(5)]
        );

        const recentUsersResponse = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.USERS,
          [Query.orderDesc('$createdAt'), Query.limit(5)]
        );

        const allUsersResponse = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.USERS,
          [Query.limit(10000)]
        );

        const allProjectsResponse = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.PROJECTS,
          [Query.limit(10000)]
        );

        let totalDownloads = allProjectsResponse.documents.reduce((sum, doc) => {
          return sum + (doc.downloadCount || 0);
        }, 0);

        setStats({
          projects: allProjectsResponse.total,
          users: allUsersResponse.total,
          downloads: totalDownloads,
          revenue: 'N/A',
        });

        setRecentProjects(recentProjectsResponse.documents.map(doc => ({ id: doc.$id, ...doc })));
        setRecentUsers(recentUsersResponse.documents.map(doc => ({ id: doc.$id, ...doc })));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setStats({ projects: 0, users: 0, downloads: 0, revenue: 'N/A' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Welcome back to the admin control panel.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<FiFolder className="w-5 h-5" />}
          title="Total Projects"
          value={stats.projects.toLocaleString()}
          isLoading={isLoading}
        />
        <StatCard
          icon={<FiUsers className="w-5 h-5" />}
          title="Total Users"
          value={stats.users.toLocaleString()}
          isLoading={isLoading}
        />
        <StatCard
          icon={<FiDownload className="w-5 h-5" />}
          title="Total Downloads"
          value={stats.downloads.toLocaleString()}
          isLoading={isLoading}
        />
        <StatCard
          icon={<FiDollarSign className="w-5 h-5" />}
          title="Total Revenue"
          value={stats.revenue}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Projects</h2>
            <Link to="/admin/projects" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-8"><FiLoader className="animate-spin text-2xl text-gray-300" /></div>
            ) : (
              <ul className="space-y-4">
                {recentProjects.map(project => (
                  <li key={project.id} className="flex items-center justify-between group">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{project.title}</p>
                      <p className="text-xs text-gray-500 truncate">{project.department}</p>
                    </div>
                    <Link
                      to={`/admin/projects/edit/${project.id}`}
                      className="text-xs font-medium px-3 py-1 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      Edit
                    </Link>
                  </li>
                ))}
                {recentProjects.length === 0 && (
                  <li className="text-center text-gray-500 py-4">No projects found.</li>
                )}
              </ul>
            )}
            <div className="mt-6 pt-6 border-t border-gray-50">
              <Link
                to="/admin/projects/add"
                className="flex items-center justify-center gap-2 w-full py-2 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
              >
                <FiPlus /> Add New Project
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Newest Users</h2>
            <Link to="/admin/users" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-8"><FiLoader className="animate-spin text-2xl text-gray-300" /></div>
            ) : (
              <ul className="space-y-4">
                {recentUsers.map(user => (
                  <li key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{user.name || 'Unknown User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {user.$createdAt ? new Date(user.$createdAt).toLocaleDateString() : ''}
                    </span>
                  </li>
                ))}
                {recentUsers.length === 0 && (
                  <li className="text-center text-gray-500 py-4">No users found.</li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
