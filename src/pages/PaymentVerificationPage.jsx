import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { verifyPayment } from '../api/opayService';
import { db, auth } from '../firebase/config';
import { addDoc, collection, serverTimestamp, doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';

const PaymentVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'failed'
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    verifyPaymentStatus();
  }, []);

  const verifyPaymentStatus = async () => {
    try {
      // Get payment details from URL or sessionStorage
      const reference = searchParams.get('reference') || sessionStorage.getItem('payment_reference');
      const orderNo = searchParams.get('orderNo') || sessionStorage.getItem('payment_orderNo');
      const projectId = searchParams.get('projectId') || sessionStorage.getItem('payment_projectId');

      if (!reference || !projectId) {
        setStatus('failed');
        setMessage('Payment reference not found');
        return;
      }

      // Verify with OPay
      const verification = await verifyPayment(reference, orderNo);

      if (verification.isPaid) {
        // Payment successful
        const user = auth.currentUser;
        if (!user) {
          setStatus('failed');
          setMessage('User not authenticated');
          return;
        }

        // Get project details
        const projectDoc = await getDoc(doc(db, 'projects', projectId));
        const project = projectDoc.data();

        // Create order record
        await addDoc(collection(db, 'orders'), {
          userId: user.uid,
          userEmail: user.email,
          projectId: projectId,
          projectTitle: project.title,
          amount: project.priceNGN,
          paymentReference: reference,
          paymentStatus: 'completed',
          orderNo: orderNo,
          createdAt: serverTimestamp(),
        });

        // Update user's purchased projects
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const purchasedProjects = userDoc.data()?.purchasedProjects || [];
        
        if (!purchasedProjects.includes(projectId)) {
          await updateDoc(userRef, {
            purchasedProjects: arrayUnion(projectId)
          });
        }

        // Update project download count
        await updateDoc(doc(db, 'projects', projectId), {
          downloadCount: increment(1)
        });

        // Clear session storage
        sessionStorage.removeItem('payment_reference');
        sessionStorage.removeItem('payment_orderNo');
        sessionStorage.removeItem('payment_projectId');

        setStatus('success');
        setMessage('Payment successful! Redirecting to download page...');

        // Redirect to download page after 2 seconds
        setTimeout(() => {
          navigate(`/projects/${projectId}/download-file`);
        }, 2000);
      } else {
        setStatus('failed');
        setMessage('Payment verification failed. Please contact support if amount was deducted.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('failed');
      setMessage('An error occurred while verifying payment: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 pt-20">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === 'verifying' && (
          <>
            <FaSpinner className="animate-spin text-6xl text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/projects')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
            >
              Back to Projects
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentVerificationPage;
