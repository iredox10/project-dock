# OPay Payment Integration Guide

## Overview
This guide will help you integrate OPay payment gateway into your Project Dock application, allowing users to purchase and download projects instantly.

## Step 1: Get OPay Merchant Account

1. Visit [OPay Merchant Portal](https://merchant.opayweb.com/)
2. Sign up for a merchant account
3. Complete KYC verification
4. Once approved, you'll receive:
   - Merchant ID
   - Public Key
   - Private Key (Secret Key)

## Step 2: Configure Environment Variables

Add the following to your `.env` file:

```bash
# OPay Payment Configuration
VITE_OPAY_MERCHANT_ID=your_merchant_id_here
VITE_OPAY_PUBLIC_KEY=your_public_key_here
VITE_OPAY_PRIVATE_KEY=your_private_key_here
VITE_OPAY_ENV=sandbox  # Change to 'production' for live
```

**Important**: 
- Start with `sandbox` for testing
- Use test credentials from OPay dashboard
- Switch to `production` only after thorough testing

## Step 3: Test the Integration

### Testing Flow:
1. Navigate to any project detail page
2. Click "Download Now" button
3. You'll be redirected to payment page
4. Select payment method (Inline or Redirect)
5. Complete payment using OPay test credentials
6. Upon success, you'll be redirected to download page

### Test Cards (Sandbox):
OPay provides test card numbers in their merchant dashboard. Common test scenarios:
- **Successful Payment**: Use test cards marked as "success"
- **Failed Payment**: Use test cards marked as "failed"
- **Insufficient Funds**: Use cards marked as "insufficient balance"

## Step 4: Payment Flow

```
User clicks "Download Now"
    ↓
Redirected to Payment Page (/projects/:id/payment)
    ↓
User selects payment method
    ↓
OPay payment initialized
    ↓
User completes payment (Inline modal or redirect)
    ↓
Payment verified via OPay API
    ↓
Order created in Firebase
    ↓
User's purchased projects updated
    ↓
Project download count incremented
    ↓
User redirected to download page
```

## Step 5: Features Implemented

### ✅ Payment Page Features:
- Two payment methods (Inline & Redirect)
- Secure payment processing
- Real-time payment verification
- Order tracking
- Automatic user purchase history update
- Duplicate purchase prevention

### ✅ Security Features:
- User authentication required
- Payment verification before download
- Secure API communication
- Environment-based configuration
- No sensitive data stored

### ✅ User Experience:
- Beautiful, modern UI
- Loading states
- Error handling
- Success feedback
- Instant download after payment

## Step 6: Database Structure

### Orders Collection:
```javascript
{
  userId: "user_uid",
  userEmail: "user@example.com",
  projectId: "project_id",
  projectTitle: "Project Title",
  amount: 5000,
  paymentReference: "PROJ_abc123_1699999999",
  paymentStatus: "completed",
  orderNo: "opay_order_number",
  createdAt: timestamp
}
```

### Users Collection Update:
```javascript
{
  purchasedProjects: ["project_id_1", "project_id_2"]
}
```

## Step 7: Going Live

1. **Complete Testing**:
   - Test successful payments
   - Test failed payments
   - Test duplicate purchases
   - Test payment verification

2. **Switch to Production**:
   ```bash
   VITE_OPAY_ENV=production
   VITE_OPAY_MERCHANT_ID=your_production_merchant_id
   VITE_OPAY_PUBLIC_KEY=your_production_public_key
   VITE_OPAY_PRIVATE_KEY=your_production_private_key
   ```

3. **Update Callback URLs**:
   - Ensure your domain is registered in OPay dashboard
   - Update callback URLs to your production domain

4. **Monitor**:
   - Check Firebase orders collection
   - Monitor OPay dashboard for transactions
   - Set up error logging/monitoring

## Troubleshooting

### Payment Not Initializing:
- Check if OPay credentials are set correctly
- Verify environment variables are loaded (restart dev server)
- Check browser console for errors
- Ensure user is logged in

### Payment Verification Failing:
- Check if payment reference is correct
- Verify API credentials
- Check OPay dashboard for transaction status
- Ensure orderNo is being passed correctly

### User Not Redirected After Payment:
- Check callback URL configuration
- Verify Firebase rules allow writes
- Check browser console for errors

## API Endpoints Used

### Initialize Payment:
```
POST https://sandboxapi.opayweb.com/api/v1/international/cashier/create
POST https://api.opayweb.com/api/v1/international/cashier/create (Production)
```

### Verify Payment:
```
POST https://sandboxapi.opayweb.com/api/v1/international/cashier/status
POST https://api.opayweb.com/api/v1/international/cashier/status (Production)
```

## Security Best Practices

1. **Never expose private keys** in frontend code
2. **Always verify payments** on the server side (consider adding backend verification)
3. **Use HTTPS** in production
4. **Validate amounts** before payment
5. **Log all transactions** for audit trail
6. **Handle errors gracefully** without exposing sensitive info

## Additional Features You Can Add

1. **Email Notifications**: Send receipt after successful payment
2. **Download Limits**: Track number of downloads per purchase
3. **Refund System**: Implement refund handling
4. **Payment History**: Show user's payment history
5. **Invoice Generation**: Auto-generate invoices
6. **Analytics**: Track payment success rates
7. **Backend Verification**: Add server-side payment verification for extra security

## Support

- **OPay Documentation**: https://documentation.opayweb.com/
- **OPay Support**: support@opayweb.com
- **Merchant Dashboard**: https://merchant.opayweb.com/

## Files Created/Modified

### New Files:
- `src/api/opayService.js` - OPay payment service
- `src/pages/PaymentPage.jsx` - Payment page component
- `OPAY_INTEGRATION_GUIDE.md` - This guide

### Modified Files:
- `src/App.jsx` - Added payment route
- `src/pages/ProjectDetailPage.jsx` - Updated download button to link to payment
- `.env.example` - Added OPay configuration variables

---

**Note**: This is a client-side implementation. For production, consider adding a backend service to handle payment verification and webhooks for maximum security.
