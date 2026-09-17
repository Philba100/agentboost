"use client";

import { useState } from 'react';

export interface UpdateInfo {
  update_available: boolean;
  current_version: string;
  latest_version: string;
  release_date: string;
  download_url: string;
  fallback_exe_url?: string;
  release_notes: string[];
}

interface UpdateModalProps {
  updateInfo: UpdateInfo;
  onClose: () => void;
}

export default function UpdateNotificationModal({ updateInfo, onClose }: UpdateModalProps) {
  const [status, setStatus] = useState<'idle' | 'downloading' | 'installing' | 'completed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);

  const handleInstallUpdate = async () => {
    setStatus('downloading');
    setProgressPercent(15);

    // Simulated download progress indicator
    const timer = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 85) {
          clearInterval(timer);
          return 90;
        }
        return prev + 25;
      });
    }, 450);

    try {
      // 1. Check if running inside native Tauri container
      if (typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__) {
        const { invoke } = await import('@tauri-apps/api/core');
        setStatus('installing');
        setProgressPercent(95);

        const res = await invoke<string>('install_desktop_update', {
          downloadUrl: updateInfo.download_url
        });

        clearInterval(timer);
        setProgressPercent(100);
        setStatus('completed');
      } else {
        // Fallback: Browser download trigger
        clearInterval(timer);
        setProgressPercent(100);
        window.location.href = updateInfo.download_url;
        setStatus('completed');
      }
    } catch (err: any) {
      clearInterval(timer);
      setStatus('error');
      setErrorMessage(err?.message || 'Update installation failed. You can download the installer manually.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070c14]/90 backdrop-blur-md p-4 animate-in fade-in duration-150 select-none">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative z-10 bg-[#0f172a] border border-[#00ff9d]/40 rounded-3xl max-w-lg w-full p-7 shadow-[0_0_80px_rgba(0,0,0,0.85)] flex flex-col font-mono text-xs">
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 text-[10px] font-bold uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-ping"></span>
              Workstation Upgrade Available
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight font-sans">
              AgentBoost v{updateInfo.latest_version}
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Current version: <strong>v{updateInfo.current_version}</strong> • Released: {updateInfo.release_date}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Release Notes */}
        <div className="my-5 space-y-3">
          <span className="text-slate-400 uppercase text-[10px] tracking-wider block font-bold">
            What&apos;s New in v{updateInfo.latest_version}:
          </span>
          <div className="bg-[#070c14] border border-slate-800 rounded-2xl p-4 max-h-48 overflow-y-auto no-scrollbar space-y-2.5 font-sans text-xs text-slate-300">
            {updateInfo.release_notes.map((note, index) => (
              <div key={index} className="flex items-start gap-2.5">
                <span className="text-[#00ff9d] font-bold">✓</span>
                <span className="leading-relaxed">{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar (Visible during download/install) */}
        {(status === 'downloading' || status === 'installing') && (
          <div className="mb-4 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{status === 'downloading' ? 'Downloading installer binary...' : 'Launching installer...'}</span>
              <span className="text-[#00ff9d] font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#00ff9d] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {status === 'completed' && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-sans text-xs text-center">
            ✓ Update package launched. Follow the setup prompts to finalize the installation.
          </div>
        )}

        {status === 'error' && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-sans text-xs">
            {errorMessage}
          </div>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer font-sans"
          >
            Remind Me Later
          </button>

          <button
            onClick={handleInstallUpdate}
            disabled={status === 'downloading' || status === 'installing'}
            style={{ color: '#0f172a' }}
            className="px-6 py-2.5 bg-[#00ff9d] hover:bg-emerald-300 disabled:opacity-50 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-[0_0_15px_rgba(0,255,157,0.3)] !text-[#0f172a]"
          >
            {status === 'downloading'
              ? 'Downloading...'
              : status === 'installing'
              ? 'Installing...'
              : status === 'completed'
              ? 'Re-launch Installer'
              : 'Download & Install Now ⚡'}
          </button>
        </div>
      </div>
    </div>
  );
}