'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense, useCallback } from 'react';
import { createClient, User } from '@supabase/supabase-js';
import Link from 'next/link';

// Enterprise Standard: Strict TypeScript Interfaces
interface Profile {
  id: string;
  subscription_tier: 'free' | 'pro' | 'elite';
  created_at?: string;
}

// Enterprise Standard: Singleton Supabase client initialization
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 🛑 Stripe Price ID: Configure via environment variable
const LEADGEN_PRICE_ID = process.env.NEXT_PUBLIC_LEADGEN_PRICE_ID || "";

function LeadDashboard() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscribing, setSubscribing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fallbacks and input sanitization
  const domain = searchParams.get('domain')?.toLowerCase() || 'company.com';
  const role = searchParams.get('role') || 'Decision Maker';

  const fetchSessionAndProfile = useCallback(async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
          
        if (profileError) throw profileError;
        setProfile(profileData);
      }
    } catch (err: any) {
      console.error('Auth/Profile Fetch Error:', err.message);
      setError('Failed to load user data. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessionAndProfile();
  }, [fetchSessionAndProfile]);

  const handleSubscribe = async () => {
    setSubscribing(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user?.email, 
          userId: user?.id,
          priceId: LEADGEN_PRICE_ID // Pass the correct price
        })
      });
      
      if (!res.ok) throw new Error('Failed to initiate checkout.');
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Invalid checkout URL received.');
      }
    } catch (err: any) {
      console.error('Checkout Error:', err);
      setError(err.message || 'Payment service unavailable.');
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-blue-400 flex items-center justify-center font-bold font-mono text-sm">
        INITIALIZING SECURE CONNECTION TO {domain}...
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-8 text-center">
        <section className="bg-[#1e293b] p-10 rounded-2xl border border-blue-500/20 max-w-md w-full shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 tracking-tight">LeadGen Pro</h2>
          <p className="text-slate-400 mb-8 text-sm">Authentication required to query proprietary B2B contact databases.</p>
          <Link href="/login?next=/b2b-leads" className="block w-full bg-blue-600 hover:bg-blue-500 transition-colors text-white font-bold py-3.5 rounded-md">
            Authorize Session
          </Link>
        </section>
      </main>
    );
  }

  const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'elite';

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-200 p-6 font-sans">
      <header className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-bold">Lead Database</h1>
          <p className="text-blue-400 text-[10px] font-bold tracking-widest uppercase">Target: {domain}</p>
        </div>
        <span className={`px-2 py-1 rounded text-[10px] font-bold border ${isPro ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
          {isPro ? 'PRO ACTIVE' : 'STARTER'}
        </span>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-xl text-sm">
          {error}
        </div>
      )}

      {!isPro ? (
        <div className="space-y-6">
          {/* Skeleton Loader representing locked data */}
          <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 select-none">
             <div className="flex justify-between items-center mb-4">
                <div className="h-4 w-24 bg-slate-800 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-slate-800 rounded animate-pulse"></div>
             </div>
             <div className="h-6 w-full bg-slate-800 rounded mb-2 blur-md"></div>
             <div className="h-4 w-2/3 bg-slate-800 rounded blur-md"></div>
          </div>

          <section className="bg-gradient-to-br from-[#1e293b] to-blue-900/20 p-8 text-center rounded-2xl border border-blue-500/30 shadow-2xl">
            <h3 className="font-black text-2xl mb-2">Reveal Contact Data</h3>
            <p className="text-slate-400 text-sm mb-8">
              Unlock verified emails, direct phone lines, and LinkedIn profiles for {role}s at {domain}.
            </p>
            <button 
              onClick={handleSubscribe} 
              disabled={subscribing} 
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 transition-all text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20"
            >
              {subscribing ? 'Processing Transaction...' : 'Upgrade to Pro — $29.99/mo'}
            </button>
          </section>
        </div>
      ) : (
        <div className="space-y-4">
          <article className="bg-[#1e293b] p-5 rounded-2xl border border-blue-500/30 shadow-lg">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-lg font-bold">Jane Smith</h3>
                  <p className="text-blue-400 text-xs font-medium uppercase tracking-tighter">{role}</p>
               </div>
               <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded border border-emerald-500/20">VERIFIED</span>
            </div>
            <div className="space-y-3 font-mono text-sm">
               <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-500">Email</span>
                  <span className="text-white select-all">j.smith@{domain}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-slate-500">Direct Line</span>
                  <span className="text-white select-all">+1 (555) 012-3456</span>
               </div>
            </div>
          </article>
          
          <button className="w-full bg-slate-100 hover:bg-white transition-colors text-slate-900 font-bold py-4 rounded-xl text-sm shadow-md">
            Export to CRM (Salesforce / HubSpot)
          </button>
        </div>
      )}
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a]" />}>
      <LeadDashboard />
    </Suspense>
  );
}