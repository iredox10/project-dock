
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { account, teams } from '../appwrite/config';

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        await account.get();
        const userTeams = await teams.list();

        // --- DEBUGGING: Log the names of all teams the user is in ---
        console.log('User is a member of these teams:', userTeams.teams.map(t => t.name));
        // --- END DEBUGGING ---

        const isAdminTeamMember = userTeams.teams.some(team => team.name === 'Admins');
        setIsAdmin(isAdminTeamMember);

      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
      setIsLoading(false);
    };

    checkAdminStatus();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
