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
      console.error('No authorization header provided');
      return Response.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Extract user ID from Authorization header (Bearer token)
    const token = authHeader.replace('Bearer ', '');
    
    let user;
    try {
      const { data: { user: authUser }, error: userError } = await supabaseAdmin.auth.getUser(token);
      
      if (userError) {
        console.error('Auth error:', userError);
        return Response.json(
          { error: 'Failed to authenticate user: ' + userError.message },
          { status: 401 }
        );
      }
      
      if (!authUser) {
        console.error('No user found from token');
        return Response.json(
          { error: 'User not found' },
          { status: 401 }
        );
      }
      
      user = authUser;
    } catch (authError) {
      console.error('Exception during auth:', authError);
      return Response.json(
        { error: 'Authentication failed: ' + (authError as Error).message },
        { status: 401 }
      );
    }

    // Create share link
    let result;
    try {
      result = await createShareLink(skillId, user.id, expiresInDays);
    } catch (linkError: any) {
      console.error('Error creating share link:', linkError);
      
      // Check if it's a table not found error
      if (linkError?.code === 'PGRST205' || linkError?.message?.includes('share_links')) {
        return Response.json(
          { error: 'Share links table not found. Please run the database migration.' },
          { status: 500 }
        );
      }
      
      return Response.json(
        { error: 'Failed to create share link: ' + (linkError?.message || (linkError as Error).message) },
        { status: 500 }
      );
    }

    if (!result) {
      console.error('Share link creation returned null');
      return Response.json(
        { error: 'Failed to create share link (null result)' },
        { status: 500 }
      );
    }

    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in generate-share-link route:', error);
    return Response.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
