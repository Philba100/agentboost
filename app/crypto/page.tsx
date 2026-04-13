'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Environment validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables are missing.');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// 🛑 Stripe Price ID: Configure via environment variable
const CRYPTO_PRICE_ID = process.env.NEXT_PUBLIC_CRYPTO_PRICE_ID || "";

function CryptoDashboard() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const asset = searchParams.get('asset') || 'BTC';
  const timeframe = searchParams.get('timeframe') || '7D';
  const risk = searchParams.get('risk') || 'Medium';

  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        const currentUser = session?.user;
        if (isMounted) setUser(currentUser);

        if (currentUser) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('subscription_tier, updated_at')
            .eq('id', currentUser.id)
            .single();
          
          if (isMounted) setProfile(profileData);
        }
      } catch (error) {
        console.error('Session initialization failed:', error);
      } finally {
        if (isMounted) setTimeout(() => setLoading(false), 600);
      }
    }
    
    initializeSession();
    return () => { isMounted = false; };
  }, []);

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      const res = await fetch('/api/checkout', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // PASS THE DYNAMIC PRICE ID HERE
        body: JSON.stringify({ 
          email: user.email, 
          userId: user.id, 
          priceId: CRYPTO_PRICE_ID 
        })
      });
      
      if (!res.ok) throw new Error('Payment gateway unavailable');
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to generate checkout session');
      }
    } catch (err: any) {
      alert(`Transaction Error: ${err.message}`);
      setSubscribing(false);
    }
  };

  // 1. Loading State (Terminal Boot)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#00ff9d] flex flex-col items-center justify-center font-mono text-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-4 h-4 border-2 border-[#00ff9d] border-t-transparent rounded-full animate-spin"></div>
          <span>INITIALIZING QUANT ENGINE...</span>
        </div>
        <div className="text-white/30 text-xs">Establishing secure connection to market data layer</div>
      </div>
    );
  }

  // 2. Unauthenticated State
  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
        <div className="bg-[#0a0a0a] p-10 rounded-2xl border border-white/10 max-w-md w-full shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff9d] to-transparent opacity-50"></div>
          <h2 className="text-2xl font-bold mb-2 tracking-tight">AgentBoost Auth</h2>
          <p className="text-white/40 mb-8 text-sm leading-relaxed">Identity verification required to access institutional order books and analytical models.</p>
          <Link href="/login?next=/crypto" className="flex items-center justify-center gap-2 w-full bg-white text-black font-semibold py-3.5 rounded-lg hover:bg-[#00ff9d] transition-colors">
            Authenticate Session
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'elite';

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] p-6 md:p-10 font-sans antialiased">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold tracking-tighter">{asset}/USD</h1>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${isPro ? 'bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30' : 'bg-white/5 text-white/40 border border-white/10'}`}>
              {isPro ? 'Pro Active' : 'Basic Tier'}
            </span>
          </div>
          <p className="text-white/40 text-sm font-mono flex items-center gap-4">
            <span>HORIZON: <span className="text-white">{timeframe}</span></span>
            <span>RISK: <span className="text-white">{risk}</span></span>
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-[10px] text-white/40 font-mono mb-1">CURRENT SPOT</div>
          <div className="text-2xl font-mono text-white">$64,291.50 <span className="text-[#00ff9d] text-sm">+2.4%</span></div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {!isPro ? (
          /* Locked State */
          <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ff9d]/5 to-transparent"></div>
            <div className="relative p-10 md:p-16 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#00ff9d]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#00ff9d]/20">
                <svg className="w-8 h-8 text-[#00ff9d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="font-bold text-3xl mb-4 tracking-tight">Institutional Quant Layer Locked</h3>
              <p className="text-white/50 max-w-lg mb-10 leading-relaxed">
                Upgrade to PRO to unlock Delta-Neutral algorithmic hedging, live Greeks calculation, and automated multi-leg options execution.
              </p>
              <button 
                onClick={handleSubscribe} 
                disabled={subscribing} 
                className="bg-white text-black font-semibold px-8 py-3.5 rounded-lg hover:bg-[#00ff9d] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {subscribing ? (
                  <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> Provisioning...</>
                ) : 'Deploy Pro Engine — $199/mo'}
              </button>
            </div>
          </div>
        ) : (
          /* Pro State: Data Dashboard */
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-[#0a0a0a] p-6 rounded-xl border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Recommended Strategy: Iron Condor</h2>
                  <span className="text-xs font-mono text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-1 rounded">PROB: 84.2%</span>
                </div>
                <div className="h-40 border-y border-white/5 flex items-center justify-center mb-6 relative overflow-hidden">
                  {/* Abstract Volatility Chart Mockup */}
                  <svg className="w-full h-full text-white/10 absolute" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
                    <path d="M0,50 Q25,20 50,50 T100,50 L100,100 L0,100 Z" fill="currentColor" opacity="0.5"/>
                    <path d="M0,50 Q25,80 50,50 T100,50" stroke="#00ff9d" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm font-mono mb-6">
                  <div className="bg-white/5 p-3 rounded text-center">
                    <div className="text-white/40 text-[10px] mb-1">SELL CALL (Short)</div>
                    <div className="text-red-400">Strike $72,000</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded text-center">
                    <div className="text-white/40 text-[10px] mb-1">SELL PUT (Short)</div>
                    <div className="text-green-400">Strike $61,000</div>
                  </div>
                </div>
                <button className="w-full bg-[#00ff9d] text-black font-semibold py-3 rounded-lg hover:brightness-110 transition-all">
                  Execute Multi-Leg Order via API
                </button>
              </div>
            </div>

            {/* Greeks Panel */}
            <div className="bg-[#0a0a0a] p-6 rounded-xl border border-white/10 flex flex-col">
              <h2 className="text-lg font-semibold mb-6 border-b border-white/10 pb-4">Live Greeks</h2>
              <div className="space-y-4 flex-1">
                {[
                  { name: 'IV', val: '68.4%', desc: 'Implied Volatility' },
                  { name: 'Δ (Delta)', val: '0.12', desc: 'Price Sensitivity' },
                  { name: 'Γ (Gamma)', val: '0.04', desc: 'Delta Velocity' },
                  { name: 'Θ (Theta)', val: '-$12.4', desc: 'Time Decay' },
                  { name: 'ν (Vega)', val: '$8.2', desc: 'Vol Sensitivity' }
                ].map((greek, i) => (
                  <div key={i} className="flex justify-between items-center group">
                    <div>
                      <div className="font-mono text-white/80">{greek.name}</div>
                      <div className="text-[10px] text-white/30">{greek.desc}</div>
                    </div>
                    <div className="font-mono text-[#00ff9d] group-hover:scale-110 transition-transform">{greek.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono text-sm">INITIALIZING...</div>}>
      <CryptoDashboard />
    </Suspense>
  );
}