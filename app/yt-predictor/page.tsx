'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function YTDashboard() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [subscribing, setSubscribing] = useState(false);

  const title = searchParams.get('title') || 'Your Video Title';
  const concept = searchParams.get('concept') || 'Analyzing concept...';

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

  if (loading) return <div className="min-h-screen bg-[#0f0f0f] text-[#ff0000] flex items-center justify-center font-bold animate-pulse">Running Vision AI Analysis...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-8 text-center font-sans">
        <div className="bg-[#212121] p-10 rounded-2xl shadow-xl max-w-sm w-full border border-[#333]">
          <h2 className="text-2xl font-bold mb-4 text-[#ff0000] italic">CreatorPro AI</h2>
          <p className="text-gray-400 mb-8 text-sm">Sign in to predict your thumbnail performance.</p>
          <Link href="/login" className="block w-full bg-[#ff0000] text-white font-bold py-3 rounded-full uppercase tracking-widest text-xs">Sign In</Link>
        </div>
      </div>
    );
  }

  const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'elite';

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
            <div className="w-8 h-6 bg-[#ff0000] rounded flex items-center justify-center text-white">
                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
            </div>
            <h1 className="text-sm font-bold tracking-tight">Thumbnail Lab</h1>
        </div>
        <span className={`px-2 py-1 rounded text-[10px] font-bold ${isPro ? 'bg-[#ff0000]/20 text-[#ff0000] border border-[#ff0000]/30' : 'bg-[#333] text-gray-500'}`}>
          {isPro ? 'PRO ACTIVE' : 'STARTER'}
        </span>
      </div>

      <div className="bg-[#212121] p-4 rounded-xl border border-[#333] mb-6">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Target Title</p>
          <h2 className="text-sm font-medium line-clamp-2">{title}</h2>
      </div>

      {!isPro ? (
        <div className="space-y-6">
           <div className="bg-[#000] aspect-video rounded-lg border-2 border-dashed border-[#444] flex items-center justify-center flex-col text-center p-4">
              <span className="text-gray-600 text-3xl mb-2">👁️</span>
              <p className="text-gray-500 text-xs font-bold uppercase">Heatmap Prediction Locked</p>
           </div>

          <div className="bg-gradient-to-b from-[#212121] to-[#0f0f0f] p-8 text-center rounded-2xl border border-[#333] shadow-2xl">
            <h3 className="text-xl font-bold mb-3 italic">Increase Your CTR</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Unlock AI Eye-Tracking Heatmaps and competitive analysis to see exactly where viewers will look first.
            </p>
            <button onClick={handleSubscribe} disabled={subscribing} className="w-full bg-white text-black font-bold py-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95">
              {subscribing ? 'Initializing...' : 'Get Vision Pro — $20/mo'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-[#212121] p-5 rounded-2xl border border-[#333] text-center">
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Predicted CTR</p>
                <p className="text-3xl font-black text-[#ff0000]">8.4%</p>
             </div>
             <div className="bg-[#212121] p-5 rounded-2xl border border-[#333] text-center">
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Retention Potential</p>
                <p className="text-3xl font-black text-emerald-500">High</p>
             </div>
          </div>
          
          <div className="bg-[#212121] p-6 rounded-2xl border border-[#333]">
             <h4 className="text-xs font-bold uppercase text-gray-500 mb-4 tracking-widest">Visual Feedback</h4>
             <ul className="text-sm space-y-4 text-gray-300">
                <li className="flex gap-3"><span className="text-emerald-500 font-bold">✓</span> Facial expression is highly emotive.</li>
                <li className="flex gap-3"><span className="text-[#ff0000] font-bold">!</span> Background saturation is too low for mobile.</li>
                <li className="flex gap-3"><span className="text-emerald-500 font-bold">✓</span> Strong contrast between subject and house.</li>
             </ul>
          </div>

          <button className="w-full bg-[#3ea6ff] text-[#0f0f0f] font-bold py-4 rounded-full shadow-lg text-sm mt-4 uppercase tracking-tighter">
            Generate 3 Alternative Concepts
          </button>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <Suspense><YTDashboard /></Suspense>;
}