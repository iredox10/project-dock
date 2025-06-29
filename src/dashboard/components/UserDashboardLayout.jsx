
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { FaBook, FaUserCircle, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { auth, db } from '../../firebase/config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const UserSidebar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        }
      } else {
        navigate('/login'); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const linkClasses = "flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-colors";
  const activeLinkClasses = "bg-indigo-100 text-indigo-600 font-bold";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <aside className="w-64 bg-white border-r flex-shrink-0 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b text-center">
        <FaUserCircle className="mx-auto text-5xl text-gray-400 mb-2" />
        <h2 className="text-lg font-bold text-gray-800 truncate">{userName || 'Welcome'}</h2>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        <NavLink to="/dashboard" end className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/dashboard/my-projects" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FaBook />
          <span>My Purchased Projects</span>
        </NavLink>
        <NavLink to="/dashboard/profile" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FaUserCircle />
          <span>Profile Settings</span>
        </NavLink>
      </nav>
      <div className="p-4 border-t">
        <button onClick={handleLogout} className={`${linkClasses} w-full`}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

const UserDashboardLayout = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <UserSidebar />
      <main className="flex-grow p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboardLayout;
