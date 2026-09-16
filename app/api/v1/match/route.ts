import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import OpenAI from 'openai';

/**
 * SEMANTIC ROUTER ENGINE
 * Matches user intent to the most relevant AgentBoost skills using vector similarity.
 */
export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    // 1. AUTHENTICATION: Extract and Validate API Key
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer sk_')) {
      return NextResponse.json({ error: 'Missing or malformed API Key' }, { status: 401 });
    }

    const apiKey = authHeader.replace('Bearer ', '');

    // Query Supabase for the owner of this API key
    const { data: keyData, error: keyError } = await supabaseAdmin
      .from('api_keys')
      .select('user_id')
      .eq('key_secret', apiKey)
      .single();

    if (keyError || !keyData) {
      return NextResponse.json({ error: 'Invalid API Key' }, { status: 401 });
    }

    // 2. PARSE REQUEST
    const { query, match_threshold = 0.5, match_count = 5 } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    // 3. GENERATE EMBEDDING
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query.replace(/\n/g, ' '),
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // 4. SEMANTIC SEARCH (RPC Call)
    const { data: matches, error: matchError } = await supabaseAdmin.rpc('match_skills', {
      query_embedding: queryEmbedding,
      match_threshold: match_threshold,
      match_count: match_count,
    });

    if (matchError) {
      console.error('Supabase RPC Error:', matchError);
      return NextResponse.json({ error: 'Failed to search skills' }, { status: 500 });
    }

    // 5. LOG SUCCESS AND RETURN
    console.log(`Semantic match for query: "${query}" - Found ${matches?.length || 0} matches`);

    return NextResponse.json({
      success: true,
      query,
      matches: matches || []
    });

  } catch (err: any) {
    console.error("Semantic Router Error:", err);
    return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
  }
}
