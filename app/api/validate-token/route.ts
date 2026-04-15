import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

let skills: any[] = [];
try {
  const skillsModule = require('@/app/lib/skillsData');
  skills = skillsModule.default || [];
} catch (e) {
  console.error('Error loading skills:', e);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyPrefix = searchParams.get('key');
    const skillId = searchParams.get('skill');

    if (!keyPrefix) {
      return NextResponse.json({ valid: false, error: 'No key provided' }, { status: 401 });
    }

    // Find the skill
    const skill = skillId ? skills.find((s: any) => s.id === skillId) : null;
    const isFreeSk = skill?.free === true;
    
    // RULE 1: Free skills always accessible
    if (isFreeSk) {
      return NextResponse.json({ 
        valid: true,
        type: 'free-skill',
        message: 'Free skill - always accessible'
      });
    }

    // For paid skills, check user's subscription
    // Find API key that starts with this prefix
    const { data: apiKeys, error: fetchError } = await supabase
      .from('api_keys')
      .select('user_id, key_secret')
      .limit(1000);

    if (fetchError || !apiKeys) {
      return NextResponse.json({ valid: false, error: 'Invalid request' }, { status: 401 });
    }

    // Find key matching the prefix
    const matchingKey = apiKeys.find((k: any) => k.key_secret?.startsWith(keyPrefix));
    
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

    // ACCESS CONTROL LOGIC:
    // - Enterprise users have access to everything
    if (profile.subscription_tier === 'enterprise') {
      return NextResponse.json({ 
        valid: true,
        type: 'enterprise',
        message: 'Enterprise tier - full access'
      });
    }

    // - Pro users have access to all paid skills
    if (profile.subscription_tier === 'pro') {
      return NextResponse.json({ 
        valid: true,
        type: 'pro',
        message: 'Pro tier - access to this paid skill'
      });
    }

    // - Free users can only access free skills (already handled above)
    return NextResponse.json({ 
      valid: false, 
      error: 'Upgrade required - this is a premium skill',
      needsUpgrade: true
    }, { status: 402 });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json({ valid: false, error: 'Server error' }, { status: 500 });
  }
}
