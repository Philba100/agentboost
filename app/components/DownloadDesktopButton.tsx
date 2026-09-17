"use client";

import { useEffect, useState } from 'react';
import { isTauri } from '@/lib/tauri';

const MSI_DOWNLOAD_URL =
  'https://lewgsyjntzsqfxdtkcin.supabase.co/storage/v1/object/public/installers/AgentBoost_0.1.0_x64_en-US.msi';

export default function DownloadDesktopButton({
  variant = 'hero'
}: {
  variant?: 'hero' | 'header' | 'minimal';
}) {
  const [inDesktopApp, setInDesktopApp] = useState(false);

  useEffect(() => {
    isTauri().then((tauri) => setInDesktopApp(tauri));
  }, []);

  if (inDesktopApp) {
    return (
      <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        Desktop Active
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <a
        href={MSI_DOWNLOAD_URL}
        download="AgentBoost_0.1.0_x64_en-US.msi"
        className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-300 text-xs font-mono hover:border-slate-500 hover:text-white transition cursor-pointer"
      >
        <span>💻</span> Download Desktop (.msi)
      </a>
    );
  }

  return (
    <a
      href={MSI_DOWNLOAD_URL}
      download="AgentBoost_0.1.0_x64_en-US.msi"
      className="px-5 py-3 bg-transparent border border-slate-700/80 text-slate-300 font-mono text-xs rounded-xl hover:text-white hover:border-[#00ff9d]/50 transition flex items-center gap-2 cursor-pointer"
    >
      <span>💻</span> Download Windows Installer (.msi)
    </a>
  );
}