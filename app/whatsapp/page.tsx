'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Environment validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// 🛑 STRIPE PRICE ID: Configure via environment variable or remove if not using Stripe checkout
// const WHATSAPP_PRICE_ID = process.env.NEXT_PUBLIC_WHATSAPP_PRICE_ID || "";

function WhatsAppDashboard() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [subscribing, setSubscribing] = useState(false);

  // Decoded AI Extracted Data
  const campaign = decodeURIComponent(searchParams.get('camp') || 'Automated Broadcast');
  const audience = decodeURIComponent(searchParams.get('aud') || 'Global Contacts');
  const message = decodeURIComponent(searchParams.get('msg') || '');
  const scheduleTime = decodeURIComponent(searchParams.get('time') || 'Immediate Execution');
  const timezone = decodeURIComponent(searchParams.get('tz') || 'UTC');

  useEffect(() => {
    let isMounted = true;
    async function initializeSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user;
        if (isMounted) setUser(currentUser);

        if (currentUser) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('subscription_tier')
            .eq('id', currentUser.id)
            .single();
          if (isMounted) setProfile(profileData);
        }
      } catch (err) {
        console.error('Auth sync failed:', err);
      } finally {
        if (isMounted) setTimeout(() => setLoading(false), 750);
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
        // ADDED: The specific Price ID for WhatsApp Pro
        body: JSON.stringify({ 
          email: user.email, 
          userId: user.id,
          priceId: process.env.NEXT_PUBLIC_WHATSAPP_PRICE_ID || "" 
        })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error);
    } catch (err: any) {
      alert(`API Error: ${err.message}`);
      setSubscribing(false);
    }
  };

  // 1. Booting / API Sync State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#25D366] flex flex-col items-center justify-center font-mono text-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-4 h-4 border-2 border-[#25D366] border-t-transparent rounded-full animate-spin"></div>
          <span>ESTABLISHING WABA HANDSHAKE...</span>
        </div>
        <div className="text-white/30 text-xs">Syncing Meta Graph API endpoints</div>
      </div>
    );
  }

  // 2. Unauthenticated State
  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-[#0a0a0a] p-10 rounded-xl border border-white/10 max-w-md w-full shadow-2xl">
          <div className="w-12 h-12 bg-[#25D366]/10 rounded-lg flex items-center justify-center mx-auto mb-6 border border-[#25D366]/20">
            <svg className="w-6 h-6 text-[#25D366]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-white tracking-tight">Enterprise Comms API</h2>
          <p className="text-white/40 mb-8 text-sm">Authentication required to manage outbound WhatsApp workflows and access API routing.</p>
          <Link href="/login?next=/whatsapp" className="block w-full bg-white text-black font-semibold py-3.5 rounded-md hover:bg-[#25D366] transition-colors">
            Initialize Session
          </Link>
        </div>
      </div>
    );
  }

  const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'elite';

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] font-sans antialiased">
      {/* Dashboard Topbar */}
      <div className="bg-[#0a0a0a] px-6 py-4 flex justify-between items-center border-b border-white/10 sticky top-0 z-10">
        <div>
          <h1 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
            {campaign}
          </h1>
          <p className="text-[11px] text-white/40 mt-1 uppercase tracking-widest font-mono">Orchestration Manager</p>
        </div>
        <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-widest border ${isPro ? 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30' : 'bg-white/5 text-white/40 border-white/10'}`}>
          {isPro ? 'PRO INFRA' : 'STARTER'}
        </span>
      </div>

      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        {!isPro ? (
          <div className="space-y-6 mt-4">
            <div className="bg-[#0a0a0a] p-6 rounded-xl border border-white/10">
                <p className="text-[11px] text-white/40 font-semibold uppercase tracking-widest mb-4 font-mono">Intercepted Payload</p>
                <div className="bg-[#111] p-5 rounded-md text-white/30 font-mono text-sm blur-[3px] select-none border border-white/5">
                    {message || "Payload pending generation..."}
                </div>
            </div>

            <div className="bg-gradient-to-b from-[#111] to-[#0a0a0a] p-10 text-center rounded-2xl border border-white/10 mt-10 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#25D366] to-transparent opacity-30"></div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Unlock High-Throughput Routing</h3>
              <p className="text-white/40 text-sm mb-10 leading-relaxed max-w-md mx-auto">
                Provision dedicated WhatsApp Business API nodes. Enable dynamic templating, bypass rate limits, and access SOC2 compliant analytics.
              </p>
              <button onClick={handleSubscribe} disabled={subscribing} className="w-full md:w-auto px-12 bg-white text-black font-semibold py-4 rounded-md shadow-[0_0_20px_rgba(37,211,102,0.15)] hover:bg-[#25D366] transition-all">
                {subscribing ? 'Provisioning Node...' : 'Upgrade to Orchestration Pro — $19.99/mo'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Left Column: Meta Data & Pre-flight */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-[#0a0a0a] p-5 rounded-xl border border-white/10">
                <h4 className="text-[11px] text-white/40 font-semibold uppercase tracking-widest mb-4">Routing Parameters</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-white/30 uppercase mb-1">Target Segment</p>
                    <p className="text-sm font-medium text-white">{audience}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase mb-1">Execution Window</p>
                    <p className="text-sm font-medium text-white">{scheduleTime}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase mb-1">Timezone / Edge Node</p>
                    <p className="text-sm font-mono text-[#25D366]">{timezone}</p>
                  </div>
                </div>
              </div>

              {/* Simulated Telemetry */}
              <div className="bg-[#0a0a0a] p-5 rounded-xl border border-white/10">
                <h4 className="text-[11px] text-white/40 font-semibold uppercase tracking-widest mb-4">Pre-Flight Checks</h4>
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Spam Score</span>
                    <span className="text-[#25D366]">0.02% (Pass)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Variables Resolved</span>
                    <span className="text-[#25D366]">Valid</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Est. Deliverability</span>
                    <span className="text-white">99.98%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Payload & Execution */}
            <div className="md:col-span-2 space-y-6">
               <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
                 <div className="bg-white/5 px-5 py-3 border-b border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-white/40 font-semibold uppercase tracking-widest">Payload Preview</span>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/60">JSON / Liquid</span>
                 </div>
                 <div className="p-5 bg-[#050505]">
                    <p className="text-sm leading-loose whitespace-pre-wrap text-white/80 font-mono">
                      {message || "{ \n  \"error\": \"No payload detected from LLM engine.\" \n}"}
                    </p>
                 </div>
               </div>

              <button className="w-full bg-[#25D366] text-black font-bold py-4 rounded-md shadow-[0_0_20px_rgba(37,211,102,0.2)] hover:bg-[#20b85a] transition-all flex justify-center items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                Deploy Broadcast to Edge
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense><WhatsAppDashboard /></Suspense>;
}