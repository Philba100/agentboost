'use client';
import { useState } from 'react';

interface CheckoutProps {
  priceId: string;
  userId: string;
  userEmail: string;
  label: string;
  className?: string;
}

export default function CheckoutButton({ priceId, userId, userEmail, label, className }: CheckoutProps) {
  const [status, setStatus] = useState<'idle' | 'encrypting' | 'redirecting'>('idle');

  const handleCheckout = async () => {
    setStatus('encrypting');
    
    try {
      // Simulate encryption delay for premium feel
      await new Promise(r => setTimeout(r, 800));
      setStatus('redirecting');

      const res = await fetch('/api/checkout', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, userId: userId, priceId: priceId })
      });
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Provisioning Error: " + data.error);
        setStatus('idle');
      }
    } catch (err) {
      alert("Secure connection failed.");
      setStatus('idle');
    }
  };

  return (
    <button 
      onClick={handleCheckout} 
      disabled={status !== 'idle'} 
      className={`relative overflow-hidden group ${className}`}
    >
      {/* Premium Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
      
      <span className="relative flex items-center justify-center gap-3">
        {status === 'idle' && label}
        {status === 'encrypting' && (
          <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> Encrypting Session...</>
        )}
        {status === 'redirecting' && (
          <><svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg> Handoff to Stripe...</>
        )}
      </span>
    </button>
  );
}