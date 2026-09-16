"use client";

interface DesktopHeaderProps {
  activeInferenceSource: string;
  setActiveInferenceSource: (source: string) => void;
  daemonActive?: boolean;
  connectedClients?: number;
}

export default function DesktopHeader({
  activeInferenceSource,
  setActiveInferenceSource,
  daemonActive = true,
  connectedClients = 3
}: DesktopHeaderProps) {
  return (
    <header className="flex justify-between items-center px-6 md:px-12 py-5 border-b border-white/[0.08] sticky top-0 bg-[#0f172a]/90 backdrop-blur-xl z-50 shrink-0 select-none">
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

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-sm font-mono">
          <span className={`w-2 h-2 rounded-full ${daemonActive ? 'bg-[#00ff9d] animate-pulse' : 'bg-red-400'}`}></span>
          <span className="text-slate-300">Daemon Active (127.0.0.1:8765)</span>
          <span className="text-slate-500 hidden xl:inline">({connectedClients} clients connected)</span>
        </div>
      </div>

      {/* Global Model Routing Selector */}
      <div className="flex items-center gap-4">
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
  );
}