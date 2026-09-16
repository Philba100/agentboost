import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = 'ping', targetUrl, messages, model } = body;

    // Note, this is not defaut ip. its for testing only
    const base = (targetUrl || 'http://127.0.0.1:1234').replace(/\/+$/, '');
    const v1Url = base.endsWith('/v1') ? base : `${base}/v1`;

    // 1. PING ACTION
    if (action === 'ping') {
      try {
        const res = await fetch(`${v1Url}/models`, {
          method: 'GET',
          signal: AbortSignal.timeout(3500)
        });

        if (res.ok) {
          const json = await res.json();
          const loadedModel = json?.data?.[0]?.id || 'Gemma 4 Loaded';
          return NextResponse.json({
            online: true,
            model: loadedModel,
            modelsList: json?.data || []
          });
        }
      } catch (err: any) {
        return NextResponse.json({ online: false, error: err.message }, { status: 200 });
      }
      return NextResponse.json({ online: false }, { status: 200 });
    }

    // 2. CHAT INFERENCE ACTION
    if (action === 'chat') {
      const chatRes = await fetch(`${v1Url}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model || 'google/gemma-4-e2b',
          messages: messages || [],
          temperature: 0.2,
          max_tokens: 800
        }),
        signal: AbortSignal.timeout(30000)
      });

      if (!chatRes.ok) {
        const errorText = await chatRes.text();
        return NextResponse.json({ error: errorText }, { status: chatRes.status });
      }

      const chatJson = await chatRes.json();
      return NextResponse.json(chatJson);
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Bridge failure' }, { status: 500 });
  }
}