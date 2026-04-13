'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense, useCallback } from 'react';
import { createClient, User } from '@supabase/supabase-js';
import Link from 'next/link';
import { skills } from '@/lib/skills';

interface Profile {
  id: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const currentSkill = skills.find(s => s.id === 'github-review');

function GitHubDashboard() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const repo = searchParams.get('repo_url') || 'github.com/example/repo';
  const pr = searchParams.get('pr_number') || '104';

  const fetchSessionAndProfile = useCallback(async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles').select('*').eq('id', currentUser.id).single();
        if (profileError) throw profileError;
        setProfile(profileData);
      }
    } catch (err: any) {
      setError('Failed to load user data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSessionAndProfile(); }, [fetchSessionAndProfile]);

  const handleSubscribe = async () => {
    setProcessing(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, userId: user?.id, priceId: currentSkill?.priceId })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error('Invalid checkout URL.');
    } catch (err: any) {
      setError(err.message || 'Payment service unavailable.');
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0d1117] text-purple-400 flex items-center justify-center font-bold animate-pulse">Cloning & Scanning {repo} PR #{pr}...</div>;

  if (!user) {
    return (
      <main className="min-h-screen bg-[#0d1117] text-white flex flex-col items-center justify-center p-8">
        <section className="bg-[#161b22] p-8 rounded-2xl border border-[#30363d] max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">{currentSkill?.name}</h2>
          <p className="text-[#8b949e] mb-8 text-sm">Sign in to view SOC2 vulnerabilities.</p>
          <Link href="/login" className="block w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 text-center rounded-xl">Sign In</Link>
        </section>
      </main>
    );
  }

  const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'enterprise';

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-6 font-sans border-t-4 border-purple-500">
      <header className="flex justify-between items-center border-b border-[#30363d] pb-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Security Analysis</h1>
          <p className="text-purple-400 text-xs font-mono">{repo} / PR #{pr}</p>
        </div>
        <span className={`px-2 py-1 rounded text-[10px] font-bold ${isPro ? 'bg-purple-600 text-white' : 'bg-[#21262d] text-[#8b949e]'}`}>
          {isPro ? 'SECURE' : 'LOCKED'}
        </span>
      </header>

      {error && <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-xl text-sm">{error}</div>}

      {!isPro ? (
        <section className="bg-gradient-to-br from-[#161b22] to-purple-900/10 p-8 text-center rounded-2xl border border-purple-500/30">
          <div className="text-4xl mb-4">{currentSkill?.icon}</div>
          <h3 className="font-bold text-2xl mb-2 text-white">Unlock Full Audit</h3>
          <p className="text-[#8b949e] text-sm mb-6">{currentSkill?.desc}</p>
          <ul className="text-left text-sm space-y-2 mb-8 max-w-xs mx-auto text-[#8b949e]">
            {currentSkill?.benefits.map((b, i) => <li key={i}>✓ {b}</li>)}
          </ul>
          <button onClick={handleSubscribe} disabled={processing} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl">
            {processing ? 'Processing...' : `Upgrade for ${currentSkill?.price}/mo`}
          </button>
        </section>
      ) : (
        <article className="bg-[#161b22] p-5 rounded-2xl border border-red-500/30">
          <h3 className="text-red-400 font-bold mb-2">High Severity: SQL Injection Risk</h3>
          <p className="text-sm font-mono text-[#8b949e] mb-4">File: `src/api/users.ts` Line 42</p>
          <pre className="bg-[#0d1117] p-4 rounded-lg text-xs overflow-x-auto text-red-300 border border-red-900/50">
            {`- const query = "SELECT * FROM users WHERE id = " + req.params.id;`}
            <br />
            <span className="text-green-400">{`+ const query = "SELECT * FROM users WHERE id = $1";`}</span>
          </pre>
        </article>
      )}
    </main>
  );
}

export default function Page() { return <Suspense fallback={<div className="min-h-screen bg-[#0d1117]" />}><GitHubDashboard /></Suspense>; }