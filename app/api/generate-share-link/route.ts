import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createShareLink } from '@/lib/shareLinks';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { skillId, expiresInDays } = body;

    if (!skillId) {
      return Response.json(
        { error: 'Skill ID is required' },
        { status: 400 }
      );
    }

    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return Response.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Extract user ID from Authorization header (Bearer token)
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return Response.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Create share link
    const result = await createShareLink(skillId, user.id, expiresInDays);

    if (!result) {
      return Response.json(
        { error: 'Failed to create share link' },
        { status: 500 }
      );
    }

    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating share link:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
