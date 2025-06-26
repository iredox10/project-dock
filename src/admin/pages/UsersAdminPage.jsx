
import React, { useState, useMemo } from 'react';
import { FaSearch, FaEye, FaUserSlash, FaTrash } from 'react-icons/fa';

// Mock Data - In a real app, this would come from your API.
const initialUsers = [
  { id: 1, name: 'Aminu Abubakar', email: 'aminu.a@example.com', registrationDate: '2023-10-25', status: 'Active', projectCount: 5 },
  { id: 2, name: 'Chiamaka Igwe', email: 'chiamaka.i@example.com', registrationDate: '2023-10-22', status: 'Active', projectCount: 2 },
  { id: 3, name: 'David Ojo', email: 'david.o@example.com', registrationDate: '2023-09-15', status: 'Suspended', projectCount: 0 },
  { id: 4, name: 'Ngozi Eze', email: 'ngozi.e@example.com', registrationDate: '2023-08-01', status: 'Active', projectCount: 8 },
  { id: 5, name: 'Bello Adekunle', email: 'bello.a@example.com', registrationDate: '2023-07-30', status: 'Active', projectCount: 1 },
];

const UsersAdminPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleSuspend = (userId) => {
    // In a real app, you'd make an API call here.
    alert(`Suspending user with ID: ${userId}. This would trigger an API call.`);
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: user.status === 'Active' ? 'Suspended' : 'Active' } : user
    ));
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      // In a real app, you'd make an API call here.
      alert(`Deleting user with ID: ${userId}. This would trigger an API call.`);
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleViewActivity = (userId) => {
    alert(`Viewing activity for user with ID: ${userId}. This would typically navigate to a detailed user activity page.`);
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
