// api/create-order.js
// Vercel Serverless Function — creates a Razorpay order
// KEY_SECRET never leaves this file and never reaches the frontend

const https = require('https');

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const KEY_ID     = process.env.RAZORPAY_KEY_ID;
  const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

  if (!KEY_ID || !KEY_SECRET) {
    return res.status(500).json({ error: 'Razorpay credentials not configured' });
  }

  const { amount, currency = 'INR' } = req.body;

  // Validate amount (minimum 100 paise = ₹1)
  if (!amount || amount < 100) {
    return res.status(400).json({ error: 'Amount must be at least 100 paise' });
  }

  const orderData = JSON.stringify({
    amount,                          // in paise e.g. 466700 = ₹4,667
    currency,
    receipt: 'cloudlens_pro_' + Date.now(),
  });

  // Call Razorpay API with Basic Auth (KEY_ID:KEY_SECRET)
  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');

  try {
    const order = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.razorpay.com',
        path: '/v1/orders',
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(orderData),
        },
      };

      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (response.statusCode === 200) resolve(parsed);
            else reject(new Error(parsed.error?.description || 'Razorpay API error'));
          } catch (e) {
            reject(new Error('Invalid response from Razorpay'));
          }
        });
      });

      request.on('error', reject);
      request.write(orderData);
      request.end();
    });

    // Return order details to frontend (never return KEY_SECRET)
    return res.status(200).json({
      order_id: order.id,
      amount:   order.amount,
      currency: order.currency,
      key_id:   KEY_ID,           // KEY_ID is safe to send to frontend
    });

  } catch (err) {
    console.error('Create order error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
