const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  // 1. Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { reference, email } = JSON.parse(event.body);

    if (!reference || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing reference or email' }),
      };
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY is missing in Netlify environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    // 2. Verify with Paystack
    const verifyUrl = `https://api.paystack.co/transaction/verify/${reference}`;
    const verifyResponse = await fetch(verifyUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json'
      }
    });

    const paystackData = await verifyResponse.json();

    if (!verifyResponse.ok || paystackData.data.status !== 'success') {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Payment was not successful', 
          status: paystackData.data?.status 
        }),
      };
    }

    const { amount, status } = paystackData.data;

    // 3. Connect to Neon Database
    const sql = neon(process.env.DATABASE_URL);

    // Check if reference already exists to prevent duplicate entries
    const existing = await sql`SELECT id FROM transactions WHERE reference = ${reference}`;
    
    if (existing.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Already recorded' }),
      };
    }

    // 4. Insert into database
    await sql`
      INSERT INTO transactions (reference, email, amount, status)
      VALUES (${reference}, ${email}, ${amount}, ${status})
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Payment verified and recorded successfully'
      }),
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};