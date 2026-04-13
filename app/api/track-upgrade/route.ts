export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Minimal server-side tracking - write to server logs for now
    // In production, forward to analytics backend or database
    // @ts-ignore
    console.log('[track-upgrade]', JSON.stringify(body));
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    // @ts-ignore
    console.error('track-upgrade error', err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
