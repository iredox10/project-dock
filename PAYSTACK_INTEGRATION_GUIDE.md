# Paystack Integration Guide

## Overview
Project Dock now supports Paystack alongside OPay, enabling students to pay with Nigerian bank cards, bank transfers, USSD, and microfinance banks such as OPay, Kuda, Moniepoint, and PalmPay. This document covers the configuration steps required to go live.

## 1. Collect Paystack Credentials
1. Sign in to the [Paystack Dashboard](https://dashboard.paystack.com/).
2. Navigate to **Settings → API Keys & Webhooks**.
3. Copy your **Public Key** (`pk_test_...` or `pk_live_...`).
4. Copy your **Secret Key** (`sk_test_...` or `sk_live_...`).

## 2. Update Environment Variables
Add the new keys and Appwrite function IDs to `.env` (or `.env.local`):

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
VITE_APPWRITE_PAYSTACK_FUNCTION_ID=paystack-handler
```

- Keep `VITE_APPWRITE_PAYSTACK_FUNCTION_ID` in sync with the function ID shown in the Appwrite console.

## 3. Configure the Appwrite Function
A secure serverless function called `paystack-handler` lives in `functions/paystack-handler`.

1. Deploy the function via the Appwrite CLI or console.
2. In **Functions → paystack-handler → Settings → Variables**, set:
   - `PAYSTACK_SECRET_KEY`
   - `PAYSTACK_PUBLIC_KEY` (optional, used for logging)
   - `PAYSTACK_BASE_URL` (`https://api.paystack.co`)
3. After deployment, copy the function's **ID** from the Appwrite console (not the name/slug) and place it in `VITE_APPWRITE_PAYSTACK_FUNCTION_ID`.
4. Re-deploy the function after editing variables.

## 4. Verify Supported Channels
The frontend launches Paystack Inline Checkout with the following channel options:

- **Cards & Major Banks**: `card`, `bank`, `bank_transfer`, `ussd`
- **Microfinance Banks**: `bank_transfer`, `bank`

Microfinance customers choose their preferred bank (e.g., OPay, Kuda, Moniepoint, PalmPay) before checkout, ensuring they see relevant transfer instructions inside Paystack.

## 5. Test the Flow
1. Use Paystack test cards for the "Cards & Major Banks" option.
2. Use Paystack's sandbox bank transfer details for the microfinance flow.
3. Confirm that the app redirects to `/payment/verify` and then to the download page after success.
4. Check the `orders` collection to ensure the transaction was recorded.

## 6. Going Live
- Swap test keys for live keys.
- Disable `VITE_OPAY_DEMO_MODE` (Paystack now relies on real test/live keys only).
- Monitor Paystack Dashboard analytics and Appwrite logs for early transactions.

## Troubleshooting
| Issue | Resolution |
|-------|------------|
| *"Paystack is not configured" message* | Ensure `VITE_PAYSTACK_PUBLIC_KEY` and `VITE_APPWRITE_PAYSTACK_FUNCTION_ID` are set, and the function variables contain your secret key. |
| App reports payment failure but Paystack shows success | Confirm the Appwrite function has the correct secret key and re-deploy. Double-check network logs for function errors. |
| Bank transfer option missing in checkout | Ensure the microfinance channel uses `['bank_transfer','bank']`; live accounts must have bank transfer enabled in Paystack. |

With Paystack enabled, students can now pay with cards, USSD, major banks, and leading Nigerian microfinance institutions without leaving Project Dock. Enjoy the flexibility! ✅
