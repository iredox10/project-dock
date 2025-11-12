const sdk = require('node-appwrite');
const axios = require('axios');

/*
  Appwrite function to securely handle OPay payment integration.
  
  Payload from frontend should be in this format:
  {
    "action": "initialize" | "verify",
    "data": { ... } 
  }
*/

module.exports = async (req, res) => {
  const client = new sdk.Client();

  // You can remove services you don't use
  // const account = new sdk.Account(client);
  // const database = new sdk.Databases(client);
  // const storage = new sdk.Storage(client);
  // const users = new sdk.Users(client);

  if (
    !req.variables['APPWRITE_FUNCTION_ENDPOINT'] ||
    !req.variables['APPWRITE_FUNCTION_API_KEY']
  ) {
    console.warn("Environment variables are not set. Function cannot use Appwrite SDK.");
  } else {
    client
      .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
      .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
      .setKey(req.variables['APPWRITE_FUNCTION_API_KEY'])
      .setSelfSigned(true);
  }

  // --- OPay Logic ---

  // 1. Get OPay credentials from secure environment variables
  const { OPAY_MERCHANT_ID, OPAY_PUBLIC_KEY, OPAY_PRIVATE_KEY, OPAY_ENV } = req.variables;

  if (!OPAY_MERCHANT_ID || !OPAY_PUBLIC_KEY || !OPAY_PRIVATE_KEY) {
    return res.json({
      success: false,
      message: 'Payment gateway credentials are not configured on the server. Contact support.',
    }, 500);
  }

  const baseURL = OPAY_ENV === 'production' 
    ? 'https://api.opayweb.com' 
    : 'https://sandboxapi.opayweb.com';

  // 2. Parse payload from the frontend
  let payload;
  try {
    payload = JSON.parse(req.payload);
  } catch (e) {
    return res.json({ success: false, message: 'Invalid request payload.' }, 400);
  }

  const { action, data } = payload;

  // 3. Handle the requested action
  if (action === 'initialize') {
    // --- Initialize Payment ---
    try {
      const { amount, productName, productDesc, callbackUrl, returnUrl } = data;
      const reference = `PROJ_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;

      const opayPayload = {
        reference: reference,
        mchShortName: OPAY_MERCHANT_ID,
        productName: productName,
        productDesc: productDesc || productName,
        amount: {
          total: amount,
          currency: 'NGN'
        },
        callbackUrl: callbackUrl,
        returnUrl: returnUrl,
        expireAt: 30, // minutes
      };

      const response = await axios.post(
        `${baseURL}/api/v1/international/cashier/create`,
        opayPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPAY_PUBLIC_KEY}`,
            'MerchantId': OPAY_MERCHANT_ID,
          }
        }
      );

      if (response.data.code === '00000') {
        return res.json({
          success: true,
          reference: reference,
          cashierUrl: response.data.data.cashierUrl,
          orderNo: response.data.data.orderNo,
        });
      } else {
        throw new Error(response.data.message || 'Payment initialization failed on OPay');
      }
    } catch (error) {
      console.error('OPay Initialization Error:', error.message);
      return res.json({
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to initialize payment on the server.',
      }, 500);
    }

  } else if (action === 'verify') {
    // --- Verify Payment ---
    try {
      const { reference, orderNo } = data;

      if (!reference || !orderNo) {
        return res.json({ success: false, message: 'Reference and Order Number are required for verification.' }, 400);
      }

      const response = await axios.post(
        `${baseURL}/api/v1/international/cashier/status`,
        {
          orderNo: orderNo,
          reference: reference,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPAY_PUBLIC_KEY}`,
            'MerchantId': OPAY_MERCHANT_ID,
          }
        }
      );

      if (response.data.code === '00000') {
        const status = response.data.data.status;
        return res.json({
          success: true,
          status: status, // SUCCESS, PENDING, FAIL, CLOSE
          isPaid: status === 'SUCCESS',
          data: response.data.data,
        });
      } else {
        throw new Error(response.data.message || 'Payment verification failed on OPay');
      }
    } catch (error) {
      console.error('OPay Verification Error:', error.message);
      return res.json({
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to verify payment on the server.',
      }, 500);
    }

  } else {
    return res.json({ success: false, message: 'Invalid action specified.' }, 400);
  }
};
