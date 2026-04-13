import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ valid: false, error: 'No token provided' }, { status: 401 });
    }

    // Find profile with this token
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, subscription_tier, updated_at')
      .eq('share_token', token)
      .single();

    if (error || !profile) {
      return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 401 });
    }

    // Check if subscription is still active (within 30 days of update)
    const activatedDate = new Date(profile.updated_at);
    const renewalDate = new Date(activatedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const today = new Date();

    if (profile.subscription_tier === 'pro' && renewalDate > today) {
      return NextResponse.json({ 
        valid: true, 
        userId: profile.id,
        tier: profile.subscription_tier,
        expiresAt: renewalDate.toISOString()
      });
    }

    return NextResponse.json({ valid: false, error: 'Subscription expired' }, { status: 401 });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json({ valid: false, error: 'Server error' }, { status: 500 });
  }
}
