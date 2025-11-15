import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../appwrite/auth';
import { usersService } from '../appwrite/database';

const ProtectedRoute = ({ children, requiredRole = 'admin' }) => {
  const [isAuthorized, setIsAuthorized] = useState(null); // null = loading, boolean = result
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuthAndRole = async () => {
      try {
        // First, check if user is authenticated
        const currentUser = await authService.getCurrentUser();
        
        if (!currentUser) {
          console.log('No current user found');
          setIsAuthorized(false);
          return;
        }

        console.log('Current user found:', currentUser.$id);

        // Then, check user's role from the database
        try {
          const userDoc = await usersService.getUserById(currentUser.$id);
          console.log('Full user document from database:', userDoc);
          const role = userDoc?.role || 'user';
          console.log('Retrieved role value:', role);
          setUserRole(role);
          
          // Check if user has required role
          if (requiredRole === 'admin') {
            const isAuth = role === 'admin';
            console.log('Required role: admin, User role:', role, 'Is authorized:', isAuth);
            setIsAuthorized(isAuth);
          } else {
            setIsAuthorized(true); // For other roles, implement as needed
          }
        } catch (dbError) {
          console.error('Database error when fetching user:', dbError);
          // If user doesn't exist in database, default to 'user' role
          setUserRole('user');
          setIsAuthorized(false); // Admin pages require user to be in database with admin role
        }
      } catch (error) {
        console.error('Error checking authorization:', error);
        setIsAuthorized(false);
      }
    };

    checkAuthAndRole();
  }, [requiredRole]);

  // While checking, show loading state or return null
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If not authorized, redirect to appropriate page
  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  // If authorized, render the children
  return children;
};

export default ProtectedRoute;