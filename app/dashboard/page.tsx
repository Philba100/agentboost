'use client';
import { useEffect, useState, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import skills from '@/app/lib/skillsData';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// 🛑 Stripe Price ID: Configure via environment variable
const API_ACCESS_PRICE_ID = process.env.NEXT_PUBLIC_API_ACCESS_PRICE_ID || ""; 

function DashboardContent() {
  const [keys, setKeys] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

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
              subscription_tier: 'starter'
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

        // Set first skill as default
        if (skills.length > 0) {
          setSelectedSkill(skills[0]);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const generateKey = async () => {
    const { data } = await supabase.from('api_keys').insert([{ user_id: user.id }]).select();
    if (data) setKeys([...keys, ...data]);
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

  const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'elite';
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
            <div className={`px-4 py-2 rounded-lg border ${isPro ? 'border-[#00ff9d] bg-[#00ff9d]/10 text-[#00ff9d]' : 'border-red-500 bg-red-500/10 text-red-400'} font-mono text-xs font-semibold uppercase tracking-widest`}>
              {isPro ? '✓ ACTIVE' : 'RESTRICTED'}
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
              {isPro ? (
                <div className="bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-lg p-4 mb-4">
                  <p className="text-[#00ff9d] font-semibold mb-2">✓ Pro Plan Active</p>
                  <p className="text-slate-300 text-sm mb-2">Your subscription renews monthly. You have access to all premium agents and skills. Generate API keys below to use in OpenClaw and MCP environments.</p>
                  <p className="text-slate-400 text-xs">Renews: {remainingDays !== null ? `in ${remainingDays} days` : 'monthly'}</p>
                </div>
              ) : (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                  <p className="text-red-400 font-semibold mb-2">⚠ Limited Access</p>
                  <p className="text-slate-300 text-sm">Activate your free plan to access all features and generate API keys.</p>
                  <button onClick={handleCheckout} disabled={subscribing} className="mt-3 w-full bg-[#00ff9d] text-[#0f172a] font-bold py-2 rounded-lg text-sm hover:bg-emerald-400 transition-all">
                    {subscribing ? 'Processing...' : 'Activate Free Plan'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Skills Sidebar */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-white mb-4">Available Skills</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {skills.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedSkill?.id === skill.id
                      ? 'bg-[#00ff9d] border-[#00ff9d] text-[#0f172a] font-semibold'
                      : 'bg-[#1e293b] border-slate-700 text-slate-200 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{skill.icon}</span>
                    <p className="font-semibold truncate">{skill.name}</p>
                  </div>
                  <p className={`text-xs ${selectedSkill?.id === skill.id ? 'text-[#0f172a]/70' : 'text-slate-400'}`}>
                    {skill.category || 'General'}
                  </p>
                </button>
              ))}
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
                    {isPro ? (
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
                    ) : (
                      <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                        <p className="text-red-400 font-semibold mb-2">🔒 Premium Feature</p>
                        <p className="text-slate-300 text-sm mb-4">Activate your free subscription to access this skill and all others.</p>
                        <button onClick={handleCheckout} disabled={subscribing} className="w-full bg-[#00ff9d] text-[#0f172a] font-bold py-2 rounded-lg text-sm hover:bg-emerald-400 transition-all">
                          {subscribing ? 'Processing...' : 'Activate Free Plan'}
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

        {/* API Keys Section - Only for Pro Users */}
        {isPro && (
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
        {isPro && selectedSkill && keys.length > 0 && (
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
                <h4 className="font-semibold text-white mb-3">🔗 Share Link</h4>
                <p className="text-slate-400 text-sm mb-4">Share this skill with team members:</p>
                <div className="flex flex-col gap-2">
                  <input 
                    type="text" 
                    value={`https://agentboost-seven.vercel.app/skills/${selectedSkill.id}?key=${keys[0]?.key_secret?.substring(0, 14)}`}
                    readOnly
                    className="w-full px-3 py-2 bg-[#0b1220] border border-slate-600 rounded text-slate-300 text-xs font-mono"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`https://agentboost-seven.vercel.app/skills/${selectedSkill.id}?key=${keys[0]?.key_secret?.substring(0, 14)}`);
                      alert('Link copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-slate-700 text-white rounded font-semibold text-sm hover:bg-slate-600 transition-all"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#0f172a] border-l-4 border-[#00ff9d] rounded-lg p-4">
              <p className="text-slate-300 text-sm">
                <strong>💡 Tip:</strong> Links are secured with your API key prefix. Share them with your team - valid subscribers can access this skill.
              </p>
            </div>
          </div>
        )}

        {isPro && selectedSkill && keys.length === 0 && (
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