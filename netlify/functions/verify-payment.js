const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    // Only parse the financial fields
    const { reference, email } = JSON.parse(event.body);

    if (!reference || !email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing reference or email' }) };
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    const verifyUrl = `https://api.paystack.co/transaction/verify/${reference}`;
    
    const verifyResponse = await fetch(verifyUrl, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${paystackSecretKey}`, 'Content-Type': 'application/json' }
    });

    const paystackData = await verifyResponse.json();

    if (!verifyResponse.ok || paystackData.data.status !== 'success') {
      return { statusCode: 400, body: JSON.stringify({ error: 'Payment failed' }) };
    }

    const { amount, status } = paystackData.data;
    const sql = neon(process.env.DATABASE_URL);

    // This INSERT matches your exact existing database schema
    await sql`
      INSERT INTO transactions (reference, email, amount, status)
      VALUES (${reference}, ${email}, ${amount}, ${status})
    `;

    return { statusCode: 200, body: JSON.stringify({ success: true, message: 'Recorded' }) };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};