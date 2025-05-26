// In your Vercel API endpoint (/api/generate)
const midtransClient = require('midtrans-client');

module.exports = async (req, res) => {
  // Set CORS headers for ALL responses (including 204)
  res.setHeader('Access-Control-Allow-Origin', 'https://ideentitas.id'); // Exact domain
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Required for credentials: include

  // Handle OPTIONS (preflight) requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Must return 200 for OPTIONS
  }

  // Your existing logic...
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    const transaction = await snap.createTransaction(req.body);
    
    // Ensure you return proper CORS headers even for 204
    if (!transaction.token) {
      return res.status(204).setHeader('Content-Length', '0').end();
    }
    
    res.status(200).json({ token: transaction.token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};