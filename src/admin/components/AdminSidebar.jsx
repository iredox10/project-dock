import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaFolder, FaUsers, FaSignOutAlt, FaFolderOpen, FaFileInvoiceDollar, FaComments, FaBars, FaTimes } from 'react-icons/fa';
import { authService } from '../../appwrite/auth';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        // Close sidebar on larger screens if it was open
        if (isSidebarOpen) {
          toggleSidebar();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen, toggleSidebar]);

  const linkClasses = "flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors";
  const activeLinkClasses = "bg-gray-700 text-white";

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };



  return (
    <>
      {/* Mobile menu button - only visible on mobile */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white lg:hidden"
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        >
          {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      )}

      {/* Sidebar backdrop for mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static z-40 h-screen bg-gray-800 text-white transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} lg:translate-x-0 lg:w-64`}
      >
        <div className="p-6 border-b border-gray-700">
          <Link to="/admin" className="flex items-center gap-3">
            <FaFolderOpen className="h-8 w-8 text-indigo-400" />
            <span className="text-xl font-bold">Project Dock Admin</span>
          </Link>
        </div>
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto h-[calc(100vh-170px)]">
          <NavLink 
            to="/admin" 
            end 
            onClick={() => isMobile && toggleSidebar()}
            className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/admin/orders" 
            onClick={() => isMobile && toggleSidebar()}
            className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            <FaFileInvoiceDollar />
            <span>Manage Orders</span>
          </NavLink>
          <NavLink 
            to="/admin/projects" 
            onClick={() => isMobile && toggleSidebar()}
            className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            <FaFolder />
            <span>Manage Projects</span>
          </NavLink>
          <NavLink 
            to="/admin/projects/ai-generate" 
            onClick={() => isMobile && toggleSidebar()}
            className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            <FaFolderOpen />
            <span>AI Generate Projects</span>
          </NavLink>
          <NavLink 
            to="/admin/reviews" 
            onClick={() => isMobile && toggleSidebar()}
            className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            <FaComments />
            <span>Manage Reviews</span>
          </NavLink>
          <NavLink 
            to="/admin/users" 
            onClick={() => isMobile && toggleSidebar()}
            className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
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
    </>
  );
};

export default AdminSidebar;