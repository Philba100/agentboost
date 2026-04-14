import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Setup endpoint to create share_links table if it doesn't exist
 * This is called once during initial setup
 */
export async function POST(request: Request) {
  try {
    // Get authorization header - must be from admin or authenticated user
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return Response.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Check if table exists by attempting to query it
    const { error: checkError } = await supabaseAdmin
      .from('share_links')
      .select('count', { count: 'exact' })
      .limit(1);

    if (!checkError) {
      return Response.json(
        { message: 'share_links table already exists' },
        { status: 200 }
      );
    }

    // Create the table using raw SQL
    const { error: createError } = await supabaseAdmin.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS share_links (
          share_id VARCHAR(36) PRIMARY KEY,
          skill_id VARCHAR(255) NOT NULL,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP WITH TIME ZONE,
          view_count INTEGER DEFAULT 0,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_share_links_share_id ON share_links(share_id);
        CREATE INDEX IF NOT EXISTS idx_share_links_user_id ON share_links(user_id);
        CREATE INDEX IF NOT EXISTS idx_share_links_skill_id ON share_links(skill_id);
        CREATE INDEX IF NOT EXISTS idx_share_links_created_at ON share_links(created_at DESC);

        ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS share_links_select_public ON share_links;
        CREATE POLICY share_links_select_public ON share_links FOR SELECT USING (true);

        DROP POLICY IF EXISTS share_links_insert_own ON share_links;
        CREATE POLICY share_links_insert_own ON share_links FOR INSERT WITH CHECK (auth.uid() = user_id);

        DROP POLICY IF EXISTS share_links_update_own ON share_links;
        CREATE POLICY share_links_update_own ON share_links FOR UPDATE USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS share_links_delete_own ON share_links;
        CREATE POLICY share_links_delete_own ON share_links FOR DELETE USING (auth.uid() = user_id);

        CREATE OR REPLACE FUNCTION update_share_links_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS share_links_updated_at_trigger ON share_links;
        CREATE TRIGGER share_links_updated_at_trigger
          BEFORE UPDATE ON share_links
          FOR EACH ROW
          EXECUTE FUNCTION update_share_links_updated_at();
      `
    });

    if (createError) {
      console.error('Error creating share_links table:', createError);
      // The RPC function might not exist, so we'll return an error
      return Response.json(
        { 
          error: 'Could not create table. Please run the migration SQL manually in Supabase console.',
          details: createError
        },
        { status: 500 }
      );
    }

    return Response.json(
      { message: 'share_links table created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Setup error:', error);
    return Response.json(
      { error: 'Setup failed: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
