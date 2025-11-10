import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaShieldAlt, FaCheckCircle, FaSpinner, FaCreditCard, FaLock, FaDownload } from 'react-icons/fa';
import { db, auth } from '../firebase/config';
import { getDoc, doc, addDoc, collection, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { initializeInlinePayment, initializePayment, verifyPayment, isOpayConfigured } from '../api/opayService';
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
  const [paymentMethod, setPaymentMethod] = useState('inline'); // 'inline' or 'redirect'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate(`/login?redirect=/projects/${projectId}/payment`);
      }
    });
    return () => unsubscribe();
  }, [projectId, navigate]);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const projectDocRef = doc(db, 'projects', projectId);
        const docSnap = await getDoc(projectDocRef);
        
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
          
          // Check if user already purchased
          if (user) {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const purchasedProjects = userDoc.data().purchasedProjects || [];
              setHasPurchased(purchasedProjects.includes(projectId));
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
    if (!user) {
      showModal('Login Required', 'Please login to make a purchase', 'warning');
      navigate(`/login?redirect=/projects/${projectId}/payment`);
      return;
    }

    if (!isOpayConfigured()) {
      showModal('Payment Unavailable', 'Payment gateway is not configured. Please contact support.', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      const paymentData = {
        amount: project.priceNGN,
        email: user.email,
        firstName: userData.name?.split(' ')[0] || 'User',
        lastName: userData.name?.split(' ')[1] || '',
        phone: userData.phone || '',
        productName: project.title,
        productDesc: `${project.department} - ${project.level} Project`,
        callbackUrl: `${window.location.origin}/payment/verify?projectId=${projectId}`,
        returnUrl: `${window.location.origin}/payment/success?projectId=${projectId}`,
      };

      // Both methods now use redirect
      const response = await initializePayment(paymentData);
      
      if (response.success) {
        // Store reference in sessionStorage for verification
        sessionStorage.setItem('payment_reference', response.reference);
        sessionStorage.setItem('payment_orderNo', response.orderNo);
        sessionStorage.setItem('payment_projectId', projectId);
        
        // Redirect to OPay cashier
        window.location.href = response.cashierUrl;
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      showModal('Payment Failed', error.message, 'error');
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (reference, orderNo) => {
    try {
      // Verify payment
      const verification = await verifyPayment(reference, orderNo);
      
      if (verification.isPaid) {
        // Create order record
        const orderData = {
          userId: user.uid,
          userEmail: user.email,
          projectId: projectId,
          projectTitle: project.title,
          amount: project.priceNGN,
          paymentReference: reference,
          paymentStatus: 'completed',
          orderNo: orderNo,
          createdAt: serverTimestamp(),
        };

        await addDoc(collection(db, 'orders'), orderData);

        // Update user's purchased projects
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const purchasedProjects = userDoc.data()?.purchasedProjects || [];
        
        if (!purchasedProjects.includes(projectId)) {
          await updateDoc(userRef, {
            purchasedProjects: [...purchasedProjects, projectId]
          });
        }

        // Update project download count
        await updateDoc(doc(db, 'projects', projectId), {
          downloadCount: increment(1)
        });

        showModal('Payment Successful!', 'Your payment was successful. You can now download the project.', 'success');
        
        setTimeout(() => {
          navigate(`/projects/${projectId}/download-file`);
        }, 2000);
      } else {
        showModal('Payment Failed', 'Payment verification failed. Please contact support if amount was deducted.', 'error');
      }
    } catch (error) {
      console.error('Payment success handling error:', error);
      showModal('Error', 'An error occurred while processing your payment. Please contact support.', 'error');
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
                    onClick={() => setPaymentMethod('inline')}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'inline'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'inline' ? 'border-indigo-600' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'inline' && (
                        <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900">OPay Quick Pay</div>
                      <div className="text-sm text-gray-600">Pay securely without leaving this page</div>
                    </div>
                    <FaCreditCard className="text-2xl text-indigo-600" />
                  </button>

                  <button
                    onClick={() => setPaymentMethod('redirect')}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'redirect'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'redirect' ? 'border-indigo-600' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'redirect' && (
                        <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900">OPay Redirect</div>
                      <div className="text-sm text-gray-600">Complete payment on OPay's secure page</div>
                    </div>
                    <FaLock className="text-2xl text-indigo-600" />
                  </button>
                </div>
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
                  Your payment is secured by OPay's industry-standard encryption. 
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
