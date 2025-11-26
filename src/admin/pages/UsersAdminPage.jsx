import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Modal, useModal } from '../../components/Modal';
import { FiSearch, FiEye, FiUserX, FiTrash, FiLoader, FiUserCheck } from 'react-icons/fi';
import { databases, DATABASE_ID, COLLECTIONS } from '../../appwrite/config';
import { Query } from 'appwrite';

// Reusable Confirmation Modal
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmColor = 'bg-red-600' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-100 w-full max-w-md text-center transform transition-all">
        <h2 className="text-xl font-bold mb-2 text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">{message}</p>
        <div className="flex justify-center gap-3">
          <button onClick={onClose} className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">Cancel</button>
          <button onClick={onConfirm} className={`px-5 py-2.5 text-white text-sm font-medium rounded-md hover:opacity-90 transition-colors ${confirmColor}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export const UsersAdminPage = () => {
  const { modal, showModal, closeModal: closeNotificationModal } = useModal();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [modalState, setModalState] = useState({ isOpen: false, action: null, user: null });

  const USERS_PER_PAGE = 10;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.orderDesc('$createdAt'), Query.limit(USERS_PER_PAGE)]
      );
      const fetchedUsers = response.documents.map(d => ({ id: d.$id, ...d }));
      setUsers(fetchedUsers);
      setHasMore(response.documents.length === USERS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching users: ", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchMoreUsers = async () => {
    if (!hasMore) return;
    setIsMoreLoading(true);
    try {
      const offset = users.length;
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.orderDesc('$createdAt'), Query.limit(USERS_PER_PAGE), Query.offset(offset)]
      );
      const newUsers = response.documents.map(d => ({ id: d.$id, ...d }));
      setUsers(prev => [...prev, ...newUsers]);
      setHasMore(response.documents.length === USERS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching more users: ", error);
    } finally {
      setIsMoreLoading(false);
    }
  };

  const openModal = (action, user) => setModalState({ isOpen: true, action, user });
  const closeModal = () => setModalState({ isOpen: false, action: null, user: null });

  const confirmAction = async () => {
    const { action, user } = modalState;
    if (!user) return;

    if (action === 'delete') {
      try {
        await databases.deleteDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          user.id
        );
        setUsers(prev => prev.filter(u => u.id !== user.id));
      } catch (error) { console.error("Error deleting user: ", error); }
    }

    if (action === 'suspend') {
      try {
        const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          user.id,
          { status: newStatus }
        );
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      } catch (error) { console.error("Error suspending user: ", error); }
    }
    closeModal();
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div className="w-full">
      <Modal {...modal} onClose={closeNotificationModal} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Users</h1>
        <p className="text-sm text-gray-500 mt-1">Manage user accounts and permissions.</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Mobile view for users */}
        <div className="md:hidden">
          {isLoading ?
            <div className="flex justify-center items-center py-12">
              <FiLoader className="animate-spin text-2xl text-gray-400" />
            </div>
            : (
              <div className="divide-y divide-gray-100">
                {filteredUsers.map(user => (
                  <div key={user.id} className="p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{user.email}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                            {user.status}
                          </span>
                          <span className="text-xs text-gray-400">
                            {user.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => showModal('Feature Info', 'This would navigate to a user activity page.', 'info')}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal('suspend', user)}
                          className={`p-2 rounded-md transition-colors ${user.status === 'Active' ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'}`}
                        >
                          {user.status === 'Active' ? <FiUserX className="w-4 h-4" /> : <FiUserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openModal('delete', user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <FiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>

        {/* Desktop view for users */}
        <div className="hidden md:block overflow-x-auto">
          {isLoading ?
            <div className="flex justify-center items-center py-20">
              <FiLoader className="animate-spin text-3xl text-gray-300" />
            </div>
            : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{user.name}</td>
                      <td className="p-4 text-sm text-gray-600">{user.email}</td>
                      <td className="p-4 text-sm text-gray-600">{user.createdAt?.toDate().toLocaleDateString() || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => showModal('Feature Info', 'This would navigate to a user activity page.', 'info')}
                            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            title="View Activity"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openModal('suspend', user)}
                            className={`p-1.5 rounded-md transition-colors ${user.status === 'Active' ? 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                            title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                          >
                            {user.status === 'Active' ? <FiUserX className="w-4 h-4" /> : <FiUserCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openModal('delete', user)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete User"
                          >
                            <FiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
        {hasMore && !isLoading &&
          <div className="p-4 border-t border-gray-100 text-center">
            <button
              onClick={fetchMoreUsers}
              disabled={isMoreLoading}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
            >
              {isMoreLoading ? 'Loading...' : 'Load More Users'}
            </button>
          </div>
        }
      </div>
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={confirmAction}
        title={`Confirm ${modalState.action === 'delete' ? 'Deletion' : 'Status Change'}`}
        message={`Are you sure you want to ${modalState.action} the user "${modalState.user?.name}"?`}
        confirmText={modalState.action === 'delete' ? 'Delete' : 'Confirm'}
        confirmColor={modalState.action === 'delete' ? 'bg-red-600' : 'bg-yellow-600'}
      />
    </div>
  );
};