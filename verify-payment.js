// api/verify-payment.js
// Vercel Serverless Function — verifies Razorpay payment signature
// This prevents fake/tampered payment confirmations

const crypto = require('crypto');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Validate all fields are present
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required payment fields' });
  }

  const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

  if (!KEY_SECRET) {
    return res.status(500).json({ error: 'Razorpay secret not configured' });
  }

  // HMAC-SHA256 verification
  // Razorpay signs: order_id + "|" + payment_id with your KEY_SECRET
  const body      = razorpay_order_id + '|' + razorpay_payment_id;
  const generated = crypto
    .createHmac('sha256', KEY_SECRET)
    .update(body)
    .digest('hex');

  if (generated !== razorpay_signature) {
    // Signatures don't match — possible fraud attempt
    console.warn('Signature mismatch:', { razorpay_order_id, razorpay_payment_id });
    return res.status(400).json({ error: 'Payment verification failed — signature mismatch' });
  }

  // Signatures match — payment is genuine
  console.log('Payment verified:', razorpay_payment_id);

  return res.status(200).json({
    success: true,
    payment_id: razorpay_payment_id,
    message: 'Payment verified successfully',
  });
}
