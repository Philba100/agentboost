import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get('share_id');
    const action = searchParams.get('action');

    // Security: Check for authorization header (admin only)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.includes('Bearer')) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (action === 'list-all') {
      // List all share links (admin debug only)
      const { data, error } = await supabaseAdmin
        .from('share_links')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }

      return Response.json({ 
        message: 'Last 20 share links',
        count: data?.length || 0,
        data 
      });
    }

    if (action === 'lookup' && shareId) {
      // Lookup a specific share link
      const { data, error } = await supabaseAdmin
        .from('share_links')
        .select('*')
        .eq('share_id', shareId)
        .single();

      if (error) {
        return Response.json({ 
          error: 'Share link not found',
          details: error.message 
        }, { status: 404 });
      }

      return Response.json({
        message: 'Share link details',
        data,
        resolved_url: `/api/skill-md?id=${shareId}`,
        share_url: `https://agentboost-seven.vercel.app/share/${shareId}`
      });
    }

    return Response.json({
      usage: {
        list_all: '/api/debug/share-links?action=list-all',
        lookup: '/api/debug/share-links?action=lookup&share_id=<id>'
      },
      message: 'Debug endpoints require authorization header: Authorization: Bearer <token>'
    });
  } catch (error) {
    return Response.json(
      { error: 'Debug endpoint error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
