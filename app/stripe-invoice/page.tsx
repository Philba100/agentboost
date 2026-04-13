'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function InvoiceDashboard() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [subscribing, setSubscribing] = useState(false);

  const email = searchParams.get('email') || 'client@example.com';
  const amount = parseInt(searchParams.get('amount') || '0');
  const desc = searchParams.get('desc') || 'Professional Services';

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

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

  if (loading) return <div className="min-h-screen bg-[#f6f9fc] text-[#635bff] flex items-center justify-center font-bold italic underline">Generating Stripe Invoice...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f6f9fc] flex flex-col items-center justify-center p-8 text-center font-sans">
        <div className="bg-white p-10 rounded-lg shadow-xl max-w-sm w-full border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-[#635bff]">Stripe Invoicer</h2>
          <p className="text-gray-400 mb-8 text-sm">Sign in to instantly bill your clients.</p>
          <Link href="/login" className="block w-full bg-[#635bff] text-white font-bold py-3 rounded-md">Sign In</Link>
        </div>
      </div>
    );
  }

  const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'elite';

  return (
    <div className="min-h-screen bg-[#f6f9fc] text-[#32325d] p-6 font-sans">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#635bff] rounded flex items-center justify-center text-white font-black text-[10px]">S</div>
            <h1 className="text-sm font-black uppercase tracking-widest">Invoicer</h1>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${isPro ? 'bg-indigo-100 text-[#635bff]' : 'bg-gray-200 text-gray-400'}`}>
          {isPro ? 'STRIPE CONNECTED' : 'STARTER'}
        </span>
      </div>

      {!isPro ? (
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Invoice Draft</h4>
              <div className="flex justify-between items-center blur-sm select-none">
                 <p className="text-lg font-bold">Client: {email}</p>
                 <p className="text-lg font-black text-[#635bff]">{formattedAmount}</p>
              </div>
           </div>

          <div className="bg-white p-8 text-center rounded-lg shadow-2xl border-t-4 border-[#635bff] relative overflow-hidden">
            <h3 className="text-xl font-black mb-3">Connect Your Stripe Account</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Unlock the ability to generate real payment links and send automated invoices directly to your clients.
            </p>
            <button onClick={handleSubscribe} disabled={subscribing} className="w-full bg-[#635bff] text-white font-bold py-4 rounded-md shadow-lg shadow-indigo-200 transition-all">
              {subscribing ? 'Initializing Checkout...' : 'Connect Stripe Account ($10/mo)'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-[#635bff]">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-6 tracking-widest">Invoice Preview</h4>
            
            <div className="mb-8">
               <p className="text-xs text-gray-400 mb-1">Bill To</p>
               <p className="font-bold text-sm">{email}</p>
            </div>

            <div className="bg-[#f6f9fc] p-5 rounded flex justify-between items-center mb-8 border border-gray-100">
               <span className="text-sm font-medium">{desc}</span>
               <span className="text-xl font-black text-[#635bff]">{formattedAmount}</span>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium bg-gray-50 p-3 rounded italic">
               <span>🔒</span> "Payment link will be generated via Stripe API"
            </div>
          </div>
          
          <button className="w-full bg-[#635bff] text-white font-bold py-4 rounded-md shadow-lg text-sm mt-4">
            Generate Live Payment Link
          </button>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <Suspense><InvoiceDashboard /></Suspense>;
}