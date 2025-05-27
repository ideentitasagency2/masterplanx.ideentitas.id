const midtransClient = require("midtrans-client");

module.exports = async (req, res) => {
  // CORS headers
  const allowedOrigins = [
    'https://ideentitas.id',
    'https://www.ideentitas.id',
    'https://masterplanx.ideentitas.id'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle unsupported methods
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 🔥 Parse request body
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const body = JSON.parse(Buffer.concat(buffers).toString());

    // Midtrans logic
    const midtransClient = require('midtrans-client');
    const snap = new midtransClient.Snap({
      isProduction: process.env.NODE_ENV === 'production',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    const transaction = await snap.createTransaction(body);

    if (!transaction.token) {
      return res.status(204).end();
    }

    res.status(200).json({ token: transaction.token });

  } catch (error) {
    // ✅ Make sure error responses also include CORS headers
    res.status(500).json({ error: error.message });
  }
};
