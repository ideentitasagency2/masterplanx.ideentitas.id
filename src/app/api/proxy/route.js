export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request) {
  let data;
  try {
    const body = await request.text();
    data = JSON.parse(body);
  } catch (err) {
    console.error('Invalid JSON body:', err);
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbzkcvpGrPrUn-ktteVcmCqeYX72RaMteTprb3NgYQpghuQlkfg6mhMIgWu1vJqzrEk/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const rawText = await response.text();
    console.log('Raw response from Google Apps Script:', rawText);

    return new Response(rawText, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain'
      }
    });
  } catch (error) {
    console.error('Fetch failed:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  }
}
