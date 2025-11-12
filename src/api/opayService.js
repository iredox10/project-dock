import { v4 as uuidv4 } from 'uuid';
import { functions } from '../appwrite/config'; // Import the functions service from Appwrite config

/**
 * OPay Payment Gateway Integration Service (Secure Version)
 * This service communicates with a secure Appwrite Function instead of OPay directly.
 */

// OPay API Configuration
const OPAY_CONFIG = {
  // Your OPay credentials (public ones are safe here, but not used directly)
  merchantId: import.meta.env.VITE_OPAY_MERCHANT_ID,
  publicKey: import.meta.env.VITE_OPAY_PUBLIC_KEY,
  
  // The ID of the Appwrite function that will handle OPay calls
  functionId: import.meta.env.VITE_APPWRITE_OPAY_FUNCTION_ID,

  // Demo mode for testing without credentials
  isDemoMode: import.meta.env.VITE_OPAY_DEMO_MODE === 'true',
};

/**
 * Initialize payment with OPay via a secure Appwrite Function
 * @param {Object} paymentData - Payment information
 * @returns {Promise<Object>} - Payment initialization response
 */
export const initializePayment = async (paymentData) => {
  // Demo mode - simulate payment for testing without calling the backend
  if (OPAY_CONFIG.isDemoMode) {
    console.log('🎭 DEMO MODE: Simulating payment initialization', paymentData);
    const reference = `DEMO_${uuidv4().substring(0, 8)}_${Date.now()}`;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      reference: reference,
      cashierUrl: `/payment/demo?reference=${reference}&amount=${paymentData.amount}`,
      orderNo: `DEMO_ORDER_${Date.now()}`,
      isDemo: true,
    };
  }

  if (!OPAY_CONFIG.functionId) {
    throw new Error('The Appwrite Function ID for payments is not configured. Please set VITE_APPWRITE_OPAY_FUNCTION_ID in your .env file.');
  }

  // Real OPay integration via Appwrite Function
  try {
    const payload = {
      action: 'initialize',
      data: paymentData,
    };

    const execution = await functions.createExecution(
      OPAY_CONFIG.functionId,
      JSON.stringify(payload)
    );

    if (execution.status === 'completed') {
      const response = JSON.parse(execution.responseBody);
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Payment initialization failed on the server.');
      }
    } else {
      const errorResponse = JSON.parse(execution.responseBody);
      throw new Error(errorResponse.message || `Function execution failed with status: ${execution.status}`);
    }
  } catch (error) {
    console.error('Appwrite Function (initialize) error:', error);
    throw new Error(error.message || 'Failed to execute payment initialization function.');
  }
};

/**
 * Verify payment status via a secure Appwrite Function
 * @param {string} reference - Transaction reference
 * @param {string} orderNo - OPay Order number
 * @returns {Promise<Object>} - Payment verification response
 */
export const verifyPayment = async (reference, orderNo) => {
  // Demo mode - auto-approve payments
  if (OPAY_CONFIG.isDemoMode || reference.startsWith('DEMO_')) {
    console.log('🎭 DEMO MODE: Auto-approving payment', reference);
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      status: 'SUCCESS',
      isPaid: true,
      data: { reference, orderNo, status: 'SUCCESS' },
    };
  }

  if (!OPAY_CONFIG.functionId) {
    throw new Error('The Appwrite Function ID for payments is not configured. Please set VITE_APPWRITE_OPAY_FUNCTION_ID in your .env file.');
  }

  // Real OPay verification via Appwrite Function
  try {
    const payload = {
      action: 'verify',
      data: { reference, orderNo },
    };

    const execution = await functions.createExecution(
      OPAY_CONFIG.functionId,
      JSON.stringify(payload)
    );

    if (execution.status === 'completed') {
      const response = JSON.parse(execution.responseBody);
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Payment verification failed on the server.');
      }
    } else {
      const errorResponse = JSON.parse(execution.responseBody);
      throw new Error(errorResponse.message || `Function execution failed with status: ${execution.status}`);
    }
  } catch (error) {
    console.error('Appwrite Function (verify) error:', error);
    throw new Error(error.message || 'Failed to execute payment verification function.');
  }
};

/**
 * Check if OPay is properly configured for client-side initialization
 */
export const isOpayConfigured = () => {
  // In this secure setup, we only need to know if the function ID is set.
  // The demo mode flag also allows the UI to work without any backend config.
  return OPAY_CONFIG.isDemoMode || !!OPAY_CONFIG.functionId;
};

export default {
  initializePayment,
  verifyPayment,
  isOpayConfigured,
};
