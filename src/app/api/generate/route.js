const midtransClient = require("midtrans-client");

const setCorsHeaders = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
};

module.exports = async (req, res) => {
  // Set CORS headers immediately
  setCorsHeaders(res);

  // Handle OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Content-Type", "application/json");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const transaction = await snap.createTransaction(req.body);

    if (!transaction.token) {
      return res.status(204).setHeader("Content-Length", "0").end();
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ token: transaction.token });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: error.message });
  }
};
