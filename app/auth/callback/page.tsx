'use client';
import { useEffect } from 'react';
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

  useEffect(() => {
    // Supabase automatically detects the #access_token in the URL and creates the session.
    // We just listen for it to finish, then redirect them to the requested destination.
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push(nextDestination);
      }
    });
  }, [router, nextDestination]);

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