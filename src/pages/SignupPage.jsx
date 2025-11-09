
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFolderOpen, FaUser, FaEnvelope, FaLock, FaSpinner, FaRocket, FaShieldAlt, FaStar } from 'react-icons/fa';
import { auth, db } from '../firebase/config.js';
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
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        role: 'user',
        createdAt: serverTimestamp(),
        purchasedProjects: []
      });

      navigate('/');

    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else {
        setError('Failed to create account. Please try again.');
        console.error("Signup error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: FaRocket, text: 'Instant Access to Projects' },
    { icon: FaShieldAlt, text: 'Secure & Private' },
    { icon: FaStar, text: 'Premium Resources' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 items-center justify-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="signup-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#signup-pattern)" />
          </svg>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center max-w-md">
          <Link to="/" className="inline-block mb-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border-2 border-white/30">
              <FaFolderOpen className="text-white text-4xl" />
            </div>
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Join Us Today!
          </h1>
          <p className="text-lg text-indigo-100 mb-8">
            Start your academic journey with thousands of verified projects
          </p>

          {/* Benefits */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon className="text-white" />
                  </div>
                  <span className="text-white font-semibold">{benefit.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 p-8 sm:p-12">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <FaFolderOpen className="text-white text-2xl" />
              </div>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Create Account</h2>
            <p className="mt-2 text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl font-semibold text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Must be at least 6 characters</p>
            </div>

            <div className="text-xs text-slate-600">
              By creating an account, you agree to our{' '}
              <a href="#" className="font-bold text-indigo-600 hover:underline">
                Terms of Service
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-3 py-4 px-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
