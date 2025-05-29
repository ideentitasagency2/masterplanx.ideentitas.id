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
    const response = await fetch('https://script.google.com/macros/s/AKfycbwNx077Cb8gxRP5Z-c8-U4Iy07zPyKICGsCQpgC4yu8fzrCmb0EKvabl65-QWQEPBU/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const raw = await response.text();
    console.log('Raw response from Google Apps Script:', raw);

    let result;
    try {
      result = JSON.parse(raw);
    } catch (err) {
      console.error('Failed to parse response JSON:', err);
      return new Response(JSON.stringify({ error: 'Invalid JSON from Google Apps Script' }), {
        status: 502,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
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
