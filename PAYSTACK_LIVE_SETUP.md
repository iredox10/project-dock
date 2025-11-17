# Paystack Live Integration Setup Guide

## Step 1: Get Your Paystack Keys

### For Testing (Recommended First):
1. Go to https://dashboard.paystack.com/signup
2. Complete your account setup
3. Navigate to Settings → API Keys & Webhooks
4. Copy your **Test Public Key** (starts with `pk_test_...`)

### For Live Production:
1. Complete Paystack business verification
2. Submit required documents (Business registration, ID, etc.)
3. Wait for approval (usually 1-3 business days)
4. Get your **Live Public Key** (starts with `pk_live_...`)

## Step 2: Update Environment Variables

Edit your `.env` file and update these values:

```env
# Paystack Configuration
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_actual_key_here
```

For production/live:
```env
VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_actual_key_here
```

## Step 3: Test Cards (Test Mode Only)

When using `pk_test_...`, use these test cards:

### Successful Payment:
- **Card Number:** 4084 0840 8408 4081
- **CVV:** 408
- **Expiry:** Any future date (e.g., 12/25)
- **PIN:** 0000
- **OTP:** 123456

### Failed Payment (for testing):
- **Card Number:** 5060 6666 6666 6666 4000
- **CVV:** 123
- **Expiry:** Any future date

### Testing OPay/Bank Transfer:
- Select "Bank Transfer" or "Bank" option in Paystack popup
- Choose your preferred bank (OPay, Kuda, etc.)
- Follow the test payment flow

## Step 4: Backend Function Setup (Optional)

For payment verification, you can deploy an Appwrite function:

1. Create a new function in Appwrite Console
2. Copy the function ID
3. Add to `.env`:
```env
VITE_APPWRITE_PAYSTACK_FUNCTION_ID=your_function_id_here
```

**Note:** For now, the app uses client-side verification which works for testing.
For production, implement server-side verification for security.

## Step 5: Verify Integration

1. Restart your development server
2. Try making a test payment
3. You should see the Paystack payment popup
4. Use test card details to complete payment
5. Verify the order is created in your database

## Going Live Checklist

- [ ] Business verified on Paystack
- [ ] Live API keys obtained
- [ ] Updated `.env` with `pk_live_...` key
- [ ] Tested payment flow thoroughly
- [ ] Implemented webhook for payment notifications (recommended)
- [ ] Set up server-side verification
- [ ] Updated bank account for settlements
- [ ] Tested on production/staging environment

## Important Notes

1. **Test Mode:** Free to use, no real money charged
2. **Live Mode:** Real transactions, real money
3. **Fees:** Paystack charges 1.5% + ₦100 per transaction in Nigeria
4. **Settlement:** Funds are settled to your bank account (T+1 or T+2)
5. **Security:** Never expose your Secret Key in frontend code

## Need Help?

- Paystack Docs: https://paystack.com/docs/
- Support: support@paystack.com
- Integration Guide: Check `PAYSTACK_INTEGRATION_GUIDE.md` in this project
