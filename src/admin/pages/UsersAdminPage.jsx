
import React, { useState, useMemo, useEffect } from 'react';
import { FaSearch, FaEye, FaUserSlash, FaTrash } from 'react-icons/fa';
import { teams } from '../../appwrite/config';

const UsersAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Step 1: Find the team by name to get its ID
        const teamList = await teams.list({ search: 'Admins' });

        if (teamList.teams.length === 0) {
          throw new Error("The 'Admins' team could not be found. Please create it in your Appwrite console.");
        }

        const adminTeam = teamList.teams[0];
        const adminTeamId = adminTeam.$id;

        // Step 2: Use the team ID to get the list of members
        const response = await teams.listMemberships(adminTeamId);

        const userList = response.memberships.map(membership => ({
          id: membership.userId,
          name: membership.userName,
          email: membership.userEmail,
          registrationDate: new Date(membership.joined).toLocaleDateString(),
          status: 'Active', // Placeholder
          projectCount: 0, // Placeholder
        }));
        setUsers(userList);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        alert(error.message);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleSuspend = (userId) => {
    alert(`Suspending user with ID: ${userId}. This would trigger an API call.`);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      alert(`Deleting user with ID: ${userId}. This would trigger an API call.`);
    }
  };

  const handleViewActivity = (userId) => {
    alert(`Viewing activity for user with ID: ${userId}.`);
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Manage Users</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-semibold">User Name</th>
                <th className="p-3 font-semibold">Email</th>
                <th className="p-3 font-semibold">Registration Date</th>
                <th className="p-3 font-semibold">Projects</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{user.name}</td>
                  <td className="p-3 text-gray-600">{user.email}</td>
                  <td className="p-3 text-gray-600">{user.registrationDate}</td>
                  <td className="p-3 text-gray-600 text-center">{user.projectCount}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-4">
                    <button onClick={() => handleViewActivity(user.id)} className="text-gray-500 hover:text-gray-700" title="View Activity">
                      <FaEye />
                    </button>
                    <button onClick={() => handleSuspend(user.id)} className="text-yellow-500 hover:text-yellow-700" title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}>
                      <FaUserSlash />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700" title="Delete User">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersAdminPage 
