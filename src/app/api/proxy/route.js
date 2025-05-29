// For Next.js 13+ App Router (/app/api/proxy/route.js)
export async function POST(request) {
  const { data } = await request.json();
  
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbzYP01sjtPp5SlZazfgGoUhbIHICi-4xr8-nUMlylnWuXDCj0IE84yaqBBwfnojeq9v/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  }
}