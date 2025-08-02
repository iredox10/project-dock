
import React, { useState, useEffect } from 'react';
import { FaFolder, FaUsers } from 'react-icons/fa';
import { databases } from '../../appwrite/config';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID_PROJECTS;

const StatCard = ({ icon, title, value, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg flex items-center gap-6 border-l-4 ${color}`}>
    <div className="text-4xl text-gray-600">{icon}</div>
    <div>
      <p className="text-gray-500 font-semibold">{title}</p>
      <p className="text-3xl font-extrabold text-gray-900">{value}</p>
    </div>
  </div>
);

const DashboardHomePage = () => {
  const [projectCount, setProjectCount] = useState(0);
  const [userCount, setUserCount] = useState(0); // Placeholder for user count

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        setProjectCount(response.total);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    // In a real app, you would fetch user data here.
    // For now, we'll use a placeholder value.
    const fetchUsers = () => {
      // This is where you would call your backend to get the user count.
      // Since we can't do this from the client-side SDK directly,
      // we will leave it as a placeholder.
      setUserCount('N/A');
    };

    fetchProjects();
    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FaFolder />} title="Total Projects" value={projectCount} color="border-blue-500" />
        <StatCard icon={<FaUsers />} title="Total Users" value={userCount} color="border-purple-500" />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        {/* This would be populated with data from your API */}
        <ul className="divide-y divide-gray-200">
          <li className="py-3 flex justify-between items-center"><span>New project "Quantum Computing Basics" uploaded.</span><span className="text-sm text-gray-500">2 hours ago</span></li>
          <li className="py-3 flex justify-between items-center"><span>User 'chiamaka@example.com' registered.</span><span className="text-sm text-gray-500">5 hours ago</span></li>
          <li className="py-3 flex justify-between items-center"><span>Project "AI Chatbot" downloaded.</span><span className="text-sm text-gray-500">1 day ago</span></li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardHomePage;
