
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { FaSearch, FaEye, FaUserSlash, FaTrash, FaSpinner } from 'react-icons/fa';
import { db } from '../../firebase/config'; // Your Firebase config
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy, limit, startAfter } from 'firebase/firestore';

// Reusable Confirmation Modal - Enhanced for different actions
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmColor = 'bg-red-600' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">Cancel</button>
          <button onClick={onConfirm} className={`px-6 py-2 text-white rounded-lg font-semibold ${confirmColor} hover:opacity-90`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export const UsersAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [modalState, setModalState] = useState({ isOpen: false, action: null, user: null });

  const USERS_PER_PAGE = 10;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'), limit(USERS_PER_PAGE));
      const docSnapshots = await getDocs(q);
      const fetchedUsers = docSnapshots.docs.map(d => ({ id: d.id, ...d.data() }));
      const lastDoc = docSnapshots.docs[docSnapshots.docs.length - 1];
      setUsers(fetchedUsers);
      setLastVisible(lastDoc);
      setHasMore(fetchedUsers.length === USERS_PER_PAGE);
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
    if (!hasMore || !lastVisible) return;
    setIsMoreLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(USERS_PER_PAGE));
      const docSnapshots = await getDocs(q);
      const newUsers = docSnapshots.docs.map(d => ({ id: d.id, ...d.data() }));
      const lastDoc = docSnapshots.docs[docSnapshots.docs.length - 1];
      setUsers(prev => [...prev, ...newUsers]);
      setLastVisible(lastDoc);
      setHasMore(newUsers.length === USERS_PER_PAGE);
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
      // NOTE: This deletes the user's data from Firestore, but NOT from Firebase Authentication.
      // A Cloud Function is required to safely delete a user from Firebase Auth.
      try {
        await deleteDoc(doc(db, 'users', user.id));
        setUsers(prev => prev.filter(u => u.id !== user.id));
      } catch (error) { console.error("Error deleting user: ", error); }
    }

    if (action === 'suspend') {
      // NOTE: This only changes the user's status in Firestore.
      // A Cloud Function is required to truly disable a user in Firebase Auth.
      try {
        const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
        await updateDoc(doc(db, 'users', user.id), { status: newStatus });
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
    <div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Manage Users</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="mb-4 relative"><input type="text" placeholder="Search loaded users by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" /><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /></div>

        <div className="overflow-x-auto">
          {isLoading ? <div className="flex justify-center items-center py-20"><FaSpinner className="animate-spin text-4xl text-indigo-600" /></div> : (
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 font-semibold">User Name</th><th className="p-3 font-semibold">Email</th><th className="p-3 font-semibold">Registration Date</th><th className="p-3 font-semibold">Status</th><th className="p-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{user.name}</td>
                    <td className="p-3 text-gray-600">{user.email}</td>
                    <td className="p-3 text-gray-600">{user.createdAt?.toDate().toLocaleDateString() || 'N/A'}</td>
                    <td className="p-3"><span className={`px-3 py-1 text-xs font-bold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{user.status}</span></td>
                    <td className="p-3 text-center space-x-4">
                      <button onClick={() => alert('This would navigate to a user activity page.')} className="text-gray-500 hover:text-gray-700" title="View Activity"><FaEye /></button>
                      <button onClick={() => openModal('suspend', user)} className="text-yellow-500 hover:text-yellow-700" title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}><FaUserSlash /></button>
                      <button onClick={() => openModal('delete', user)} className="text-red-500 hover:text-red-700" title="Delete User"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {hasMore && !isLoading && <div className="text-center mt-6"><button onClick={fetchMoreUsers} disabled={isMoreLoading} className="bg-gray-200 text-gray-800 font-bold px-6 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50">{isMoreLoading ? 'Loading...' : 'Load More'}</button></div>}
      </div>
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={confirmAction}
        title={`Confirm ${modalState.action === 'delete' ? 'Deletion' : 'Status Change'}`}
        message={`Are you sure you want to ${modalState.action} the user "${modalState.user?.name}"?`}
        confirmText={modalState.action === 'delete' ? 'Delete' : 'Confirm'}
        confirmColor={modalState.action === 'delete' ? 'bg-red-600' : 'bg-yellow-500'}
      />
    </div>
  );
};
