import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyPrefix = searchParams.get('key');

    if (!keyPrefix) {
      return NextResponse.json({ valid: false, error: 'No key provided' }, { status: 401 });
    }

    // Find API key that starts with this prefix
    const { data: apiKeys, error: fetchError } = await supabase
      .from('api_keys')
      .select('user_id, key_secret')
      .limit(1000); // Fetch all to check prefix

    if (fetchError || !apiKeys) {
      return NextResponse.json({ valid: false, error: 'Invalid request' }, { status: 401 });
    }

    // Find key matching the prefix
    const matchingKey = apiKeys.find(k => k.key_secret?.startsWith(keyPrefix));
    
    if (!matchingKey) {
      return NextResponse.json({ valid: false, error: 'Invalid key' }, { status: 401 });
    }

    // Check if user's subscription is active
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_tier, updated_at')
      .eq('id', matchingKey.user_id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ valid: false, error: 'User not found' }, { status: 401 });
    }

    // Check if subscription is active (within 30 days)
    const activatedDate = new Date(profile.updated_at);
    const renewalDate = new Date(activatedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const today = new Date();

    if (profile.subscription_tier === 'pro' && renewalDate > today) {
      return NextResponse.json({ 
        valid: true, 
        userId: matchingKey.user_id,
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
