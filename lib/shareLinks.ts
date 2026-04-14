import { supabaseAdmin } from './supabaseAdmin';

/**
 * Generate a random share ID composed of random numbers and letters
 * Format: 8-4-4-4-12 (like UUID but alphanumeric)
 * Example: 7k3m9x2l-9d4f-8p2q-1r5s-3t8u9v2w4x5y
 */
function generateShareId(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  const segments = [8, 4, 4, 4, 12];
  
  return segments
    .map(len => 
      Array.from({ length: len }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join('')
    )
    .join('-');
}

/**
 * Create a new share link for a skill
 */
export async function createShareLink(
  skillId: string,
  userId: string,
  expiresInDays?: number
): Promise<{ shareId: string; shareUrl: string } | null> {
  try {
    const shareId = generateShareId();

    // Calculate expiration date if specified
    let expiresAt = null;
    if (expiresInDays) {
      const now = new Date();
      expiresAt = new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
    }

    // Insert share link into database
    const { data, error } = await supabaseAdmin
      .from('share_links')
      .insert([{
        share_id: shareId,
        skill_id: skillId,
        user_id: userId,
        expires_at: expiresAt,
        view_count: 0,
      }])
      .select('share_id')
      .single();

    if (error) {
      console.error('Error creating share link:', error);
      // Throw an error so the caller can access the error details
      throw error;
    }

    // Generate full share URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/share/${shareId}`;

    return {
      shareId,
      shareUrl,
    };
  } catch (error) {
    console.error('Error in createShareLink:', error);
    throw error;
  }
}

/**
 * Get all share links for a user
 */
export async function getShareLinks(userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('share_links')
      .select('share_id, skill_id, created_at, expires_at, view_count')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching share links:', error);
      return [];
    }

    return data?.map(link => ({
      ...link,
      shareUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/share/${link.share_id}`,
    })) || [];
  } catch (error) {
    console.error('Error in getShareLinks:', error);
    return [];
  }
}

/**
 * Delete a share link
 */
export async function deleteShareLink(shareId: string, userId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('share_links')
      .delete()
      .eq('share_id', shareId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting share link:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteShareLink:', error);
    return false;
  }
}
