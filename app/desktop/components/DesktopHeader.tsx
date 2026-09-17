"use client";

import { useState, useEffect } from 'react';
import { AuditLog } from '../page';
import UpdateNotificationModal, { UpdateInfo } from './UpdateNotificationModal';

interface DesktopHeaderProps {
  activeInferenceSource: string;
  setActiveInferenceSource: (source: string) => void;
  daemonActive?: boolean;
  connectedClients?: number;
  auditLogs?: AuditLog[];
}

export default function DesktopHeader({
  activeInferenceSource,
  setActiveInferenceSource,
  daemonActive = true,
  connectedClients = 3,
  auditLogs = []
}: DesktopHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState<UpdateInfo | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Check for desktop version updates on mount
  useEffect(() => {
    const checkUpdates = async () => {
      try {
        const res = await fetch('/api/desktop/update?current=0.1.0');
        if (res.ok) {
          const data: UpdateInfo = await res.json();
          if (data.update_available) {
            setUpdateAvailable(data);
          }
        }
      } catch (err) {
        console.warn('Update check bypassed:', err);
      }
    };

    checkUpdates();
    const interval = setInterval(checkUpdates, 15 * 60 * 1000); // Check every 15 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="flex justify-between items-center px-6 md:px-12 py-4 border-b border-white/[0.08] sticky top-0 bg-[#0f172a]/95 backdrop-blur-xl z-40 shrink-0 select-none">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-br from-[#00ff9d] to-[#00b870] rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.3)]">
              <div className="w-2.5 h-2.5 border border-[#0f172a] rotate-45"></div>
            </div>
            <div className="text-lg font-bold tracking-tight text-white flex items-center">
              AGENT<span className="font-light text-white/50">BOOST</span>
              <span className="ml-3 text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#1e293b] text-slate-300 border border-slate-700">
                Workstation
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-white/20"></div>

          {/* Status Indicator Pill */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${daemonActive ? 'bg-[#00ff9d] animate-pulse' : 'bg-red-400'}`}></span>
            <span className="text-slate-300">Daemon Active (127.0.0.1:8765)</span>
            <span className="text-slate-500 hidden xl:inline">({connectedClients} clients connected)</span>
          </div>

          {/* Live Update Available Alert Badge */}
          {updateAvailable && (
            <button
              onClick={() => setShowUpdateModal(true)}
              style={{ color: '#0f172a' }}
              className="animate-bounce inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00ff9d] text-[#0f172a] font-mono text-[11px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,157,0.3)] hover:bg-emerald-300 transition cursor-pointer"
            >
              <span>🚀</span> Update to v{updateAvailable.latest_version} Available
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 relative">
          {/* Notification Bell with Live Alerts */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-[#1e293b] border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition cursor-pointer"
            title="Notification & Alerts Center"
          >
            <span className="text-sm">🔔</span>
            {auditLogs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00ff9d] text-[#0f172a] font-bold text-[9px] flex items-center justify-center font-mono">
                {auditLogs.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-60 top-12 w-80 bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in font-mono text-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                <span className="font-bold text-white uppercase text-[11px]">Active System Alerts</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="divide-y divide-slate-800/80 max-h-64 overflow-y-auto my-2 no-scrollbar">
                {updateAvailable && (
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      setShowUpdateModal(true);
                    }}
                    className="py-2.5 space-y-1 bg-[#00ff9d]/5 p-2 rounded-xl border border-[#00ff9d]/20 cursor-pointer hover:bg-[#00ff9d]/10 transition mb-2"
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[#00ff9d] font-bold">WORKSTATION UPDATE</span>
                      <span className="text-[#00ff9d]">v{updateAvailable.latest_version}</span>
                    </div>
                    <p className="text-slate-200 font-sans text-xs">
                      A new desktop update is available. Click to download and install.
                    </p>
                  </div>
                )}
                {auditLogs.length === 0 && !updateAvailable ? (
                  <p className="text-slate-500 py-3 text-center">No alerts recorded.</p>
                ) : (
                  auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="py-2.5 space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-[#00ff9d] font-bold">{log.system}</span>
                        <span className="text-slate-500">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-300 font-sans text-xs line-clamp-2">{log.operation}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-2 border-t border-slate-800 text-center">
                <span className="text-[10px] text-slate-500">Autonomous Accountability Sentinel Active</span>
              </div>
            </div>
          )}

          {/* Inference Model Routing Selector */}
          <select
            value={activeInferenceSource}
            onChange={(e) => setActiveInferenceSource(e.target.value)}
            className="bg-[#1e293b] border border-slate-700 hover:border-slate-500 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-200 outline-none font-mono cursor-pointer transition shadow-sm"
          >
            <option>In-Process Deterministic Core (Fastpath)</option>
            <option>LM Studio (127.0.0.1:1234 / Local)</option>
            <option>Ollama (127.0.0.1:11434 / Local)</option>
            <option>Claude 3.5 Sonnet (Direct API)</option>
            <option>GPT-4o Enterprise (Direct API)</option>
          </select>
        </div>
      </header>

      {/* Modal Dialog for Update Installation */}
      {showUpdateModal && updateAvailable && (
        <UpdateNotificationModal
          updateInfo={updateAvailable}
          onClose={() => setShowUpdateModal(false)}
        />
      )}
    </>
  );
}