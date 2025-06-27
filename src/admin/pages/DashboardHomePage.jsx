
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFolder, FaUsers, FaDownload, FaMoneyBillWave, FaSpinner, FaPlus } from 'react-icons/fa';
import { db } from '../../firebase/config';
import { collection, getDocs, getCountFromServer, query, orderBy, limit } from 'firebase/firestore';

const StatCard = ({ icon, title, value, color, isLoading }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-lg flex items-center gap-6 border-l-8 ${color}`}>
    <div className="text-4xl text-gray-400">{icon}</div>
    <div>
      <p className="text-gray-500 font-semibold">{title}</p>
      {isLoading ? (
        <FaSpinner className="animate-spin text-2xl mt-2 text-gray-500" />
      ) : (
        <p className="text-3xl font-extrabold text-gray-900">{value}</p>
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
        // Fetch counts
        const projectsCountPromise = getCountFromServer(collection(db, 'projects'));
        const usersCountPromise = getCountFromServer(collection(db, 'users'));

        // Fetch recent projects
        const recentProjectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(3));
        const recentProjectsPromise = getDocs(recentProjectsQuery);

        // Fetch recent users
        const recentUsersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(3));
        const recentUsersPromise = getDocs(recentUsersQuery);

        // Fetch all projects to calculate total downloads (for demonstration)
        // In a large-scale app, this would be handled by a summary document updated with Cloud Functions.
        const allProjectsPromise = getDocs(collection(db, 'projects'));


        // Await all promises
        const [
          projectsSnapshot,
          usersSnapshot,
          recentProjectsSnapshot,
          recentUsersSnapshot,
          allProjectsSnapshot
        ] = await Promise.all([
          projectsCountPromise,
          usersCountPromise,
          recentProjectsPromise,
          recentUsersPromise,
          allProjectsPromise
        ]);

        // Calculate total downloads
        let totalDownloads = 0;
        allProjectsSnapshot.forEach(doc => {
          totalDownloads += doc.data().downloadCount || 0;
        });

        // Set stats
        setStats({
          projects: projectsSnapshot.data().count,
          users: usersSnapshot.data().count,
          downloads: totalDownloads,
          revenue: 'N/A', // Revenue would require an `orders` collection
        });

        setRecentProjects(recentProjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setRecentUsers(recentUsersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FaFolder />} title="Total Projects" value={stats.projects.toLocaleString()} color="border-blue-500" isLoading={isLoading} />
        <StatCard icon={<FaUsers />} title="Total Users" value={stats.users.toLocaleString()} color="border-purple-500" isLoading={isLoading} />
        <StatCard icon={<FaDownload />} title="Total Downloads" value={stats.downloads.toLocaleString()} color="border-green-500" isLoading={isLoading} />
        <StatCard icon={<FaMoneyBillWave />} title="Total Revenue" value={stats.revenue} color="border-yellow-500" isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Projects</h2>
          {isLoading ? <div className="flex justify-center py-8"><FaSpinner className="animate-spin text-2xl text-gray-400" /></div> : (
            <ul className="space-y-4">
              {recentProjects.map(project => (
                <li key={project.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{project.title}</p>
                    <p className="text-sm text-gray-500">{project.department}</p>
                  </div>
                  <Link to={`/admin/projects/edit/${project.id}`} className="text-indigo-600 font-semibold text-sm">View</Link>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/admin/projects/add" className="flex items-center justify-center gap-2 text-indigo-600 font-bold hover:underline">
                  <FaPlus /> Add New Project
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Newest Users</h2>
          {isLoading ? <div className="flex justify-center py-8"><FaSpinner className="animate-spin text-2xl text-gray-400" /></div> : (
            <ul className="space-y-4">
              {recentUsers.map(user => (
                <li key={user.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <p className="text-sm text-gray-500">{user.createdAt?.toDate().toLocaleDateString()}</p>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/admin/users" className="flex items-center justify-center gap-2 text-indigo-600 font-bold hover:underline">
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
