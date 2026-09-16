"use client";

import { useEffect, useState } from 'react';
import { isTauri } from '@/lib/tauri';

export default function DownloadDesktopButton({
  variant = 'hero'
}: {
  variant?: 'hero' | 'header' | 'minimal';
}) {
  const [inDesktopApp, setInDesktopApp] = useState(false);
  const [detectedOs, setDetectedOs] = useState<'windows' | 'mac' | 'linux'>('windows');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // 1. Detect if the user is already inside the Tauri desktop window
    isTauri().then((tauri) => setInDesktopApp(tauri));

    // 2. Detect the visitor's OS from userAgent
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.includes('mac')) setDetectedOs('mac');
      else if (ua.includes('linux')) setDetectedOs('linux');
      else setDetectedOs('windows');
    }
  }, []);

  const triggerDownload = (targetPlatform: string) => {
    setShowDropdown(false);
    // Directly routes the browser to download the installer binary
    window.location.href = `/api/download/desktop?platform=${targetPlatform}`;
  };

  // If already running inside the desktop app, display an active badge instead of a download link
  if (inDesktopApp) {
    if (variant === 'header') {
      return (
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Desktop Active
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        Native Workspace Active
      </div>
    );
  }

  const osLabel = detectedOs === 'mac' ? 'macOS' : detectedOs === 'linux' ? 'Linux' : 'Windows';

  // Navigation Header Variant
  if (variant === 'header') {
    return (
      <button
        onClick={() => triggerDownload(detectedOs)}
        className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-300 text-xs font-mono hover:border-slate-500 hover:text-white transition cursor-pointer"
      >
        <span>💻</span> Download Desktop ({osLabel})
      </button>
    );
  }

  // Hero Section Primary Trigger with Multiple OS Option
  return (
    <div className="relative inline-block">
      <div className="flex items-center">
        <button
          onClick={() => triggerDownload(detectedOs)}
          className="px-4 py-3 bg-transparent border border-slate-700/80 text-slate-300 font-mono text-xs rounded-l-xl hover:text-white hover:border-[#00d984]/50 transition flex items-center gap-2 cursor-pointer"
        >
          <span>💻</span> Download for {osLabel}
        </button>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="px-2.5 py-3 bg-slate-800/80 border-y border-r border-slate-700/80 text-slate-400 hover:text-white rounded-r-xl transition text-xs font-mono cursor-pointer"
          title="Choose platform"
        >
          ▾
        </button>
      </div>

      {/* Alternative Platforms Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 mt-2 w-48 bg-[#0c131f] border border-slate-800 rounded-xl shadow-2xl p-1.5 z-30 font-mono text-xs animate-in fade-in duration-150">
          <button
            onClick={() => triggerDownload('windows')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between"
          >
            <span>Windows (.msi)</span>
            {detectedOs === 'windows' && <span className="text-emerald-400 text-[10px]">Detected</span>}
          </button>
          <button
            onClick={() => triggerDownload('mac')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between"
          >
            <span>macOS (.dmg)</span>
            {detectedOs === 'mac' && <span className="text-emerald-400 text-[10px]">Detected</span>}
          </button>
          <button
            onClick={() => triggerDownload('linux')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between"
          >
            <span>Linux (.AppImage)</span>
            {detectedOs === 'linux' && <span className="text-emerald-400 text-[10px]">Detected</span>}
          </button>
        </div>
      )}
    </div>
  );
}