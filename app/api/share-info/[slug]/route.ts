import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    if (!slug) {
      return Response.json(
        { error: 'Share link ID is required' },
        { status: 400 }
      );
    }

    // Look up the share link
    const { data: shareLink, error: shareError } = await supabaseAdmin
      .from('share_links')
      .select('skill_id, user_id, created_at, expires_at, view_count')
      .eq('share_id', slug)
      .single();

    if (shareError || !shareLink) {
      return Response.json(
        { error: 'Share link not found' },
        { status: 404 }
      );
    }

    // Check if share link has expired (if expires_at is set)
    if (shareLink.expires_at) {
      const expiresAt = new Date(shareLink.expires_at);
      if (expiresAt < new Date()) {
        return Response.json(
          { error: 'Share link has expired' },
          { status: 410 } // 410 Gone
        );
      }
    }

    // Increment view count
    await supabaseAdmin
      .from('share_links')
      .update({ view_count: (shareLink.view_count || 0) + 1 })
      .eq('share_id', slug);

    return Response.json({
      skill_id: shareLink.skill_id,
      user_id: shareLink.user_id,
      shared_at: shareLink.created_at,
    });
  } catch (error) {
    console.error('Share info error:', error);
    return Response.json(
      { error: 'Failed to get share information' },
      { status: 500 }
    );
  }
}
