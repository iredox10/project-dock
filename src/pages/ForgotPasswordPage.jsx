
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFolderOpen, FaEnvelope, FaPaperPlane, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { auth } from '../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Password reset link sent! Please check your email inbox (and spam folder).');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else {
        setError('Failed to send reset link. Please try again.');
        console.error("Forgot password error:", err);
      }
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
          <Link to="/" className="inline-block mb-8"><FaFolderOpen className="mx-auto h-16 w-auto text-white" /></Link>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Forgot Your Password?</h1>
          <p className="text-lg text-gray-300 max-w-md">No problem. Enter your email below and we'll send you a link to reset it.</p>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8 sm:p-12">
        <div className="max-w-md w-full">
          <div className="lg:hidden text-center mb-8"><Link to="/"><FaFolderOpen className="mx-auto h-12 w-auto text-indigo-600" /></Link></div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Reset Password</h2>
            <p className="mt-2 text-sm text-gray-600">Remember it now?{' '}<Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">Sign in</Link></p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center font-semibold">{error}</p>}
            {successMessage && <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center font-semibold flex items-center gap-3"><FaCheckCircle /> {successMessage}</div>}

            {!successMessage && (
              <>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Your email address" />
                </div>
                <div>
                  <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:bg-gray-400">
                    {isLoading ? <FaSpinner className="animate-spin" /> : <><FaPaperPlane /><span>Send Reset Link</span></>}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
