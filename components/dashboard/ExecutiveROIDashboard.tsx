"use client";

import { useState, useEffect } from 'react';

export default function ExecutiveROIDashboard() {
  const [stats, setStats] = useState({
    totalSavings: 4820.50,
    tokensSaved: 12540000,
    privateExecutions: 842,
    activeAgents: 100,
    localComputePercent: 88,
  });

  // Small animation effect for the numbers
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (count < stats.localComputePercent) setCount(prev => prev + 1);
    }, 20);
    return () => clearTimeout(timer);
  }, [count, stats.localComputePercent]);

  return (
    <div className="bg-[#0b1220] border border-slate-800 rounded-xl overflow-hidden">
      {/* Header Section */}
      <div className="bg-[#1e293b] p-6 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-[#00ff9d]">💰</span> Compute Savings Ledger
          </h2>
          <p className="text-slate-400 text-sm mt-1">Real-time ROI analysis of private on-device automation.</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Live Audit Mode</span>
          <div className="flex items-center gap-2 justify-end mt-1">
            <div className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse"></div>
            <span className="text-[#00ff9d] font-mono text-xs">SECURE NODE ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-800">
        <div className="bg-[#0b1220] p-6">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Cost Savings</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-white">${stats.totalSavings.toLocaleString()}</h3>
            <span className="text-emerald-400 text-xs font-semibold">+12.4%</span>
          </div>
          <p className="text-slate-500 text-[10px] mt-2 italic">Est. cloud API costs avoided this month</p>
        </div>

        <div className="bg-[#0b1220] p-6">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Tokens Processed Locally</p>
          <h3 className="text-3xl font-bold text-white">{(stats.tokensSaved / 1000000).toFixed(1)}M</h3>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#00ff9d] h-full transition-all duration-1000"
              style={{ width: `${stats.localComputePercent}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-[#0b1220] p-6">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Private Executions</p>
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-bold text-white">{stats.privateExecutions}</h3>
            <div className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/30 rounded text-indigo-400 text-[10px] font-bold">
              ZERO-TRUST
            </div>
          </div>
          <p className="text-slate-500 text-[10px] mt-2">Verified zero-leak hardware runs</p>
        </div>

        <div className="bg-[#0b1220] p-6">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Active Skill Matrices</p>
          <h3 className="text-3xl font-bold text-white">{stats.activeAgents}</h3>
          <div className="flex gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-full h-1 bg-[#00ff9d] rounded-full opacity-60"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <div className="p-6 bg-[#0b1220] border-t border-slate-800 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            Efficiency Breakdown: Local vs. Cloud
          </h4>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="stroke-slate-800"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-[#00ff9d]"
                  strokeWidth="3"
                  strokeDasharray={`${count}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-white font-bold text-lg">{count}%</span>
                <span className="text-slate-500 text-[8px] uppercase">Local</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">On-Device Compute (Gemma 4 / Llama 3)</span>
                <span className="text-white font-bold">{stats.localComputePercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-[#00ff9d] h-full" style={{ width: `${stats.localComputePercent}%` }}></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Cloud Failover / Routing</span>
                <span className="text-white font-bold">{100 - stats.localComputePercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full" style={{ width: `${100 - stats.localComputePercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-72 bg-[#131e31] rounded-lg p-4 border border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-tighter">Security Audit Trail</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5"></div>
              <p className="text-[10px] text-slate-400"><span className="text-slate-200">12:04 PM</span> - Lead-Scraper encrypted local session initialized.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5"></div>
              <p className="text-[10px] text-slate-400"><span className="text-slate-200">11:58 AM</span> - Contract-Risk vector check completed (Offline).</p>
            </div>
            <div className="flex items-start gap-2 border-l border-slate-700 pl-2">
              <p className="text-[10px] text-indigo-400 italic">Auto-balancing compute for efficiency...</p>
            </div>
          </div>
          <button className="w-full mt-4 py-2 border border-slate-700 rounded text-[10px] font-bold text-slate-300 hover:bg-slate-800 transition-colors uppercase">
            Download Executive Audit Report (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
