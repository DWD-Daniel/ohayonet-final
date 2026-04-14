const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { reference, email } = JSON.parse(event.body);

    if (!reference || !email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing reference or email' }) };
    }

    // No Paystack verification or Neon insertion — just acknowledge
    return { statusCode: 200, body: JSON.stringify({ success: true, message: 'Request processed' }) };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};