'use client';
import { useEffect, useState, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// 🛑 Stripe Price ID: Configure via environment variable
const API_ACCESS_PRICE_ID = process.env.NEXT_PUBLIC_API_ACCESS_PRICE_ID || ""; 

function DashboardContent() {
  const [keys, setKeys] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        
        // Fetch Profile Tier
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setProfile(prof);

        // Fetch Keys
        const { data: k } = await supabase.from('api_keys').select('*').eq('user_id', session.user.id);
        setKeys(k || []);
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
      const res = await fetch('/api/checkout', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, userId: user.id, priceId: API_ACCESS_PRICE_ID })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setSubscribing(false);
    } catch (err) { setSubscribing(false); }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#00ff9d] border-t-transparent rounded-full animate-spin"></div></div>;

  if (!user) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white font-sans">
      <p className="mb-4 text-gray-500 uppercase tracking-widest text-xs">Authentication Required</p>
      <Link href="/login" className="bg-[#00ff9d] text-black px-6 py-2 rounded font-bold">Sign In</Link>
    </div>
  );

  const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'elite';

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] p-10 font-sans antialiased">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Operator <span className="text-[#00ff9d] font-light">Console</span></h1>
          <span className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border ${isPro ? 'border-[#00ff9d] text-[#00ff9d]' : 'border-red-500 text-red-500'}`}>
            STATUS: {isPro ? 'AUTHORIZED' : 'RESTRICTED'}
          </span>
        </div>

        {!isPro ? (
          <div className="bg-[#0a0a0a] border border-white/10 p-10 rounded-2xl text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <h2 className="text-2xl font-bold mb-4 text-white">API Access Locked</h2>
            <p className="text-white/40 mb-8 text-sm max-w-lg mx-auto leading-relaxed">
              You must provision an Enterprise API License to generate headless authentication keys for OpenClaw and MCP environments.
            </p>
            <button onClick={handleCheckout} disabled={subscribing} className="bg-white text-black font-bold px-10 py-4 rounded-lg text-sm uppercase tracking-widest hover:bg-[#00ff9d] transition-all">
              {subscribing ? 'Initializing Checkout...' : 'Purchase API License - $199/mo'}
            </button>
          </div>
        ) : (
          <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-white/10 shadow-2xl">
            <h2 className="text-xl font-bold mb-2 text-white">Provisioned Keys</h2>
            <p className="text-white/40 text-xs mb-8 uppercase tracking-widest font-mono">Do not share these secrets.</p>
            
            <div className="space-y-3 mb-8">
              {keys.length === 0 && <p className="text-white/20 text-sm italic">No keys provisioned yet.</p>}
              {keys.map(k => (
                <div key={k.id} className="bg-black p-4 rounded-lg font-mono text-sm border border-white/5 flex justify-between items-center group">
                  <span className="text-[#00ff9d] opacity-80 group-hover:opacity-100 transition">{k.key_secret}</span>
                  <span className="text-white/30 uppercase text-[10px] bg-white/5 px-2 py-1 rounded">{k.name}</span>
                </div>
              ))}
            </div>
            
            <button onClick={generateKey} className="bg-white/5 border border-white/10 text-white font-bold px-6 py-3 rounded-lg text-xs uppercase tracking-widest hover:bg-[#00ff9d] hover:text-black transition-all">
              + Generate New Key
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return <Suspense><DashboardContent/></Suspense>
}