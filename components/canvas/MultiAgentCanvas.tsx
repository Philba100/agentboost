"use client";
import { useState } from 'react';

interface AgentNode {
  id: string;
  name: string;
  icon: string;
  status: 'idle' | 'processing' | 'completed';
  output?: string;
}

export default function MultiAgentCanvas() {
  const [pipeline, setPipeline] = useState<AgentNode[]>([
    { id: 'lead-scraper', name: 'Lead Scraper Pro', icon: '🔍', status: 'completed', output: 'Found 12 matching enterprise domains.' },
    { id: 'bant-qualifier', name: 'BANT Qualifier', icon: '📊', status: 'processing', output: 'Evaluating budget compliance and authority vectors...' },
    { id: 'contract-draft', name: 'Contract Generator', icon: '📝', status: 'idle' }
  ]);

  const [globalInput, setGlobalInput] = useState("Run complete market check on financial technology providers in NYC region.");

  return (
    <div className="bg-[#0b1220] border border-slate-800 rounded-xl p-6 min-h-[500px] flex flex-col justify-between">
      {/* Top Workspace Bar */}
      <div className="border-b border-slate-800 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span>🧠</span> System Core Workspace: Multi-Agent Orchestrator
        </h2>
        <p className="text-slate-400 text-sm">Chain multiple independent skill profiles sequentially to handle complex enterprise objectives.</p>
      </div>

      {/* Main Interactive Assembly Track */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 my-auto overflow-x-auto p-4">
        {pipeline.map((agent, index) => (
          <div key={agent.id} className="flex flex-col lg:flex-row items-center w-full lg:w-auto">
            {/* Individual Agent Card Node */}
            <div className={`w-64 bg-[#1e293b] border rounded-xl p-5 shadow-xl transition-all duration-300 ${
              agent.status === 'processing' ? 'border-[#00ff9d] ring-1 ring-[#00ff9d]/30 scale-105' : 'border-slate-700'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl p-2 bg-[#0b1220] rounded-lg border border-slate-800">{agent.icon}</span>
                <div>
                  <h4 className="font-bold text-white text-sm tracking-wide">{agent.name}</h4>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    agent.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                    agent.status === 'processing' ? 'bg-cyan-500/10 text-cyan-400 animate-pulse' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {agent.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Agent Log Console Out */}
              <div className="bg-[#0b1220] rounded-lg p-2.5 text-xs font-mono text-slate-300 h-16 overflow-y-auto border border-slate-900">
                {agent.output ? agent.output : "Awaiting upstream input stream data..."}
              </div>
            </div>

            {/* Connection Arrow between Pipelines */}
            {index < pipeline.length - 1 && (
              <div className="text-xl text-[#00ff9d] font-bold my-3 lg:my-0 lg:mx-4 transform rotate-90 lg:rotate-0 animate-pulse">
                ──►
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Global Control Terminal input */}
      <div className="mt-8 bg-[#131e31] p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          value={globalInput}
          onChange={(e) => setGlobalInput(e.target.value)}
          className="w-full bg-[#0b1220] border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00ff9d] transition-all"
        />
        <button className="w-full sm:w-auto whitespace-nowrap px-6 py-3 bg-gradient-to-r from-[#00ff9d] to-emerald-500 text-[#0f172a] font-bold text-sm rounded-lg hover:shadow-lg hover:shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
          🚀 Run Pipeline Team
        </button>
      </div>
    </div>
  );
}
