import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { reference, email } = await req.json();

    if (!reference || !email) {
      return new Response(JSON.stringify({ error: 'Missing reference or email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY is not configured');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const verifyUrl = `https://api.paystack.co/transaction/verify/${reference}`;
    const verifyResponse = await fetch(verifyUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      console.error('Paystack verification failed:', errorData);
      return new Response(JSON.stringify({
        error: 'Payment verification failed',
        details: errorData.message
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const verificationData = await verifyResponse.json();

    if (!verificationData.status || !verificationData.data) {
      return new Response(JSON.stringify({ error: 'Invalid response from payment gateway' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { status, amount, customer } = verificationData.data;

    if (status !== 'success') {
      return new Response(JSON.stringify({
        error: 'Payment was not successful',
        status: status
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sql = neon(process.env.DATABASE_URL);

    const existingTransaction = await sql`
      SELECT id FROM transactions WHERE reference = ${reference}
    `;

    if (existingTransaction.length > 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Transaction already recorded',
        transaction: existingTransaction[0]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await sql`
      INSERT INTO transactions (reference, email, amount, status)
      VALUES (${reference}, ${email}, ${amount}, ${status})
      RETURNING id, reference, email, amount, status, created_at
    `;

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment verified and recorded successfully',
      transaction: result[0]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing payment verification:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/verify-payment"
};
