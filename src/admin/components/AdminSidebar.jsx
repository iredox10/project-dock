import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FiGrid, FiFolder, FiUsers, FiLogOut, FiFileText, FiMessageSquare, FiMenu, FiX, FiLayers, FiArrowLeft } from 'react-icons/fi';
import { authService } from '../../appwrite/auth';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024 && isSidebarOpen) {
        toggleSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen, toggleSidebar]);

  const linkClasses = "flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all font-medium";
  const activeLinkClasses = "bg-gray-100 text-gray-900 font-semibold";

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
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white border border-gray-200 text-gray-900 lg:hidden shadow-sm"
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Sidebar backdrop for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-white/80 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-40 h-screen bg-white border-r border-gray-100 w-72 flex flex-col transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="p-8 border-b border-gray-50">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white">
              <FiLayers className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">Admin Dock</span>
          </Link>
        </div>

        <nav className="flex-grow p-6 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">Overview</div>

          <NavLink
            to="/admin"
            end
            onClick={() => isMobile && toggleSidebar()}
            className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            <FiGrid className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>

          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-4 px-4">Management</div>

          <NavLink
            to="/admin/orders"
            onClick={() => isMobile && toggleSidebar()}
            className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            <FiFileText className="w-5 h-5" />
            <span>Orders</span>
          </NavLink>
          <NavLink
            to="/admin/projects"
            onClick={() => isMobile && toggleSidebar()}
            className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            <FiFolder className="w-5 h-5" />
            <span>Projects</span>
          </NavLink>
          <NavLink
            to="/admin/users"
            onClick={() => isMobile && toggleSidebar()}
            className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            <FiUsers className="w-5 h-5" />
            <span>Users</span>
          </NavLink>
          <NavLink
            to="/admin/reviews"
            onClick={() => isMobile && toggleSidebar()}
            className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            <FiMessageSquare className="w-5 h-5" />
            <span>Reviews</span>
          </NavLink>
        </nav>

        <div className="p-6 border-t border-gray-50 space-y-1">
          <Link 
            to="/" 
            className={`${linkClasses} w-full justify-start text-gray-600 hover:text-gray-900`}
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Main Page</span>
          </Link>
          <button onClick={handleLogout} className={`${linkClasses} w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50`}>
            <FiLogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;