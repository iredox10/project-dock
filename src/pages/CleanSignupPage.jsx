import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiLoader } from 'react-icons/fi';
import { authService } from '../appwrite/auth';

const CleanSignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', referralCode: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check for referral code in URL
  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const ref = searchParams.get('ref');
    if (ref) {
      setFormData(prev => ({ ...prev, referralCode: ref }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.register(
        formData.email, 
        formData.password, 
        formData.name,
        formData.referralCode
      );

      if (result.success) {
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get('redirect') || '/';
        navigate(redirect);
      }

    } catch (err) {
      if (err.message.includes('duplicate')) {
        setError('This email is already registered.');
      } else if (err.message.includes('password')) {
        setError('Password must be at least 8 characters.');
      } else {
        setError('Failed to create account. Please try again.');
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
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">Create account</h1>
          <p className="text-sm text-gray-500">
            Start your academic journey with us
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full px-0 py-3 text-gray-900 bg-transparent border-b border-gray-200 focus:border-gray-900 focus:outline-none placeholder-gray-400 transition-colors"
                placeholder="Full name"
              />
            </div>

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
                placeholder="Password (min. 8 chars)"
              />
            </div>

            <div>
              <label htmlFor="referralCode" className="sr-only">Referral Code (Optional)</label>
              <input
                id="referralCode"
                name="referralCode"
                type="text"
                value={formData.referralCode}
                onChange={handleChange}
                className="block w-full px-0 py-3 text-gray-900 bg-transparent border-b border-gray-200 focus:border-gray-900 focus:outline-none placeholder-gray-400 transition-colors"
                placeholder="Referral Code (Optional)"
              />
            </div>
          </div>

          <div className="text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-gray-900 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-gray-900 hover:underline">Privacy Policy</a>.
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
                Create Account <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-gray-900 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CleanSignupPage;