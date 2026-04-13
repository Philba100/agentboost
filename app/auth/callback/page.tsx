'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextDestination = searchParams.get('next') || '/dashboard';
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let redirected = false;
    let timeoutId: NodeJS.Timeout;

    const handleAuth = async () => {
      try {
        // Get current session immediately
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // User is already authenticated, redirect immediately
          if (!redirected) {
            redirected = true;
            router.push(nextDestination);
          }
          return;
        }

        // Listen for auth changes (e.g., from email confirmation)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user && !redirected) {
            redirected = true;
            router.push(nextDestination);
          }
        });

        // Timeout after 5 minutes if no auth event
        timeoutId = setTimeout(() => {
          if (!redirected) {
            setError('Authentication timeout. Please try logging in again.');
            redirected = true;
          }
        }, 5 * 60 * 1000);

        return () => {
          subscription?.unsubscribe();
          clearTimeout(timeoutId);
        };
      } catch (err) {
        setError('Authentication failed. Please try again.');
        console.error(err);
      }
    };

    handleAuth();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [router, nextDestination]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0e14] text-red-400 flex flex-col items-center justify-center font-bold">
        <p className="mb-4">{error}</p>
        <a href="/login" className="text-[#00ff9d] hover:underline">
          Return to Login
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#00ff9d] flex flex-col items-center justify-center font-bold">
      <div className="w-12 h-12 border-4 border-[#00ff9d] border-t-transparent rounded-full animate-spin mb-4"></div>
      Confirming your secure login...
    </div>
  );
}

import { Suspense } from 'react';

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0b0e14] text-[#00ff9d] flex flex-col items-center justify-center font-bold">
        <div className="w-12 h-12 border-4 border-[#00ff9d] border-t-transparent rounded-full animate-spin mb-4"></div>
        Loading...
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}