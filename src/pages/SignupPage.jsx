
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFolderOpen, FaUser, FaEnvelope, FaLock, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { auth, db } from '../firebase/config.js'; // Import your Firebase config
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Create a user document in the 'users' collection in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        role: 'user', // Default role
        createdAt: serverTimestamp(),
        purchasedProjects: []
      });

      // 3. Redirect to homepage on success
      navigate('/');

    } catch (err) {
      // Handle Firebase errors
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else {
        setError('Failed to create an account. Please try again.');
        console.error("Signup error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-blue-500 items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-24 -right-10 w-72 h-72 bg-white/10 rounded-full"></div>
        <div className="relative z-10 text-center">
          <Link to="/" className="inline-block mb-8"><FaFolderOpen className="mx-auto h-16 w-auto text-white" /></Link>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Join Project Dock Today</h1>
          <p className="text-lg text-indigo-100 max-w-md">Unlock access to thousands of projects, get inspired, and kickstart your academic success.</p>
        </div>
      </div>

      {/* Right Column: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8 sm:p-12">
        <div className="max-w-md w-full">
          <div className="lg:hidden text-center mb-8"><Link to="/"><FaFolderOpen className="mx-auto h-12 w-auto text-indigo-600" /></Link></div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">Already have an account?{' '}<Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">Sign in here</Link></p>
          </div>

          <form onSubmit={handleSignup} className="mt-8 space-y-6">
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center font-semibold">{error}</p>}
            <div className="space-y-4">
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Full Name" />
              </div>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Email address" />
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Password" />
              </div>
            </div>
            <div className="text-xs text-gray-500">By creating an account, you agree to our <a href="#" className="font-medium hover:underline">Terms of Service</a>.</div>
            <div>
              <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:bg-gray-400">
                {isLoading ? <FaSpinner className="animate-spin" /> : <><span>Create Account</span><FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" /></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
