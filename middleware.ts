import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Since Middleware runs on the Edge, we use standard fetch for Supabase 
// to avoid importing heavy Node.js libraries.
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  // 1. Only intercept requests that look like: /share/[share_id]/[filename]
  // We want to ignore the base /share/[share_id] page if users view it in a browser
  const shareFileRegex = /^\/share\/([^/]+)\/(.+)$/;
  const match = url.match(shareFileRegex);

  if (match) {
    const share_id = match[1];
    const filePath = match[2]; // e.g., 'SKILL.md' or 'icon.png'

    // 2. Look up the share_id in your Supabase database using the REST API
    // Replace with your actual Supabase URL and Anon Key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/share_links?share_id=eq.${share_id}&select=skill_id,expires_at`,
        {
          headers: {
            'apikey': supabaseAnonKey as string,
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          // Cache carefully or disable cache so expired links stop working immediately
          cache: 'no-store' 
        }
      );

      const data = await response.json();

      // 3. Check if the link exists
      if (!data || data.length === 0) {
        return new NextResponse("Skill link not found", { status: 404 });
      }

      const shareRecord = data[0];

      // 4. Check if the link has expired (Your subscription logic)
      if (shareRecord.expires_at) {
        const expirationDate = new Date(shareRecord.expires_at);
        if (new Date() > expirationDate) {
          return new NextResponse("This skill link has expired", { status: 403 });
        }
      }

      // 5. If valid, REWRITE the URL to the actual public folder path
      // Example: rewrites /share/123/SKILL.md -> /skills/lead-qualifier/SKILL.md
      const actualSkillId = shareRecord.skill_id;
      
      return NextResponse.rewrite(
        new URL(`/skills/${actualSkillId}/${filePath}`, request.url)
      );

    } catch (error) {
      console.error("Error fetching share link:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }

  return NextResponse.next();
}

// Optimize middleware to only run on /share/* paths
export const config = {
  matcher: '/share/:path*',
}