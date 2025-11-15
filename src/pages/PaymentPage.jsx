import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaShieldAlt, FaCheckCircle, FaSpinner, FaCreditCard, FaLock, FaDownload, FaUniversity, FaMobileAlt } from 'react-icons/fa';
import { getProjectById, getAllOrders, createOrder, updateProject } from '../api/projectServices';
import { authService } from '../appwrite/auth';
import { Query } from 'appwrite';
import { launchPaystackInline, verifyPaystackPayment, isPaystackConfigured, MICROFINANCE_BANKS } from '../api/paystackService.js';
import { Modal, useModal } from '../components/Modal';

const PaymentPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { modal, showModal, closeModal } = useModal();
  
  const [project, setProject] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'bank', 'opay'
  const [selectedBank, setSelectedBank] = useState('');

  useEffect(() => {
    const abortController = new AbortController();

    const checkAuthStatus = async () => {
      if (abortController.signal.aborted) return;

      try {
        // Get the current user to verify authentication
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        
        // If user is not authenticated, redirect to login
        if (!currentUser) {
          const currentURL = encodeURIComponent(`/projects/${projectId}/payment`);
          navigate(`/login?redirect=${currentURL}`);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // If there's an error checking auth, also redirect to login
        const currentURL = encodeURIComponent(`/projects/${projectId}/payment`);
        navigate(`/login?redirect=${currentURL}`);
      }
    };

    checkAuthStatus();

    // Cleanup
    return () => {
      abortController.abort();
    };
  }, [projectId, navigate]);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const projectDoc = await getProjectById(projectId);
        
        if (projectDoc) {
          setProject({ id: projectDoc.$id, ...projectDoc });
          
          // Check if user already purchased by querying orders collection
          if (user) {
            try {
              const { documents: orders } = await getAllOrders({
                userId: user.$id,
                projectId: projectId,
                status: 'completed',
                limit: 1
              });
              setHasPurchased(orders && orders.length > 0);
            } catch (orderError) {
              console.log("Error checking purchase status:", orderError);
              setHasPurchased(false);
            }
          }
        } else {
          setError('Project not found.');
        }
      } catch (err) {
        setError('Failed to load project details.');
        console.error("Error fetching project:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId && user) {
      fetchProject();
    }
  }, [projectId, user]);

  const handlePayment = async () => {
    // Double check auth status before processing payment
    let currentUser = user;
    if (!currentUser) {
      try {
        currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          const currentURL = encodeURIComponent(`/projects/${projectId}/payment`);
          navigate(`/login?redirect=${currentURL}`);
          return;
        }
        setUser(currentUser);
      } catch (authError) {
        const currentURL = encodeURIComponent(`/projects/${projectId}/payment`);
        navigate(`/login?redirect=${currentURL}`);
        return;
      }
    }

    if (!isPaystackConfigured()) {
      showModal('Payment Unavailable', 'Payment gateway is not configured. Please contact support.', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const userName = user.name || user.email?.split('@')[0] || 'User';
      const nameParts = userName.split(' ');
      
      // Determine payment channels based on selected method
      let channels = ['card', 'bank', 'bank_transfer', 'ussd'];
      if (paymentMethod === 'card') {
        channels = ['card'];
      } else if (paymentMethod === 'bank') {
        channels = ['bank', 'bank_transfer', 'ussd'];
      } else if (paymentMethod === 'opay') {
        channels = ['bank', 'bank_transfer'];
      }

      const reference = await launchPaystackInline({
        email: user.email || user.emailAddress,
        amountNGN: project.priceNGN,
        firstName: nameParts[0] || 'User',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: user.phone || '',
        projectTitle: project.title,
        channels,
        preferredMicrofinanceBank: paymentMethod === 'opay' ? selectedBank || 'OPay' : undefined,
        metadata: {
          projectId: projectId,
          userId: user.$id,
          department: project.department,
          level: project.level,
        },
        onSuccess: async (response) => {
          await handlePaymentSuccess(response.reference);
        },
        onCancel: () => {
          setIsProcessing(false);
          showModal('Payment Cancelled', 'You cancelled the payment process.', 'info');
        },
      });

      // Store reference for potential later verification
      sessionStorage.setItem('payment_reference', reference);
      sessionStorage.setItem('payment_projectId', projectId);
    } catch (error) {
      console.error('Payment initialization error:', error);
      showModal('Payment Failed', error.message, 'error');
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (reference) => {
    try {
      // Verify payment
      const verification = await verifyPaystackPayment(reference);
      
      if (verification.isPaid) {
        // Create order record matching the existing schema
        const orderData = {
          userId: user.$id,
          projectId: projectId,
          projectTitle: project.title,
          amount: project.priceNGN,
          status: 'completed',
          paymentId: reference,
          transactionId: reference,
          quantity: 1
        };

        await createOrder(orderData);

        // Note: User purchases are tracked in the orders collection
        // No need to update user document as it doesn't have purchasedProjects field

        // Update project download count
        const projectData = await getProjectById(projectId);
        await updateProject(projectId, {
          ...projectData,
          downloadCount: (projectData.downloadCount || 0) + 1
        });

        showModal('Payment Successful!', 'Your payment was successful. You can now download the project.', 'success');
        
        setTimeout(() => {
          navigate(`/projects/${projectId}/download-file`);
        }, 2000);
      } else {
        showModal('Payment Failed', 'Payment verification failed. Please contact support if amount was deducted.', 'error');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment success handling error:', error);
      showModal('Error', 'An error occurred while processing your payment. Please contact support.', 'error');
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center pt-20">
        <FaSpinner className="animate-spin text-5xl text-indigo-600" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Project not found'}</h2>
          <Link to="/projects" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (hasPurchased) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Already Purchased</h2>
          <p className="text-gray-600 mb-6">You've already purchased this project.</p>
          <Link
            to={`/projects/${projectId}/download-file`}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
          >
            <FaDownload />
            Download Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 pb-12">
      <Modal {...modal} onClose={closeModal} />
      
      <div className="max-w-4xl mx-auto px-4">
        <Link
          to={`/projects/${projectId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-semibold mb-6"
        >
          <FaArrowLeft />
          Back to Project
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Complete Your Purchase</h1>

              {/* Project Summary */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{project.department} • {project.level}</span>
                  <span className="font-bold text-2xl text-indigo-600">₦{project.priceNGN?.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-8">
                <label className="block font-semibold text-gray-700 mb-4">Payment Method</label>
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'card' ? 'border-indigo-600' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'card' && (
                        <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900">Card Payment</div>
                      <div className="text-sm text-gray-600">Pay with Debit/Credit Card (Visa, Mastercard, Verve)</div>
                    </div>
                    <FaCreditCard className="text-2xl text-indigo-600" />
                  </button>

                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'bank' ? 'border-indigo-600' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'bank' && (
                        <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900">Bank Transfer / USSD</div>
                      <div className="text-sm text-gray-600">Pay via Bank Transfer or USSD</div>
                    </div>
                    <FaUniversity className="text-2xl text-indigo-600" />
                  </button>

                  <button
                    onClick={() => setPaymentMethod('opay')}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'opay'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'opay' ? 'border-indigo-600' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'opay' && (
                        <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900">OPay & Other Microfinance Banks</div>
                      <div className="text-sm text-gray-600">Pay with OPay, Kuda, Moniepoint, PalmPay, etc.</div>
                    </div>
                    <FaMobileAlt className="text-2xl text-indigo-600" />
                  </button>
                </div>

                {/* Bank Selection for OPay method */}
                {paymentMethod === 'opay' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Your Bank (Optional)
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    >
                      <option value="">Select a bank...</option>
                      {MICROFINANCE_BANKS.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs text-gray-500">
                      Selecting your bank helps streamline the payment process
                    </p>
                  </div>
                )}
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Pay ₦{project.priceNGN?.toLocaleString()} Securely
                  </>
                )}
              </button>

              {/* Security Note */}
              <div className="mt-6 flex items-start gap-3 text-sm text-gray-600">
                <FaShieldAlt className="text-green-500 text-lg mt-0.5" />
                <p>
                  Your payment is secured by Paystack's industry-standard encryption. 
                  We never store your payment information.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Project Price</span>
                  <span className="font-semibold">₦{project.priceNGN?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="font-semibold text-green-600">₦0</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-2xl text-indigo-600">₦{project.priceNGN?.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-green-800">
                  <FaCheckCircle />
                  What you'll get:
                </div>
                <ul className="text-sm text-green-700 space-y-1 ml-6">
                  <li>• Instant download access</li>
                  <li>• Complete project material</li>
                  <li>• PDF & DOCX formats</li>
                  <li>• Lifetime access</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
