
import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { FaTachometerAlt, FaFolder, FaUsers, FaSignOutAlt, FaFolderOpen } from 'react-icons/fa';

const AdminSidebar = () => {
  const linkClasses = "flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors";
  const activeLinkClasses = "bg-gray-700 text-white";

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col h-screen">
      <div className="p-6 border-b border-gray-700">
        <Link to="/admin" className="flex items-center gap-3">
          <FaFolderOpen className="h-8 w-8 text-indigo-400" />
          <span className="text-xl font-bold">Project Dock Admin</span>
        </Link>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        <NavLink to="/admin" end className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/projects" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FaFolder />
          <span>Manage Projects</span>
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FaUsers />
          <span>Manage Users</span>
        </NavLink>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <Link to="/" className={`${linkClasses}`}>
          <FaSignOutAlt />
          <span>Back to Main Site</span>
        </Link>
      </div>
    </aside>
  );
}


const AdminLayout = () => {
  return (
    <div className="flex bg-gray-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AdminSidebar />
      <main className="flex-grow p-8">
        {/* Outlet is where nested child routes will be rendered */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
