const sdk = require('node-appwrite');
const axios = require('axios');

const DEFAULT_CHANNELS = ['card', 'bank', 'bank_transfer', 'ussd'];

const parsePayload = (payload) => {
  if (!payload) return {};
  try {
    return JSON.parse(payload);
  } catch (error) {
    throw new Error('Invalid request payload. Expecting valid JSON.');
  }
};

const ensureAmountInKobo = (amount) => {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error('Invalid amount supplied.');
  }
  return Math.round(numericAmount * 100);
};

const buildAxiosInstance = (secretKey, baseUrl) => axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Bearer ${secretKey}`,
    'Content-Type': 'application/json',
  },
});

module.exports = async (req, res) => {
  try {
    const client = new sdk.Client();

    if (
      req.variables['APPWRITE_FUNCTION_ENDPOINT'] &&
      req.variables['APPWRITE_FUNCTION_API_KEY'] &&
      req.variables['APPWRITE_FUNCTION_PROJECT_ID']
    ) {
      client
        .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
        .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
        .setKey(req.variables['APPWRITE_FUNCTION_API_KEY'])
        .setSelfSigned(true);
    } else {
      console.warn('Appwrite function environment variables are not fully configured.');
    }

    const PAYSTACK_SECRET_KEY = req.variables['PAYSTACK_SECRET_KEY'];
    const PAYSTACK_PUBLIC_KEY = req.variables['PAYSTACK_PUBLIC_KEY'];
    const PAYSTACK_BASE_URL = req.variables['PAYSTACK_BASE_URL'] || 'https://api.paystack.co';

    if (!PAYSTACK_SECRET_KEY) {
      return res.json({
        success: false,
        message: 'Paystack secret key is not configured on the server.',
      }, 500);
    }

    let payload = {};
    try {
      payload = parsePayload(req.payload);
    } catch (payloadError) {
      return res.json({
        success: false,
        message: payloadError.message,
      }, 400);
    }

    const { action, data = {} } = payload;
    const axiosInstance = buildAxiosInstance(PAYSTACK_SECRET_KEY, PAYSTACK_BASE_URL);

    if (action === 'initialize') {
      const {
        email,
        amount,
        reference,
        channels = DEFAULT_CHANNELS,
        callbackUrl,
        currency = 'NGN',
        metadata = {},
      } = data;

      if (!email || !amount) {
        return res.json({
          success: false,
          message: 'Email and amount are required to initialize Paystack transactions.',
        }, 400);
      }

      try {
        const payloadBody = {
          email,
          amount: ensureAmountInKobo(amount),
          reference,
          channels,
          callback_url: callbackUrl,
          currency,
          metadata,
        };

        const response = await axiosInstance.post('/transaction/initialize', payloadBody);

        if (response.data?.status && response.data?.data) {
          return res.json({
            success: true,
            authorizationUrl: response.data.data.authorization_url,
            accessCode: response.data.data.access_code,
            reference: response.data.data.reference,
            data: response.data.data,
          });
        }

        return res.json({
          success: false,
          message: response.data?.message || 'Paystack initialization failed.',
        }, 502);
      } catch (error) {
        console.error('Paystack initialize error:', error.response?.data || error.message);
        return res.json({
          success: false,
          message: error.response?.data?.message || error.message || 'Could not initialize Paystack transaction.',
          error: error.response?.data || error.message,
        }, 502);
      }
    }

    if (action === 'verify') {
      const { reference } = data;

      if (!reference) {
        return res.json({
          success: false,
          message: 'Transaction reference is required for verification.',
        }, 400);
      }

      try {
        const response = await axiosInstance.get(`/transaction/verify/${reference}`);

        console.log('Paystack verify response:', JSON.stringify({
          status: response.data?.status,
          message: response.data?.message,
          transactionStatus: response.data?.data?.status,
          reference,
        }));

        if (response.data?.status && response.data?.data) {
          const transaction = response.data.data;
          return res.json({
            success: true,
            isPaid: transaction.status === 'success',
            data: transaction,
            publicKey: PAYSTACK_PUBLIC_KEY,
          });
        }

        console.warn('Paystack verification returned false status:', response.data);
        return res.json({
          success: false,
          message: response.data?.message || 'Paystack verification failed.',
          paystackResponse: response.data,
        }, 502);
      } catch (error) {
        console.error('Paystack verify error:', {
          message: error.message,
          statusCode: error.response?.status,
          data: error.response?.data,
          reference,
        });
        return res.json({
          success: false,
          message: error.response?.data?.message || error.message || 'Could not verify Paystack transaction.',
          error: error.response?.data || error.message,
        }, error.response?.status || 502);
      }
    }

    return res.json({
      success: false,
      message: 'Invalid action specified.',
    }, 400);
  } catch (globalError) {
    console.error('Unhandled error in paystack-handler:', globalError);
    return res.json({
      success: false,
      message: 'Internal server error: ' + (globalError.message || 'Unknown error'),
      error: globalError.toString(),
    }, 500);
  }
};
