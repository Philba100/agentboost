import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

  let skillId = id;

  // Check if this might be a share_id (format: 8-4-4-4-12 alphanumeric)
  // Share IDs have hyphens in a specific pattern and are typically longer
  const shareIdPattern = /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/;
  
  if (shareIdPattern.test(id)) {
    try {
      // Try to resolve as a share_id
      const { data: shareLink, error: shareError } = await supabaseAdmin
        .from('share_links')
        .select('skill_id, expires_at')
        .eq('share_id', id)
        .single();

      if (shareError || !shareLink) {
        return NextResponse.json({ error: 'share_link_not_found' }, { status: 404 });
      }

      // Check if share link has expired
      if (shareLink.expires_at) {
        const expiresAt = new Date(shareLink.expires_at);
        if (expiresAt < new Date()) {
          return NextResponse.json({ error: 'share_link_expired' }, { status: 410 });
        }
      }

      skillId = shareLink.skill_id;
      
      // Increment view count
      try {
        const { data: currentLink } = await supabaseAdmin
          .from('share_links')
          .select('view_count')
          .eq('share_id', id)
          .single();
        
        if (currentLink) {
          await supabaseAdmin
            .from('share_links')
            .update({ view_count: (currentLink.view_count || 0) + 1 })
            .eq('share_id', id);
        }
      } catch {
        // Silently fail if view count update fails
      }
    } catch (err) {
      console.error('Error resolving share_id:', err);
      // Fall through to try as regular skill_id
    }
  }

  const mdPath = path.join(process.cwd(), 'skills', skillId, 'SKILL.md');
  try {
    const content = await fs.promises.readFile(mdPath, 'utf8');
    return NextResponse.json({ content });
  } catch (err) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
}
