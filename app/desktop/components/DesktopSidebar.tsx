"use client";

interface DesktopSidebarProps {
  currentScreen: 'terminal' | 'tenders' | 'paperwork' | 'models' | 'gateway';
  setCurrentScreen: (screen: 'terminal' | 'tenders' | 'paperwork' | 'models' | 'gateway') => void;
  systemRamGb: number;
}

export default function DesktopSidebar({
  currentScreen,
  setCurrentScreen,
  systemRamGb
}: DesktopSidebarProps) {
  return (
    <aside className="w-64 border-r border-slate-700/80 bg-[#1e293b] flex flex-col justify-between p-4 shrink-0 h-full select-none">
      <div className="space-y-6">
        {/* Workspace Navigation */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5 px-2 font-mono">
            Workspaces
          </span>
          <nav className="space-y-1">
            {[
              { id: 'terminal', label: 'AI Chat & Tool Calling', icon: '⚡', badge: '60+ Tools' },
              { id: 'tenders', label: 'Tenders & Bidding', icon: '📋', badge: 'Tender Core' },
              { id: 'paperwork', label: 'Corporate Paperwork', icon: '📑', badge: '5 Suites' },
              { id: 'models', label: 'Local Models & AI Hub', icon: '🧠', badge: 'Gemma 4' },
              { id: 'gateway', label: 'Gateway & Audit Logs', icon: '🔌', badge: ':8765' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentScreen(tab.id as any)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition cursor-pointer ${
                  currentScreen === tab.id
                    ? 'bg-[#00ff9d]/15 text-[#00ff9d] border border-[#00ff9d]/40 shadow-sm'
                    : 'text-slate-300 hover:bg-[#0f172a]/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </div>
                <span className="text-[10px] font-mono opacity-60">{tab.badge}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Live Hardware Telemetry Profile */}
        <div className="p-3.5 rounded-xl bg-[#0f172a] border border-slate-700 space-y-2 text-xs font-mono">
          <span className="text-slate-400 uppercase text-[10px] tracking-wider block font-bold">Hardware Profile</span>
          <div className="flex justify-between text-slate-300">
            <span>System RAM:</span>
            <span className="text-emerald-400 font-bold">{systemRamGb} GB Assigned</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Local GPU:</span>
            <span className="text-cyan-400 font-medium">Metal / CUDA Ready</span>
          </div>
        </div>
      </div>

      {/* Bottom Settings Button with safe margin */}
      <div className="pb-8 mb-4">
        <button
          onClick={() => setCurrentScreen('models')}
          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition cursor-pointer border ${
            currentScreen === 'models'
              ? 'bg-[#00ff9d]/15 text-[#00ff9d] border-[#00ff9d]/40 shadow-sm'
              : 'text-slate-300 border-slate-700 hover:bg-[#0f172a] hover:text-white'
          }`}
        >
          <span className="text-base">⚙️</span>
          <span>Model &amp; API Settings</span>
        </button>
      </div>
    </aside>
  );
}