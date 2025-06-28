
import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { FaTachometerAlt, FaFolder, FaUsers, FaSignOutAlt, FaFolderOpen, FaFileInvoiceDollar } from 'react-icons/fa';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


const AdminSidebar = () => {
  const navigate = useNavigate();
  const linkClasses = "flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors";
  const activeLinkClasses = "bg-gray-700 text-white";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

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
        <NavLink to="/admin/orders" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FaFileInvoiceDollar />
          <span>Manage Orders</span>
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
        <button onClick={handleLogout} className={`${linkClasses} w-full`}>
          <FaSignOutAlt />
          <span>Back to Main Site</span>
        </button>
      </div>
    </aside>
  );
}


const AdminLayout = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AdminSidebar />
      <main className="flex-grow p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
