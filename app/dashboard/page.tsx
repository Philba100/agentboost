'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import skills from '@/app/lib/skillsData';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// 🛑 Stripe Price ID: Configure via environment variable
const API_ACCESS_PRICE_ID = process.env.NEXT_PUBLIC_API_ACCESS_PRICE_ID || ""; 

function DashboardContent() {
  const searchParams = useSearchParams();
  const [keys, setKeys] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [shareLink, setShareLink] = useState<string>('');
  const [generatingLink, setGeneratingLink] = useState(false);
  const [shareTableMissing, setShareTableMissing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        
        // Fetch Profile Tier
        let { data: prof, error: profError } = await supabase
          .from('profiles')
          .select('id, full_name, subscription_tier, updated_at')
          .eq('id', session.user.id)
          .single();
        
        // If profile doesn't exist, create it
        if (profError || !prof) {
          const { data: newProf, error: insertError } = await supabase
            .from('profiles')
            .insert([{
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || '',
              subscription_tier: 'free'
            }])
            .select('id, full_name, subscription_tier, updated_at')
            .single();
          
          prof = newProf;
          profError = insertError;
        }
        
        if (prof) {
          setProfile(prof);
        }

        // Fetch Keys
        const { data: k } = await supabase.from('api_keys').select('*').eq('user_id', session.user.id);
        setKeys(k || []);

        // Set skill from URL param, or default to first skill
        const skillParam = searchParams.get('skill');
        if (skillParam) {
          const foundSkill = skills.find(s => s.id === skillParam);
          setSelectedSkill(foundSkill || skills[0]);
        } else if (skills.length > 0) {
          setSelectedSkill(skills[0]);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [searchParams]);

  // Generate unique share link when skill changes
  useEffect(() => {
    const generateShareLink = async () => {
      if (!selectedSkill || !user) {
        setShareLink('');
        return;
      }

      setGeneratingLink(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          console.error('No session token available');
          setShareLink('');
          return;
        }

        const response = await fetch('/api/generate-share-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            skillId: selectedSkill.id,
            expiresInDays: 365, // 1 year
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setShareLink(data.shareUrl);
          setShareTableMissing(false);
        } else {
          const errorData = await response.json();
          // Check if it's a table missing error
          if (errorData.error?.includes('table not found') || errorData.error?.includes('Share links table')) {
            setShareTableMissing(true);
          } else {
            setShareTableMissing(false);
          }
          console.error('Failed to generate share link:', errorData.error);
          setShareLink('');
        }
      } catch (error) {
        console.error('Error generating share link:', error);
        setShareLink('');
      } finally {
        setGeneratingLink(false);
      }
    };

    generateShareLink();
  }, [selectedSkill, user]);

  const generateKey = async () => {
    const { data } = await supabase.from('api_keys').insert([{ user_id: user.id }]).select();
    if (data) setKeys([...keys, ...data]);
  };

  const handleUpgradeEnterprise = async () => {
    setSubscribing(true);
    try {
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ subscription_tier: 'enterprise' })
        .eq('id', user.id);
      
      if (!updateErr) {
        const { data: updatedProfile, error: refetchError } = await supabase
          .from('profiles')
          .select('id, full_name, subscription_tier, updated_at')
          .eq('id', user.id)
          .single();
        
        if (updatedProfile && !refetchError) {
          setProfile(updatedProfile);
          alert('✓ Enterprise Plan Activated! You now have access to all skills.');
        }
      } else {
        alert('Error upgrading plan: ' + updateErr.message);
      }
      setSubscribing(false);
    } catch (err) {
      console.error('Error:', err);
      alert('Error: ' + (err as Error).message);
      setSubscribing(false);
    }
  };

  const handleCheckout = async () => {
    setSubscribing(true);
    try {
      // First, check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      let updateError;
      
      if (!existingProfile) {
        // Profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            full_name: user.user_metadata?.full_name || '',
            subscription_tier: 'pro'
          }]);
        updateError = insertError;
      } else {
        // Profile exists, update it
        const { error: updateErr } = await supabase
          .from('profiles')
          .update({ 
            subscription_tier: 'pro'
          })
          .eq('id', user.id);
        updateError = updateErr;
      }
      
      if (!updateError) {
        // Refetch the updated profile with all fields
        const { data: updatedProfile, error: refetchError } = await supabase
          .from('profiles')
          .select('id, full_name, subscription_tier, updated_at')
          .eq('id', user.id)
          .single();
        
        if (updatedProfile && !refetchError) {
          setProfile(updatedProfile);
          alert('✓ Pro Plan Activated! Your subscription renews monthly.');
        } else {
          alert('Profile updated but refresh failed. Please refresh the page.');
          console.error('Refetch error:', refetchError);
        }
      } else {
        alert('Error activating plan: ' + updateError.message);
        console.error('Update error:', updateError);
      }
      setSubscribing(false);
    } catch (err) { 
      console.error('Error:', err);
      alert('Error: ' + (err as Error).message);
      setSubscribing(false); 
    }
  };

  const calculateRemainingDays = () => {
    if (!profile?.updated_at) return null;
    const activatedDate = new Date(profile.updated_at);
    const renewalDate = new Date(activatedDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from activation
    const today = new Date();
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Get free vs paid skills
  const freeSkills = skills.filter(s => s.free === true);
  const paidSkills = skills.filter(s => s.free !== true);
  
  // Reorder skills: put selected skill first, then free skills, then paid skills
  const orderedSkills = selectedSkill 
    ? [
        selectedSkill,
        ...freeSkills.filter(s => s.id !== selectedSkill.id),
        ...paidSkills.filter(s => s.id !== selectedSkill.id)
      ]
    : skills;
  
  const isFree = profile?.subscription_tier === 'free';
  const isPro = profile?.subscription_tier === 'pro';
  const isEnterprise = profile?.subscription_tier === 'enterprise';
  const remainingDays = calculateRemainingDays();

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#00ff9d] border-t-transparent rounded-full animate-spin"></div></div>;

  if (!user) return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 text-white font-sans">
      <p className="mb-4 text-gray-500 uppercase tracking-widest text-xs">Authentication Required</p>
      <Link href="/login" className="bg-[#00ff9d] text-[#0f172a] px-6 py-2 rounded font-bold">Sign In</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans antialiased">
      {/* Header */}
      <div className="border-b border-slate-800 bg-[#1e293b]/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-slate-400 text-sm mt-1">Manage your subscriptions and access skills</p>
            </div>
            <div className={`px-4 py-2 rounded-lg border font-mono text-xs font-semibold uppercase tracking-widest ${
              isEnterprise ? 'border-[#00ff9d] bg-[#00ff9d]/10 text-[#00ff9d]' :
              isPro ? 'border-blue-500 bg-blue-500/10 text-blue-400' :
              'border-slate-600 bg-slate-600/10 text-slate-300'
            }`}>
              {isEnterprise ? '✓ ENTERPRISE' : isPro ? '✓ PRO' : '○ FREE'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* User Profile Card */}
        <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-slate-700 rounded-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-sm uppercase text-slate-400 font-semibold tracking-wide mb-2">User Profile</h2>
              <p className="text-2xl font-bold text-white mb-6">{user?.email}</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs uppercase text-slate-500 tracking-wider mb-1">Subscription Plan</p>
                  <p className="text-lg font-semibold text-slate-200 capitalize">{profile?.subscription_tier || 'Free'}</p>
                </div>
            {isPro && remainingDays !== null && (
                  <div>
                    <p className="text-xs uppercase text-slate-500 tracking-wider mb-1">Days Until Renewal</p>
                    <p className={`text-lg font-semibold ${remainingDays > 7 ? 'text-[#00ff9d]' : 'text-orange-400'}`}>
                      {remainingDays} {remainingDays === 1 ? 'day' : 'days'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-sm uppercase text-slate-400 font-semibold tracking-wide mb-2">Subscription Info</h2>
              {isEnterprise ? (
                <div className="bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-lg p-4 mb-4">
                  <p className="text-[#00ff9d] font-semibold mb-2">🚀 Enterprise Plan Active</p>
                  <p className="text-slate-300 text-sm">Full access to all {skills.length} skills. Unlimited usage and API access.</p>
                </div>
              ) : isPro ? (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <p className="text-blue-400 font-semibold mb-2">✓ Pro Plan Active</p>
                  <p className="text-slate-300 text-sm mb-3">You have access to 5 free skills + purchased premium skills.</p>
                  <button onClick={handleUpgradeEnterprise} disabled={subscribing} className="w-full bg-[#00ff9d] text-[#0f172a] font-bold py-2 rounded-lg text-sm hover:bg-emerald-400 transition-all">
                    {subscribing ? 'Processing...' : 'Upgrade to Enterprise'}
                  </button>
                </div>
              ) : (
                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 mb-4">
                  <p className="text-slate-300 font-semibold mb-2">○ Free Plan</p>
                  <p className="text-slate-300 text-sm mb-2">Access {freeSkills.length} free skills. Upgrade to access {paidSkills.length} premium skills.</p>
                  <div className="space-y-2 mt-3">
                    <button onClick={handleUpgradeEnterprise} disabled={subscribing} className="w-full bg-[#00ff9d] text-[#0f172a] font-bold py-2 rounded-lg text-sm hover:bg-emerald-400 transition-all">
                      {subscribing ? 'Processing...' : 'Upgrade to Enterprise'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Skills Sidebar */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-white mb-2">Available Skills</h3>
            <p className="text-xs text-slate-400 mb-4">{freeSkills.length} free • {paidSkills.length} premium</p>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {orderedSkills.map((skill) => {
                const isFreeSkill = skill?.free === true;
                const canAccess = isFreeSkill || isEnterprise;
                const canSelect = isFreeSkill || (isPro && !isFreeSkill) || isEnterprise;
                
                return (
                <button
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill)}
                  disabled={isFree && !isFreeSkill}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedSkill?.id === skill.id
                      ? 'bg-[#00ff9d] border-[#00ff9d] text-[#0f172a] font-semibold'
                      : isFreeSkill
                      ? 'bg-[#1e293b] border-slate-700 text-slate-200 hover:border-slate-600'
                      : isEnterprise
                      ? 'bg-[#1e293b] border-blue-700/50 text-slate-200 hover:border-blue-600'
                      : 'bg-[#0f172a] border-slate-800 text-slate-400 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{skill.icon}</span>
                      <p className="font-semibold truncate">{skill.name}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap ${
                      isFreeSkill
                        ? 'bg-green-600/20 text-green-400'
                        : isEnterprise
                        ? 'bg-blue-600/20 text-blue-400'
                        : isPro && !isFreeSkill
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'bg-slate-600/20 text-slate-400'
                    }`}>
                      {isFreeSkill ? 'FREE' : isEnterprise ? 'ALL' : 'LOCKED'}
                    </span>
                  </div>
                  <p className={`text-xs ${selectedSkill?.id === skill.id ? 'text-[#0f172a]/70' : 'text-slate-400'}`}>
                    {skill.category || 'General'}
                  </p>
                </button>
                );
              })}
            </div>
          </div>

          {/* Skill Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedSkill ? (
              <>
                {/* Skill Header */}
                <div className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] border border-slate-700 rounded-xl p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl">{selectedSkill.icon}</div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-white mb-2">{selectedSkill.name}</h2>
                      <p className="text-slate-400 mb-3">{selectedSkill.desc}</p>
                      {selectedSkill.category && (
                        <span className="inline-block px-3 py-1 bg-[#00ff9d] text-[#0f172a] text-xs font-semibold rounded">
                          {selectedSkill.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedSkill.benefits.map((benefit: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-[#0f172a] rounded-lg">
                        <span className="text-[#00ff9d] font-bold">✓</span>
                        <span className="text-slate-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How to Get It */}
                <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">How to Access</h3>
                  <div className="space-y-4">
                    {selectedSkill.free || isEnterprise ? (
                      <>
                        <div className="bg-[#0f172a] border-l-4 border-[#00ff9d] p-4 rounded">
                          <h4 className="font-semibold text-white mb-2">1. View Full Documentation</h4>
                          <p className="text-slate-400 text-sm mb-3">Read the complete skill documentation and examples.</p>
                          <Link href={`/skills/${selectedSkill.id}`} className="inline-block px-4 py-2 bg-[#00ff9d] text-[#0f172a] rounded font-semibold text-sm hover:bg-emerald-400 transition-all">
                            View Skill Docs
                          </Link>
                        </div>

                        <div className="bg-[#0f172a] border-l-4 border-[#00ff9d] p-4 rounded">
                          <h4 className="font-semibold text-white mb-2">2. Try the Interactive Demo</h4>
                          <p className="text-slate-400 text-sm mb-3">Test the skill with sample data in the interactive playground.</p>
                          <a href={`/skills/${selectedSkill.id}/scripts/index.html`} target="_blank" rel="noreferrer" className="inline-block px-4 py-2 bg-[#00ff9d] text-[#0f172a] rounded font-semibold text-sm hover:bg-emerald-400 transition-all">
                            Open Demo
                          </a>
                        </div>

                        {(isEnterprise) && (
                          <>
                            <div className="bg-[#0f172a] border-l-4 border-[#00ff9d] p-4 rounded">
                              <h4 className="font-semibold text-white mb-2">3. Access via OpenClaw</h4>
                              <p className="text-slate-400 text-sm mb-3">Use your API keys to integrate this skill into OpenClaw agents.</p>
                              <p className="text-slate-300 text-xs font-mono">agent.mount(client.skills.get('{selectedSkill.id}'))</p>
                            </div>

                            <div className="bg-[#0f172a] border-l-4 border-[#00ff9d] p-4 rounded">
                              <h4 className="font-semibold text-white mb-2">4. Access on Mobile & Edge Gallery</h4>
                              <p className="text-slate-400 text-sm mb-3">Use this skill on mobile devices through the Edge Gallery.</p>
                              <a href={`https://agentboost-seven.vercel.app/skills/${selectedSkill.id}`} target="_blank" rel="noreferrer" className="inline-block px-4 py-2 bg-[#00ff9d] text-[#0f172a] rounded font-semibold text-sm hover:bg-emerald-400 transition-all">
                                Open in Edge Gallery
                              </a>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="bg-slate-800/30 border border-slate-700 p-6 rounded-lg text-center">
                        <p className="text-slate-300 font-semibold mb-3">🔒 Premium Skill</p>
                        <p className="text-slate-400 text-sm mb-4">This skill requires an Enterprise subscription to access.</p>
                        <button onClick={handleUpgradeEnterprise} disabled={subscribing} className="w-full bg-[#00ff9d] text-[#0f172a] font-bold py-2 rounded-lg text-sm hover:bg-emerald-400 transition-all">
                          {subscribing ? 'Processing...' : 'Upgrade to Enterprise'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">Select a skill from the list to view details</div>
            )}
          </div>
        </div>

        {/* API Keys Section - For Enterprise Users */}
        {isEnterprise && (
          <div className="mt-12 bg-[#1e293b] border border-slate-700 rounded-xl p-8">
            <h3 className="text-xl font-bold text-white mb-4">API Keys for OpenClaw</h3>
            <p className="text-slate-400 mb-6 text-sm">Generate and manage headless authentication keys for your OpenClaw and MCP environments.</p>
            
            {keys.length > 0 && (
              <div className="space-y-3 mb-6">
                <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider mb-3">Active Keys ({keys.length})</p>
                {keys.map(k => (
                  <div key={k.id} className="bg-[#0f172a] p-4 rounded-lg font-mono text-xs border border-slate-700 flex justify-between items-center group">
                    <span className="text-[#00ff9d] opacity-80 group-hover:opacity-100 transition break-all">{k.key_secret}</span>
                    <span className="text-slate-400 uppercase text-[10px] bg-slate-800/50 px-2 py-1 rounded ml-2 shrink-0">{k.name}</span>
                  </div>
                ))}
              </div>
            )}
            
            <button onClick={generateKey} className="bg-[#00ff9d] text-[#0f172a] font-bold px-6 py-3 rounded-lg text-sm uppercase tracking-widest hover:bg-emerald-400 transition-all">
              + Generate New Key
            </button>
          </div>
        )}

        {/* Edge Gallery Mobile Access */}
        {isEnterprise && selectedSkill && keys.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-[#1e293b] to-[#0f172a] border border-slate-700 rounded-xl p-8">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span>📱</span> Access on Mobile & Edge Gallery
            </h3>
            <p className="text-slate-400 mb-6 text-sm">Use {selectedSkill.name} directly on your mobile device through the Edge Gallery.</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#0f172a] border border-slate-700 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-3">📲 Quick Access Link</h4>
                <p className="text-slate-400 text-sm mb-4">Open this skill on any mobile device:</p>
                <a href={`https://agentboost-seven.vercel.app/skills/${selectedSkill.id}?key=${keys[0]?.key_secret?.substring(0, 14)}`} target="_blank" rel="noreferrer" className="block w-full px-4 py-3 bg-[#00ff9d] text-[#0f172a] rounded font-semibold text-sm text-center hover:bg-emerald-400 transition-all">
                  Open {selectedSkill.name} on Mobile
                </a>
              </div>

              <div className="bg-[#0f172a] border border-slate-700 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-3">🔗 Unique Share Link</h4>
                <p className="text-slate-400 text-sm mb-4">Share this skill with team members (unique for each skill):</p>
                {shareTableMissing ? (
                  <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 text-center">
                    <p className="text-red-400 font-semibold mb-3">⚠️ Setup Required</p>
                    <p className="text-red-300 text-sm mb-4">
                      The share_links table needs to be created in your Supabase database.
                    </p>
                    <details className="text-left">
                      <summary className="text-red-300 cursor-pointer font-semibold mb-3 hover:text-red-200">
                        ▶ Click to see setup instructions
                      </summary>
                      <div className="bg-[#0b1220] p-3 rounded border border-slate-700 mt-3">
                        <p className="text-slate-300 text-xs font-mono whitespace-pre-wrap break-words">
                          1. Go to your Supabase project dashboard
                          <br/>2. Open the SQL Editor
                          <br/>3. Create a new query and paste the SQL below:
                        </p>
                        <div className="mt-3 bg-[#0f172a] p-3 rounded border border-slate-600">
                          <code className="text-[#00ff9d] text-xs font-mono block overflow-x-auto" style={{maxHeight: '300px', overflowY: 'auto'}}>
{`CREATE TABLE IF NOT EXISTS share_links (
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

CREATE POLICY share_links_select_public ON share_links FOR SELECT USING (true);
CREATE POLICY share_links_insert_own ON share_links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY share_links_update_own ON share_links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY share_links_delete_own ON share_links FOR DELETE USING (auth.uid() = user_id);`}
                          </code>
                        </div>
                        <p className="text-slate-300 text-xs mt-3">
                          4. Run the query
                          <br/>5. Refresh this page
                        </p>
                      </div>
                    </details>
                  </div>
                ) : generatingLink ? (
                  <div className="w-full px-4 py-2 bg-slate-700 text-slate-400 rounded text-sm text-center">
                    Generating link...
                  </div>
                ) : shareLink ? (
                  <div className="flex flex-col gap-2">
                    <input 
                      type="text" 
                      value={shareLink}
                      readOnly
                      className="w-full px-3 py-2 bg-[#0b1220] border border-slate-600 rounded text-slate-300 text-xs font-mono"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(shareLink);
                        alert('Link copied to clipboard!');
                      }}
                      className="px-4 py-2 bg-slate-700 text-white rounded font-semibold text-sm hover:bg-slate-600 transition-all"
                    >
                      Copy Link
                    </button>
                  </div>
                ) : (
                  <div className="w-full px-4 py-2 bg-red-700/20 border border-red-600 text-red-400 rounded text-sm">
                    Failed to generate share link
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 bg-[#0f172a] border-l-4 border-[#00ff9d] rounded-lg p-4">
              <p className="text-slate-300 text-sm">
                <strong>💡 Tip:</strong> Each skill gets a unique shareable link. Recipients can access the skill without needing their own account or API key.
              </p>
            </div>
          </div>
        )}

        {isEnterprise && selectedSkill && keys.length === 0 && (
          <div className="mt-8 bg-gradient-to-r from-[#1e293b] to-[#0f172a] border border-yellow-700 rounded-xl p-8">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span>📱</span> Access on Mobile & Edge Gallery
            </h3>
            <p className="text-yellow-400 mb-4">Generate an API key to create shareable Edge Gallery links for this skill.</p>
            <a href="#api-keys-section" className="inline-block px-6 py-2 bg-[#00ff9d] text-[#0f172a] rounded font-semibold hover:bg-emerald-400 transition-all">
              Generate API Key
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return <Suspense><DashboardContent/></Suspense>
}