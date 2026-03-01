# Netlify Deployment Guide for Ohayonet Pharmacy

This guide covers deploying your Paystack-integrated pharmacy website to Netlify with Neon database.

## Prerequisites

1. GitHub/GitLab account with your code repository
2. Netlify account (sign up at https://netlify.com)
3. Paystack account with API keys
4. Basic understanding of environment variables

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your repository contains:
- All source code files
- `netlify.toml` configuration file
- `.env.example` (but NOT `.env` with actual keys)

### 2. Create Netlify Site

1. Log in to Netlify
2. Click "Add new site" > "Import an existing project"
3. Connect to your Git provider (GitHub/GitLab)
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`

### 3. Install Neon Database Extension

1. In your Netlify site dashboard, go to "Integrations"
2. Search for "Neon" in the integration marketplace
3. Click "Enable" on the Neon PostgreSQL integration
4. Follow prompts to create or connect a Neon database
5. The integration automatically adds `DATABASE_URL` to your environment variables

### 4. Run Database Migration

After connecting Neon, you need to create the transactions table:

**Option A: Using Supabase CLI (if available)**
```bash
supabase db push
```

**Option B: Manual SQL Execution**
1. Go to your Neon dashboard
2. Navigate to SQL Editor
3. Run the migration SQL from your migration file

The migration creates:
```sql
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,
  email text NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  verified_at timestamptz DEFAULT now()
);
```

### 5. Configure Environment Variables

In Netlify dashboard, go to Site settings > Environment variables:

Add these variables:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `VITE_PAYSTACK_PUBLIC_KEY` | `pk_test_xxxxx` | Your Paystack public key |
| `PAYSTACK_SECRET_KEY` | `sk_test_xxxxx` | Your Paystack secret key |
| `DATABASE_URL` | (auto-set by Neon) | Database connection string |

**Important Security Notes:**
- NEVER commit actual API keys to your repository
- Use test keys (`pk_test_` and `sk_test_`) during development
- Switch to live keys only when ready for production
- Keep your secret key absolutely confidential

### 6. Deploy

1. Click "Deploy site" in Netlify
2. Wait for the build to complete (usually 2-5 minutes)
3. Check the deploy log for any errors

### 7. Test Your Deployment

Once deployed:

1. Visit your Netlify site URL
2. Browse to any product
3. Click the "Buy" button
4. Use Paystack test card: `4084084084084081`
   - CVV: 123
   - Expiry: Any future date
   - PIN: 1234
5. Complete the payment
6. Verify the success message appears
7. Check your Neon database to confirm the transaction was recorded

## Troubleshooting

### Build Fails

**Issue**: Build command fails
- Check the build log for specific errors
- Verify all dependencies are in `package.json`
- Ensure Node version compatibility

**Issue**: TypeScript errors
- Run `npm run typecheck` locally first
- Fix any type errors before deploying

### Functions Not Working

**Issue**: 404 error on `/.netlify/functions/verify-payment`
- Verify `netlify.toml` exists with correct functions directory
- Check that `netlify/functions/verify-payment.js` exists
- Review function logs in Netlify dashboard

**Issue**: Function errors
- Check Netlify function logs for error details
- Verify all environment variables are set correctly
- Ensure `DATABASE_URL` is accessible from functions

### Payment Issues

**Issue**: Paystack popup doesn't open
- Check browser console for errors
- Verify `VITE_PAYSTACK_PUBLIC_KEY` is set in Netlify
- Confirm Paystack script is loaded in `index.html`

**Issue**: Payment verification fails
- Check `PAYSTACK_SECRET_KEY` is correctly set
- Review function logs for API errors
- Verify Paystack API is accessible from Netlify

**Issue**: Transactions not saving
- Confirm database migration ran successfully
- Check `DATABASE_URL` environment variable
- Review function logs for database errors
- Verify Neon database is accessible

### Environment Variable Issues

**Issue**: Variables not available
- Restart the build after adding variables
- Check variable names match exactly (case-sensitive)
- Ensure `VITE_` prefix for frontend variables

## Monitoring and Maintenance

### Check Function Logs
1. Go to Netlify dashboard
2. Navigate to Functions tab
3. Click on `verify-payment`
4. View real-time logs

### Database Monitoring
1. Log in to Neon dashboard
2. View connection metrics
3. Monitor query performance
4. Check storage usage

### Update Environment Variables
1. Go to Site settings > Environment variables
2. Update values as needed
3. Trigger a new deploy for changes to take effect

## Going Live (Production)

When ready to accept real payments:

1. **Switch to Live Keys**
   - Get live keys from Paystack dashboard
   - Update `VITE_PAYSTACK_PUBLIC_KEY` to `pk_live_xxxxx`
   - Update `PAYSTACK_SECRET_KEY` to `sk_live_xxxxx`

2. **Enable Production Database**
   - Ensure you're using a production-ready Neon database
   - Consider upgrading from free tier if needed

3. **Security Checklist**
   - ✅ All secrets in environment variables (not in code)
   - ✅ HTTPS enabled (automatic on Netlify)
   - ✅ Database RLS policies enabled
   - ✅ Function logs monitored
   - ✅ Error handling in place

4. **Test Thoroughly**
   - Complete end-to-end payment flow
   - Verify database records
   - Check email notifications (if implemented)
   - Test error scenarios

## Support Resources

- **Netlify**: https://docs.netlify.com
- **Neon**: https://neon.tech/docs
- **Paystack**: https://paystack.com/docs
- **Function Logs**: Netlify Dashboard > Functions

## Common Commands

```bash
# Test build locally
npm run build

# Type check
npm run typecheck

# Preview production build
npm run preview

# Install dependencies
npm install
```

## File Structure

```
ohayonet2/project/
├── netlify/
│   └── functions/
│       └── verify-payment.js    # Backend verification
├── src/
│   ├── components/
│   │   └── PaystackCheckout.tsx # Payment UI component
│   └── pages/
├── index.html                   # Includes Paystack script
├── netlify.toml                 # Netlify configuration
├── package.json                 # Dependencies
└── .env.example                 # Template for local dev
```

## Next Steps

After successful deployment:

1. Set up custom domain (optional)
2. Configure webhooks for payment notifications
3. Implement customer email collection
4. Add order tracking functionality
5. Set up analytics and monitoring
6. Configure backup strategies for database

---

**Need Help?** Check the function logs in Netlify dashboard or review the Paystack documentation for API-specific issues.
