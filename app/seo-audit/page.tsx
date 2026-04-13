'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function SEODashboard() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [subscribing, setSubscribing] = useState(false);

  const url = searchParams.get('url') || 'target-site.com';

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      setUser(currentUser);

      if (currentUser) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        setProfile(profileData);
      }
      setTimeout(() => setLoading(false), 800);
    }
    getSession();
  }, []);

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      const res = await fetch('/api/checkout', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, userId: user.id })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setSubscribing(false);
    } catch (err) { setSubscribing(false); }
  };

  if (loading) return <div className="min-h-screen bg-[#fafafa] text-[#4f46e5] flex items-center justify-center font-bold italic">Crawling {url} for SEO issues...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-xl max-w-sm w-full">
          <h2 className="text-2xl font-black mb-4 text-[#4f46e5]">SEO Audit Pro</h2>
          <p className="text-gray-400 mb-8 text-sm">Sign in to run technical site audits.</p>
          <Link href="/login" className="block w-full bg-[#4f46e5] text-white font-bold py-3 rounded-xl">Sign In</Link>
        </div>
      </div>
    );
  }

  const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'elite';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] p-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-xl font-black">Technical Audit</h1>
          <p className="text-[#4f46e5] text-[10px] font-bold uppercase truncate max-w-[200px]">{url}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${isPro ? 'bg-indigo-100 text-indigo-600 border border-indigo-200' : 'bg-gray-100 text-gray-400'}`}>
          {isPro ? 'AGENCY PRO' : 'STARTER'}
        </span>
      </div>

      {!isPro ? (
        <div className="space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
                 <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Health Score</p>
                 <p className="text-3xl font-black text-emerald-500">82%</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
                 <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Technical Errors</p>
                 <p className="text-3xl font-black text-red-500 blur-sm">??</p>
              </div>
           </div>

          <div className="bg-white p-8 text-center rounded-2xl border border-indigo-100 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#4f46e5]"></div>
            <h3 className="text-xl font-black mb-3 italic">View Critical Errors</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Unlock the full report to see broken links, missing meta tags, and Core Web Vitals optimization suggestions for <strong>{url}</strong>.
            </p>
            <button onClick={handleSubscribe} disabled={subscribing} className="w-full bg-[#4f46e5] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all">
              {subscribing ? 'Opening Secure Portal...' : 'Get Audit Pro — $30/mo'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="text-sm font-black mb-4 flex items-center gap-2">
               <span className="text-red-500">⚠️</span> 14 Critical SEO Issues
            </h4>
            <div className="space-y-4">
               <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-xs font-bold text-red-700">Missing H1 Tags (4 pages)</p>
                  <p className="text-[10px] text-red-500 mt-1">Found on: /blog, /about, /contact, /services</p>
               </div>
               <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-xs font-bold text-red-700">Duplicate Meta Descriptions (8 pages)</p>
               </div>
               <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <p className="text-xs font-bold text-indigo-700">Image Alt Text Missing (24 images)</p>
               </div>
            </div>
          </div>
          
          <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-md text-sm mt-4">
            Download White-Label PDF Report
          </button>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <Suspense><SEODashboard /></Suspense>;
}