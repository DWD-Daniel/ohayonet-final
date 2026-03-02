const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // 1. Destructure the new address and phone fields from the frontend
    const { reference, email, full_name, address, phone } = JSON.parse(event.body);

    // 2. Updated Validation
    if (!reference || !email || !full_name || !address || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required details (reference, email, full name, address, or phone)' }),
      };
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
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
        body: JSON.stringify({ error: 'Payment was not successful' }),
      };
    }

    const { amount, status } = paystackData.data;
    const sql = neon(process.env.DATABASE_URL);

    // 3. Insert including the new columns
    await sql`
  INSERT INTO transactions (reference, email, amount, status, full_name, delivery_address, phone_number)
  VALUES (${reference}, ${email}, ${amount}, ${status}, ${full_name}, ${address}, ${phone})
`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Payment verified and delivery info recorded successfully'
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