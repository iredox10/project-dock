import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FaFolderOpen, FaLock, FaKey, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { authService } from '../appwrite/auth';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [secret, setSecret] = useState('');

  // Extract userId and secret from URL parameters
  useEffect(() => {
    const userIdParam = searchParams.get('userId');
    const secretParam = searchParams.get('secret');

    if (!userIdParam || !secretParam) {
      setError('Invalid reset link. Please check your email and try again.');
      return;
    }

    setUserId(userIdParam);
    setSecret(secretParam);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!password) {
      setError('Please enter a new password.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(userId, secret, password, confirmPassword);
      setSuccessMessage('Your password has been successfully reset! You can now log in with your new password.');
      // Clear form after success
      setPassword('');
      setConfirmPassword('');
      // Automatically redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. The reset link may have expired or is invalid.');
      console.error("Reset password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-gray-700 via-gray-900 to-black items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-24 -right-10 w-72 h-72 bg-white/10 rounded-full"></div>
        <div className="relative z-10 text-center">
          <Link to="/" className="inline-block mb-8">
            <FaFolderOpen className="mx-auto h-16 w-auto text-white" />
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Reset Your Password</h1>
          <p className="text-lg text-gray-300 max-w-md">Securely create a new password for your account.</p>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8 sm:p-12">
        <div className="max-w-md w-full">
          <div className="lg:hidden text-center mb-8">
            <Link to="/">
              <FaFolderOpen className="mx-auto h-12 w-auto text-indigo-600" />
            </Link>
          </div>
          
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Reset Password</h2>
            {successMessage ? (
              <p className="mt-2 text-sm text-gray-600">You can now log in with your new password.</p>
            ) : (
              <p className="mt-2 text-sm text-gray-600">Create a new, secure password for your account.</p>
            )}
          </div>

          {error && (
            <div className="mt-4 bg-red-100 text-red-700 p-3 rounded-lg text-center font-semibold flex items-center gap-3">
              <FaExclamationTriangle /> {error}
            </div>
          )}

          {successMessage ? (
            <div className="mt-8 bg-green-100 text-green-800 p-4 rounded-lg text-center font-semibold flex items-center justify-center gap-3">
              <FaCheckCircle className="text-xl" /> {successMessage}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="New password"
                />
              </div>
              
              <div className="relative">
                <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Confirm new password"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:bg-gray-400"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
            </form>
          )}

          {successMessage && (
            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;