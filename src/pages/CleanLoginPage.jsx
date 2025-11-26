import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiLoader } from 'react-icons/fi';
import { authService } from '../appwrite/auth';
import { usersService } from '../appwrite/database';

const CleanLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.login(formData.email, formData.password);

      if (result.success) {
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get('redirect');

        if (redirect) {
          navigate(redirect);
        } else {
          const user = result.user;
          try {
            const userData = await usersService.getUserById(user.$id);
            if (userData && userData.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/dashboard');
            }
          } catch (dbError) {
            navigate('/');
          }
        }
      }

    } catch (err) {
      if (err.message.includes('Invalid credentials') || err.message.includes('user not found') || err.message.includes('password')) {
        setError('Invalid email or password.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <Link to="/" className="inline-block text-2xl font-bold tracking-tighter text-gray-900 mb-8">
            Project Dock
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">Welcome back</h1>
          <p className="text-sm text-gray-500">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full px-0 py-3 text-gray-900 bg-transparent border-b border-gray-200 focus:border-gray-900 focus:outline-none placeholder-gray-400 transition-colors"
                placeholder="Email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="block w-full px-0 py-3 text-gray-900 bg-transparent border-b border-gray-200 focus:border-gray-900 focus:outline-none placeholder-gray-400 transition-colors"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 border-gray-300 rounded text-gray-900 focus:ring-gray-900"
              />
              <span className="text-gray-500 group-hover:text-gray-900 transition-colors">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-gray-500 hover:text-gray-900 transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <FiLoader className="animate-spin" />
            ) : (
              <>
                Sign in <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-gray-900 hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CleanLoginPage;
