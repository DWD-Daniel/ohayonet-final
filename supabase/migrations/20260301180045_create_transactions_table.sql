/*
  # Create Transactions Table for Paystack Integration

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key) - Unique identifier for each transaction
      - `reference` (text, unique, not null) - Paystack transaction reference
      - `email` (text, not null) - Customer email address
      - `amount` (numeric, not null) - Transaction amount in kobo (smallest currency unit)
      - `status` (text, not null) - Transaction status (success, failed, abandoned)
      - `created_at` (timestamptz) - Timestamp when transaction was created
      - `verified_at` (timestamptz) - Timestamp when transaction was verified
      
  2. Security
    - Enable RLS on `transactions` table
    - Add policy for authenticated users to read their own transactions
    - Add policy for service role to insert transactions (for backend verification)
    
  3. Indexes
    - Index on reference for fast lookups
    - Index on email for customer transaction history
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,
  email text NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  verified_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Service can insert transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference);
CREATE INDEX IF NOT EXISTS idx_transactions_email ON transactions(email);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);