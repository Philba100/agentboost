import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

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

    // Look up the share link in database
    const { data: shareLink, error: shareError } = await supabaseAdmin
      .from('share_links')
      .select('skill_id, user_id, created_at')
      .eq('share_id', slug)
      .single();

    if (shareError || !shareLink) {
      return Response.json(
        { error: 'Share link not found or has expired' },
        { status: 404 }
      );
    }

    // Redirect to the skill page with the share ID in the URL
    // This allows us to track the view and maintain the share context
    const redirectUrl = new URL(request.url);
    redirectUrl.pathname = `/share/${slug}/view`;

    return Response.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('Share link error:', error);
    return Response.json(
      { error: 'Failed to process share link' },
      { status: 500 }
    );
  }
}
