# Paystack Payment Integration Setup Guide

This guide will help you set up Paystack payment integration for your Ohayonet Pharmacy website.

## Prerequisites

1. A Paystack account (sign up at https://paystack.com)
2. A Netlify account for deployment
3. Neon database connected via Netlify extension

## Step 1: Get Your Paystack API Keys

1. Log in to your Paystack Dashboard: https://dashboard.paystack.com
2. Navigate to Settings > API Keys & Webhooks
3. Copy your **Public Key** (starts with `pk_test_` or `pk_live_`)
4. Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)

**Important**: Never share or commit your Secret Key to version control!

## Step 2: Set Up Environment Variables

### For Local Development

1. Create a `.env` file in the project root (copy from `.env.example`)
2. Add your keys:
   ```
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
   PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
   DATABASE_URL=your_neon_database_url
   ```

### For Netlify Deployment

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Environment variables
3. Add the following environment variables:
   - `VITE_PAYSTACK_PUBLIC_KEY` = your Paystack public key
   - `PAYSTACK_SECRET_KEY` = your Paystack secret key
   - `DATABASE_URL` = automatically provided by Neon extension

## Step 3: Database Setup

The transactions table has been automatically created with the following schema:

```sql
transactions (
  id uuid PRIMARY KEY,
  reference text UNIQUE NOT NULL,
  email text NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  verified_at timestamptz DEFAULT now()
)
```

This table stores all successful payment transactions for record-keeping and verification.

## Step 4: Deploy to Netlify

1. Connect your repository to Netlify
2. Set up the Neon database extension in Netlify
3. Add your environment variables as described in Step 2
4. Deploy your site

## How It Works

### Frontend Flow

1. User clicks the "Buy" button on any product
2. Paystack Inline popup opens with payment form
3. User enters card details and completes payment
4. On success, the frontend sends the transaction reference to your backend

### Backend Flow

1. Netlify Function receives the transaction reference
2. Function verifies the transaction with Paystack API using your secret key
3. If verified, the transaction is saved to your Neon database
4. Response is sent back to the frontend

### Security Features

- Secret key is never exposed to the frontend
- All payment verification happens server-side
- Database transactions are protected with Row Level Security
- Payment references are unique to prevent duplicate entries

## Testing Payments

Paystack provides test cards for development:

- **Successful transaction**: 4084084084084081
- **Insufficient funds**: 5060666666666666666
- **Invalid PIN**: 507850785078507812

Use any:
- CVV: 123
- Expiry: Any future date
- PIN: 1234

## Troubleshooting

### Payment popup doesn't open
- Check that Paystack script is loaded in index.html
- Verify VITE_PAYSTACK_PUBLIC_KEY is set correctly
- Check browser console for errors

### Payment verification fails
- Ensure PAYSTACK_SECRET_KEY is set in Netlify environment variables
- Check that DATABASE_URL is properly configured
- Review Netlify Function logs for errors

### Transactions not saving to database
- Verify Neon database is connected and accessible
- Check database connection string in environment variables
- Review transaction table permissions and RLS policies

## Support

For Paystack-specific issues, contact Paystack support: support@paystack.com
For technical integration help, refer to Paystack documentation: https://paystack.com/docs

## Security Notes

- Always use test keys (`pk_test_` and `sk_test_`) during development
- Switch to live keys (`pk_live_` and `sk_live_`) only when ready for production
- Never commit API keys to version control
- Use environment variables for all sensitive configuration
- Regularly rotate your API keys for security
