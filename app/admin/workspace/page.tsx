"use client";
import MultiAgentCanvas from "@/components/canvas/MultiAgentCanvas";
import ExecutiveROIDashboard from "@/components/dashboard/ExecutiveROIDashboard";

export default function EnterpriseWorkspacePage() {
  return (
    <div className="min-h-screen bg-[#060b13] text-slate-100 p-4 lg:p-8 space-y-8">
      {/* Upper Navigation / Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              AgentBoost <span className="text-[#00ff9d]">Enterprise Console</span>
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Secure, decentralized management hub for cross-platform automated agents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#131e31] border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">Target Environment:</span>
            <span className="text-xs bg-[#00ff9d]/10 text-[#00ff9d] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Hybrid Node
            </span>
          </div>
        </div>
      </div>

      {/* Row 1: ROI Financial Ledger Metrics */}
      <section className="w-full animate-fadeIn">
        <ExecutiveROIDashboard />
      </section>

      {/* Row 2: Interactive Pipeline Orchestration Track */}
      <section className="w-full">
        <div className="bg-[#0b1220] border border-slate-800 rounded-xl p-1 shadow-2xl">
          <MultiAgentCanvas />
        </div>
      </section>
    </div>
  );
}
