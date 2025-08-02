import React, { useState, useEffect } from 'react';
import { account } from '../appwrite/config';
import { useNavigate } from 'react-router-dom';

const UserDashboardPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch user data', error);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      navigate('/');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">User Dashboard</h1>
        <div className="space-y-4">
          <div>
            <p className="text-lg font-semibold">Name:</p>
            <p className="text-gray-700">{user.name}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">Email:</p>
            <p className="text-gray-700">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDashboardPage;
