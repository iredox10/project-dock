import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiLoader, FiLock, FiCreditCard, FiSmartphone, FiGlobe } from 'react-icons/fi';
import { getProjectById, getAllOrders, createOrder, updateProject, getUserById } from '../api/projectServices';
import { authService } from '../appwrite/auth';
import { launchPaystackInline, verifyPaystackPayment, isPaystackConfigured, MICROFINANCE_BANKS } from '../api/paystackService.js';
import { Modal, useModal } from '../components/Modal';

const PaymentPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { modal, showModal, closeModal } = useModal();

  const [project, setProject] = useState(null);
  const [user, setUser] = useState(null);
  const [fullUser, setFullUser] = useState(null);
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
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);

        if (!currentUser) {
          const currentURL = encodeURIComponent(`/projects/${projectId}/payment`);
          navigate(`/login?redirect=${currentURL}`);
        } else {
          // Fetch full user profile to check for referral
          try {
            const userDoc = await getUserById(currentUser.$id);
            setFullUser(userDoc);
          } catch (e) {
            console.error('Error fetching full user profile:', e);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        const currentURL = encodeURIComponent(`/projects/${projectId}/payment`);
        navigate(`/login?redirect=${currentURL}`);
      }
    };

    checkAuthStatus();

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

      let channels = ['card', 'bank', 'bank_transfer', 'ussd'];
      if (paymentMethod === 'card') {
        channels = ['card'];
      } else if (paymentMethod === 'bank') {
        channels = ['bank', 'bank_transfer', 'ussd'];
      } else if (paymentMethod === 'opay') {
        channels = ['bank', 'bank_transfer'];
      }

      // Calculate final price with discount
      let finalAmount = project.priceNGN;
      if (fullUser?.referredBy) {
        finalAmount = Math.round(project.priceNGN * 0.9); // 10% discount
      }

      const reference = await launchPaystackInline({
        email: user.email || user.emailAddress,
        amountNGN: finalAmount,
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
          originalPrice: project.priceNGN,
          discountApplied: !!fullUser?.referredBy
        },
        onSuccess: async (response) => {
          await handlePaymentSuccess(response.reference, finalAmount);
        },
        onCancel: () => {
          setIsProcessing(false);
          showModal('Payment Cancelled', 'You cancelled the payment process.', 'info');
        },
      });

      sessionStorage.setItem('payment_reference', reference);
      sessionStorage.setItem('payment_projectId', projectId);
    } catch (error) {
      console.error('Payment initialization error:', error);
      showModal('Payment Failed', error.message, 'error');
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (reference, amountPaid) => {
    try {
      const verification = await verifyPaystackPayment(reference);

      if (verification.isPaid) {
        const orderData = {
          userId: user.$id,
          projectId: projectId,
          projectTitle: project.title,
          amount: amountPaid || project.priceNGN,
          status: 'completed',
          paymentId: reference,
          transactionId: reference,
          quantity: 1
        };

        await createOrder(orderData);

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
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <FiLoader className="animate-spin text-2xl text-gray-400" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{error || 'Project not found'}</h2>
          <Link to="/projects" className="text-gray-900 underline hover:text-gray-600">
            Return to Library
          </Link>
        </div>
      </div>
    );
  }

  if (hasPurchased) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="text-2xl text-gray-900" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">Already Purchased</h2>
          <p className="text-gray-500 mb-8">You have already purchased this project.</p>
          <Link
            to={`/projects/${projectId}/download-file`}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-black transition-colors"
          >
            Download Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <Modal {...modal} onClose={closeModal} />

      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-8">
          <Link
            to={`/projects/${projectId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft />
            Back to Project
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Payment Form */}
          <div className="lg:col-span-7">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Checkout</h1>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-4 w-full">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-gray-900' : 'border-gray-300'}`}>
                        {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-gray-900" />}
                      </div>
                      <div className="flex-1">
                        <span className="block font-medium text-gray-900">Card Payment</span>
                        <span className="block text-sm text-gray-500">Visa, Mastercard, Verve</span>
                      </div>
                      <FiCreditCard className="text-xl text-gray-400" />
                    </div>
                  </label>

                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'bank' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={() => setPaymentMethod('bank')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-4 w-full">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'bank' ? 'border-gray-900' : 'border-gray-300'}`}>
                        {paymentMethod === 'bank' && <div className="w-2 h-2 rounded-full bg-gray-900" />}
                      </div>
                      <div className="flex-1">
                        <span className="block font-medium text-gray-900">Bank Transfer</span>
                        <span className="block text-sm text-gray-500">Direct transfer or USSD</span>
                      </div>
                      <FiGlobe className="text-xl text-gray-400" />
                    </div>
                  </label>

                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'opay' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="opay"
                      checked={paymentMethod === 'opay'}
                      onChange={() => setPaymentMethod('opay')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-4 w-full">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'opay' ? 'border-gray-900' : 'border-gray-300'}`}>
                        {paymentMethod === 'opay' && <div className="w-2 h-2 rounded-full bg-gray-900" />}
                      </div>
                      <div className="flex-1">
                        <span className="block font-medium text-gray-900">Mobile Money</span>
                        <span className="block text-sm text-gray-500">OPay, PalmPay, etc.</span>
                      </div>
                      <FiSmartphone className="text-xl text-gray-400" />
                    </div>
                  </label>
                </div>

                {paymentMethod === 'opay' && (
                  <div className="mt-4 pl-8">
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-900"
                    >
                      <option value="">Select your bank (Optional)</option>
                      {MICROFINANCE_BANKS.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 px-6 rounded-lg hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isProcessing ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiLock />
                      Pay ₦{project.priceNGN?.toLocaleString()}
                    </>
                  )}
                </button>
                <p className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                  <FiLock className="w-3 h-3" />
                  Secured by Paystack
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-gray-50 rounded-xl p-8 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{project.title}</h4>
                  <p className="text-sm text-gray-500">{project.department}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₦{project.priceNGN?.toLocaleString()}</span>
                </div>
                {fullUser?.referredBy && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Referral Discount (10%)</span>
                    <span>-₦{Math.round(project.priceNGN * 0.1)?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Processing Fee</span>
                  <span>₦0.00</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-xl">
                    ₦{(fullUser?.referredBy ? Math.round(project.priceNGN * 0.9) : project.priceNGN)?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Includes:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-gray-900" />
                    Complete project material
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-gray-900" />
                    Source code (if applicable)
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-gray-900" />
                    Instant download
                  </li>
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
