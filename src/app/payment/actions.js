'use server';

import midtransClient from 'midtrans-client';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;

export async function submitToBrevo(data) {
  const fullData = {
    ...data,
    listIds: [3],
    updateEnabled: true
  };

  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY
    },
    body: JSON.stringify(fullData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to submit to Brevo");
  }

  return response.json();
}

export async function generateSnapToken(transactionDetails) {
  const snap = new midtransClient.Snap({
    isProduction: process.env.NODE_ENV === 'production',
    serverKey: MIDTRANS_SERVER_KEY,
    clientKey: MIDTRANS_CLIENT_KEY
  });

  const transaction = await snap.createTransaction(transactionDetails);
  return { token: transaction.token };
}