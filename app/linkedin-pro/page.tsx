'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function LinkedInDashboard() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [subscribing, setSubscribing] = useState(false);

  const topic = searchParams.get('topic') || 'Executive Leadership';
  const tone = searchParams.get('tone') || 'Professional';

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

  if (loading) return <div className="min-h-screen bg-[#f3f2ef] text-[#0a66c2] flex items-center justify-center font-bold italic">Drafting Viral Content...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f3f2ef] flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-[#0a66c2]">Ghostwriter Pro</h2>
          <p className="text-gray-500 mb-8 text-sm">Sign in to generate high-converting LinkedIn posts.</p>
          <Link href="/login" className="block w-full bg-[#0a66c2] text-white font-bold py-2 rounded-full">Sign In</Link>
        </div>
      </div>
    );
  }

  const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'elite';

  return (
    <div className="min-h-screen bg-[#f3f2ef] text-[#191919] p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0a66c2] text-white flex items-center justify-center rounded font-black text-sm">in</div>
            <h1 className="text-sm font-bold">Ghostwriter Dashboard</h1>
        </div>
        <span className={`px-2 py-1 rounded text-[10px] font-bold border ${isPro ? 'border-[#0a66c2] text-[#0a66c2] bg-white' : 'bg-gray-200 text-gray-500'}`}>
          {isPro ? 'PRO SUBSCRIPTION' : 'FREE TIER'}
        </span>
      </div>

      {!isPro ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center mt-10">
          <h3 className="text-xl font-bold mb-3">Write Content that Converts</h3>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Unlock the full Ghostwriter tool to generate unlimited posts, optimize your hashtags, and schedule directly to your profile.
          </p>
          <button onClick={handleSubscribe} disabled={subscribing} className="w-full bg-[#0a66c2] text-white font-bold py-3 rounded-full shadow-lg transition-all">
            {subscribing ? 'Opening Secure Portal...' : 'Get Content Pro — $40/mo'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex gap-3 mb-4">
               <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
               <div>
                  <h4 className="text-sm font-bold">Generated Post Preview</h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-tight">Tone: {tone}</p>
               </div>
            </div>
            <div className="text-sm leading-relaxed space-y-4 font-serif italic text-gray-700">
               <p className="font-bold text-gray-900">"Most leaders think {topic} is about numbers. They're wrong. It's actually about empathy..."</p>
               <p>I learned this lesson the hard way in 2022. Here's exactly what I'd do differently today:</p>
               <p>1. Prioritize feedback loops.<br/>2. Focus on intent over impact.<br/>3. Automate the mundane.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Viral Score</p>
                <p className="text-xl font-bold text-emerald-600">89%</p>
             </div>
             <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Optimal Time</p>
                <p className="text-xl font-bold">9:15 AM</p>
             </div>
          </div>

          <button className="w-full bg-[#0a66c2] text-white font-bold py-3 rounded-full shadow-md mt-4">
            Schedule to LinkedIn Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <Suspense><LinkedInDashboard /></Suspense>;
}