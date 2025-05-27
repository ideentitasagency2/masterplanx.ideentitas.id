import midtransClient from "midtrans-client";

export async function OPTIONS(request) {
  const origin = request.headers.get("origin");
  const allowedOrigins = [
    'https://ideentitas.id',
    'https://www.ideentitas.id',
    'https://masterplanx.ideentitas.id'
  ];

  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin'
  };

  if (allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return new Response(null, { status: 200, headers });
}

export async function POST(request) {
  const origin = request.headers.get("origin");
  const allowedOrigins = [
    'https://ideentitas.id',
    'https://www.ideentitas.id',
    'https://masterplanx.ideentitas.id'
  ];

  const headers = {
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin'
  };

  if (allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  try {
    const body = await request.json();

    const snap = new midtransClient.Snap({
      isProduction: process.env.NODE_ENV === 'production',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    const transaction = await snap.createTransaction(body);

    if (!transaction.token) {
      return new Response(null, { status: 204, headers });
    }

    return new Response(JSON.stringify({ token: transaction.token }), {
      status: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      }
    });
  }
}
