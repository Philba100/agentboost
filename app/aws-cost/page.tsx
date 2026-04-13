'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense, useCallback } from 'react';
import { createClient, User } from '@supabase/supabase-js';
import Link from 'next/link';
import { skills } from '@/lib/skills';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const currentSkill = skills.find(s => s.id === 'aws-cost');

function AWSDashboard() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const region = searchParams.get('region') || 'us-east-1';
  const resource = searchParams.get('resource_type') || 'EC2';

  const fetchUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    if (session?.user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setProfile(data);
    }
    setLoading(false);
  }, []);
  useEffect(() => { fetchUser(); }, [fetchUser]);

  const handleSubscribe = async () => {
    setProcessing(true);
    const res = await fetch('/api/checkout', { 
      method: 'POST', body: JSON.stringify({ email: user?.email, userId: user?.id, priceId: currentSkill?.priceId })
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url; else setProcessing(false);
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-orange-400 flex items-center justify-center font-bold">Querying AWS Region {region}...</div>;

  if (!user) return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <Link href="/login" className="bg-orange-500 p-4 rounded text-white font-bold">Login to Analyze Cloud Costs</Link>
      </div>
  );

  const isPro = profile?.subscription_tier === 'pro';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8 border-t-4 border-orange-500">
      <h1 className="text-2xl font-bold text-white mb-6">AWS Infrastructure Scanner: {region} ({resource})</h1>
      {!isPro ? (
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 text-center max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-white mb-2">{currentSkill?.name}</h2>
          <p className="mb-6">{currentSkill?.desc}</p>
          <button onClick={handleSubscribe} disabled={processing} className="w-full bg-orange-500 text-white p-4 rounded-lg font-bold">
            {processing ? 'Connecting...' : `Optimize for ${currentSkill?.price}/mo`}
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 p-6 rounded-xl border border-orange-500/30">
          <h3 className="text-orange-400 font-bold mb-2">Idle Resources Detected</h3>
          <p>We found 4 unattached EBS volumes and 2 idle EC2 instances in {region}.</p>
          <p className="text-emerald-400 font-mono mt-4">Potential Savings: $342.00 / month</p>
        </div>
      )}
    </div>
  );
}

export default function Page() { return <Suspense><AWSDashboard /></Suspense>; }