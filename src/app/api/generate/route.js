const midtransClient = require('midtrans-client');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://masterplanx.ideentitas.id');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify the request origin if needed
    const allowedOrigins = ['https://masterplanx.ideentitas.id'];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Initialize Midtrans
    const snap = new midtransClient.Snap({
      isProduction: process.env.NODE_ENV === 'production',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    // Create transaction
    const transaction = await snap.createTransaction(req.body);
    
    // Successful response
    res.status(200).json({ 
      token: transaction.token,
      redirect_url: transaction.redirect_url 
    });
    
  } catch (error) {
    console.error('Midtrans error:', error);
    res.status(500).json({ 
      error: error.message,
      fullError: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};