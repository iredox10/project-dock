import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

/**
 * OPay Payment Gateway Integration Service
 * Documentation: https://documentation.opayweb.com/
 */

// OPay API Configuration
const OPAY_CONFIG = {
  // Test/Production URLs
  baseURL: import.meta.env.VITE_OPAY_ENV === 'production' 
    ? 'https://api.opayweb.com' 
    : 'https://sandboxapi.opayweb.com',
  
  // Your OPay credentials (set these in .env file)
  merchantId: import.meta.env.VITE_OPAY_MERCHANT_ID,
  publicKey: import.meta.env.VITE_OPAY_PUBLIC_KEY,
  privateKey: import.meta.env.VITE_OPAY_PRIVATE_KEY,
  
  // Demo mode for testing without credentials
  isDemoMode: import.meta.env.VITE_OPAY_DEMO_MODE === 'true',
};

/**
 * Initialize payment with OPay
 * @param {Object} paymentData - Payment information
 * @returns {Promise<Object>} - Payment initialization response
 */
export const initializePayment = async (paymentData) => {
  // Demo mode - simulate payment for testing
  if (OPAY_CONFIG.isDemoMode) {
    console.log('🎭 DEMO MODE: Simulating payment initialization', paymentData);
    const reference = `DEMO_${uuidv4().substring(0, 8)}_${Date.now()}`;
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      reference: reference,
      cashierUrl: `/payment/demo?reference=${reference}&amount=${paymentData.amount}`,
      orderNo: `DEMO_ORDER_${Date.now()}`,
      isDemo: true,
    };
  }

  // Real OPay integration
  try {
    const reference = `PROJ_${uuidv4().substring(0, 8)}_${Date.now()}`;
    
    const payload = {
      reference: reference,
      mchShortName: OPAY_CONFIG.merchantId,
      productName: paymentData.productName,
      productDesc: paymentData.productDesc || paymentData.productName,
      userPhone: paymentData.userPhone || '',
      userRequestIp: paymentData.userRequestIp || '',
      amount: {
        total: paymentData.amount,
        currency: 'NGN'
      },
      callbackUrl: paymentData.callbackUrl || `${window.location.origin}/payment/verify`,
      returnUrl: paymentData.returnUrl || `${window.location.origin}/payment/success`,
      expireAt: paymentData.expireAt || 30, // minutes
    };

    const response = await axios.post(
      `${OPAY_CONFIG.baseURL}/api/v1/international/cashier/create`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPAY_CONFIG.publicKey}`,
          'MerchantId': OPAY_CONFIG.merchantId,
        }
      }
    );

    if (response.data.code === '00000') {
      return {
        success: true,
        reference: reference,
        cashierUrl: response.data.data.cashierUrl,
        orderNo: response.data.data.orderNo,
      };
    } else {
      throw new Error(response.data.message || 'Payment initialization failed');
    }
  } catch (error) {
    console.error('OPay initialization error:', error);
    
    // Better error message
    if (error.message === 'Network Error') {
      throw new Error('Unable to connect to payment gateway. This might be because:\n1. OPay credentials are not configured\n2. CORS restrictions\n3. Network connectivity issues\n\nEnable demo mode or configure OPay credentials.');
    }
    
    throw new Error(error.response?.data?.message || error.message || 'Failed to initialize payment');
  }
};

/**
 * Verify payment status
 * @param {string} reference - Transaction reference
 * @returns {Promise<Object>} - Payment verification response
 */
export const verifyPayment = async (reference, orderNo) => {
  // Demo mode - auto-approve payments
  if (OPAY_CONFIG.isDemoMode || reference.startsWith('DEMO_')) {
    console.log('🎭 DEMO MODE: Auto-approving payment', reference);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      status: 'SUCCESS',
      isPaid: true,
      data: {
        reference: reference,
        orderNo: orderNo,
        status: 'SUCCESS',
      },
    };
  }

  // Real OPay verification
  try {
    const response = await axios.post(
      `${OPAY_CONFIG.baseURL}/api/v1/international/cashier/status`,
      {
        orderNo: orderNo,
        reference: reference,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPAY_CONFIG.publicKey}`,
          'MerchantId': OPAY_CONFIG.merchantId,
        }
      }
    );

    if (response.data.code === '00000') {
      const status = response.data.data.status;
      return {
        success: true,
        status: status, // SUCCESS, PENDING, FAIL, CLOSE
        isPaid: status === 'SUCCESS',
        data: response.data.data,
      };
    } else {
      throw new Error(response.data.message || 'Payment verification failed');
    }
  } catch (error) {
    console.error('OPay verification error:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to verify payment');
  }
};

/**
 * Alternative: Use OPay redirect method (more reliable)
 * This redirects to OPay's hosted payment page
 */
export const initializeRedirectPayment = async (paymentData) => {
  try {
    const reference = `PROJ_${uuidv4().substring(0, 8)}_${Date.now()}`;
    
    const payload = {
      reference: reference,
      mchShortName: OPAY_CONFIG.merchantId,
      productName: paymentData.productName,
      productDesc: paymentData.productDesc || paymentData.productName,
      userPhone: paymentData.phone || '',
      userRequestIp: '',
      amount: {
        total: paymentData.amount,
        currency: 'NGN'
      },
      callbackUrl: paymentData.callbackUrl || `${window.location.origin}/payment/verify`,
      returnUrl: paymentData.returnUrl || `${window.location.origin}/payment/success`,
      expireAt: 30, // minutes
    };

    const response = await axios.post(
      `${OPAY_CONFIG.baseURL}/api/v1/international/cashier/create`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPAY_CONFIG.publicKey}`,
          'MerchantId': OPAY_CONFIG.merchantId,
        }
      }
    );

    if (response.data.code === '00000') {
      return {
        success: true,
        reference: reference,
        cashierUrl: response.data.data.cashierUrl,
        orderNo: response.data.data.orderNo,
      };
    } else {
      throw new Error(response.data.message || 'Payment initialization failed');
    }
  } catch (error) {
    console.error('OPay initialization error:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to initialize payment');
  }
};

/**
 * Simplified inline payment - just redirect to cashier URL
 * OPay doesn't have a reliable inline SDK, so we use redirect
 */
export const initializeInlinePayment = async (paymentData, onSuccess, onClose) => {
  try {
    // Just use the redirect method
    const result = await initializeRedirectPayment(paymentData);
    return result;
  } catch (error) {
    console.error('Payment initialization error:', error);
    throw error;
  }
};

/**
 * Check if OPay is properly configured
 */
export const isOpayConfigured = () => {
  return !!(OPAY_CONFIG.merchantId && OPAY_CONFIG.publicKey);
};

export default {
  initializePayment,
  verifyPayment,
  initializeInlinePayment,
  isOpayConfigured,
};
