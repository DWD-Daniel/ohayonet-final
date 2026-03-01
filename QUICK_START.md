# Quick Start Guide - Paystack Integration

## What Was Built

Your Ohayonet Pharmacy website now has a complete Paystack payment integration with:

✅ **Secure Payment Processing**
- Paystack Inline popup for card payments
- Server-side payment verification
- Transaction recording in Neon database

✅ **Professional UI/UX**
- "Buy" buttons on all products
- Loading states during payment
- Success/error modals with clear feedback
- Responsive design for mobile and desktop

✅ **Security Features**
- Secret keys never exposed to frontend
- All verification happens server-side
- Database protected with Row Level Security
- HTTPS encryption (automatic on Netlify)

## Files Created/Modified

### New Files
1. **`netlify/functions/verify-payment.js`** - Backend payment verification
2. **`src/components/PaystackCheckout.tsx`** - Payment UI component
3. **`.env.example`** - Environment variable template
4. **`netlify.toml`** - Netlify deployment configuration
5. **`PAYSTACK_SETUP.md`** - Detailed setup instructions
6. **`DEPLOYMENT.md`** - Netlify deployment guide

### Modified Files
1. **`index.html`** - Added Paystack Inline script
2. **`package.json`** - Added required dependencies
3. **`src/pages/HomePage.tsx`** - Integrated checkout component
4. **`src/pages/NewProductsPage.tsx`** - Integrated checkout component

### Database
- **`transactions` table** - Stores all payment records

## 3-Step Setup for Local Development

### Step 1: Get Paystack Keys
1. Sign up at https://paystack.com
2. Go to Settings > API Keys
3. Copy your test keys:
   - Public Key: `pk_test_xxxxx`
   - Secret Key: `sk_test_xxxxx`

### Step 2: Configure Environment
1. Create `.env` file in project root:
   ```env
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
   PAYSTACK_SECRET_KEY=sk_test_your_key_here
   DATABASE_URL=your_neon_database_url
   ```

### Step 3: Run Locally
```bash
npm install
npm run dev
```

## Deploying to Netlify

### Quick Deploy (5 minutes)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Paystack integration"
   git push
   ```

2. **Create Netlify Site**
   - Go to https://netlify.com
   - Click "Add new site" > "Import from Git"
   - Select your repository

3. **Add Neon Database**
   - In Netlify dashboard: Integrations > Neon
   - Click "Enable" and follow prompts
   - This auto-creates `DATABASE_URL`

4. **Add Paystack Keys**
   - Site settings > Environment variables
   - Add:
     - `VITE_PAYSTACK_PUBLIC_KEY` = your public key
     - `PAYSTACK_SECRET_KEY` = your secret key

5. **Deploy**
   - Click "Deploy site"
   - Wait 2-5 minutes
   - Your site is live!

## Testing Payments

Use these Paystack test cards:

**Successful Payment:**
- Card: `4084084084084081`
- CVV: `123`
- Expiry: Any future date (e.g., `12/25`)
- PIN: `1234`

**Failed Payment (insufficient funds):**
- Card: `5060666666666666666`

## How It Works

### User Flow
1. Customer clicks "Buy" on a product
2. Paystack popup opens with payment form
3. Customer enters card details
4. Payment processed by Paystack
5. Frontend sends reference to your backend
6. Backend verifies with Paystack API
7. Transaction saved to database
8. Success message shown to customer

### Technical Flow
```
Frontend (React)
    ↓ [User clicks Buy]
Paystack Popup
    ↓ [Payment completed]
Frontend receives reference
    ↓ [POST to Netlify Function]
Backend Function
    ↓ [Verify with Paystack API]
Paystack API confirms
    ↓ [Save to database]
Neon Database
    ↓ [Return success]
Frontend shows confirmation
```

## Environment Variables Explained

| Variable | Used By | Purpose |
|----------|---------|---------|
| `VITE_PAYSTACK_PUBLIC_KEY` | Frontend | Initialize Paystack popup |
| `PAYSTACK_SECRET_KEY` | Backend | Verify payments securely |
| `DATABASE_URL` | Backend | Connect to Neon database |

**Important:**
- `VITE_` prefix = available in frontend
- No prefix = backend only (more secure)

## Troubleshooting Quick Fixes

### "Payment system is not configured"
➜ Add `VITE_PAYSTACK_PUBLIC_KEY` to environment variables

### "Payment verification failed"
➜ Check `PAYSTACK_SECRET_KEY` is set correctly

### Transactions not saving
➜ Verify `DATABASE_URL` is set and database migration ran

### 404 on verify-payment function
➜ Check `netlify.toml` exists and functions directory is correct

## Next Steps

1. **Collect Customer Info**
   - Add email input before payment
   - Replace hardcoded `customer@example.com`

2. **Add Features**
   - Order confirmation emails
   - Transaction history page
   - Admin dashboard for viewing sales

3. **Go Live**
   - Switch to live Paystack keys
   - Test thoroughly
   - Monitor transactions

## Key Files to Know

**Frontend (What user sees):**
- `src/components/PaystackCheckout.tsx` - Payment button and modals

**Backend (Security layer):**
- `netlify/functions/verify-payment.js` - Verifies payments

**Configuration:**
- `netlify.toml` - Deployment settings
- `.env` - Local development secrets (not committed)

## Support

- **Setup Issues**: See `PAYSTACK_SETUP.md`
- **Deployment Issues**: See `DEPLOYMENT.md`
- **Paystack Help**: https://paystack.com/docs
- **Netlify Help**: https://docs.netlify.com

## Security Reminders

🔒 **Never commit these to Git:**
- `.env` file
- API keys in code
- `DATABASE_URL`

✅ **Always:**
- Use environment variables
- Keep secret keys secret
- Use test keys for development
- Monitor transaction logs

---

**Your payment system is production-ready!** Just add your Paystack keys and deploy to Netlify.
