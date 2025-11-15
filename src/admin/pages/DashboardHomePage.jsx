
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFolder, FaUsers, FaDownload, FaMoneyBillWave, FaSpinner, FaPlus } from 'react-icons/fa';
import { databases, DATABASE_ID, COLLECTIONS } from '../../appwrite/config'; // Using Appwrite database service and constants
import { Query } from 'appwrite';

const StatCard = ({ icon, title, value, color, isLoading }) => (
  <div className={`bg-white p-4 rounded-2xl shadow-lg flex flex-col items-center text-center gap-3 border-l-8 ${color} min-h-[140px]`}>
    <div className="text-3xl text-gray-400">{icon}</div>
    <div className="flex-1 flex flex-col justify-center">
      <p className="text-gray-500 font-semibold text-sm">{title}</p>
      {isLoading ? (
        <FaSpinner className="animate-spin text-xl mt-1 text-gray-500 self-center" />
      ) : (
        <p className="text-2xl font-extrabold text-gray-900 mt-1">{value}</p>
      )}
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
        // Using Appwrite database service to get collections
        // Fetch recent projects (limit 3)
        const recentProjectsResponse = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.PROJECTS,
          [Query.orderDesc('$createdAt'), Query.limit(3)]
        );
        
        // Fetch recent users (limit 3)
        const recentUsersResponse = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.USERS,
          [Query.orderDesc('$createdAt'), Query.limit(3)]
        );
        
        // Fetch total user count by using a large limit to get all results
        const allUsersResponse = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.USERS,
          [Query.limit(10000)] // Using a large limit to get all users
        );

        // Fetch total project count by using a large limit to get all results
        const allProjectsResponse = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.PROJECTS,
          [Query.limit(10000)] // Using a large limit to get all projects
        );

        // Calculate total downloads
        let totalDownloads = allProjectsResponse.documents.reduce((sum, doc) => {
          return sum + (doc.downloadCount || 0);
        }, 0);

        // Set stats
        setStats({
          projects: allProjectsResponse.total,
          users: allUsersResponse.total,
          downloads: totalDownloads,
          revenue: 'N/A', // Revenue would require an `orders` collection
        });

        setRecentProjects(recentProjectsResponse.documents.map(doc => ({ id: doc.$id, ...doc })));
        setRecentUsers(recentUsersResponse.documents.map(doc => ({ id: doc.$id, ...doc })));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Set stats to 0 in case of error
        setStats({
          projects: 0,
          users: 0,
          downloads: 0,
          revenue: 'N/A',
        });
        setRecentProjects([]);
        setRecentUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<FaFolder />} title="Total Projects" value={stats.projects.toLocaleString()} color="border-blue-500" isLoading={isLoading} />
        <StatCard icon={<FaUsers />} title="Total Users" value={stats.users.toLocaleString()} color="border-purple-500" isLoading={isLoading} />
        <StatCard icon={<FaDownload />} title="Total Downloads" value={stats.downloads.toLocaleString()} color="border-green-500" isLoading={isLoading} />
        <StatCard icon={<FaMoneyBillWave />} title="Total Revenue" value={stats.revenue} color="border-yellow-500" isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Recent Projects */}
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Projects</h2>
          {isLoading ? <div className="flex justify-center py-8"><FaSpinner className="animate-spin text-2xl text-gray-400" /></div> : (
            <ul className="space-y-3">
              {recentProjects.map(project => (
                <li key={project.id} className="p-3 bg-gray-50 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{project.title}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{project.department}</p>
                  </div>
                  <Link to={`/admin/projects/edit/${project.id}`} className="text-indigo-600 font-semibold text-sm self-start sm:self-auto">View</Link>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/admin/projects/add" className="flex items-center justify-center gap-2 text-indigo-600 font-bold hover:underline text-sm">
                  <FaPlus /> Add New Project
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Newest Users</h2>
          {isLoading ? <div className="flex justify-center py-8"><FaSpinner className="animate-spin text-2xl text-gray-400" /></div> : (
            <ul className="space-y-3">
              {recentUsers.map(user => (
                <li key={user.id} className="p-3 bg-gray-50 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{user.email}</p>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 self-start sm:self-auto">{user.$createdAt ? new Date(user.$createdAt).toLocaleDateString() : ''}</p>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/admin/users" className="flex items-center justify-center gap-2 text-indigo-600 font-bold hover:underline text-sm">
                  View All Users
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
