
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFolderOpen, FaEnvelope, FaLock, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { auth, db } from '../firebase/config.js'; // Import your Firebase config
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore'; // Import Firestore functions

const LoginPage = () => {
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
      // 1. Sign in user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Fetch the user's document from Firestore to check their role
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        // 3. Check for the 'role' field and redirect accordingly
        if (userData.role === 'admin') {
          navigate('/admin'); // Redirect admins to the dashboard
        } else {
          navigate('/dashboard'); // Redirect regular users to the homepage
        }
      } else {
        // Fallback in case the user document doesn't exist
        console.error("No user document found for this user!");
        navigate('/');
      }

    } catch (err) {
      // Handle Firebase errors
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('Failed to sign in. Please try again later.');
        console.error("Login error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-24 -right-10 w-72 h-72 bg-white/10 rounded-full"></div>
        <div className="relative z-10 text-center">
          <Link to="/" className="inline-block mb-8"><FaFolderOpen className="mx-auto h-16 w-auto text-white" /></Link>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Welcome Back!</h1>
          <p className="text-lg text-indigo-100 max-w-md">Sign in to continue your journey and access your personalized project library.</p>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8 sm:p-12">
        <div className="max-w-md w-full">
          <div className="lg:hidden text-center mb-8"><Link to="/"><FaFolderOpen className="mx-auto h-12 w-auto text-indigo-600" /></Link></div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600">Don't have an account?{' '}<Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">Sign up for free</Link></p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center font-semibold">{error}</p>}
            <div className="space-y-4">
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Email address" />
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Password" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center"><input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" /><label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label></div>
              <div className="text-sm"><a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">Forgot password?</a></div>
            </div>
            <div>
              <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:bg-gray-400">
                {isLoading ? <FaSpinner className="animate-spin" /> : <><span>Sign In</span><FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" /></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
