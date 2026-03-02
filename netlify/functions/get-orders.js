const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email is required' }) };
    }

    const sql = neon(process.env.DATABASE_URL);

    const transactions = await sql`
      SELECT id, reference, email, amount, status, created_at
      FROM transactions
      WHERE email = ${email}
      ORDER BY created_at DESC
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ transactions })
    };

  } catch (error) {
    console.error('Error fetching orders:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
