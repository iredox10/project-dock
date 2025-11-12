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
          setIsAuthorized(false);
          return;
        }

        // Then, check user's role from the database
        try {
          const userDoc = await usersService.getUserById(currentUser.$id);
          const role = userDoc?.role || 'user';
          setUserRole(role);
          
          // Check if user has required role
          if (requiredRole === 'admin') {
            setIsAuthorized(role === 'admin');
          } else {
            setIsAuthorized(true); // For other roles, implement as needed
          }
        } catch (dbError) {
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