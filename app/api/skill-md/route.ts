import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'missing id' }, { status: 400 });
    }

    let skillId = id;

    // Check if this looks like a share_id (UUID-like: 8-4-4-4-12 alphanumeric, exactly 36 chars)
    if (id.length === 36 && /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/.test(id)) {
      try {
        const { data, error } = await supabaseAdmin
          .from('share_links')
          .select('skill_id, expires_at, view_count')
          .eq('share_id', id)
          .single();

        if (!error && data) {
          // Check expiration
          if (data.expires_at) {
            const expiresAt = new Date(data.expires_at);
            if (expiresAt < new Date()) {
              return NextResponse.json({ error: 'share_link_expired' }, { status: 410 });
            }
          }
          skillId = data.skill_id;
          
          // Increment view count asynchronously (fire and forget)
          (async () => {
            try {
              await supabaseAdmin
                .from('share_links')
                .update({ view_count: (data.view_count || 0) + 1 })
                .eq('share_id', id);
            } catch {
              // Silent fail
            }
          })();
        }
      } catch (err) {
        console.error('[skill-md] Share link lookup error:', err);
        // Continue with skillId as regular ID
      }
    }

    // Construct path - ensure we're reading from the 'skills' directory
    const mdPath = path.join(process.cwd(), 'skills', skillId, 'SKILL.md');
    
    // Try to read the file
    const content = await fs.promises.readFile(mdPath, 'utf8');
    return NextResponse.json({ content });
    
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[skill-md] Error:', errorMsg);
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
}
