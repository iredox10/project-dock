
import React from 'react';
import { FaFolder, FaUsers, FaDownload, FaMoneyBillWave } from 'react-icons/fa';

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
  return (
    <div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FaFolder />} title="Total Projects" value="1,258" color="border-blue-500" />
        <StatCard icon={<FaUsers />} title="Total Users" value="8,492" color="border-purple-500" />
        <StatCard icon={<FaDownload />} title="Total Downloads" value="2,130" color="border-green-500" />
        <StatCard icon={<FaMoneyBillWave />} title="Total Revenue" value="₦1,500,000" color="border-yellow-500" />
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
