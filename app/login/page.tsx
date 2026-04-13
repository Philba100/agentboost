'use client';

import { createClient } from '@supabase/supabase-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const nextDestination = searchParams.get('next') || '/dashboard';

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      setIsLoading(false);
    } else {
      router.push(nextDestination);
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { 
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextDestination)}`
        } 
    });
    if (error) {
      alert(error.message);
      setIsLoading(false);
    } else if (data?.user?.identities?.length === 0) {
      alert('This email is already registered. Please sign in instead.');
      setIsLoading(false);
    } else {
      alert('Confirmation link sent to your email. Please check your inbox and click the link to complete registration.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] font-sans antialiased flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00ff9d]/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Branding */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-12 group">
          <div className="w-8 h-8 bg-gradient-to-br from-[#00ff9d] to-[#00b870] rounded-sm flex items-center justify-center shadow-[0_0_20px_rgba(0,255,157,0.4)] group-hover:scale-110 transition-transform">
             <div className="w-3 h-3 border border-black rotate-45"></div>
          </div>
          <div className="text-xl font-bold tracking-tight text-white uppercase">
            AGENT<span className="font-light text-white/40">BOOST</span>
          </div>
        </Link>

        {/* Login Card */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] p-10 rounded-2xl shadow-2xl backdrop-blur-md relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#00ff9d]/50 to-transparent"></div>
          
          <h2 className="text-xl font-semibold mb-2 text-white tracking-tight text-center">Initialize Session</h2>
          <p className="text-white/30 text-[10px] font-mono uppercase tracking-[0.2em] mb-10 text-center">Secure Authentication Protocol</p>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 ml-1">Identity (Email)</label>
              <input 
                type="email" 
                required
                placeholder="operator@network.io" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
                className="w-full bg-white/[0.03] border border-white/[0.08] p-4 rounded-lg text-sm text-white placeholder:text-white/10 focus:border-[#00ff9d]/50 focus:bg-white/[0.05] outline-none transition-all font-mono" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 ml-1">Access Credentials</label>
              <input 
                type="password" 
                required
                placeholder="••••••••••••" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
                className="w-full bg-white/[0.03] border border-white/[0.08] p-4 rounded-lg text-sm text-white placeholder:text-white/10 focus:border-[#00ff9d]/50 focus:bg-white/[0.05] outline-none transition-all font-mono" 
              />
            </div>

            <div className="pt-4 space-y-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-white text-black font-bold py-4 rounded-lg text-[13px] uppercase tracking-widest hover:bg-[#00ff9d] transition-all shadow-[0_4px_15px_rgba(0,0,0,0.4)] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                ) : 'Authorize Access'}
              </button>

              <button 
                type="button"
                onClick={handleSignUp}
                disabled={isLoading}
                className="w-full bg-transparent border border-white/10 text-white/60 font-semibold py-4 rounded-lg text-[11px] uppercase tracking-widest hover:text-white hover:border-white/30 transition-all"
              >
                Provision New Identity
              </button>
            </div>
          </form>

          {/* Footer Metadata */}
          <div className="mt-12 flex justify-between items-center text-[9px] font-mono text-white/20 uppercase tracking-widest border-t border-white/[0.05] pt-6">
            <span>Status: Encrypted</span>
            <span>v2.4.0-STABLE</span>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-[11px] font-semibold text-white/30 hover:text-[#00ff9d] transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Return to Registry
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="bg-[#050505] min-h-screen"></div>}>
      <LoginContent />
    </Suspense>
  );
}