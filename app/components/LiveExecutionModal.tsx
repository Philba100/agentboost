"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { executeSkill } from '@/lib/executor';

interface ModalProps {
  skill: {
    id: string;
    name: string;
    icon: string;
    desc: string;
    category?: string;
  };
  onClose: () => void;
}

export default function LiveExecutionModal({ skill, onClose }: ModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [latency, setLatency] = useState<number | null>(null);

  const defaultPayload = useMemo(() => {
    switch (skill.id) {
      case 'crypto':
        return { asset: 'BTC', timeframe: '7D' };
      case 'real-estate':
        return { purchase_price: 1200000, estimated_rent: 7800, address: '14 Marina Tower, Dubai' };
      case 'lead-qualifier':
      case 'lead-qualifier-bant':
        return { estimated_budget: 65000, decision_authority: 'VP Sales', timeline: 'Q3' };
      case 'aws-cost':
        return { region: 'us-east-1' };
      case 'github-review':
        return { repo_name: 'enterprise/payment-service', pr_number: 104 };
      default:
        return { prompt: `Run deterministic audit for ${skill.name}` };
    }
  }, [skill]);

  const [inputData, setInputData] = useState(JSON.stringify(defaultPayload, null, 2));

  const handleRunExecution = async () => {
    setIsRunning(true);
    setOutput(null);

    let parsed = {};
    try {
      parsed = JSON.parse(inputData);
    } catch {
      parsed = { prompt: inputData };
    }

    try {
      const result = await executeSkill(skill.id, parsed);
      setOutput(result.data);
      setLatency(result.latency_ms);
    } catch (err: any) {
      setOutput({
        error: err?.message || 'Execution error',
        skill: skill.id
      });
      setLatency(1);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    /* Near-Black Backdrop: 95% opacity completely blocks out the cards behind it */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#03060a]/95 backdrop-blur-md p-4 animate-in fade-in duration-150">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* 100% Solid Opaque Dialog Box */}
      <div className="relative z-10 bg-[#0a0f18] border border-slate-700/90 rounded-2xl max-w-xl w-full max-h-[88vh] flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.98)] overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-[#0e1624] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-xl p-1.5 bg-[#05080e] border border-slate-800 rounded-lg">
              {skill.icon}
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">{skill.name}</h3>
              <p className="text-[10px] font-mono text-[#00ff9d]">In-Process Deterministic Fastpath</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white w-7 h-7 rounded-lg flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 transition text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1 font-mono text-xs [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div>
            <label className="block text-slate-400 mb-1.5 text-[10px] uppercase tracking-wider">
              Input Parameters (JSON):
            </label>
            <textarea
              rows={4}
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              className="w-full bg-[#04070d] border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-[#00ff9d] focus:outline-none text-[11px] leading-relaxed resize-none"
            />
          </div>

          {/* Trigger Button: Guaranteed Pure Black Text on Green */}
          <button
            onClick={handleRunExecution}
            disabled={isRunning}
            style={{ color: '#000000' }}
            className="w-full py-2.5 bg-[#00ff9d] hover:bg-emerald-300 font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-[0_0_15px_rgba(0,255,157,0.2)] disabled:opacity-60 cursor-pointer !text-black"
          >
            {isRunning ? 'Calculating In-Memory...' : 'Run Live Execution'}
          </button>

          {output && (
            <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Response Data:</span>
                <span className="text-emerald-400 font-bold">✓ 200 OK ({latency}ms in-process)</span>
              </div>
              {/* Solid Near-Black Output Canvas */}
              <pre className="bg-[#04070d] border border-slate-800/90 rounded-xl p-3.5 text-emerald-400 overflow-x-auto text-[11px] leading-relaxed max-h-52 [scrollbar-width:none]">
                {JSON.stringify(output, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#0e1624] flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-[10px] text-slate-400">Deploy this tool to your local agent:</span>
          <div className="flex gap-2">
            <Link
              href={`/skills/${skill.id}`}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition"
            >
              MCP Config
            </Link>
            <Link
              href={`/dashboard?skill=${skill.id}`}
              style={{ color: '#000000' }}
              className="px-3 py-1 bg-[#00ff9d] hover:bg-emerald-300 font-extrabold rounded-lg text-xs transition !text-black"
            >
              Provision Key
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}