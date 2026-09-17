'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MSI_DOWNLOAD_URL =
  'https://lewgsyjntzsqfxdtkcin.supabase.co/storage/v1/object/public/installers/AgentBoost_0.1.0_x64_en-US.msi';

export default function WorkspaceActions() {
  const [busyAction, setBusyAction] = useState<'launch' | 'download' | null>(null);
  const router = useRouter();

  const handleLaunch = async () => {
    setBusyAction('launch');
    if (typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__) {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('spawn_agent', { skillId: 'all', name: 'AgentBoost Workspace' });
      } catch (err) {
        console.warn('Tauri native window invocation bypassed, routing to web workspace:', err);
        router.push('/dashboard');
      }
    } else {
      router.push('/dashboard');
    }
    setBusyAction(null);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        type="button"
        onClick={handleLaunch}
        disabled={busyAction !== null}
        className="bg-[#00ff9d] text-[#0f172a] font-semibold text-sm px-8 py-4 rounded-md hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,157,0.2)] disabled:opacity-70 cursor-pointer"
      >
        {busyAction === 'launch' ? 'Initializing...' : 'Launch Workspace'}
        <span aria-hidden="true">→</span>
      </button>

      <a
        href={MSI_DOWNLOAD_URL}
        download="AgentBoost_0.1.0_x64_en-US.msi"
        className="flex items-center gap-3 px-6 py-4 text-slate-300 font-mono text-[13px] border border-slate-700 rounded-md bg-slate-800/50 backdrop-blur-sm hover:border-slate-500 transition-colors justify-center cursor-pointer"
      >
        <span className="text-[#00ff9d]">$</span> download_desktop --msi
      </a>
    </div>
  );
}